from PIL import Image

img = Image.open('public/products/hotwheels_bouquet.jpg')
print(f'Image size: {img.size}')

gif = Image.open('public/products/hotwheels_bouquet.gif')
print(f'GIF size: {gif.size}')
