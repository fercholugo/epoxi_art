"use client";

import { useRef, useState, useCallback } from "react";
import type { AnalysisStatus, AnalysisResult } from "@/types";
import { api } from "@/lib/api";

interface UseImageAnalysisReturn {
  status: AnalysisStatus;
  preview: string | null;
  result: AnalysisResult | null;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleAnalyze: () => Promise<void>;
  handleReset: () => void;
}

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validate(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Formato no válido. Usa JPG, PNG o WebP.";
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `La imagen supera los ${MAX_SIZE_MB} MB permitidos.`;
  }
  return null;
}

export function useImageAnalysis(): UseImageAnalysisReturn {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((f: File) => {
    const err = validate(f);
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    setStatus("idle");

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadFile(f);
    },
    [loadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) loadFile(f);
    },
    [loadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("surface_type", "piso");

    try {
      setStatus("analyzing");
      const response = await api.postForm<{
        success: boolean;
        analysis: AnalysisResult;
      }>("/api/v1/analyze", formData);

      if (!response.success) throw new Error("Análisis fallido");
      setResult(response.analysis);
      setStatus("success");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al conectar con el servicio de IA.";
      setError(msg);
      setStatus("error");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    setStatus("idle");
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return {
    status,
    preview,
    result,
    error,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleAnalyze,
    handleReset,
  };
}
