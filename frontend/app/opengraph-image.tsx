import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EpoxyArt — Decoración en Resina Epóxica Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0e0e0e 0%, #1a1a1a 50%, #242424 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "2px solid #c9a84c",
            borderRadius: "8px",
            opacity: 0.4,
          }}
        />
        {/* Gold accent top */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#c9a84c",
            marginBottom: "32px",
          }}
        />
        {/* Logo */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "700",
            color: "#c9a84c",
            letterSpacing: "8px",
            marginBottom: "16px",
          }}
        >
          EPOXYART
        </div>
        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#f5f0e8",
            marginBottom: "8px",
            letterSpacing: "2px",
          }}
        >
          Decoración en Resina Epóxica Premium
        </div>
        {/* Subtitle */}
        <div
          style={{
            fontSize: "20px",
            color: "#9a8f7f",
            marginTop: "8px",
          }}
        >
          Pisos · Paredes · Diseño Personalizado
        </div>
        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "40px",
          }}
        >
          {["+350 Proyectos", "8+ Años", "Garantía 5 años"].map((stat) => (
            <div
              key={stat}
              style={{
                fontSize: "18px",
                color: "#c9a84c",
                borderTop: "1px solid #c9a84c",
                paddingTop: "8px",
              }}
            >
              {stat}
            </div>
          ))}
        </div>
        {/* Bottom gold accent */}
        <div
          style={{
            width: "80px",
            height: "3px",
            background: "#c9a84c",
            marginTop: "32px",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
