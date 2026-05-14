import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive', size?: 'default' | 'sm' | 'lg' | 'icon' }>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-light shadow-sm',
      secondary: 'border border-primary text-primary bg-transparent hover:bg-primary/10',
      ghost: 'text-primary hover:bg-primary/10',
      destructive: 'bg-error text-white hover:bg-error/90 shadow-sm'
    }
    const sizes = {
      default: 'px-6 py-3',
      sm: 'px-4 py-2 text-sm',
      lg: 'px-8 py-4 text-lg',
      icon: 'h-10 w-10 text-center flex items-center justify-center'
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-sans font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
