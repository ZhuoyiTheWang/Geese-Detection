#FILE PURPOSE: test model trained on testing data
from ultralytics import YOLO
import glob
from PIL import Image

model = YOLO("runs/detect/train/weights/best.pt") #load best weights from training

for i, img_file in enumerate(glob.glob("datasets/images/test/*.jpg")): #for image files in testing folder
    result = model.predict(img_file)[0] #predict using the image
    result = result.plot(line_width=1) #plot results with line width of 1
    result = result[:, :, ::-1] #switch from BGR to RGB
    result = Image.fromarray(result) #plot as image
    result.save(f'output_{img_file[-8:]}') #save image as output with same numerical value
    if i >= 5: #to start, only run with 5 test cases
        break #end for loop

for i, img_file in enumerate(glob.glob("Data/testing_images/*.jpg")): #for image files in testing folder
    result = model.predict(img_file)[0] #predict using the image
    result = result.plot(line_width=1) #plot results with line width of 1
    result = result[:, :, ::-1] #switch from BGR to RGB
    result = Image.fromarray(result) #plot as image
    result.save(f'output_{img_file[-8:]}') #save image as output with same numerical value
    if i >= 5: #to start, only run with 5 test cases
        break #end for loop