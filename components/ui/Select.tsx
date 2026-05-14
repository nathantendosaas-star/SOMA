import * as React from "react"
import { cn } from "./Button"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex w-full rounded-xl border border-border bg-white dark:bg-surface-card px-4 py-3 text-sm font-sans transition-colors focus:outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 text-content appearance-none",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }
