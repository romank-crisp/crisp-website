// State Management
let selectedFile = null;
let selectedQuality = 'medium';
let outputFileName = '';

// DOM Elements
const uploadSection = document.getElementById('uploadSection');
const settingsSection = document.getElementById('settingsSection');
const progressSection = document.getElementById('progressSection');
const successSection = document.getElementById('successSection');

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const outputNameInput = document.getElementById('outputName');
const changeFileBtn = document.getElementById('changeFileBtn');
const convertBtn = document.getElementById('convertBtn');
const downloadBtn = document.getElementById('downloadBtn');
const convertAnotherBtn = document.getElementById('convertAnotherBtn');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const successFileName = document.getElementById('successFileName');

// Quality Buttons
const qualityBtns = document.querySelectorAll('.quality-btn');

// Quality Settings for FFmpeg
const qualitySettings = {
    high: { crf: '10', bitrate: '2M' },
    medium: { crf: '23', bitrate: '1M' },
    low: { crf: '35', bitrate: '500k' }
};

// Initialize
function init() {
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Drop Zone Events
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // File Input
    fileInput.addEventListener('change', handleFileSelect);
    
    // Quality Buttons
    qualityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            qualityBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedQuality = btn.dataset.quality;
        });
    });
    
    // Action Buttons
    changeFileBtn.addEventListener('click', resetToUpload);
    convertBtn.addEventListener('click', handleConvert);
    downloadBtn.addEventListener('click', handleDownload);
    convertAnotherBtn.addEventListener('click', resetToUpload);
    
    // Output Name Input
    outputNameInput.addEventListener('input', (e) => {
        outputFileName = e.target.value;
    });
}

// Drag and Drop Handlers
function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File Selection Handler
function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

// File Handler
function handleFile(file) {
    // Validate file type
    if (!file.type.includes('mp4') && !file.name.endsWith('.mp4')) {
        alert('Please select an MP4 file');
        return;
    }
    
    selectedFile = file;
    
    // Update UI
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Set default output name (remove .mp4 extension)
    const defaultName = file.name.replace(/\.mp4$/i, '');
    outputFileName = defaultName;
    outputNameInput.value = defaultName;
    
    // Show settings section
    showSection('settings');
}

// Format File Size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Show Section
function showSection(section) {
    uploadSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    progressSection.classList.add('hidden');
    successSection.classList.add('hidden');
    
    switch(section) {
        case 'upload':
            uploadSection.classList.remove('hidden');
            break;
        case 'settings':
            settingsSection.classList.remove('hidden');
            break;
        case 'progress':
            progressSection.classList.remove('hidden');
            break;
        case 'success':
            successSection.classList.remove('hidden');
            break;
    }
}

// Reset to Upload
function resetToUpload() {
    selectedFile = null;
    outputFileName = '';
    fileInput.value = '';
    outputNameInput.value = '';
    showSection('upload');
}

// Handle Convert
async function handleConvert() {
    if (!selectedFile) {
        alert('Please select a file first');
        return;
    }
    
    if (!outputFileName.trim()) {
        alert('Please enter an output file name');
        return;
    }
    
    // Show progress section
    showSection('progress');
    progressText.textContent = 'Preparing conversion...';
    progressFill.style.width = '10%';
    
    try {
        // Create FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('quality', selectedQuality);
        formData.append('outputName', outputFileName);
        
        // Update progress
        progressText.textContent = 'Converting video...';
        progressFill.style.width = '50%';
        
        // Send to server for conversion
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Conversion failed');
        }
        
        // Update progress
        progressFill.style.width = '90%';
        progressText.textContent = 'Finalizing...';
        
        // Get the converted file
        const blob = await response.blob();
        
        // Store the blob for download
        window.convertedBlob = blob;
        
        // Update progress
        progressFill.style.width = '100%';
        
        // Show success
        setTimeout(() => {
            successFileName.textContent = `${outputFileName}.webm`;
            showSection('success');
        }, 500);
        
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Conversion failed. Please make sure the server is running.');
        showSection('settings');
    }
}

// Handle Download
function handleDownload() {
    if (!window.convertedBlob) {
        alert('No file to download');
        return;
    }
    
    // Create download link
    const url = URL.createObjectURL(window.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outputFileName}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
