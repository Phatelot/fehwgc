import json
import os
import requests
import imghdr

def download_images(json_file):
    # Load data from the JSON file
    with open(json_file, mode='r', encoding='utf-8') as file:
        data = json.load(file)

    # Create 'img' directory if it doesn't exist
    os.makedirs('img', exist_ok=True)

    for entry in data:
        # Construct the base filename from nameSlug and optional outfitSlug
        filename_base = entry['nameSlug']
        if 'outfitSlug' in entry:
            filename_base += f"_{entry['outfitSlug']}"

        # Download the face image if not already downloaded
        face_url = entry['facePicUrl']
        face_filename = os.path.join('img', f"{filename_base}_face")
        if not check_existing_file(face_filename):
            download_file(face_url, face_filename)

        # Download the body image if not already downloaded
        body_url = entry['bodyPicUrl']
        body_filename = os.path.join('img', f"{filename_base}_body")
        if not check_existing_file(body_filename):
            download_file(body_url, body_filename)

def download_file(url, filename_base):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Check for errors

        # Temporarily save the file to detect its format
        temp_filename = f"{filename_base}.tmp"
        with open(temp_filename, 'wb') as file:
            for chunk in response.iter_content(1024):
                file.write(chunk)

        # Detect the image type and rename with correct extension
        image_type = imghdr.what(temp_filename)
        if image_type in ['jpeg', 'png']:
            file_extension = 'jpg' if image_type == 'jpeg' else 'png'
            final_filename = f"{filename_base}.{file_extension}"
            os.rename(temp_filename, final_filename)
            print(f"Downloaded {final_filename}")
        else:
            print(f"Failed to detect image type for {url}, assuming png.")
            final_filename = f"{filename_base}.png"
            os.rename(temp_filename, final_filename)
            print(f"Downloaded {final_filename}")

    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")

def check_existing_file(filename_base):
    """Check if a file with a jpg or png extension already exists for the given base filename."""
    for ext in ['jpg', 'png']:
        if os.path.exists(f"{filename_base}.{ext}"):
            print(f"File {filename_base}.{ext} already exists, skipping download.")
            return True
    return False

# Example usage
download_images('output_file_for_dl.json')
