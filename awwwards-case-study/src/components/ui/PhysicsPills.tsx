"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";

interface PhysicsPillsProps {
    tags: string[];
    onTagClick?: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────
const FONT = "700 16px 'DM Sans', sans-serif";
const PILL_PX = 30;
const PILL_PY = 18;
const WALL_W = 150;

// ─── Measure pill sizes using an offscreen canvas ────────────────────
function measureTags(tags: string[], dpr: number): { width: number; height: number }[] {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = FONT;
    return tags.map(tag => {
        const textW = ctx.measureText(tag.toUpperCase()).width;
        return {
            width: Math.ceil(textW + PILL_PX * 2),
            height: Math.ceil(16 + PILL_PY * 2),
        };
    });
}

// ─── Draw a single pill ─────────────────────────────────────────────
function drawPill(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    w: number, h: number,
    angle: number,
    label: string,
    opacity: number,
    dpr: number,
    brandColor: string,
    hoverScale: number,
) {
    const rw = w * dpr;
    const rh = h * dpr;
    const r = rh / 2;

    ctx.save();
    ctx.translate(x * dpr, y * dpr);
    ctx.rotate(angle);
    ctx.globalAlpha = opacity;

    // Scale (animated externally)
    ctx.scale(hoverScale, hoverScale);

    // Shadow
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 8 * dpr;
    ctx.shadowOffsetY = 2 * dpr;

    // Pill shape
    ctx.beginPath();
    ctx.moveTo(-rw / 2 + r, -rh / 2);
    ctx.lineTo(rw / 2 - r, -rh / 2);
    ctx.arc(rw / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(-rw / 2 + r, rh / 2);
    ctx.arc(-rw / 2 + r, 0, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();

    ctx.fillStyle = brandColor;
    ctx.fill();

    // Reset shadow for text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${16 * dpr}px 'DM Sans', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label.toUpperCase(), 0, 1 * dpr);

    ctx.restore();
}

// ─── Get brand color from CSS var ────────────────────────────────────
function getBrandColor(): string {
    if (typeof window === "undefined") return "#e53e3e";
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim();
    if (raw && !raw.startsWith("#") && !raw.startsWith("rgb")) {
        return `rgb(${raw})`;
    }
    return raw || "#e53e3e";
}

// ─── Component ──────────────────────────────────────────────────────
export const PhysicsPills = React.memo(({ tags, onTagClick }: PhysicsPillsProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Refs for physics state (avoid re-renders)
    const bodiesRef = useRef<Matter.Body[]>([]);
    const dimsRef = useRef<{ width: number; height: number }[]>([]);
    const opacitiesRef = useRef<number[]>([]);
    const hoveredRef = useRef<number | null>(null);
    const hoverScalesRef = useRef<number[]>([]);
    const brandColorRef = useRef<string>("#e53e3e");

    // Hit test: find which pill the pointer is over
    const hitTest = useCallback((clientX: number, clientY: number): number | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const mx = clientX - rect.left;
        const my = clientY - rect.top;

        const bodies = bodiesRef.current;
        const dims = dimsRef.current;

        for (let i = bodies.length - 1; i >= 0; i--) {
            const body = bodies[i];
            const dim = dims[i];
            if (!body || !dim) continue;

            // Transform point into body-local space
            const dx = mx - body.position.x;
            const dy = my - body.position.y;
            const cos = Math.cos(-body.angle);
            const sin = Math.sin(-body.angle);
            const lx = dx * cos - dy * sin;
            const ly = dx * sin + dy * cos;

            if (Math.abs(lx) <= dim.width / 2 && Math.abs(ly) <= dim.height / 2) {
                return i;
            }
        }
        return null;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        brandColorRef.current = getBrandColor();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const actualTags = tags;

        // Measure pill sizes
        const dims = measureTags(actualTags, dpr);
        dimsRef.current = dims;
        opacitiesRef.current = actualTags.map(() => 0);
        hoverScalesRef.current = actualTags.map(() => 1);

        // Resize canvas
        let width = container.clientWidth;
        let height = container.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d", { alpha: true })!;

        // ─── Physics setup ───────────────────────────────────────
        const engine = Matter.Engine.create({ enableSleeping: true });
        engine.gravity.y = 0.8;
        const world = engine.world;

        const wallOpts = { isStatic: true } as Matter.IChamferableBodyDefinition;
        const ground = Matter.Bodies.rectangle(width / 2, height + WALL_W / 2, width + WALL_W * 2, WALL_W, wallOpts);
        const leftWall = Matter.Bodies.rectangle(50 - WALL_W / 2, height / 2, WALL_W, height * 3, wallOpts);
        const rightWall = Matter.Bodies.rectangle(width - 50 + WALL_W / 2, height / 2, WALL_W, height * 3, wallOpts);
        Matter.World.add(world, [ground, leftWall, rightWall]);

        const bodies = actualTags.map((_, i) => {
            const dim = dims[i] ?? { width: 160, height: 64 };
            const startX = 50 + dim.width / 2 + Math.random() * Math.max(width - 100 - dim.width, 0);
            const startY = Math.random() * 100;
            return Matter.Bodies.rectangle(startX, startY, dim.width, dim.height, {
                restitution: 0.5 + Math.random() * 0.2,
                friction: 0.2,
                frictionAir: 0.03 + Math.random() * 0.03,
                density: 0.001 + Math.random() * 0.002,
                angle: (Math.random() - 0.5) * 0.4,
                chamfer: { radius: dim.height / 2 },
            });
        });
        bodiesRef.current = bodies;

        // Mouse constraint for dragging
        const mouse = Matter.Mouse.create(container);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse,
            constraint: { stiffness: 0.2, render: { visible: false } },
        });
        // Prevent scroll hijacking
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        Matter.World.add(world, mouseConstraint);

        const runner = Matter.Runner.create();
        const staggerTimeouts: ReturnType<typeof setTimeout>[] = [];
        let isVisible = false;
        let hasTriggered = false;
        let animFrameId: number | null = null;

        // ─── Render loop ─────────────────────────────────────────
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < bodies.length; i++) {
                const body = bodies[i];
                const dim = dims[i];
                const opacity = opacitiesRef.current[i] ?? 0;
                if (!body || !dim || opacity <= 0) continue;

                // Smooth hover microinteraction via lerp
                const target = hoveredRef.current === i ? 1.2 : 1;
                const current = hoverScalesRef.current[i] ?? 1;
                hoverScalesRef.current[i] = current + (target - current) * 0.15;

                drawPill(
                    ctx,
                    body.position.x, body.position.y,
                    dim.width, dim.height,
                    body.angle,
                    actualTags[i],
                    opacity,
                    dpr,
                    brandColorRef.current,
                    hoverScalesRef.current[i],
                );
            }

            animFrameId = requestAnimationFrame(render);
        };

        const startLoop = () => {
            if (animFrameId === null) {
                animFrameId = requestAnimationFrame(render);
            }
        };

        const stopLoop = () => {
            if (animFrameId !== null) {
                cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }
        };

        // ─── Visibility observer ─────────────────────────────────
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;

            if (isVisible) {
                if (!hasTriggered) {
                    hasTriggered = true;
                    Matter.Runner.run(runner, engine);

                    bodies.forEach((body, i) => {
                        const tid = setTimeout(() => {
                            Matter.World.add(world, body);
                            // Fade in
                            const fadeIn = () => {
                                opacitiesRef.current[i] = Math.min((opacitiesRef.current[i] ?? 0) + 0.05, 1);
                                if (opacitiesRef.current[i] < 1) requestAnimationFrame(fadeIn);
                            };
                            fadeIn();
                        }, i * 80);
                        staggerTimeouts.push(tid);
                    });
                }
                startLoop();
            } else {
                stopLoop();
            }
        }, { threshold: 0.2 });
        observer.observe(container);

        // ─── Resize handler ──────────────────────────────────────
        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            Matter.Body.setPosition(ground, { x: width / 2, y: height + WALL_W / 2 });
            Matter.Body.setPosition(leftWall, { x: 50 - WALL_W / 2, y: height / 2 });
            Matter.Body.setPosition(rightWall, { x: width - 50 + WALL_W / 2, y: height / 2 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(width / 2, height + WALL_W / 2, width + WALL_W * 2, WALL_W, wallOpts).vertices);
            Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(50 - WALL_W / 2, height / 2, WALL_W, height * 3, wallOpts).vertices);
            Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(width - 50 + WALL_W / 2, height / 2, WALL_W, height * 3, wallOpts).vertices);
        };
        window.addEventListener("resize", handleResize);

        // ─── Pointer events for hover / click ────────────────────
        const handleMove = (e: PointerEvent) => {
            const hit = hitTest(e.clientX, e.clientY);
            hoveredRef.current = hit;
            canvas.style.cursor = hit !== null ? "pointer" : "grab";
        };

        const handleClick = (e: MouseEvent) => {
            const hit = hitTest(e.clientX, e.clientY);
            if (hit !== null) {
                onTagClick?.();
            }
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("click", handleClick);

        // ─── Cleanup ─────────────────────────────────────────────
        return () => {
            staggerTimeouts.forEach(clearTimeout);
            window.removeEventListener("resize", handleResize);
            canvas.removeEventListener("pointermove", handleMove);
            canvas.removeEventListener("click", handleClick);
            stopLoop();
            observer.disconnect();
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            Matter.World.clear(world, false);
            Matter.Mouse.clearSourceEvents(mouse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags, onTagClick, hitTest]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto z-0"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />
        </div>
    );
});
PhysicsPills.displayName = "PhysicsPills";
