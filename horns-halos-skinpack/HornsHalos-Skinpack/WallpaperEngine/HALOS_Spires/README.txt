Place rose_bloom.webm and preview.jpg here after rendering with Blender.
Run: blender --background --python ../../../generate_wallpapers.py
Then convert .exr sequences to .webm using ffmpeg.
ffmpeg -framerate 30 -i HALOS_Spires_4K_%04d.png -c:v libvpx-vp9 -crf 30 -b:v 0 HALOS_Spires.webm