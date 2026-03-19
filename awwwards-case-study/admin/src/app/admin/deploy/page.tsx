"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
    Rocket,
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    Globe,
    Server,
    Zap,
    ExternalLink,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────── */

interface BuildEntry {
    id: string;
    status: "QUEUED" | "WORKING" | "SUCCESS" | "FAILURE" | "TIMEOUT" | "CANCELLED";
    createTime: string;
    finishTime?: string;
    duration?: string;
    trigger?: string;
}

interface DeployStatus {
    publicSite: { url: string; status: "live" | "unknown"; lastDeploy?: string };
    adminApp: { url: string; status: "live" | "unknown" };
    contactFunction: { url: string; status: "live" | "unknown" };
}

/* ─── Constants ─────────────────────────────────────────────────── */

const PROJECT_ID = "crisp-website-485112";
const REGION = "europe-west1";

const DEPLOY_STATUS: DeployStatus = {
    publicSite: {
        url: "https://crisp-studio.com",
        status: "live",
    },
    adminApp: {
        url: `https://crisp-admin-${REGION}.run.app`,
        status: "live",
    },
    contactFunction: {
        url: `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/contact-form`,
        status: "live",
    },
};

/* ─── Status Badge ──────────────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
        SUCCESS: { color: "text-emerald-600 bg-emerald-50", icon: <CheckCircle2 size={14} />, label: "Success" },
        FAILURE: { color: "text-red-600 bg-red-50", icon: <XCircle size={14} />, label: "Failed" },
        WORKING: { color: "text-blue-600 bg-blue-50", icon: <Loader2 size={14} className="animate-spin" />, label: "Building" },
        QUEUED: { color: "text-amber-600 bg-amber-50", icon: <Clock size={14} />, label: "Queued" },
        TIMEOUT: { color: "text-orange-600 bg-orange-50", icon: <Clock size={14} />, label: "Timeout" },
        CANCELLED: { color: "text-gray-500 bg-gray-100", icon: <XCircle size={14} />, label: "Cancelled" },
    };
    const c = config[status] || config.QUEUED;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.color}`}>
            {c.icon} {c.label}
        </span>
    );
}

/* ─── Service Card ──────────────────────────────────────────────── */

