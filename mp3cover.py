import eyed3
from eyed3.id3.frames import ImageFrame, TextFrame

file_path = r"C:\Users\CadenB\OneDrive\Music\MyMusic\ytmp3free.cc_persona-3-reload-color-your-night-with-lyrics-youtubemp3free.org.mp3"
art_path = 'colornight.jpg'

DEFAULT_TITLE = "Untitled"
DEFAULT_ARTIST = "Unknown Artist [Local Copy]"
DEFAULT_ALBUM = "Unknown Album [Local Copy]"
DEFAULT_YEAR = "2000"
DEFAULT_GENRE = "Other"
DEFAULT_TRACK = (1, 10)
DEFAULT_ALBUM_ARTIST = "Various Artists"
DEFAULT_COMPOSER = "Unknown"

# Load the MP3
audiofile = eyed3.load(file_path)

if audiofile is None:
    print(f"Failed to load: {file_path}")
    exit()

# Clear and re-init tag
if audiofile.tag is not None:
    audiofile.tag.clear()
    audiofile.tag.save(version=eyed3.id3.ID3_V2_3)

audiofile.initTag()

# Apply metadata
audiofile.tag.title = DEFAULT_TITLE
audiofile.tag.artist = DEFAULT_ARTIST
audiofile.tag.album = DEFAULT_ALBUM
audiofile.tag.album_artist = DEFAULT_ALBUM_ARTIST
audiofile.tag.genre = DEFAULT_GENRE
audiofile.tag.year = int(DEFAULT_YEAR)
audiofile.tag.track_num = DEFAULT_TRACK
audiofile.tag.composer = DEFAULT_COMPOSER
audiofile.tag.disc_num = (1, 2)

# Use only one date to avoid TDRL warnings (eyed3 will drop extras anyway)
audiofile.tag.release_date = DEFAULT_YEAR

# Embed album art
with open(art_path, 'rb') as img_file:
    audiofile.tag.images.set(
        ImageFrame.FRONT_COVER,
        img_file.read(),
        'image/jpeg'
    )

# Save using ID3v2.3 for maximum compatibility
audiofile.tag.save(version=eyed3.id3.ID3_V2_3)

print(f"✅ Tagged and saved: {file_path}")
