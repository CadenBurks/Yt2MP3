import eyed3
from eyed3.id3.frames import ImageFrame

file_path = r"C:\Users\CadenB\OneDrive\Music\iTunes\Color Your Night.mp3"
art_path = 'colornight.jpg'

audiofile = eyed3.load(file_path)

if audiofile.tag is not None:
    audiofile.tag.clear()
    audiofile.tag.save(version=eyed3.id3.ID3_V2_3)  # Save cleared state
audiofile.initTag()


DEFAULT_TITLE = "Unknown Title"
DEFAULT_ARTIST = "Unknown Artist"
DEFAULT_ALBUM = "Unknown Album"
DEFAULT_YEAR = "2000"
DEFAULT_GENRE = "Other"
DEFAULT_TRACK = (0, 0)
DEFAULT_ALBUM_ARTIST = "Various Artists"

print(f"Processing: {file_path}")
audiofile = eyed3.load(file_path)
if audiofile is None:
    print(f"Failed to load: {file_path}")
else:
    # Clear all existing tags, including ID3v1 and v2
    if audiofile.tag is not None:
        audiofile.tag.clear()
    audiofile.initTag()

    # Set metadata (you could customize per file here)
    audiofile.tag.title = DEFAULT_TITLE
    audiofile.tag.artist = DEFAULT_ARTIST
    audiofile.tag.album = DEFAULT_ALBUM
    audiofile.tag.album_artist = DEFAULT_ALBUM_ARTIST
    audiofile.tag.genre = DEFAULT_GENRE
    audiofile.tag.year = int(DEFAULT_YEAR)
    audiofile.tag.release_date = DEFAULT_YEAR
    audiofile.tag.recording_date = DEFAULT_YEAR
    audiofile.tag.original_release_date = DEFAULT_YEAR
    audiofile.tag.track_num = DEFAULT_TRACK

    # Embed cover art
    with open(art_path, 'rb') as img_file:
        audiofile.tag.images.set(
            ImageFrame.FRONT_COVER,
            img_file.read(),
            'image/jpeg'
        )

# Save with ID3v2.3 explicitly
audiofile.tag.save(version=eyed3.id3.ID3_V2_3)
