import * as React from "react"
import { cn } from "./Button"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-xl border border-border bg-white dark:bg-surface-card px-4 py-3 text-sm font-sans transition-colors placeholder:text-muted focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-content",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
