"use client";

import { useState, useRef, useCallback } from "react";
import { clsx } from "clsx";
import {
    Upload,
    FileVideo,
    RefreshCw,
    Check,
    Download,
    RotateCcw,
    X,
    VolumeX,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

type Quality = "high" | "medium" | "low";
type Step = "upload" | "settings" | "progress" | "success" | "error";

/* ─── Helpers ───────────────────────────────────────────────── */

function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/* ─── Component ─────────────────────────────────────────────── */

export function MediaConverter() {
    const [step, setStep] = useState<Step>("upload");
    const [file, setFile] = useState<File | null>(null);
    const [outputName, setOutputName] = useState("");
    const [quality, setQuality] = useState<Quality>("medium");
    const [removeAudio, setRemoveAudio] = useState(false);
    const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── File handling ───────────────────────────────────────── */

    const handleFile = useCallback((f: File) => {
        if (!f.type.includes("mp4") && !f.name.endsWith(".mp4")) {
            return;
        }
        setFile(f);
        setOutputName(f.name.replace(/\.mp4$/i, ""));
        setStep("settings");
    }, []);

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
        },
        [handleFile]
    );

    const reset = () => {
        setFile(null);
        setOutputName("");
        setQuality("medium");
        setRemoveAudio(false);
        setConvertedBlob(null);
        setErrorMessage("");
        setStep("upload");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /* ── Conversion ──────────────────────────────────────────── */

    const handleConvert = async () => {
        if (!file || !outputName.trim()) return;

        setStep("progress");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("quality", quality);
            formData.append("outputName", outputName);
            formData.append("removeAudio", String(removeAudio));

            const res = await fetch("/api/convert", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || "Conversion failed");
            }

            const blob = await res.blob();
            setConvertedBlob(blob);
            setStep("success");
        } catch (err: any) {
            setErrorMessage(err?.message || "Something went wrong");
            setStep("error");
        }
    };

    /* ── Download ────────────────────────────────────────────── */

    const handleDownload = () => {
        if (!convertedBlob) return;
        const url = URL.createObjectURL(convertedBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${outputName}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    /* ── Render ──────────────────────────────────────────────── */

    return (
        <div className="w-full max-w-[640px]">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-3xl text-black">Media Converter</h1>
                <p className="font-text text-base text-gray-500 mt-1">
                    Convert MP4 videos to WebM format (VP9 + Opus)
                </p>
            </div>

            {/* Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8">
                {/* ── Upload ─────────────────────────────────────── */}
                {step === "upload" && (
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add("ring-2", "ring-black");
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove("ring-2", "ring-black");
                        }}
                        onDrop={(e) => {
                            e.currentTarget.classList.remove("ring-2", "ring-black");
                            onDrop(e);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-all hover:border-black hover:bg-gray-50 group"
                    >
                        <Upload
                            size={48}
                            className="mx-auto mb-4 text-gray-400 group-hover:text-black transition-colors"
                        />
                        <h2 className="font-heading text-xl text-black mb-1">
                            Drop MP4 file here
                        </h2>
                        <p className="text-sm text-gray-500">or click to browse</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/mp4,.mp4"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleFile(e.target.files[0]);
                            }}
                        />
                    </div>
                )}

                {/* ── Settings ───────────────────────────────────── */}
                {step === "settings" && file && (
                    <div className="space-y-6">
                        {/* File info */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FileVideo size={32} className="text-brand" />
                                <div>
                                    <p className="font-medium text-black text-sm">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={reset}
                                className="text-xs font-medium text-gray-500 hover:text-black transition-colors border border-gray-200 rounded-md px-3 py-1.5 hover:border-black"
                            >
                                Change
                            </button>
                        </div>

                        {/* Output name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Output File Name
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={outputName}
                                    onChange={(e) => setOutputName(e.target.value)}
                                    placeholder="Enter file name"
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-16 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                />
                                <span className="absolute right-4 text-gray-400 text-sm pointer-events-none">
                                    .webm
                                </span>
                            </div>
                        </div>

                        {/* Quality */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Quality Preset
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(["high", "medium", "low"] as Quality[]).map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setQuality(q)}
                                        className={clsx(
                                            "py-2.5 rounded-lg text-sm font-medium transition-all border",
                                            quality === q
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black"
                                        )}
                                    >
                                        {q.charAt(0).toUpperCase() + q.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Remove audio */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={removeAudio}
                                onChange={(e) => setRemoveAudio(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <VolumeX
                                size={16}
                                className="text-gray-400 group-hover:text-black transition-colors"
                            />
                            <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                                Remove Audio (Mute Video)
                            </span>
                        </label>

                        {/* Convert button */}
                        <button
                            onClick={handleConvert}
                            disabled={!outputName.trim()}
                            className={clsx(
                                "w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all",
                                outputName.trim()
                                    ? "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            <RefreshCw size={16} />
                            Convert to WebM
                        </button>
                    </div>
                )}

                {/* ── Progress ───────────────────────────────────── */}
                {step === "progress" && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 mx-auto mb-4 border-[3px] border-gray-200 border-t-black rounded-full animate-spin" />
                        <h3 className="font-heading text-lg text-black mb-1">
                            Converting...
                        </h3>
                        <p className="text-sm text-gray-500">
                            This may take a while for large files
                        </p>
                    </div>
                )}

                {/* ── Success ────────────────────────────────────── */}
                {step === "success" && (
                    <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                            <Check size={28} className="text-white" />
                        </div>
                        <h3 className="font-heading text-xl text-black mb-1">
                            Conversion Complete
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {outputName}.webm
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
                            >
                                <Download size={16} />
                                Download File
                            </button>
                            <button
                                onClick={reset}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all"
                            >
                                <RotateCcw size={16} />
                                Convert Another
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Error ──────────────────────────────────────── */}
                {step === "error" && (
                    <div className="text-center py-8">
                        <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <X size={28} className="text-red-600" />
                        </div>
                        <h3 className="font-heading text-xl text-black mb-1">
                            Conversion Failed
                        </h3>
                        <p className="text-sm text-red-600 mb-6">
                            {errorMessage || "Something went wrong"}
                        </p>
                        <button
                            onClick={() => setStep("settings")}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:border-black hover:text-black transition-all"
                        >
                            <RotateCcw size={16} />
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-400 text-center mt-4">
                Powered by FFmpeg · VP9 + Opus codec · Localhost only
            </p>
        </div>
    );
}
