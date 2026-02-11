#!/bin/bash

# Script to cleanup unused files in public/img directory
# This will:
# 1. Find all files in public/img
# 2. Check if they're referenced in the src directory
# 3. List unused files
# 4. Optionally delete them

IMG_DIR="/Users/roman/Documents/Dev/crisp-website/awwwards-case-study/public/img"
SRC_DIR="/Users/roman/Documents/Dev/crisp-website/awwwards-case-study/src"

echo "=== Scanning for unused image files ==="
echo ""

# Find all files in the img directory (excluding directories)
find "$IMG_DIR" -type f | while read -r file; do
    # Get the relative path from public directory
    rel_path="${file#/Users/roman/Documents/Dev/crisp-website/awwwards-case-study/public}"
    
    # Search for this path in the source code
    if ! grep -r -q "$rel_path" "$SRC_DIR" 2>/dev/null; then
        echo "UNUSED: $file"
        echo "  -> $rel_path"
    fi
done

echo ""
echo "=== Scanning complete ==="
