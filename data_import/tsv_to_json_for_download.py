import csv
import json
import re
from unicodedata import normalize

def slugify(text):
    # Normalize and replace spaces and non-alphanumeric characters with hyphens
    text = normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')  # Remove accents
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '_', text)

def transform_drive_link(view_link):
    # Extract the file ID using a regex
    match = re.search(r"/d/([a-zA-Z0-9_-]+)", view_link)
    if match:
        file_id = match.group(1)
        # Construct the direct download link
        return f"https://drive.google.com/uc?export=download&id={file_id}"
    else:
        return view_link

def tsv_to_json(tsv_file, json_file):
    # Dictionary to keep track of occurrences of each name_slug
    slug_counts = {}

    # Read the TSV file
    with open(tsv_file, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file, delimiter='\t')

        data = []
        for row in reader:
            # Process the name to separate the outfit if there are parentheses
            name = row[0]
            outfit = None
            match = re.search(r'\((.*?)\)', name)
            if match:
                outfit = match.group(1)
                name = re.sub(r'\s*\(.*?\)', '', name).strip()  # Remove parentheses content from name

            # Create slugged name
            name_slug = slugify(name)

            # Update slug count for index
            if name_slug not in slug_counts:
                slug_counts[name_slug] = 1
            else:
                slug_counts[name_slug] += 1
            index = slug_counts[name_slug]

            # Build the entry dictionary
            entry = {
                "name": name,
                "nameSlug": name_slug,  # Slugged name
                "index": index,  # Add the index
                "facePicUrl": transform_drive_link(row[1]),
                "bodyPicUrl": transform_drive_link(row[2]),
                "outfitWeightThresholdInLb": float(row[3]),
                "heightInCm": 160.0,
                "mainShape": row[4],
            }
            if outfit:
                entry["outfit"] = outfit  # Add outfit field if it exists
                entry["outfitSlug"] = slugify(outfit)  # Slugged outfit if outfit exists
            if len(row) > 5 and row[5]:
                entry["secondaryShape"] = row[5]

            data.append(entry)

    # Write to JSON file
    with open(json_file, mode='w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Example usage
tsv_to_json('input.tsv', 'output_file_for_dl.json')
