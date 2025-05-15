import React, { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (newToast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...newToast, id }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const Toaster: React.FC = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    return null;
  }
  
  const { toasts, removeToast } = context;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${toast.type === 'success' ? 'bg-green-50 border-green-500' : ''}
            ${toast.type === 'error' ? 'bg-red-50 border-red-500' : ''}
            ${toast.type === 'info' ? 'bg-blue-50 border-blue-500' : ''}
            ${toast.type === 'warning' ? 'bg-amber-50 border-amber-500' : ''}
            border-l-4 p-4 rounded-md shadow-md min-w-[300px] max-w-md
            transform transition-all duration-500 ease-in-out
            animate-in fade-in slide-in-from-right-10
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`
                font-medium 
                ${toast.type === 'success' ? 'text-green-800' : ''}
                ${toast.type === 'error' ? 'text-red-800' : ''}
                ${toast.type === 'info' ? 'text-blue-800' : ''}
                ${toast.type === 'warning' ? 'text-amber-800' : ''}
              `}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className={`
                  mt-1 text-sm
                  ${toast.type === 'success' ? 'text-green-700' : ''}
                  ${toast.type === 'error' ? 'text-red-700' : ''}
                  ${toast.type === 'info' ? 'text-blue-700' : ''}
                  ${toast.type === 'warning' ? 'text-amber-700' : ''}
                `}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-700"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M18 6L6 18"></path>
                <path d="M6 6L18 18"></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ToastWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  );
}