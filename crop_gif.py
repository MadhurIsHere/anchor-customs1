from PIL import Image

def crop_center(pil_img, crop_width, crop_height):
    img_width, img_height = pil_img.size
    return pil_img.crop(((img_width - crop_width) // 2,
                         (img_height - crop_height) // 2,
                         (img_width + crop_width) // 2,
                         (img_height + crop_height) // 2))

with Image.open('public/products/hotwheels_bouquet.gif') as im:
    frames = []
    duration = im.info.get('duration', 100)
    for frame in range(0, im.n_frames):
        im.seek(frame)
        cropped = crop_center(im.convert('RGBA'), 480, 640)
        frames.append(cropped)
    
    frames[0].save('public/products/hotwheels_bouquet.gif', save_all=True, append_images=frames[1:], duration=duration, loop=0, disposal=2)
print("Cropped GIF saved.")
