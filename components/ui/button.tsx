import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white hover:bg-moss disabled:bg-zinc-400 disabled:text-white",
  secondary:
    "border border-line bg-white text-ink hover:border-ink hover:bg-fog disabled:text-zinc-400",
  ghost: "text-ink hover:bg-fog disabled:text-zinc-400",
  danger:
    "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:text-red-300"
};

const base =
  "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition disabled:cursor-not-allowed";

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <Link className={cn(base, variants[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
