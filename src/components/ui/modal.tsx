"use client";

import { X } from "lucide-react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-stone-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
          <button onClick={onClose} className="rounded-xl p-1 hover:bg-stone-100">
            <X className="h-5 w-5 text-stone-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
