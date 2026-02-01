"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ContactFormContextType {
    isOpen: boolean;
    isNavHidden: boolean;
    openContactForm: () => void;
    closeContactForm: () => void;
    toggleContactForm: () => void;
    setIsNavHidden: (hidden: boolean) => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(false);

    const openContactForm = useCallback(() => setIsOpen(true), []);
    const closeContactForm = useCallback(() => setIsOpen(false), []);
    const toggleContactForm = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <ContactFormContext.Provider value={{
            isOpen,
            isNavHidden,
            openContactForm,
            closeContactForm,
            toggleContactForm,
            setIsNavHidden
        }}>
            {children}
        </ContactFormContext.Provider>
    );
}

export function useContactForm() {
    const context = useContext(ContactFormContext);
    if (context === undefined) {
        throw new Error("useContactForm must be used within a ContactFormProvider");
    }
    return context;
}
