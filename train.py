#Document used to preliminary test training model using yolov8

from ultralytics import YOLO

model = YOLO("yolov8m.pt") #select model

#train the model
model.train(
    data = "goose.yaml",
    epochs = 20,
    imgsz = (800,533), #w,h
    batch = 4,
)