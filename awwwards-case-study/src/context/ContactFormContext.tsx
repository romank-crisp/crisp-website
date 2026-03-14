"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ContactPrefillData {
    service?: string;
    message?: string;
    showUpload?: boolean;
}

interface ContactFormContextType {
    isOpen: boolean;
    isNavHidden: boolean;
    prefillData: ContactPrefillData | null;
    openContactForm: () => void;
    openContactFormWithData: (data: ContactPrefillData) => void;
    closeContactForm: () => void;
    toggleContactForm: () => void;
    setIsNavHidden: (hidden: boolean) => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export function ContactFormProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(false);
    const [prefillData, setPrefillData] = useState<ContactPrefillData | null>(null);

    const openContactForm = useCallback(() => {
        setPrefillData(null);
        setIsOpen(true);
    }, []);

    const openContactFormWithData = useCallback((data: ContactPrefillData) => {
        setPrefillData(data);
        setIsOpen(true);
    }, []);

    const closeContactForm = useCallback(() => {
        setIsOpen(false);
        setPrefillData(null);
    }, []);

    const toggleContactForm = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <ContactFormContext.Provider value={{
            isOpen,
            isNavHidden,
            prefillData,
            openContactForm,
            openContactFormWithData,
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
