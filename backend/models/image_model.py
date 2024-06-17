
import re
from tkinter import Image


class ImageSteganography:
    def __init__(self):
        self.num_lsb = 8

    # Convert encoding data into 8-bit binary ASCII
    def generateData(data):
        newdata = []
        for i in data: # list of binary codes of given data
            newdata.append(format(ord(i), '08b'))
        return newdata
    
    # Pixels modified according to encoding data in generateData
    # this function modify 1 frame
    def modifyPixel(self, pixel, data):
        # Embedded data: list of binary (1d array [n]) --> list of 8-bit binary (2d array [n][8])
        datalist = self.generateData(data)
        lengthofdata = len(datalist)
        imagedata = iter(pixel)
        for i in range(lengthofdata):
            # pixel = Get 9 values (3 colors RGB * 3 pixels) from the cover image
            # For the 8-first values of pixel, embed data: cover = odd --> embeded = 1; cover = even --> embeded = 0
            # For the 9th value: mark if the end of embedded data: 0 --> continue; 1 --> stop

            # Extracts 3 pixels at a time; len(pixel) = 9 (3 colors RGB * 3 pixels)
            pixel = [value for value in imagedata.__next__()[:3] + imagedata.__next__()[:3] + imagedata.__next__()[:3]]
            # print(pixel)
            # Pixel value should be made odd for 1 and even for 0
            for j in range(0, 8):
                if (datalist[i][j] == '0' and pixel[j]% 2 != 0):
                    pixel[j] -= 1
                elif (datalist[i][j] == '1' and pixel[j] % 2 == 0):
                    if(pixel[j] != 0):
                        pixel[j] -= 1
                    else:
                        pixel[j] += 1
            # Eighth pixel of every set tells whether to stop ot read further. 0 means keep reading; 1 means thec message is over.
            if (i == lengthofdata - 1):
                if (pixel[-1] % 2 == 0):
                    if(pixel[-1] != 0):
                        pixel[-1] -= 1
                    else:
                        pixel[-1] += 1
            else:
                if (pixel[-1] % 2 != 0):
                    pixel[-1] -= 1
            pixel = tuple(pixel)
            yield pixel[0:3]
            yield pixel[3:6]
            yield pixel[6:9]

    def encoder(self, newimage, data):
        w = newimage.size[0]
        (x, y) = (0, 0)
    
        for pixel in self.modifyPixel(newimage.getdata(), data):
    
            # Putting modified pixels in the new image
            newimage.putpixel((x, y), pixel)
            if (x == w - 1):
                x = 0
                y += 1
            else:
                x += 1

    def hide_data(self, image_path, message):
        try:
            image = Image.open(image_path, 'r') # Parameter has to be r, otherwise ValueError will occur (https://pillow.readthedocs.io/en/stable/reference/Image.html)
        except FileNotFoundError:
            raise ValueError("\n%s not found! Exiting..." % image_path)
        
        input_data = memoryview(message.encode('utf-8'))

        newimage = image.copy() # New Variable to Store Hiddend Data
        self.encoder(newimage, input_data) # Steganography
        new_img_name = "encoded_image.png"
        newimage.save(new_img_name) # Save as New Frame

        return newimage
    
    def recover_data(self, image_path):
        try:
            data = ''
            image = Image.open(image_path, 'r')
            imagedata = iter(image.getdata())
            while (True):
                pixels = [value for value in imagedata.__next__()[:3] + imagedata.__next__()[:3] + imagedata.__next__()[:3]]
                # string of binary data
                binstr = ''
                for i in pixels[:8]:
                    if (i % 2 == 0):
                        binstr += '0'
                    else:
                        binstr += '1'
                if re.match("[ -~]", chr(int(binstr,2))) is not None: # only decode printable data
                    data += chr(int(binstr, 2))
                if (pixels[-1] % 2 != 0):
                    return data
        except StopIteration:
            raise ValueError("No data found in %s" % image_path)