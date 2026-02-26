import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
            <h1 className="font-heading text-[12rem] md:text-[16rem] leading-none uppercase tracking-widest text-black">
                404
            </h1>
            <p className="text-gray-500 max-w-md text-lg">
                The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                href="/"
                className="px-6 py-3 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
                Back to home
            </Link>
        </div>
    );
}
