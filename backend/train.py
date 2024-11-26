#FILE PURPOSE: Document used to preliminary test training model using yolov11

from ultralytics import YOLO
from data_download import download_custom_dataset


if __name__ == "__main__":

    # download data
    download_custom_dataset()

    # select model
    model = YOLO("yolo11n.pt")

    # train the model
    model.train(
        data = "backend/goose.yaml", #yaml file for model configuration
        epochs = 10, #number of training periods
        imgsz = [640,640], #w,h
        batch = 16,
        single_cls = True
    )