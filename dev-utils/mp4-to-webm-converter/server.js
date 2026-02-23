const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'input-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'video/mp4' || path.extname(file.originalname).toLowerCase() === '.mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only MP4 files are allowed'));
        }
    }
});

// Quality settings
const qualitySettings = {
    high: { crf: 10, bitrate: '2M' },
    medium: { crf: 23, bitrate: '1M' },
    low: { crf: 35, bitrate: '500k' }
};

// Serve static files
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', ffmpeg: 'available' });
});

// Conversion endpoint
app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const quality = req.body.quality || 'medium';
    const outputName = req.body.outputName || 'output';
    const removeAudio = req.body.removeAudio === 'true';

    // Save to Desktop instead of local outputs folder
    const desktopPath = path.join(os.homedir(), 'Desktop');
    const outputDir = desktopPath;

    // Create output directory if it doesn't exist (though Desktop should always exist)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${outputName}.webm`);
    const settings = qualitySettings[quality] || qualitySettings.medium;

    console.log(`Converting: ${req.file.originalname}`);
    console.log(`Quality: ${quality} (CRF: ${settings.crf}, Bitrate: ${settings.bitrate})`);
    console.log(`Output: ${outputName}.webm`);
    console.log(`Remove Audio: ${removeAudio}`);

    try {
        await convertToWebM(inputPath, outputPath, settings, removeAudio);

        // Send the converted file
        res.download(outputPath, `${outputName}.webm`, (err) => {
            // Only cleanup the temporary upload file, keep the Desktop file
            cleanupFile(inputPath);

            if (err) {
                console.error('Download error:', err);
            } else {
                console.log(`File saved to Desktop: ${outputName}.webm`);
            }
        });

    } catch (error) {
        console.error('Conversion error:', error);
        cleanupFile(inputPath);
        res.status(500).json({ error: 'Conversion failed', message: error.message });
    }
});

// Convert video to WebM
function convertToWebM(inputPath, outputPath, settings, removeAudio) {
    return new Promise((resolve, reject) => {
        let outputOptions = [
            '-c:v libvpx-vp9',           // VP9 codec for video
            '-crf ' + settings.crf,       // Quality (lower = better)
            '-b:v ' + settings.bitrate,   // Target bitrate
            '-cpu-used 2',                // Encoding speed (0-5, higher = faster but less efficient)
            '-row-mt 1',                  // Enable row-based multithreading
            '-threads 0'                  // Use all available CPU threads
        ];

        if (removeAudio) {
            outputOptions.push('-an');    // Disable audio recording
        } else {
            outputOptions.push('-c:a libopus'); // Opus codec for audio
            outputOptions.push('-b:a 128k');    // Audio bitrate
        }

        ffmpeg(inputPath)
            .outputOptions(outputOptions)
            .output(outputPath)
            .on('start', (commandLine) => {
                console.log('FFmpeg command:', commandLine);
            })
            .on('progress', (progress) => {
                if (progress.percent) {
                    console.log(`Processing: ${Math.round(progress.percent)}% done`);
                }
            })
            .on('end', () => {
                console.log('Conversion completed successfully');
                resolve();
            })
            .on('error', (err) => {
                console.error('FFmpeg error:', err);
                reject(err);
            })
            .run();
    });
}

// Cleanup file
function cleanupFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error cleaning up ${filePath}:`, error);
    }
}

// Cleanup old files on startup
function cleanupOldFiles() {
    // Only cleanup temporary uploads, not Desktop files
    const dirs = ['uploads'];
    dirs.forEach(dir => {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                cleanupFile(filePath);
            });
        }
    });
}

// Start server
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   MP4 to WebM Converter Server Running    ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('');
    console.log(`🌐 Server:    http://localhost:${PORT}`);
    console.log(`🎬 FFmpeg:    Ready`);
    console.log(`📁 Uploads:   ./uploads`);
    console.log(`📁 Outputs:   ~/Desktop`);
    console.log('');
    console.log('Press Ctrl+C to stop the server');
    console.log('');

    // Cleanup old files
    cleanupOldFiles();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\nShutting down gracefully...');
    cleanupOldFiles();
    process.exit(0);
});
