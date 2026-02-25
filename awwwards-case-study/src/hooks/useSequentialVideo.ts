export class SequentialVideoLoader {
    private queue: HTMLVideoElement[] = [];
    private isLoading = false;
    private loadedSet = new Set<HTMLVideoElement>();
    private static instance: SequentialVideoLoader;

    private constructor() { }

    public static getInstance(): SequentialVideoLoader {
        if (!SequentialVideoLoader.instance) {
            SequentialVideoLoader.instance = new SequentialVideoLoader();
        }
        return SequentialVideoLoader.instance;
    }

    public enqueue(video: HTMLVideoElement) {
        if (this.loadedSet.has(video) || this.queue.includes(video)) return;
        this.queue.push(video);
        this.processNext();
    }

    public dequeue(video: HTMLVideoElement) {
        this.queue = this.queue.filter(v => v !== video);
    }

    private processNext() {
        if (this.isLoading || this.queue.length === 0) return;

        this.isLoading = true;
        const video = this.queue.shift();

        if (!video) {
            this.isLoading = false;
            return;
        }

        // It's possible the video was unmounted while waiting in queue
        if (!document.body.contains(video)) {
            this.isLoading = false;
            this.processNext();
            return;
        }

        const onCanPlayThrough = () => {
            cleanup();
            this.loadedSet.add(video);
            this.isLoading = false;
            this.processNext();
        };

        const onError = () => {
            // Even if one fails, continue with the rest of the queue
            console.warn('SequentialVideoLoader: Failed to load video', video.src);
            cleanup();
            this.isLoading = false;
            this.processNext();
        };

        const cleanup = () => {
            video.removeEventListener('canplaythrough', onCanPlayThrough);
            video.removeEventListener('error', onError);
        };

        video.addEventListener('canplaythrough', onCanPlayThrough);
        video.addEventListener('error', onError);

        // Trigger the load
        video.load();
    }
}
