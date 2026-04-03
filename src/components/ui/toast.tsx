import React from "react";

export interface ToastActionElement {
  altText: string;
  action: React.ReactNode;
}

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Placeholder component - not used but needed for type exports
export const Toast = ({ ...props }: ToastProps) => null;
export const ToastAction = ({ altText, action }: ToastActionElement) => null;
export const ToastClose = () => null;
