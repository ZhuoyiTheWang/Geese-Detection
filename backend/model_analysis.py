#FILE PURPOSE: test trained model, assess accuracy using two metrics

from ultralytics import YOLO
import glob
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import pandas
from collections import Counter


def count_on_labeled_data(model, img_num = None, save = False, show = False): #img_num = number of images to be processed, save = boolean of whether or not files should be saved, show = boolean of whether or not images should be shown
    actual_counts = [] 
    predicted_counts = []
    counts_accuracy = [] #create list accuracy of counts
    file_names = [] #file names

    for i, img_file in enumerate(glob.glob("datasets/test/images/*.jpg")): #for image files in testing folder for model
        if img_num:
            if i >= img_num: #only run with number of images given
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
            result.save(f'OutputImages/output_{img_file[-8:]}') #save image as output with same numerical value

    x = np.linspace(0, max(max(predicted_counts), max(actual_counts)), 500) #generate line 
    y = x


    plt.figure()
    plt.scatter(actual_counts, predicted_counts, s=50, cmap="jet", c=np.abs(np.array(counts_accuracy)))
    plt.plot(x, y, color='midnightblue')
    plt.xlabel('Actual count')
    plt.ylabel('Predicted count')
    plt.title('Confusion Plot')
    cbar = plt.colorbar()
    cbar.set_label("Error Percentage", rotation=270)
    #plt.savefig('Confusion_plot.png')
    plt.show()

    plt.figure()
    #create bins for histogram
    counts = np.array([])
    bins = np.array([])
    #Create bins for cut-off values:
    bin_cuttoffs = np.array([-200, -150, -120, -100, -80, -60, -40, -30, -20, -15, -10, -5, 0, 5, 10, 15, 20, 30, 40, 80, 100, 120, 150, 200])
    for k in range (len(bin_cuttoffs)-1):
        if (k == 0):
            bins = np.append(bins, ">-200%") #lowest bin
        elif (k <= len(bin_cuttoffs)-1): #middle bins
            bins = np.append(bins, str(bin_cuttoffs[k]) + "%")
    bins = np.append(bins, ">200%") #highest bin
    
    for i in counts_accuracy: #for each accuracy, determine which cut-off it lies between
        if (i < bin_cuttoffs[0]): #less than the lowest category
            counts = np.append(counts, 0)
            continue
        if (i > bin_cuttoffs[-1]): #greater than the highest category
            counts = np.append(counts, len(bin_cuttoffs)-1)
            continue
        for j in range (len(bin_cuttoffs)-1): #between two bins
            if (i >= bin_cuttoffs[j] and i < bin_cuttoffs[j + 1]):
                counts = np.append(counts, j)
                break

    #PLOTTING:
    n, bins_i, patches, = plt.hist(counts, bins=range(len(bin_cuttoffs)), edgecolor='b')
    plt.xticks(ticks=range(len(bins)), labels=bins, rotation=45, ha='right')
    plt.xlabel('Error Percentage')
    plt.ylabel('Frequency')
    plt.vlines(x=(len(bins)/2), ymin=0, ymax=max(n), colors='red')
    plt.title('Error Frequency')
    #plt.savefig('Error_histogram.png')
    plt.show()

    return counts_accuracy, file_names, actual_counts, predicted_counts


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


if __name__ == "__main__":

    model = YOLO("Model/custom_150_no_opt_best.pt") #load best weights from training

    counts_accuracy, file_names, actual_counts, predicted_counts = count_on_labeled_data(model, save=False, show=False)