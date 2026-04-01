"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { clsx } from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
    Upload,
    Search,
    Copy,
    Trash2,
    X,
    Check,
    FolderOpen,
    Image as ImageIcon,
    Film,
    Loader2,
    ExternalLink,
    ChevronRight,
    RefreshCw,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

interface MediaFile {
    name: string;
    path: string;
    url: string;
    folder: string;
    size: number;
    contentType: string;
    updated: string;
}

/* ─── Helpers ───────────────────────────────────────────────── */

function formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 10) / 10} ${sizes[i]}`;
}

function isVideo(contentType: string): boolean {
    return contentType.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(contentType);
}

function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(dateStr: string): string {
    if (!dateStr) return "never";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/* ─── Component ─────────────────────────────────────────────── */

export function MediaGallery() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [folders, setFolders] = useState<string[]>([]);
    const [activeFolder, setActiveFolder] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [uploading, setUploading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string>("");
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
    const [deleteFile, setDeleteFile] = useState<MediaFile | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Load from index ────────────────────────────────────── */

    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const params = activeFolder ? `?folder=${encodeURIComponent(activeFolder)}` : "";
            const res = await fetch(`/api/media${params}`);
            const data = await res.json();
            setFiles(data.files || []);
            if (!activeFolder) {
                setFolders(data.folders || []);
            }
            if (data.updatedAt) {
                setLastSynced(data.updatedAt);
            }
        } catch (error) {
            console.error("Failed to load media:", error);
        } finally {
            setLoading(false);
        }
    }, [activeFolder]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /* ── Sync from GCS ──────────────────────────────────────── */

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/media/sync", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setLastSynced(data.updatedAt);
                // Reload from fresh index
                await loadFiles();
            }
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setSyncing(false);
        }
    };

    /* ── Upload ─────────────────────────────────────────────── */

    const handleUpload = async (uploadFiles: FileList) => {
        if (uploadFiles.length === 0) return;
        setUploading(true);
        try {
            const formData = new FormData();
            if (activeFolder) formData.append("folder", activeFolder);
            for (let i = 0; i < uploadFiles.length; i++) {
                formData.append(`file-${i}`, uploadFiles[i]);
            }
            await fetch("/api/media", { method: "POST", body: formData });
            await loadFiles();
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer.files.length > 0) {
                handleUpload(e.dataTransfer.files);
            }
        },
        [activeFolder]
    );

    /* ── Delete ─────────────────────────────────────────────── */

    const handleDelete = async () => {
        if (!deleteFile) return;
        setDeleting(true);
        try {
            await fetch(`/api/media?path=${encodeURIComponent(deleteFile.path)}`, { method: "DELETE" });
            setFiles((prev) => prev.filter((f) => f.path !== deleteFile.path));
            setDeleteFile(null);
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeleting(false);
        }
    };

    /* ── Copy URL ───────────────────────────────────────────── */

    const handleCopy = async (url: string) => {
        await navigator.clipboard.writeText(url);
        setCopiedUrl(url);
        setTimeout(() => setCopiedUrl(null), 2000);
    };

    /* ── Filter ─────────────────────────────────────────────── */

    const filteredFiles = files.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ── Render ─────────────────────────────────────────────── */

    return (
        <div className="flex h-full gap-6">
            {/* Folder sidebar */}
            <div className="w-[220px] min-w-[220px] border-r border-gray-100 py-2 pr-6 overflow-y-auto shrink-0">
                <h3 className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                    Folders
                </h3>
                <div className="space-y-0.5">
                    <button
                        onClick={() => setActiveFolder(null)}
                        className={clsx(
                            "w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors",
                            activeFolder === null
                                ? "bg-black text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        <FolderOpen size={14} />
                        All Files
                    </button>
                    {folders.map((folder) => (
                        <button
                            key={folder}
                            onClick={() => setActiveFolder(folder)}
                            className={clsx(
                                "w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors",
                                activeFolder === folder
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            <ChevronRight size={12} />
                            {folder}
                        </button>
                    ))}
                </div>

                {/* Sync section */}
                <div className="mt-8 pt-6 border-t border-gray-100 px-3">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-medium text-gray-500
                                   border border-gray-200 rounded-lg hover:border-gray-400 hover:text-black transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={syncing ? "animate-spin" : ""} />
                        {syncing ? "Syncing..." : "Sync from GCS"}
                    </button>
                    {lastSynced && (
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Last synced: {timeAgo(lastSynced)}
                        </p>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Toolbar */}
                <div className="flex items-center gap-4 mb-5 shrink-0">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search files..."
                            className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-lg
                                       focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all font-text"
                        />
                    </div>

                    <div className="flex-1" />

                    {/* File count */}
                    <span className="text-xs text-gray-400 font-text shrink-0">
                        {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
                    </span>

                    {/* Upload button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold
                                   hover:bg-gray-800 transition-colors disabled:opacity-50 shrink-0"
                    >
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files) handleUpload(e.target.files);
                        }}
                    />
                </div>

                {/* Drop zone + Grid */}
                <div
                    className="flex-1 overflow-y-auto rounded-xl border-2 border-dashed border-transparent transition-colors p-1"
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("border-black", "bg-gray-50/50");
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("border-black", "bg-gray-50/50");
                    }}
                    onDrop={(e) => {
                        e.currentTarget.classList.remove("border-black", "bg-gray-50/50");
                        handleDrop(e);
                    }}
                >
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                            <Loader2 size={24} className="animate-spin text-gray-300" />
                            <p className="font-text text-xs text-gray-400">Loading media index...</p>
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 py-20">
                            <ImageIcon size={48} strokeWidth={1} />
                            <div className="text-center">
                                <p className="font-text text-sm font-medium">
                                    {searchQuery ? "No files match your search" : "No media files in index"}
                                </p>
                                <p className="font-text text-xs mt-1">
                                    {searchQuery ? "Try a different search term" : "Click \"Sync from GCS\" to populate, or upload new files"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filteredFiles.map((file) => (
                                <MediaCard
                                    key={file.path}
                                    file={file}
                                    copied={copiedUrl === file.url}
                                    onCopy={() => handleCopy(file.url)}
                                    onPreview={() => setPreviewFile(file)}
                                    onDelete={() => setDeleteFile(file)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Preview Dialog ─────────────────────────────────── */}
            <Dialog.Root open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 max-w-[90vw] max-h-[90vh] outline-none">
                        {previewFile && (
                            <div className="relative">
                                {isVideo(previewFile.contentType) ? (
                                    <video
                                        src={previewFile.url}
                                        controls
                                        autoPlay
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl"
                                    />
                                ) : (
                                    <img
                                        src={previewFile.url}
                                        alt={previewFile.name}
                                        className="max-w-[90vw] max-h-[85vh] rounded-xl object-contain"
                                    />
                                )}

                                {/* Bottom info bar */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl p-5 pt-12">
                                    <div className="flex items-end justify-between gap-4">
                                        <div>
                                            <p className="text-white text-sm font-medium truncate">{previewFile.name}</p>
                                            <p className="text-white/60 text-xs mt-0.5">{formatSize(previewFile.size)} · {formatDate(previewFile.updated)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopy(previewFile.url)}
                                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                                title="Copy URL"
                                            >
                                                {copiedUrl === previewFile.url ? (
                                                    <Check size={16} className="text-green-400" />
                                                ) : (
                                                    <Copy size={16} className="text-white" />
                                                )}
                                            </button>
                                            <a
                                                href={previewFile.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                                title="Open original"
                                            >
                                                <ExternalLink size={16} className="text-white" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <Dialog.Close asChild>
                                    <button className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                                        <X size={18} className="text-white" />
                                    </button>
                                </Dialog.Close>
                            </div>
                        )}
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            {/* ── Delete Confirmation ────────────────────────────── */}
            <AlertDialog.Root open={!!deleteFile} onOpenChange={(open) => !open && setDeleteFile(null)}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl p-8 w-[420px] max-w-[90vw] shadow-xl">
                        <AlertDialog.Title className="font-heading text-lg font-bold text-black">
                            Delete file
                        </AlertDialog.Title>
                        <AlertDialog.Description className="font-text text-sm text-gray-500 mt-3 mb-8 leading-relaxed">
                            Are you sure you want to delete <strong className="text-black">{deleteFile?.name}</strong>? This will remove it from GCS and cannot be undone.
                        </AlertDialog.Description>
                        <div className="flex justify-end gap-3">
                            <AlertDialog.Cancel asChild>
                                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                >
                                    {deleting && <Loader2 size={14} className="animate-spin" />}
                                    Delete
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </div>
    );
}

/* ─── Media Card ────────────────────────────────────────────── */

function MediaCard({
    file,
    copied,
    onCopy,
    onPreview,
    onDelete,
}: {
    file: MediaFile;
    copied: boolean;
    onCopy: () => void;
    onPreview: () => void;
    onDelete: () => void;
}) {
    const isVid = isVideo(file.contentType);

    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md hover:border-gray-300">
            {/* Thumbnail */}
            <button
                onClick={onPreview}
                className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer"
            >
                {isVid ? (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Film size={32} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium uppercase tracking-wide">.{file.name.split(".").pop()}</span>
                    </div>
                ) : (
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                )}
            </button>

            {/* Info */}
            <div className="px-3.5 py-3">
                <p className="font-text text-xs font-medium text-black truncate" title={file.name}>
                    {file.name}
                </p>
                <p className="font-text text-[10px] text-gray-400 mt-1">
                    {formatSize(file.size)}
                </p>
            </div>

            {/* Hover actions */}
            <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onCopy(); }}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors border border-gray-100"
                    title="Copy URL"
                >
                    {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} className="text-gray-600" />}
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors border border-gray-100"
                    title="Delete"
                >
                    <Trash2 size={13} className="text-red-500" />
                </button>
            </div>
        </div>
    );
}
