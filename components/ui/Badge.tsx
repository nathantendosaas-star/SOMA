import * as React from "react"
import { cn } from "./Button"

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'warning' | 'error' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-muted/10 text-muted',
      success: 'bg-success/10 text-success',
      warning: 'bg-accent/10 text-accent',
      error: 'bg-error/10 text-error',
    }
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
