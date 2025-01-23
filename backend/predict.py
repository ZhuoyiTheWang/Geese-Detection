#FILE PURPOSE: test model trained on testing data
from ultralytics import YOLO
import glob
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np


def count_on_labeled_data(model, img_num, save, show): #img_num = number of images to be processed, save = boolean of whether or not files should be saved, show = boolean of whether or not images should be shown
    actual_counts = [] 
    predicted_counts = []
    counts_accuracy = [] #create list accuracy of counts
    file_names = [] #file names

    for i, img_file in enumerate(glob.glob("datasets/test/images/*.jpg")): #for image files in testing folder for model
        if i >= img_num: #to start, only run with 5 test cases
            return counts_accuracy, file_names, actual_counts, predicted_counts
            break #end for loop

        file_names.append(img_file[21:])
        result = model.predict(img_file)[0] #predict using the image
        predicted_count = (len(result.boxes)) #store the number of geese counted
        predicted_counts.append(predicted_count) #append predicted count to list
        actual_count = 0

        with open((glob.glob(f'datasets/test/labels/{img_file[21:-4]}.txt'))[0], 'r') as labeled_count: #open label file with same name
            actual_count = len(labeled_count.readlines()) #count the number of geese labeled
            actual_counts.append(actual_count)
            counts_accuracy.append(((predicted_count-actual_count)/actual_count)*100) #calculate accuracy and append to list

        result = result.plot(line_width=1) #plot results with line width of 1
        result = result[:, :, ::-1] #switch from BGR to RGB
        result = Image.fromarray(result) #plot as image
        if show: #show images if true
            result.show()
        if save: #save images if true
            result.save(f'OutputImages/output_{img_file[-12:]}') #save image as output with same numerical value


def counts_on_unlabeled_data(model, img_num, save, show):
    for i, img_file in enumerate(glob.glob("Data/test_images/*.jpg")): #for image files in testing folder
        if i >= img_num: #to start, only run with given number of test cases
            break #end for loop
        result = model.predict(img_file)[0] #predict using the image
        result = result.plot(line_width=1) #plot results with line width of 1
        result = result[:, :, ::-1] #switch from BGR to RGB
        result = Image.fromarray(result) #plot as image
        if show:
            result.show()
        if save:
            result.save(f'OutputImages/output_unlabeled_{img_file[-8:]}') #save image as output with same numerical value


model = YOLO("Model/custom_150_no_opt_best.pt") #load best weights from training

counts_accuracy, file_names, actual_counts, predicted_counts = count_on_labeled_data(model, img_num=22, save=False, show=False)

x = np.linspace(0, 100, 200) #generate line 
y = x

plt.figure()
plt.scatter(actual_counts, predicted_counts)
plt.plot(x, y, color='red')
plt.xlabel('Actual count')
plt.ylabel('Predicted count')
plt.title('Confusion Plot')
plt.show()

plt.figure()
#create bins for histogram
bins = [-200, -150, -120, -100, -90, -80, -70, -60, -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 150, 200]
plt.hist(x=counts_accuracy, bins=bins, edgecolor='black')
plt.xlabel('Error Percentage')
plt.ylabel('Frequency')
plt.vlines(x=0, ymin=0, ymax=5, colors='red')
plt.title('Error Frequency')
plt.show()