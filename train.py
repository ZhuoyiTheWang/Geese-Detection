#Document used to preliminary test training model using yolov8

from ultralytics import YOLO

model = YOLO("yolov8s.pt") #select model

#train the model
model.train(
    data = "goose.yaml",
    epochs = 100,
    patience = 20,
    imgsz = (800,533), #w,h
    device = 0
)