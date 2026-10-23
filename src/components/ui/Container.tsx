import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section";
}

export function Container({ className, as: Tag = "div", ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-page px-5 sm:px-8 min-[1344px]:px-0", className)} {...props} />;
}
