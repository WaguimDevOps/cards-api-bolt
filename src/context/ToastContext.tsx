'use client';
import { generateUUID } from '@/utils/id';

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Toast, ToastTitle, ToastDescription, ToastViewport, ToastProvider } from '@/components/ui/Toast';

interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'info';
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info', action?: { label: string, onClick: () => void }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastCustomProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((
        title: string,
        description?: string,
        type: 'success' | 'error' | 'info' = 'info',
        action?: { label: string, onClick: () => void }
    ) => {
        const id = generateUUID();
        setToasts((prev) => [...prev, { id, title, description, type, action }]);
    }, []);

    return (
        <ToastProvider>
            <ToastContext.Provider value={{ showToast }}>
                {children}
                {toasts.map(({ id, title, description, type, action }) => (
                    <Toast key={id} onOpenChange={(open) => !open && setToasts((prev) => prev.filter((t) => t.id !== id))}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                            <ToastTitle style={{ fontWeight: 'bold', color: type === 'error' ? '#ff4d4d' : type === 'success' ? '#4ade80' : 'var(--accent)' }}>
                                {title}
                            </ToastTitle>
                            {description && <ToastDescription style={{ fontSize: '0.85rem', opacity: 0.8 }}>{description}</ToastDescription>}
                        </div>
                        {action && (
                            <button
                                onClick={() => {
                                    action.onClick();
                                    setToasts((prev) => prev.filter((t) => t.id !== id));
                                }}
                                className="glass"
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--accent)',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {action.label}
                            </button>
                        )}
                    </Toast>
                ))}
                <ToastViewport style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem',
                    gap: '10px',
                    width: '390px',
                    maxWidth: '100vw',
                    margin: 0,
                    listStyle: 'none',
                    zIndex: 1000,
                    outline: 'none'
                }} />
            </ToastContext.Provider>
        </ToastProvider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastCustomProvider');
    return context;
}
