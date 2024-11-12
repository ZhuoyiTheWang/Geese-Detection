#Document used to preliminary test training model using yolov8

from ultralytics import YOLO
import os


if __name__ == "__main__":

    os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"

    model = YOLO("yolov8n.pt") #select model

    #train the models
    model.train(
        data = "goose.yaml",
        epochs = 20,
        imgsz = (800,533), #w,h
        batch = 4,
        device = 0
    )