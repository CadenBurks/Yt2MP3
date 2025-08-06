import sys
import json
import eyed3
from eyed3.id3.frames import ImageFrame

def main():
    # Check for JSON input
    if len(sys.argv) < 2:
        print("Error: Missing JSON argument")
        sys.exit(1)

    # Parse JSON data
    try:
        data = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print("Error: Invalid JSON input")
        sys.exit(1)

    file_path = data.get("file_path")
    art_path = data.get("art_path")
    metadata = data.get("metadata", {})

    if not file_path:
        print("Error: MP3 file path is required.")
        sys.exit(1)

    # Load the MP3 file
    audiofile = eyed3.load(file_path)
    if audiofile is None or audiofile.tag is None:
        print(f"Error: Could not load MP3 file or tags from {file_path}")
        sys.exit(1)

    # Clear existing tag and reinitialize
    audiofile.tag.clear()
    audiofile.initTag()

    # Apply metadata
    audiofile.tag.title = metadata.get("title", "Untitled")
    audiofile.tag.artist = metadata.get("artist", "Unknown Artist [Local Copy]")
    audiofile.tag.album = metadata.get("album", "Unknown Album [Local Copy]")
    audiofile.tag.album_artist = metadata.get("album_artist", "Various Artists")
    audiofile.tag.genre = metadata.get("genre", "Other")
    audiofile.tag.composer = metadata.get("composer", "Unknown")
    audiofile.tag.disc_num = tuple(metadata.get("disc_num", (1, 0)))

    year = metadata.get("year")
    if year:
        try:
            audiofile.tag.year = int(year)
            audiofile.tag.release_date = year
        except ValueError:
            print("Warning: Invalid year format")

    track_num = metadata.get("track_num")
    if track_num:
        try:
            audiofile.tag.track_num = tuple(track_num)
        except:
            audiofile.tag.track_num = (1, 0)

    if art_path:
        try:
            with open(art_path, "rb") as img_file:
                audiofile.tag.images.set(
                    ImageFrame.FRONT_COVER,
                    img_file.read(),
                    "image/jpeg"
                )
        except Exception as e:
            print(f"Warning: Failed to embed cover image - {e}")

    audiofile.tag.save(version=eyed3.id3.ID3_V2_3)

    print(f"Metadata successfully updated: {file_path}")

if __name__ == "__main__":
    main()
