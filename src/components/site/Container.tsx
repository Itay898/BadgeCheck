import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  /** Reading-width column for long-form prose. Otherwise an editorial 6xl wide. */
  size?: "reading" | "wide" | "narrow";
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function Container({
  children,
  size = "wide",
  className,
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-7",
        size === "reading" && "max-w-[720px]",
        size === "wide" && "max-w-[1180px]",
        size === "narrow" && "max-w-[860px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
