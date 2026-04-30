import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  help,
  className,
  labelClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  help?: string;
  labelClassName?: string;
}) {
  return (
    <label className={cn("grid gap-2 text-sm font-medium text-ink", labelClassName)}>
      <span>{label}</span>
      <input
        className={cn(
          "focus-ring h-11 rounded-md border border-line bg-white px-3 text-sm text-ink placeholder:text-zinc-400",
          className
        )}
        {...props}
      />
      {help ? <span className="text-xs font-normal text-zinc-500">{help}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      <span>{label}</span>
      <select
        className={cn(
          "focus-ring h-11 rounded-md border border-line bg-white px-3 text-sm text-ink",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
