from ultralytics import YOLO

# Load the YOLO11 model
model = YOLO("backend/Model/custom_150_no_opt_best.pt")

# Export the model to TFLite format
model.export(format="tflite")  # creates 'yolo11n_float32.tflite'

# Load the exported TFLite model
tflite_model = YOLO("yolo11n_float32.tflite")
