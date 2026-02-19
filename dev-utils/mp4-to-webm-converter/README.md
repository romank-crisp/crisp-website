# MP4 to WebM Converter

A simple, fast, and beautiful web-based MP4 to WebM video converter with custom file naming.

## Features

✨ **Simple & Fast** - Clean, intuitive interface with drag-and-drop support  
🎨 **Beautiful UI** - Modern dark theme with smooth animations  
🎬 **Quality Control** - Choose between High, Medium, and Low quality presets  
📝 **Custom Naming** - Name your output files however you want  
💾 **Desktop Save** - Converted files automatically saved to Desktop  
⚡ **Powered by FFmpeg** - Fast, reliable video conversion  
🧹 **Auto Cleanup** - Automatically removes temporary upload files  

## Prerequisites

The following packages are required and should be installed via Homebrew:

- **FFmpeg** - For video conversion
- **Node.js** - For running the server

### Check Installed Packages

```bash
brew list
```

### Install Missing Packages

If FFmpeg is not installed:
```bash
brew install ffmpeg
```

If Node.js is not installed:
```bash
brew install node
```

## Installation

1. Navigate to the project directory:
```bash
cd /Users/roman/.gemini/antigravity/scratch/mp4-to-webm-converter
```

2. Install Node.js dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Use the converter:
   - Drag and drop an MP4 file or click to browse
   - Enter a custom output file name
   - Select quality preset (High, Medium, or Low)
   - Click "Convert to WebM"
   - Your converted file will be saved to Desktop
   - Optionally download again via the browser

## Quality Presets

- **High** - Best quality, larger file size (CRF: 10, Bitrate: 2M)
- **Medium** - Balanced quality and size (CRF: 23, Bitrate: 1M) - *Default*
- **Low** - Smaller file size, lower quality (CRF: 35, Bitrate: 500k)

## Technical Details

### Frontend
- Pure HTML, CSS, and JavaScript
- Modern design with glassmorphism and smooth animations
- Responsive layout
- Drag-and-drop file upload

### Backend
- Node.js with Express
- Multer for file upload handling
- Fluent-FFmpeg for video conversion
- VP9 video codec with Opus audio codec
- Automatic file cleanup

### Video Conversion Settings
- Video Codec: libvpx-vp9 (VP9)
- Audio Codec: libopus (Opus)
- Audio Bitrate: 128k
- Multithreading enabled for faster conversion

## File Structure

```
mp4-to-webm-converter/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet with modern design
├── script.js           # Frontend JavaScript
├── server.js           # Node.js Express server
├── package.json        # Node.js dependencies
├── README.md           # This file
└── uploads/            # Temporary upload directory (auto-created)

Converted files are saved to: ~/Desktop
```

## Troubleshooting

### FFmpeg not found
If you get an error about FFmpeg not being found, make sure it's installed:
```bash
brew install ffmpeg
```

### Port already in use
If port 3001 is already in use, you can change it in `server.js`:
```javascript
const PORT = 3001; // Change this to another port
```

### Conversion fails
- Make sure the input file is a valid MP4 file
- Check that FFmpeg is properly installed: `ffmpeg -version`
- Check the server console for detailed error messages

## License

MIT

## Credits

Powered by FFmpeg - The leading multimedia framework