function ServiceCard({ icon, title, url, statusLabel }: {
    icon: React.ReactNode;
    title: string;
    url: string;
    statusLabel: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-heading text-sm font-bold text-gray-900">{title}</h3>
                        <p className="text-xs text-gray-400 font-mono truncate max-w-[200px]">{url}</p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {statusLabel}
                </span>
            </div>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
            >
                Open <ExternalLink size={10} />
            </a>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────────── */

export default function DeployPage() {
    const [builds, setBuilds] = useState<BuildEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [publishResult, setPublishResult] = useState<{ success: boolean; message: string } | null>(null);
    const [environment, setEnvironment] = useState<"staging" | "production">("staging");

    const fetchBuilds = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/deploy/builds");
            if (res.ok) {
                const data = await res.json();
                setBuilds(data.builds || []);
            }
        } catch (err) {
            console.error("Failed to fetch builds", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBuilds();
        // Poll every 30 seconds
        const interval = setInterval(fetchBuilds, 30000);
        return () => clearInterval(interval);
    }, [fetchBuilds]);

    const handlePublish = async () => {
        if (publishing) return;

        const confirmed = window.confirm(
            `Publish to ${environment.toUpperCase()}?\n\nThis will:\n1. Pull latest content from GCS\n2. Build static site\n3. Deploy to ${environment} hosting`
        );
        if (!confirmed) return;

        setPublishing(true);
        setPublishResult(null);
        try {
            const res = await fetch("/api/deploy/trigger", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ environment }),
            });
            const data = await res.json();
            if (res.ok) {
                setPublishResult({ success: true, message: data.message || "Build triggered!" });
                // Refresh builds list after a short delay
                setTimeout(fetchBuilds, 3000);
            } else {
                setPublishResult({ success: false, message: data.error || "Failed to trigger build" });
            }
        } catch (err) {
            setPublishResult({ success: false, message: "Network error" });
        } finally {
            setPublishing(false);
        }
    };

    const formatTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleString("en-GB", {
                day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
            });
        } catch { return iso; }
    };

    return (
        <AdminLayout treeGroups={[]} activeTreeId="" onTreeSelect={() => {}}>
            <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Deploy Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1 font-text">
                        Manage deployments and monitor build status
                    </p>
                </div>

                {/* Services Status */}
                <section>
                    <h2 className="text-sm font-heading font-bold text-gray-500 uppercase tracking-wider mb-4">Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ServiceCard
                            icon={<Globe size={20} />}
                            title="Public Site"
                            url={DEPLOY_STATUS.publicSite.url}
                            statusLabel="Live"
                        />
                        <ServiceCard
                            icon={<Server size={20} />}
                            title="Admin Panel"
                            url={DEPLOY_STATUS.adminApp.url}
                            statusLabel="Live"
                        />
                        <ServiceCard
                            icon={<Zap size={20} />}
                            title="Contact Function"
                            url={DEPLOY_STATUS.contactFunction.url}
                            statusLabel="Live"
                        />
                    </div>
                </section>

                {/* Publish */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
                                <Rocket size={20} /> Publish Site
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 font-text">
                                Build and deploy the static site with latest content from the CMS
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Environment selector */}
                            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setEnvironment("staging")}
                                    className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                                        environment === "staging"
                                            ? "bg-amber-500 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    Staging
                                </button>
                                <button
                                    onClick={() => setEnvironment("production")}
                                    className={`px-4 py-2 text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                                        environment === "production"
                                            ? "bg-emerald-600 text-white"
                                            : "bg-white text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    Production
                                </button>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={publishing}
                                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-heading text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                                    publishing
                                        ? "bg-gray-200 text-gray-400 cursor-wait"
                                        : environment === "production"
                                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                                            : "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                                }`}
                            >
                                {publishing ? (
                                    <><Loader2 size={16} className="animate-spin" /> Building…</>
                                ) : (
                                    <><Rocket size={16} /> Publish to {environment}</>
                                )}
                            </button>
                        </div>
                    </div>

                    {publishResult && (
                        <div className={`mt-4 p-3 rounded-lg text-sm font-text ${
                            publishResult.success
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                            {publishResult.message}
                        </div>
                    )}
                </section>

                {/* Build History */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-heading font-bold text-gray-500 uppercase tracking-wider">
                            Build History
                        </h2>
                        <button
                            onClick={fetchBuilds}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-text"
                        >
                            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {loading && builds.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 font-text text-sm">
                                <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                                Loading build history…
                            </div>
                        ) : builds.length === 0 ? (
                            <div className="p-12 text-center text-gray-400 font-text text-sm">
                                No builds yet. Click "Publish" to trigger your first build.
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-6 py-3 text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Build ID</th>
                                        <th className="text-left px-6 py-3 text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Trigger</th>
                                        <th className="text-left px-6 py-3 text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Started</th>
                                        <th className="text-left px-6 py-3 text-xs font-heading font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {builds.map((build) => (
                                        <tr key={build.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-3">
                                                <StatusBadge status={build.status} />
                                            </td>
                                            <td className="px-6 py-3 text-xs font-mono text-gray-600">
                                                {build.id.slice(0, 8)}…
                                            </td>
                                            <td className="px-6 py-3 text-xs font-text text-gray-500">
                                                {build.trigger || "Manual"}
                                            </td>
                                            <td className="px-6 py-3 text-xs font-text text-gray-500">
                                                {formatTime(build.createTime)}
                                            </td>
                                            <td className="px-6 py-3 text-xs font-text text-gray-500">
                                                {build.duration || "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}
