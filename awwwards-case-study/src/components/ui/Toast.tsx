"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${type === "success"
                            ? "bg-white border-green-100 text-green-800"
                            : type === "error"
                                ? "bg-white border-red-100 text-red-800"
                                : "bg-white border-blue-100 text-blue-800"
                        }`}
                >
                    <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full ${type === "success"
                                ? "bg-green-100"
                                : type === "error"
                                    ? "bg-red-100"
                                    : "bg-blue-100"
                            }`}
                    >
                        {type === "success" && <Check className="w-3.5 h-3.5" />}
                        {type === "error" && <AlertCircle className="w-3.5 h-3.5" />}
                        {type === "info" && <AlertCircle className="w-3.5 h-3.5" />}
                    </div>
                    <p className="font-text text-sm font-medium pr-2">{message}</p>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md hover:bg-black/5 transition-colors ml-2"
                    >
                        <X className="w-4 h-4 opacity-50" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
