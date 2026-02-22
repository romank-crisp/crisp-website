"use client";

import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import Matter from "matter-js";
import { clsx } from "clsx";

interface PhysicsPillsProps {
    tags: string[];
    onTagClick?: () => void;
}

export const PhysicsPills = React.memo(({ tags, onTagClick }: PhysicsPillsProps) => {
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

        const engine = Matter.Engine.create({
            enableSleeping: true // Stops bodies from shaking when rested
        });
        const world = engine.world;
        engine.gravity.y = 0.8; // Moderate gravity for smooth acceleration

        const W = 150;
        let width = container.clientWidth;
        let height = container.clientHeight;

        const wallOpts = { isStatic: true, render: { visible: false } };
        const ground = Matter.Bodies.rectangle(width / 2, height + W / 2, width + W * 2, W, wallOpts);
        // Place walls at exactly 50px from left and right edges
        const leftWall = Matter.Bodies.rectangle(50 - W / 2, height / 2, W, height * 3, wallOpts);
        const rightWall = Matter.Bodies.rectangle(width - 50 + W / 2, height / 2, W, height * 3, wallOpts);
        Matter.World.add(world, [ground, leftWall, rightWall]);

        const bodies = tags.map((_, i) => {
            const dim = dims[i] ?? { width: 160, height: 64 };
            // Ensure they drop within the 50px safety gaps
            const startX = 50 + dim.width / 2 + Math.random() * Math.max(width - 100 - dim.width, 0);
            const startY = Math.random() * 100; // Start inside/near top so fade-in from 0 opacity is visible
            // Easing and bounce feel
            const density = 0.001 + Math.random() * 0.002;
            const frictionAir = 0.03 + Math.random() * 0.03; // Light air friction
            return Matter.Bodies.rectangle(startX, startY, dim.width, dim.height, {
                restitution: 0.5 + Math.random() * 0.2, // High bounce
                friction: 0.2, // Moderate friction
                frictionAir,
                density,
                angle: (Math.random() - 0.5) * 0.4,
                chamfer: { radius: dim.height / 2 },
            });
        });

        const mouse = Matter.Mouse.create(container);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse, constraint: { stiffness: 0.2, render: { visible: false } },
        });
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        Matter.World.add(world, mouseConstraint);

        const runner = Matter.Runner.create();
        const staggerTimeouts: ReturnType<typeof setTimeout>[] = [];

        let isVisible = false;
        let hasTriggered = false;
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;

            // Trigger animation only when scrolled into view
            if (isVisible && !hasTriggered) {
                hasTriggered = true;

                Matter.Runner.run(runner, engine);

                bodies.forEach((body, i) => {
                    const tid = setTimeout(() => {
                        Matter.World.add(world, body);
                        const el = wrapperRefs.current[i];
                        if (el) el.style.opacity = "1";
                    }, i * 80);
                    staggerTimeouts.push(tid);
                });
            }
        }, { threshold: 0.2 });
        observer.observe(container);

        let animFrameId: number;
        const loop = () => {
            if (isVisible) {
                bodies.forEach((body, i) => {
                    const el = wrapperRefs.current[i];
                    if (el && body) {
                        // Use translate3d to force GPU hardware acceleration
                        // Round slightly to avoid fractional pixel layout jumping
                        const x = body.position.x.toFixed(2);
                        const y = body.position.y.toFixed(2);
                        const angle = body.angle.toFixed(4);
                        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle}rad)`;
                    }
                });
            }
            animFrameId = requestAnimationFrame(loop);
        };
        loop();

        const handleResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            Matter.Body.setPosition(ground, { x: width / 2, y: height + W / 2 });
            Matter.Body.setPosition(leftWall, { x: 50 - W / 2, y: height / 2 });
            Matter.Body.setPosition(rightWall, { x: width - 50 + W / 2, y: height / 2 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(width / 2, height + W / 2, width + W * 2, W, wallOpts).vertices);
            Matter.Body.setVertices(leftWall, Matter.Bodies.rectangle(50 - W / 2, height / 2, W, height * 3, wallOpts).vertices);
            Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(width - 50 + W / 2, height / 2, W, height * 3, wallOpts).vertices);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            staggerTimeouts.forEach(clearTimeout);
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animFrameId);
            observer.disconnect();
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
            className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing pointer-events-auto z-0"
        >
            {tags.map((tag, i) => {
                const isHovered = hoveredIdx === i;
                const bg = "rgb(var(--color-brand))";
                const textColor = "#fff";
                const borderColor = "transparent";

                return (
                    <div
                        key={`${tag}-${i}`}
                        ref={el => { wrapperRefs.current[i] = el; }}
                        className="absolute top-0 left-0 transition-opacity duration-700 ease-out"
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
                                "px-[24px] py-3 transition-all duration-300",
                                onTagClick && "cursor-pointer"
                            )}
                            style={{
                                background: bg,
                                color: textColor,
                                border: `solid 2px ${borderColor}`,
                                transform: isHovered ? "scale(1.25)" : "scale(1)",
                                zIndex: isHovered ? 20 : 10
                            }}
                        >
                            {tag}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
PhysicsPills.displayName = "PhysicsPills";

