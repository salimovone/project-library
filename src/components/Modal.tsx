import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 h-full bg-[#0009] backdrop:blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
}
