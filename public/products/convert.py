import os
import pillow_heif
from PIL import Image
from moviepy import VideoFileClip

pillow_heif.register_heif_opener()

img = Image.open('IMG_6612.heic')
img = img.convert('RGB')
img.save('hotwheels_bouquet.jpg', 'JPEG')

clip = VideoFileClip('img_6614.mov')
clip.write_gif('hotwheels_bouquet.gif', fps=15)
