import React from "react";
import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";

export default function ConfirmationModal({
  isOpen,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-auto shadow-lg flex flex-col items-center">
        <FiAlertTriangle size={40} className="text-red-500 mb-4" />
        <Dialog.Title className="text-lg font-semibold text-gray-800 mb-2 text-center">
          {title}
        </Dialog.Title>
        <Dialog.Description className="text-sm text-gray-600 mb-6 text-center">
          {description}
        </Dialog.Description>

        <div className="flex w-full gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-600 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
}