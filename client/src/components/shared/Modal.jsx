// client/src/components/shared/Modal.jsx
import React, { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
    // This effect prevents the main page from scrolling when the modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function to reset the style when the component unmounts
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        // --- The Modal Backdrop ---
        // Handles positioning and the dark overlay. The onClick here allows closing the modal by clicking outside.
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            {/* --- The Modal Panel --- */}
            {/* We stop click propagation here, so clicking inside the modal doesn't close it. */}
            {/* 'max-h-[90vh]' prevents the modal from being taller than 90% of the viewport height. */}
            {/* 'flex-col' and 'flex' allow the internal elements to size correctly. */}
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()} 
            >
                {/* --- Modal Header (Fixed) --- */}
                {/* 'flex-shrink-0' prevents this part from shrinking. */}
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* --- Modal Body (SCROLLABLE) --- */}
                {/* 'overflow-y-auto' is the magic class. It makes only this section scrollable if its content is too tall. */}
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;