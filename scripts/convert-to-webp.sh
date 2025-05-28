#!/bin/bash

# Script to recursively find PNG and GIF files and convert them to WebP.
# It will delete the WebP file if it's not smaller than the original file.

# --- Configuration ---
QUALITY=95 # Set quality for cwebp/gif2webp (0-100)

# --- Helper Functions ---
function print_usage() {
    echo "Usage: $0 <directory>"
    echo "Recursively finds .png and .gif files in <directory> and converts them to .webp format."
    echo "The .webp file is kept only if it's smaller than the original ."
}

function check_dependencies() {
    local missing_deps=0
    if ! command -v cwebp &>/dev/null; then
        echo "Error: cwebp command not found."
        missing_deps=1
    fi
    if ! command -v gif2webp &>/dev/null; then
        echo "Error: gif2webp command not found."
        missing_deps=1
    fi

    if [ "$missing_deps" -eq 1 ]; then
        echo "Please install the WebP tools (libwebp) first."
        echo "On Debian/Ubuntu: sudo apt-get install webp"
        echo "On macOS (using Homebrew): brew install webp"
        exit 1
    fi

    if ! command -v wc &>/dev/null; then
        echo "Error: wc command not found. This is unexpected as it's a standard utility."
        exit 1
    fi
}

# --- Main Script ---

# 1. Check for dependencies
check_dependencies

# 2. Check for directory argument
if [ -z "$1" ]; then
    echo "Error: No directory specified."
    print_usage
    exit 1
fi

TARGET_DIR="$1"

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory '$TARGET_DIR' not found."
    exit 1
fi

echo "Searching for .png and .gif files in '$TARGET_DIR' and converting to .webp with quality $QUALITY..."
echo "WebP files will be deleted if they are not smaller than the original."

# 3. Find and convert PNG/GIF files
# -print0 and read -d $'\0' are used to handle filenames with spaces or special characters.
find "$TARGET_DIR" -type f \( -iname "*.png" -o -iname "*.gif" \) -print0 | while IFS= read -r -d $'\0' original_file; do
    # Construct the output WebP filename by replacing original extension with .webp
    webp_file="${original_file%.*}.webp"

    echo "Processing: '$original_file'"

    # Determine original file type (convert to lowercase for reliable extension check)
    original_file_lower=$(echo "$original_file" | tr '[:upper:]' '[:lower:]')
    conversion_cmd=""
    file_type=""

    if [[ "$original_file_lower" == *.png ]]; then
        file_type="PNG"
        # cwebp command for PNG
        # -q: quality factor (0:small..100:big)
        # -o: output file
        conversion_cmd="cwebp -q \"$QUALITY\" \"$original_file\" -o \"$webp_file\""
    elif [[ "$original_file_lower" == *.gif ]]; then
        file_type="GIF"
        # gif2webp command for GIF
        # -q: quality factor (0:small..100:big)
        # Other options like -m (compression method) or -lossy could be added if needed.
        conversion_cmd="gif2webp -q \"$QUALITY\" \"$original_file\" -o \"$webp_file\""
    else
        # This case should ideally not be reached due to the find command's filter,
        # but it's good practice for robustness.
        echo "Skipping unsupported file type (should not happen): '$original_file'"
        echo "---"
        continue # Skip to the next file
    fi

    # Execute the conversion command
    if eval "$conversion_cmd" >/dev/null 2>&1; then # Suppress command output for cleaner logs
        echo "Successfully converted $file_type: '$original_file' -> '$webp_file'"

        # Get file sizes in bytes
        # Using wc -c for portability. awk '{print $1}' removes potential leading/trailing spaces from wc output.
        original_size=$(wc -c <"$original_file" | awk '{print $1}')
        webp_size=$(wc -c <"$webp_file" | awk '{print $1}')

        # Check if webp is smaller
        if [ -n "$original_size" ] && [ -n "$webp_size" ] && [ "$webp_size" -lt "$original_size" ]; then
            echo "WebP file ('$webp_file', $webp_size bytes) is smaller than $file_type ('$original_file', $original_size bytes). Keeping WebP."
            # Optional: Uncomment the line below to delete the original file after successful conversion and size check
            # rm "$original_file"
            # echo "Original $file_type deleted: '$original_file'"
        else
            echo "WebP file ('$webp_file', $webp_size bytes) is NOT smaller than $file_type ('$original_file', $original_size bytes)."
            echo "Deleting WebP file: '$webp_file'"
            rm "$webp_file"
        fi
    else
        echo "Error converting $file_type: '$original_file'. Command failed."
        # If conversion failed, the $webp_file might not exist or be 0 bytes.
        # Attempt to remove it just in case it was partially created.
        if [ -f "$webp_file" ]; then
            rm "$webp_file"
            echo "Cleaned up potentially incomplete WebP file: '$webp_file'"
        fi
    fi
    echo "---"
done

echo "Conversion process finished."
