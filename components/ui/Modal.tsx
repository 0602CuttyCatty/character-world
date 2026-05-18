"use client";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  maxHeight?: string;
}

export default function Modal({ onClose, children, width = 340, maxHeight }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ width, ...(maxHeight ? { maxHeight, display: "flex", flexDirection: "column" } : {}) }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
