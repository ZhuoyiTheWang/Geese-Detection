#FILE PURPOSE: Document used to preliminary test training model using yolov11

from ultralytics import YOLO
from data_download import download_custom_dataset
import time


if __name__ == "__main__":

    # download and randomize tvt split each run
    download_custom_dataset()

    for model_name in ["yolo11n.pt", "yolo11s.pt", "yolo11m.pt"]:

        # select model
        model = YOLO(model_name)

        # train the model
        model.train(
            # training
            data = "goose.yaml", # yaml file for model configuration
            epochs = 1000, # number of training periods
            patience = 100,
            imgsz = [1024,1024], #w,h  - the largest we can make it without throwing a dataloader error
            single_cls = True,
            multi_scale = True,
            dropout = 0.3,

            # loss
            box = 7,
            cls = 5,

            # data augmentation
            hsv_h = 0.015,
            hsv_s = 0.7,
            degrees = 0.0,
            translate = 0.1,
            scale = 0.5,
            shear = 0.0,
            perspective = 0.0,
            flipud = 0.0,
            fliplr = 0.5,
            mixup = 0.0,
            copy_paste = 0.0,
            erasing = 0.4,
            crop_fraction = 1.0,

            # device/speed settings
            device = 0,
            cache = True,
            batch = 0.6,
            workers = 8,
            deterministic = False,

            # confidence threshold
            # conf = 0.35,

            # output
            project = "models/new",
            name = model_name[:-3]
        )