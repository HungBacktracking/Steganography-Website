import re
from PIL import Image  # Use PIL instead of tkinter.Image

class ImageSteganography:
    def __init__(self):
        self.num_lsb = 8

    def generateData(self, data):
        newdata = []
        for i in data:
            newdata.append(format(ord(i), '08b'))
        return newdata

    def modifyPixel(self, pixel, data):
        datalist = self.generateData(data)
        lengthofdata = len(datalist)
        imagedata = iter(pixel)
        for i in range(lengthofdata):
            pixel = [value for value in next(imagedata)[:3] + next(imagedata)[:3] + next(imagedata)[:3]]
            for j in range(0, 8):
                if (datalist[i][j] == '0' and pixel[j] % 2 != 0):
                    pixel[j] -= 1
                elif (datalist[i][j] == '1' and pixel[j] % 2 == 0):
                    if pixel[j] != 0:
                        pixel[j] -= 1
                    else:
                        pixel[j] += 1
            if i == lengthofdata - 1:
                if pixel[-1] % 2 == 0:
                    if pixel[-1] != 0:
                        pixel[-1] -= 1
                    else:
                        pixel[-1] += 1
            else:
                if pixel[-1] % 2 != 0:
                    pixel[-1] -= 1
            pixel = tuple(pixel)
            yield pixel[0:3]
            yield pixel[3:6]
            yield pixel[6:9]

    def encoder(self, newimage, data):
        w = newimage.size[0]
        (x, y) = (0, 0)
    
        for pixel in self.modifyPixel(newimage.getdata(), data):
            newimage.putpixel((x, y), pixel)
            if x == w - 1:
                x = 0
                y += 1
            else:
                x += 1

    def hide_data(self, image_file, message):
        image = Image.open(image_file)
        newimage = image.copy()
        self.encoder(newimage, message)
        return newimage
    
    def recover_data(self, image_file):
        data = ''
        image = Image.open(image_file)
        imagedata = iter(image.getdata())
        while True:
            pixels = [value for value in next(imagedata)[:3] + next(imagedata)[:3] + next(imagedata)[:3]]
            binstr = ''
            for i in pixels[:8]:
                if i % 2 == 0:
                    binstr += '0'
                else:
                    binstr += '1'
            if re.match("[ -~]", chr(int(binstr, 2))) is not None:
                data += chr(int(binstr, 2))
            if pixels[-1] % 2 != 0:
                return data
