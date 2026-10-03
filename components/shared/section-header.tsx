import { MobileSectionHeader } from "@/components/shared/mobile-section-header";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  level = "h2",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  level?: "h1" | "h2";
  className?: string;
}) {
  return (
    <MobileSectionHeader
      eyebrow={eyebrow}
      title={title}
      subline={subtitle}
      desktopAlign={align}
      level={level}
      className={className}
    />
  );
}
