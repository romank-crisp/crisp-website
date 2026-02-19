"use client";

import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import Matter from "matter-js";
import { clsx } from "clsx";

interface PhysicsPillsProps {
    tags: string[];
    onTagClick?: () => void;
}

// Stable per-tag color — white to light desaturated blue
function tagColor(i: number, seed: number) {
    // Use seeded pseudo-random so color is stable on re-render but varies per tag
    const t = ((i * 2654435761 + seed) % 100) / 100;
    const sat = Math.round(t * 25);
    const light = Math.round(100 - t * 12);
    return `hsl(210 ${sat}% ${light}%)`;
}

export function PhysicsPills({ tags, onTagClick }: PhysicsPillsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Stable seed per tags identity so colors don't flicker on re-render
    const seed = tags.reduce((acc, t) => acc + t.charCodeAt(0), 0);

    useLayoutEffect(() => {
        wrapperRefs.current = wrapperRefs.current.slice(0, tags.length);
    }, [tags]);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;

        const dims = wrapperRefs.current.map(wrapper => ({
            width: wrapper?.offsetWidth ?? 160,
            height: wrapper?.offsetHeight ?? 64,
        }));

        wrapperRefs.current.forEach((el, i) => {
            if (el && dims[i]) {
                el.style.marginLeft = `${-dims[i].width / 2}px`;
                el.style.marginTop = `${-dims[i].height / 2}px`;
            }
        });

        const engine = Matter.Engine.create();
        const world = engine.world;
        engine.gravity.y = 0.4;

        const W = 150;
        let width = container.clientWidth;
        let height = container.clientHeight;

        const wallOpts = { isStatic: true, render: { visible: false } };
        const ground = Matter.Bodies.rectangle(width / 2, height + W / 2, width + W * 2, W, wallOpts);
        const leftWall = Matter.Bodies.rectangle(-W / 2, height / 2, W, height * 3, wallOpts);
        const rightWall = Matter.Bodies.rectangle(width + W / 2, height / 2, W, height * 3, wallOpts);
        Matter.World.add(world, [ground, leftWall, rightWall]);

        const bodies = tags.map((_, i) => {
            const dim = dims[i] ?? { width: 160, height: 64 };
            const startX = Math.random() * Math.max(width - dim.width, 80) + dim.width / 2;
            const startY = -(Math.random() * 600 + 80);
            const density = 0.001 + Math.random() * 0.004;
            const frictionAir = 0.06 + Math.random() * 0.10;
            return Matter.Bodies.rectangle(startX, startY, dim.width, dim.height, {
                restitution: 0.08, friction: 0.02, frictionAir, density,
                angle: (Math.random() - 0.5) * 0.2,
                chamfer: { radius: dim.height / 2 },
            });
        });

        Matter.World.add(world, bodies);

        const mouse = Matter.Mouse.create(container);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse, constraint: { stiffness: 0.2, render: { visible: false } },
        });
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        Matter.World.add(world, mouseConstraint);

        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        const staggerTimeouts: ReturnType<typeof setTimeout>[] = [];
        bodies.forEach((body, i) => {
            const tid = setTimeout(() => {
                Matter.World.add(world, body);
                const el = wrapperRefs.current[i];
                if (el) el.style.opacity = "1";
            }, i * 80);
            staggerTimeouts.push(tid);
        });

        let animFrameId: number;
        const loop = () => {
            bodies.forEach((body, i) => {
                const el = wrapperRefs.current[i];
                if (el && body) {
                    el.style.transform = `translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
                }
            });
            animFrameId = requestAnimationFrame(loop);
        };
        loop();

        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            Matter.Body.setPosition(ground, { x: width / 2, y: height + W / 2 });
            Matter.Body.setPosition(leftWall, { x: -W / 2, y: height / 2 });
            Matter.Body.setPosition(rightWall, { x: width + W / 2, y: height / 2 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(width / 2, height + W / 2, width + W * 2, W, wallOpts).vertices);
            Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(-W / 2, height / 2, W, height * 3, wallOpts).vertices);
            Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(width + W / 2, height / 2, W, height * 3, wallOpts).vertices);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            staggerTimeouts.forEach(clearTimeout);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animFrameId);
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            Matter.World.clear(world, false);
            Matter.Mouse.clearSourceEvents(mouse);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tags]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto z-10 bg-white/5"
        >
            {tags.map((tag, i) => {
                const isHovered = hoveredIdx === i;
                const bg = isHovered
                    ? "rgb(var(--color-brand))"
                    : tagColor(i, seed);
                const textColor = isHovered ? "#fff" : "#000";

                return (
                    <div
                        key={`${tag}-${i}`}
                        ref={el => { wrapperRefs.current[i] = el; }}
                        className="absolute top-0 left-0"
                        style={{
                            opacity: 0,
                            transformOrigin: "center center",
                            willChange: "transform",
                            // allow pointer events on tag itself
                            pointerEvents: "auto",
                        }}
                        onMouseEnter={() => setHoveredIdx(i)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        onClick={() => onTagClick?.()}
                    >
                        <div
                            className={clsx(
                                "inline-flex items-center justify-center rounded-full shadow-md select-none",
                                "font-heading text-sm font-bold uppercase tracking-wider whitespace-nowrap",
                                "px-12 py-6 transition-colors duration-200",
                                onTagClick && "cursor-pointer"
                            )}
                            style={{ background: bg, color: textColor }}
                        >
                            {tag}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
