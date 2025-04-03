#FILE PURPOSE: test trained model, assess accuracy using two metrics

from ultralytics import YOLO
import glob
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import os
import shutil


def count_on_labeled_data(model, img_num = None, save_outputs = False, save_plots = False, show = False): #img_num = number of images to be processed, save = boolean of whether or not files should be saved, show = boolean of whether or not images should be shown
    actual_counts = [] 
    predicted_counts = []
    counts_accuracy = [] #create list accuracy of counts
    file_names = [] #file names

    # clear output directory if it already exists
    if os.path.exists("AnalysisOutputs"):
        shutil.rmtree("AnalysisOutputs")

    # create output directory
    os.mkdir("AnalysisOutputs")

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
        if save_outputs: #save images if true
            result.save(f'AnalysisOutputs/output_{img_file[-8:]}') #save image as output with same numerical value

    x = np.linspace(0, max(max(predicted_counts), max(actual_counts)), 500) #generate line 
    y = x


    plt.figure()
    plt.scatter(actual_counts, predicted_counts, s=50, cmap="jet", c=np.abs(np.array(counts_accuracy)), vmin=0, vmax=250)
    plt.plot(x, y, color='midnightblue')
    plt.xlabel('Actual count')
    plt.ylabel('Predicted count')
    plt.title('Confusion Plot')
    cbar = plt.colorbar()
    cbar.set_label("Error Percentage", rotation=270)
    if save_plots:
        plt.savefig('AnalysisOutputs/Confusion_plot.png')
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
    if save_plots:
        plt.savefig('AnalysisOutputs/Error_histogram.png')
    plt.show()

    # TOTAL ACCURACY
    total_actual = sum(actual_counts)
    total_predicted = sum(predicted_counts)
    total_error = total_predicted - total_actual
    total_accuracy = (float(total_error) * 100) / total_actual
    if save_outputs:
        with open('AnalysisOutputs/Accuracy_analysis.txt', 'w') as outfile:
            outfile.write(f"Actual Total: {total_actual}\n")
            outfile.write(f"Predicted Total: {total_predicted}\n")
            outfile.write(f"\nTotal Error: {total_error}\n")
            outfile.write(f"Total Accuracy: {total_accuracy}%")
    else:
        print(f"Actual Total: {total_actual}")
        print(f"Predicted Total: {total_predicted}")
        print(f"\nTotal Error: {total_error}")
        print(f"Total Accuracy: {total_accuracy}%")

    return counts_accuracy, file_names, actual_counts, predicted_counts


def counts_on_unlabeled_data(model, save, show):
    total_geese = 0

    for i, img_file in enumerate(glob.glob("Data/test_images/*.jpg")): #for image files in testing folder
        
        result = model.predict(img_file)[0] #predict using the image
        predicted_count = (len(result.boxes))
        result = result.plot(line_width=1) #plot results with line width of 1
        result = result[:, :, ::-1] #switch from BGR to RGB
        result = Image.fromarray(result) #plot as image
        if show:
            result.show()
        if save:

            result.save(f'AnalysisOutputs/output_unlabeled_{img_file[-8:]}') #save image as output with same numerical value

        total_geese += predicted_count
        print(f"Found {predicted_count} geese")

    print(f"\nTotal geese found: {total_geese}")


if __name__ == "__main__":

    model = YOLO("Model/custom11n.pt") #load best weights from training

    counts_accuracy, file_names, actual_counts, predicted_counts = count_on_labeled_data(model, save_outputs=True, save_plots=True, show=False)
    # counts_on_unlabeled_data(model, show=True, save=False)