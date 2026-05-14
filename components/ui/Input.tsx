import * as React from "react"
import { cn } from "./Button"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-xl border border-border bg-white dark:bg-surface-card px-4 py-3 text-sm font-sans transition-colors placeholder:text-muted focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-content",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
