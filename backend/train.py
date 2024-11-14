#FILE PURPOSE: Document used to preliminary test training model using yolov8

from ultralytics import YOLO
import os


if __name__ == "__main__":

    #os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

    model = YOLO("yolo11n.pt") #select model

    #train the models
    model.train(
        data = "goose.yaml", #yaml file for model configuration
        epochs = 100, #number of training periods
        imgsz = (640,640), #w,h
        batch = 4
    )