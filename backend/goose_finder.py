#FILE PURPOSE: 
# Use to count the number of geese using the model

from ultralytics import YOLO
import glob
from PIL import Image
import base64
import numpy as np
from io import BytesIO

def base64_to_pillow(base64_string):
    if base64_string.startswith("data:image"):
        base64_string = base64_string.split(",")[1]

    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))
    
    return image

def pillow_image_to_base64(image, format="PNG"):
    buffered = BytesIO()
    image.save(buffered, format=format)
    base64_string = base64.b64encode(buffered.getvalue()).decode("utf-8")
    base64_string = f"data:image/{format.lower()};base64,{base64_string}"

    return base64_string


def count_geese(img_list):
    model = YOLO("./Model/best.pt") #load best weights from training

    counts = [] #create list for counts
    result_images = []

    for i, img in enumerate(img_list): #iterate through images
        image_pil = base64_to_pillow(img)
        result = model(image_pil)[0] #predict using the image
        counts.append(len(result.boxes)) #add the number of geese counted to the list

        result = result.plot(line_width=1) #plot results with line width of 1
        result = result[:, :, ::-1] #switch from BGR to RGB
        result = Image.fromarray(result) #plot as image

        result = pillow_image_to_base64(result)
        result_images.append(result)

    return counts, result_images






