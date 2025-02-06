#FILE PURPOSE: Document used to preliminary test training model using yolov11

from ultralytics import YOLO
from data_download import download_custom_dataset


if __name__ == "__main__":

    # download and randomize tvt split each run
    download_custom_dataset()

    # select model
    model = YOLO("yolo11n.pt") # TODO: try larger models

    # train the model
    model.train(
        # training
        data = "goose.yaml", # yaml file for model configuration
        epochs = 50, # number of training periods
        patience = 20,
        imgsz = [1024,1024], #w,h  - the largest we can make it without throwing a dataloader error
        single_cls = True,
        # multi_scale = True,  # TODO: try this setting
        dropout = 0.0, # TODO: try higher

        # loss
        box = 7.5,  # TODO: try smaller
        cls = 0.5,  # TODO: try larger

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
        batch = 0.7,
        workers = 10,
        deterministic = False,

        # output
        project = "models/"
    )