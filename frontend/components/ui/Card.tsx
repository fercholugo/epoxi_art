import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  goldBorder?: boolean;
  hover?: boolean;
}

export default function Card({
  children,
  className,
  goldBorder = false,
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-dark-2 rounded-2xl p-6",
        goldBorder && "border border-gold/20",
        hover &&
          "transition-all duration-300 hover:border-gold/50 hover:shadow-[0_0_20px_rgba(201,168,76,0.1)]",
        !goldBorder && "border border-dark-3",
        className
      )}
    >
      {children}
    </div>
  );
}
