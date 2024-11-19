#FILE PURPOSE: 
# Use to count the number of geese using the model

from ultralytics import YOLO
import glob
from PIL import Image
import re


def count_geese(img_list):
    model = YOLO("./Model/best.pt") #load best weights from training

    counts = [] #create list for counts

    for img in img_list: #iterate through images
        result = model.predict(img)[0] #predict using the image

        counts.append(len(result.boxes)) #add the number of geese counted to the list

        result = result.plot(line_width=1) #plot results with line width of 1
        result = result[:, :, ::-1] #switch from BGR to RGB
        result = Image.fromarray(result) #plot as image
        #just get digits of file without other characters
        file_digits = re.search(r'(\d+)\.jpg', img).group(1)
        result.save(f'OutputImages/output_{file_digits}.jpg') #save image as output with same numerical value

    return counts




