import React, { useEffect, useRef } from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message, btnText, btnColor, color, btnHover, loading, spinColor }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-[#1a1a1ae3] p-6 rounded-md w-[90%] max-w-sm shadow-[0_4px_20px_rgba(0,0,0,0.45)]"
      >
        <h2 className="text-neutral-200 text-lg font-semibold text-center mb-6 tracking-widest">
          {message}
        </h2>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-neutral-200 tracking-widest"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2 rounded ${btnColor} ${btnHover} ${color} tracking-widest font-bold`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className={`h-5 w-5 border-2 ${spinColor} border-t-transparent rounded-full animate-spin`}></span>
              </span>
            ) : (
              <p>{btnText || "Confirm"}</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;