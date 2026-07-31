import { spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface MaskedSlideRevealProps {
  text: string;
  staggerDelay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  speed?: number;
  className?: string;
  background?: string;
}

export function MaskedSlideReveal({
  text,
  staggerDelay = 3,
  fontSize = 72,
  color = "#ffffff",
  fontWeight = 800,
  speed = 1,
  className,
  background = "transparent",
}: MaskedSlideRevealProps) {
  const frame = useCurrentFrame() * speed;
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
      }}
    >
      <span
        className={className}
        style={{
          fontSize,
          fontWeight,
          color,
          letterSpacing: "-0.03em",
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          textAlign: "center",
          maxWidth: "90%",
          lineHeight: 1.1,
        }}
      >
        {words.map((word, i) => {
          const t = spring({
            frame: frame - i * staggerDelay,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.5 },
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                overflow: "hidden",
                verticalAlign: "bottom",
                lineHeight: 1.15,
                marginRight: "0.28em",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - t) * 110}%)`,
                  opacity: t,
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </span>
    </div>
  );
}
