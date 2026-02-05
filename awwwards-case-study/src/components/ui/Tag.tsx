import { clsx } from "clsx";

interface TagProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "brand";
    style?: React.CSSProperties;
}

export function Tag({ children, className, variant = "brand", style }: TagProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center justify-center px-3 h-[34px] rounded-full border",
                "font-heading text-sm font-bold uppercase tracking-wider text-black",
                variant === "brand" && "bg-gray-100 border-black/5",
                variant === "default" && "bg-white border-text/20",
                className
            )}
            style={style}
        >
            {children}
        </span>
    );
}
