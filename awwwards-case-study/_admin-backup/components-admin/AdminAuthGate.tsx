"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (sessionStorage.getItem("adminAuth") === "true") {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "crispffats";

        if (username === adminUser && password === adminPass) {
            sessionStorage.setItem("adminAuth", "true");
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    if (!mounted) return null;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-center items-center py-12 px-16 sm:px-6 lg:px-8 font-text">
                <div className="w-full max-w-sm relative z-10">
                    <div className="flex flex-col items-center mb-32">
                        <div className="w-[64px] h-[64px] rounded-full bg-brand flex items-center justify-center text-white mb-24">
                            <Lock size={32} />
                        </div>
                        <h2 className="text-center text-h2 font-heading font-bold uppercase tracking-tight text-text">
                            Admin Login
                        </h2>
                    </div>

                    <div className="bg-white p-32 md:p-48 shadow-xl rounded-[var(--corner-medium)] border border-text/10">
                        <form className="flex flex-col gap-24" onSubmit={handleLogin}>
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                sizeVariant="large"
                                variant={error ? "error" : "default"}
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sizeVariant="large"
                                variant={error ? "error" : "default"}
                            />

                            {error && (
                                <p className="text-brand font-text text-sm font-bold uppercase tracking-tight text-center">
                                    Invalid username or password
                                </p>
                            )}

                            <Button
                                type="submit"
                                variant="filled"
                                size="large"
                                className="w-full mt-8"
                            >
                                Login
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
