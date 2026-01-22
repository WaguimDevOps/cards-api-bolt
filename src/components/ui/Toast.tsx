'use client';

import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = ToastPrimitive.Viewport;

export const Toast = React.forwardRef<
    React.ElementRef<typeof ToastPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
    <ToastPrimitive.Root
        ref={ref}
        className="glass"
        style={{
            padding: '1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            width: '320px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
            marginBottom: '1rem'
        }}
        {...props}
    />
));
Toast.displayName = ToastPrimitive.Root.displayName;

export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastClose = ToastPrimitive.Close;
