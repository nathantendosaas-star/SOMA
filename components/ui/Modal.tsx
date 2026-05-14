import * as React from "react"
import { cn } from "./Button"

export function Modal({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-surface-dark/50 transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
        {title && <h3 className="mb-4 font-display text-2xl font-semibold text-surface-dark">{title}</h3>}
        {children}
      </div>
    </div>
  )
}
