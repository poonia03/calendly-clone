import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

function Toast({ message = "Copied!", isVisible, onClose }) {
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 2500);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast toast--visible">
      <div className="toast-content">
        <Check size={18} strokeWidth={2} aria-hidden />
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;
