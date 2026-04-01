"use client";

import React, { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { InfiniteScrollItem } from "@/types/work";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { getAssetUrl } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

// ─── Internal types ──────────────────────────────────────────────────
interface CellRect {
    x: number;
    y: number;
    w: number;
    h: number;
    item: InfiniteScrollItem;
}

interface MediaEntry {
    type: "image" | "video" | "lottie";
    element: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement;
    ready: boolean;
}

// ─── Props ───────────────────────────────────────────────────────────
export interface InfiniteScrollPaneProps {
    items: InfiniteScrollItem[][];
    id?: string;
}

// ─── Constants ───────────────────────────────────────────────────────
const GAP = 4;          // tight gap between cells
const CORNER = 16;      // matches --corner-large
const AUTO_SPEED = -0.7;
const LABEL_FONT = "700 11px 'DM Sans', sans-serif";
const TEXT_FONT = "400 18px 'DM Sans', sans-serif";

// ─── Modular wrapping ────────────────────────────────────────────────
function wrapValue(min: number, max: number, v: number): number {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
}

// ─── Rounded rect clipping ──────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

// ─── Parse CSS color / Tailwind class into a canvas-compatible color ─
let resolvedBrandColor: string | null = null;
function getBrandColor(): string {
    if (resolvedBrandColor) return resolvedBrandColor;
    if (typeof window === "undefined") return "#e53e3e";
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
    // CSS vars may be in "R G B" format, convert to rgb()
    if (raw && !raw.startsWith("#") && !raw.startsWith("rgb")) {
        resolvedBrandColor = `rgb(${raw})`;
    } else {
        resolvedBrandColor = raw || "#e53e3e";
    }
    return resolvedBrandColor;
}

function resolveColor(color?: string): string {
    if (!color) return "#e5e7eb";
    if (color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl")) return color;
    if (color.includes("brand")) return getBrandColor();
    if (color.includes("gray")) return "#e5e7eb";
    return "#e5e7eb";
}

// ─── Wrap text into lines that fit a width ────────────────────────────
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
        const test = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = test;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
}

// ─── Mobile Horizontal Scroll ───────────────────────────────────────
const LottiePlayer = dynamic(() => import("lottie-react"), { ssr: false });

function MobileScrollPane({ items, id }: { items: InfiniteScrollItem[][]; id: string }) {
    // Flatten all items, keep only those with renderable content
    const allItems = useMemo(() =>
        items.flatMap(row => row).filter(item => {
            if (item.type === "spline") return false;
            if (item.type === "text" && item.text) return true;
            if (item.type === "image" && item.src) return true;
            return false;
        }),
        [items]
    );

    return (
        <section id={id} className="w-full bg-white pt-[128px] overflow-hidden">
            <div
                className="w-full overflow-x-auto snap-x snap-mandatory flex pl-4 pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {allItems.map((item, idx) => (
                    <div
                        key={item.id}
                        className="relative rounded-2xl overflow-hidden shrink-0 snap-center"
                        style={{
                            width: "120vw",
                            height: "50vh",
                            minHeight: "280px",
                            marginLeft: idx === 0 ? 0 : "8px",
                            backgroundColor: item.type === "text" ? "var(--color-brand, #e53e3e)" : (item.color || "#e5e7eb"),
                        }}
                    >
                        <MobileScrollCell item={item} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function MobileLottieCell({ src }: { src: string }) {
    const [animationData, setAnimationData] = useState<unknown>(null);

    useEffect(() => {
        const url = getAssetUrl(src);
        fetch(url)
            .then(r => r.json())
            .then(data => setAnimationData(data))
            .catch(console.error);
    }, [src]);

    if (!animationData) return null;

    return (
        <LottiePlayer
            animationData={animationData}
            loop
            autoplay
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
    );
}

function MobileScrollCell({ item }: { item: InfiniteScrollItem }) {
    const label = item.label || `${item.width}×${item.height}`;

    if (item.type === "text" && item.text) {
        return (
            <div className="absolute inset-0 p-8 flex flex-col items-center justify-between">
                <div />
                <p className="text-white text-3xl font-normal text-center leading-relaxed font-heading">
                    {item.text}
                </p>
                <div className="flex justify-center pointer-events-auto">
                    <Button
                        href="/service/ai-visual-content"
                        variant="filled"
                        size="large"
                        className="!bg-white !text-brand !border-white hover:!bg-white/90 shadow-lg"
                        rightIcon={ArrowRight}
                    >
                        Learn more
                    </Button>
                </div>
            </div>
        );
    }

    if (item.type === "image" && item.src) {
        const url = getAssetUrl(item.src);

        if (item.src.endsWith(".mp4") || item.src.endsWith(".webm")) {
            return (
                <>
                    <video
                        src={url}
                        className="absolute inset-0 w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full">
                        {label}
                    </div>
                </>
            );
        }

        if (item.src.endsWith(".json")) {
            return (
                <>
                    <div className="absolute inset-0 w-full h-full">
                        <MobileLottieCell src={item.src} />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full">
                        {label}
                    </div>
                </>
            );
        }

        return (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={url}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full">
                    {label}
                </div>
            </>
        );
    }

    return null;
}

// ─── Component ──────────────────────────────────────────────────────
export function WorksInfiniteScrollPane({ items, id = "infinite-scroll" }: InfiniteScrollPaneProps) {
    return (
        <>
            {/* Mobile: horizontal scroll (visible < md) */}
            <div className="block md:hidden">
                <MobileScrollPane items={items} id={id} />
            </div>
            {/* Desktop: canvas infinite scroll (visible >= md) */}
            <div className="hidden md:block">
                <DesktopInfiniteScrollPane items={items} id={id} />
            </div>
        </>
    );
}

function DesktopInfiniteScrollPane({ items, id }: InfiniteScrollPaneProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const splineOverlayRef = useRef<HTMLDivElement>(null);
    const textOverlayRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const mediaCache = useRef<Map<string, MediaEntry>>(new Map());
    const lottieCache = useRef<Map<string, any>>(new Map());

    // Scroll state — all stored as refs to avoid re-renders
    const scrollPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPointer = useRef({ x: 0, y: 0 });
    const targetMul = useRef({ x: 1, y: 0 });
    const currentMul = useRef({ x: 1, y: 0 });
    const isVisible = useRef(false);
    const dpr = useRef(1);
    const isHoveringButton = useRef(false);

    // ─── Build flat cell layout (one "tile" = all rows) ─────────────
    const { cells, tileW, tileH } = useMemo(() => {
        if (!items || items.length === 0) return { cells: [], tileW: 0, tileH: 0 };

        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const scale = isMobile ? 0.7 : 1;
        const gap = isMobile ? 2 : GAP;

        let cursorY = 0;
        const cellList: CellRect[] = [];
        let maxWidth = 0;

        for (const row of items) {
            let cursorX = 0;
            let rowHeight = 0;
            for (const item of row) {
                const w = Math.round((typeof item.width === "number" ? item.width : parseInt(String(item.width), 10) || 600) * scale);
                const h = Math.round((typeof item.height === "number" ? item.height : parseInt(String(item.height), 10) || 500) * scale);
                cellList.push({ x: cursorX, y: cursorY, w, h, item });
                cursorX += w + gap;
                rowHeight = Math.max(rowHeight, h);
            }
            maxWidth = Math.max(maxWidth, cursorX);
            cursorY += rowHeight + gap;
        }

        // tileW/tileH include the trailing gap so that when copies tile,
        // the seam between the last cell of one copy and the first cell of the next
        // has the same gap as between cells within the tile.
        return { cells: cellList, tileW: maxWidth, tileH: cursorY };
    }, [items]);

    // ─── Preload media ──────────────────────────────────────────────
    const preloadMedia = useCallback((src: string, item: InfiniteScrollItem) => {
        if (!src || mediaCache.current.has(src)) return;

        if (src.endsWith(".mp4") || src.endsWith(".webm")) {
            const video = document.createElement("video");
            video.src = src;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.preload = "auto";
            video.crossOrigin = "anonymous";
            const entry: MediaEntry = { type: "video", element: video, ready: false };
            video.addEventListener("canplaythrough", () => {
                entry.ready = true;
                video.play().catch(() => { });
            }, { once: true });
            video.addEventListener("error", () => { entry.ready = false; });
            video.load();
            mediaCache.current.set(src, entry);
        } else if (src.endsWith(".json")) {
            // Lottie — use a hidden DOM container so lottie-web can create its own canvas
            const container = document.createElement("div");
            container.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:400px;height:400px;pointer-events:none;";
            document.body.appendChild(container);

            // Placeholder canvas — will be replaced once lottie creates its own
            const placeholder = document.createElement("canvas");
            placeholder.width = 400;
            placeholder.height = 400;
            const entry: MediaEntry = { type: "lottie", element: placeholder, ready: false };
            mediaCache.current.set(src, entry);

            const loadAnim = (json: any) => {
                import("lottie-web").then(({ default: lottie }) => {
                    lottie.loadAnimation({
                        container,
                        renderer: "canvas",
                        loop: true,
                        autoplay: true,
                        animationData: json,
                    });
                    // lottie-web creates a <canvas> inside the container
                    const lottieCanvas = container.querySelector("canvas");
                    if (lottieCanvas) {
                        entry.element = lottieCanvas;
                        entry.ready = true;
                    }
                }).catch(console.error);
            };

            if (lottieCache.current.has(src)) {
                loadAnim(lottieCache.current.get(src)!);
            } else {
                fetch(src)
                    .then(r => r.json())
                    .then(json => {
                        lottieCache.current.set(src, json);
                        loadAnim(json);
                    })
                    .catch(console.error);
            }
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous";
            const entry: MediaEntry = { type: "image", element: img, ready: false };
            img.onload = () => { entry.ready = true; };
            img.onerror = () => { entry.ready = false; };
            img.src = src;
            mediaCache.current.set(src, entry);
        }
    }, []);



    // ─── Draw a single cell ─────────────────────────────────────────
    const drawCell = useCallback((
        ctx: CanvasRenderingContext2D,
        cell: CellRect,
        drawX: number,
        drawY: number,
        pixelRatio: number
    ) => {
        const { w, h, item } = cell;
        const rw = w * pixelRatio;
        const rh = h * pixelRatio;
        const rx = drawX * pixelRatio;
        const ry = drawY * pixelRatio;
        const rCorner = CORNER * pixelRatio;

        // Skip Spline items — they're rendered as DOM overlays
        if (item.type === "spline") return;

        ctx.save();
        roundRect(ctx, rx, ry, rw, rh, rCorner);
        ctx.clip();

        // Background color
        const bgColor = item.type === "text" ? getBrandColor() : resolveColor(item.color);
        ctx.fillStyle = bgColor;
        ctx.fillRect(rx, ry, rw, rh);

        // Draw media content — check .json (Lottie) BEFORE generic image
        if (item.type === "image" && item.src?.endsWith(".json")) {
            // Lottie — drawn from lottie-web's internal canvas
            const entry = mediaCache.current.get(item.src);
            if (entry?.ready) {
                try {
                    ctx.drawImage(entry.element, rx, ry, rw, rh);
                } catch { }
            } else if (item.src) {
                preloadMedia(item.src, item);
            }
        } else if (item.type === "image" && item.src) {
            const entry = mediaCache.current.get(item.src);
            if (entry?.ready) {
                // Object-cover: center crop the source to fill the cell
                const el = entry.element as HTMLImageElement | HTMLVideoElement;
                const srcW = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth;
                const srcH = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight;

                if (srcW && srcH) {
                    const srcRatio = srcW / srcH;
                    const dstRatio = rw / rh;
                    let sx = 0, sy = 0, sw = srcW, sh = srcH;
                    if (srcRatio > dstRatio) {
                        sw = srcH * dstRatio;
                        sx = (srcW - sw) / 2;
                    } else {
                        sh = srcW / dstRatio;
                        sy = (srcH - sh) / 2;
                    }
                    try {
                        ctx.drawImage(el, sx, sy, sw, sh, rx, ry, rw, rh);
                    } catch {
                        // Video may not be ready yet
                    }
                }
            } else {
                preloadMedia(item.src, item);
            }
        } else if (item.type === "text" && item.text) {
            // Text cells — only draw background; text + button rendered as DOM overlay
        }

        // Draw label badge (bottom-right) — only for image items
        if (item.type === "image") {
            const label = item.label || `${item.width}×${item.height}`;
            ctx.font = `700 ${11 * pixelRatio}px 'DM Sans', sans-serif`;
            const labelW = ctx.measureText(label.toUpperCase()).width + 24 * pixelRatio;
            const labelH = 28 * pixelRatio;
            const labelX = rx + rw - labelW - 12 * pixelRatio;
            const labelY = ry + rh - labelH - 12 * pixelRatio;

            // Badge background
            ctx.fillStyle = "rgba(0,0,0,0.4)";
            roundRect(ctx, labelX, labelY, labelW, labelH, labelH / 2);
            ctx.fill();

            // Badge text
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label.toUpperCase(), labelX + labelW / 2, labelY + labelH / 2);
        }

        ctx.restore();
    }, [preloadMedia]);

    // ─── Main render loop ────────────────────────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || cells.length === 0 || tileW === 0 || tileH === 0) return;

        const ctx = canvas.getContext("2d", { alpha: false })!;
        dpr.current = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for perf
        let lastTime = 0;

        // Preload all media upfront
        for (const cell of cells) {
            if (cell.item.src && cell.item.type !== "spline") {
                preloadMedia(cell.item.src, cell.item);
            }
        }

        // Start scrolled to center of the tile
        scrollPos.current = { x: -tileW / 2, y: -tileH / 2 };

        const resize = () => {
            const parent = canvas.parentElement!;
            const w = parent.clientWidth;
            const h = parent.clientHeight;
            const p = dpr.current;
            canvas.width = w * p;
            canvas.height = h * p;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
        };
        resize();

        const tick = (now: number) => {
            if (!isVisible.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const delta = lastTime ? Math.min(now - lastTime, 33) : 16.666; // Cap to ~30fps
            lastTime = now;
            const timeScale = delta / 16.666;
            const p = dpr.current;

            const viewW = canvas.width / p;
            const viewH = canvas.height / p;

            // Auto-scroll + velocity decay
            if (!isDragging.current) {
                velocity.current.x *= Math.pow(0.95, timeScale);
                velocity.current.y *= Math.pow(0.95, timeScale);

                currentMul.current.x += (targetMul.current.x - currentMul.current.x) * 0.1 * timeScale;
                currentMul.current.y += (targetMul.current.y - currentMul.current.y) * 0.1 * timeScale;

                if (Math.abs(velocity.current.x) < 0.1) velocity.current.x = 0;
                if (Math.abs(velocity.current.y) < 0.1) velocity.current.y = 0;

                const baseSpeed = isHoveringButton.current ? 0 : AUTO_SPEED;
                const moveX = (baseSpeed * currentMul.current.x) + velocity.current.x;
                const moveY = (baseSpeed * currentMul.current.y) + velocity.current.y;

                scrollPos.current.x = wrapValue(-tileW, 0, scrollPos.current.x + moveX * timeScale);
                scrollPos.current.y = wrapValue(-tileH, 0, scrollPos.current.y + moveY * timeScale);
            }

            // Clear
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw tiled copies (2×2 = 4 copies to cover any scroll position)
            const sx = scrollPos.current.x;
            const sy = scrollPos.current.y;

            for (let ty = -1; ty <= 1; ty++) {
                for (let tx = -1; tx <= 1; tx++) {
                    const offX = sx + tx * tileW;
                    const offY = sy + ty * tileH;

                    for (const cell of cells) {
                        const drawX = cell.x + offX;
                        const drawY = cell.y + offY;

                        // Frustum culling — only draw cells visible on screen
                        if (
                            drawX + cell.w < 0 || drawX > viewW ||
                            drawY + cell.h < 0 || drawY > viewH
                        ) continue;

                        drawCell(ctx, cell, drawX, drawY, p);
                    }
                }
            }

            // Position Spline overlays
            if (splineOverlayRef.current) {
                const splineCells = cells.filter(c => c.item.type === "spline");
                const overlayChildren = splineOverlayRef.current.children;
                let overlayIdx = 0;

                for (const cell of splineCells) {
                    let bestX = Infinity, bestY = Infinity;
                    // Find the best tile copy that's closest to the viewport center
                    for (let ty = -1; ty <= 1; ty++) {
                        for (let tx = -1; tx <= 1; tx++) {
                            const candX = cell.x + sx + tx * tileW;
                            const candY = cell.y + sy + ty * tileH;
                            const centerDist = Math.hypot(
                                candX + cell.w / 2 - viewW / 2,
                                candY + cell.h / 2 - viewH / 2
                            );
                            const bestDist = Math.hypot(
                                bestX + cell.w / 2 - viewW / 2,
                                bestY + cell.h / 2 - viewH / 2
                            );
                            if (centerDist < bestDist) {
                                bestX = candX;
                                bestY = candY;
                            }
                        }
                    }

                    const el = overlayChildren[overlayIdx] as HTMLElement | undefined;
                    if (el) {
                        const isOnScreen = bestX + cell.w > 0 && bestX < viewW && bestY + cell.h > 0 && bestY < viewH;
                        el.style.transform = `translate(${bestX}px, ${bestY}px)`;
                        el.style.width = `${cell.w}px`;
                        el.style.height = `${cell.h}px`;
                        el.style.display = isOnScreen ? "block" : "none";
                    }
                    overlayIdx++;
                }
            }

            // Position Text item button overlays
            if (textOverlayRef.current) {
                const textCells = cells.filter(c => c.item.type === "text" && c.item.text);
                const overlayChildren = textOverlayRef.current.children;
                let overlayIdx = 0;

                for (const cell of textCells) {
                    let bestX = Infinity, bestY = Infinity;
                    // Find the best tile copy that's closest to the viewport center
                    for (let ty = -1; ty <= 1; ty++) {
                        for (let tx = -1; tx <= 1; tx++) {
                            const candX = cell.x + sx + tx * tileW;
                            const candY = cell.y + sy + ty * tileH;
                            const centerDist = Math.hypot(
                                candX + cell.w / 2 - viewW / 2,
                                candY + cell.h / 2 - viewH / 2
                            );
                            const bestDist = Math.hypot(
                                bestX + cell.w / 2 - viewW / 2,
                                bestY + cell.h / 2 - viewH / 2
                            );
                            if (centerDist < bestDist) {
                                bestX = candX;
                                bestY = candY;
                            }
                        }
                    }

                    const el = overlayChildren[overlayIdx] as HTMLElement | undefined;
                    if (el) {
                        const isOnScreen = bestX + cell.w > 0 && bestX < viewW && bestY + cell.h > 0 && bestY < viewH;
                        el.style.transform = `translate(${bestX}px, ${bestY}px)`;
                        el.style.width = `${cell.w}px`;
                        el.style.height = `${cell.h}px`;
                        el.style.display = isOnScreen ? "flex" : "none";
                    }
                    overlayIdx++;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        // Visibility observer — stop painting when offscreen
        const observer = new IntersectionObserver(([entry]) => {
            isVisible.current = entry.isIntersecting;
        }, { threshold: 0.05 });
        observer.observe(canvas.parentElement!);

        rafRef.current = requestAnimationFrame(tick);
        window.addEventListener("resize", resize);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            observer.disconnect();
            window.removeEventListener("resize", resize);
            // Pause all videos
            mediaCache.current.forEach(entry => {
                if (entry.type === "video") (entry.element as HTMLVideoElement).pause();
            });
        };
    }, [cells, tileW, tileH, drawCell, preloadMedia]);

    // ─── Spline overlay items ────────────────────────────────────────
    const splineItems = useMemo(
        () => cells.filter(c => c.item.type === "spline"),
        [cells]
    );

    const textItems = useMemo(
        () => cells.filter(c => c.item.type === "text" && c.item.text),
        [cells]
    );

    // ─── Pointer handlers ────────────────────────────────────────────
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        isDragging.current = true;
        velocity.current = { x: 0, y: 0 };
        lastPointer.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging.current) {
            // Mouse-direction based speed
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            targetMul.current = {
                x: mx < rect.width / 2 ? -4.5 : 4.5,
                y: my < rect.height / 2 ? -4.5 : 4.5,
            };
            return;
        }

        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        velocity.current = { x: dx, y: dy };

        scrollPos.current.x = wrapValue(-tileW, 0, scrollPos.current.x + dx);
        scrollPos.current.y = wrapValue(-tileH, 0, scrollPos.current.y + dy);

        lastPointer.current = { x: e.clientX, y: e.clientY };
    }, [tileW, tileH]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        isDragging.current = false;
        // Transfer velocity for momentum
        velocity.current = {
            x: velocity.current.x * 0.5,
            y: velocity.current.y * 0.5,
        };
    }, []);

    const handlePointerLeave = useCallback(() => {
        if (!isDragging.current) {
            targetMul.current = { x: 1, y: 0 };
        }
    }, []);

    return (
        <section
            id={id}
            className="relative w-full h-[150vh] min-h-[600px] bg-white pt-[128px] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
            />

            {/* DOM overlay for Spline scenes (rare — usually 0-1 items) */}
            {splineItems.length > 0 && (
                <div ref={splineOverlayRef} className="absolute inset-0 pointer-events-none z-10">
                    {splineItems.map((cell, i) => (
                        <ErrorBoundary key={i} label={`Spline:${cell.item.id}`}>
                            <div
                                className="absolute top-0 left-0 rounded-[var(--corner-large)] overflow-hidden pointer-events-auto cursor-grab active:cursor-grabbing [&>div]:!h-full [&>div]:!w-full [&>div>canvas]:!w-full [&>div>canvas]:!h-full [&>div>canvas]:object-cover"
                                style={{ display: "none" }}
                            >
                                <Spline scene={cell.item.src || "/img/workspane/pane-11-viry/scene.splinecode"} />
                            </div>
                        </ErrorBoundary>
                    ))}
                </div>
            )}

            {/* DOM overlay for Text Item Buttons */}
            {textItems.length > 0 && (
                <div ref={textOverlayRef} className="absolute inset-0 pointer-events-none origin-top-left z-20">
                    {textItems.map((cell, i) => (
                        <div
                            key={i}
                            className="absolute top-0 left-0 pointer-events-none flex flex-col items-center justify-evenly px-16 py-8"
                            style={{ display: "none" }}
                        >
                            <p className="text-white text-[27px] font-normal text-center leading-[39px] pointer-events-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                {cell.item.text}
                            </p>
                            <div
                                className="flex justify-center pointer-events-auto"
                                onPointerDown={(e) => e.stopPropagation()}
                                onPointerEnter={() => { isHoveringButton.current = true; }}
                                onPointerLeave={() => { isHoveringButton.current = false; }}
                            >
                                <Button
                                    href="/service/ai-visual-content"
                                    variant="filled"
                                    size="large"
                                    className="!bg-white !text-brand !border-white hover:!bg-white/90 shadow-lg relative z-50"
                                    rightIcon={ArrowRight}
                                >
                                    Learn more
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
