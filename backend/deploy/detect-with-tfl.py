import numpy as np
import tensorflow.lite as tflite
import cv2
import matplotlib.pyplot as plt

# Load the TFLite model
interpreter = tflite.Interpreter(model_path="backend/Model/custom_150_no_opt_best_saved_model/custom_150_no_opt_best_float32.tflite")
interpreter.allocate_tensors()

# Get input & output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Load and preprocess the original image
image_path = "backend/datasets/test/images/6f31e841-95.jpg"  # Change to your image file
original_image = cv2.imread(image_path)
original_height, original_width, _ = original_image.shape

# Resize the image to match model input size (assuming 640x640)
input_size = 640  # Adjust if your model uses a different input size
input_image = cv2.resize(original_image, (input_size, input_size))
input_image = input_image.astype(np.float32) / 255.0  # Normalize to 0-1 if needed
input_image = np.expand_dims(input_image, axis=0)  # Add batch dimension

# Run inference
interpreter.set_tensor(input_details[0]['index'], input_image)
interpreter.invoke()

# Extract the output tensor
output_data = interpreter.get_tensor(output_details[0]['index'])  # Shape: (1, 6, 8400)
output_data = np.squeeze(output_data)  # Shape becomes (6, 8400)

# Extract individual components
x_centers, y_centers, widths, heights, confidences, class_ids = output_data

# Set confidence threshold
confidence_threshold = 0.3
indices = np.where(confidences > confidence_threshold)[0]  # Indices of valid detections

# Convert boxes to original image scale
boxes = []
confidences_list = []
class_ids_list = []

for i in indices:
    x = x_centers[i] * original_width
    y = y_centers[i] * original_height
    w = widths[i] * original_width
    h = heights[i] * original_height

    x_min = int(x - w / 2)
    y_min = int(y - h / 2)
    x_max = int(x + w / 2)
    y_max = int(y + h / 2)

    boxes.append([x_min, y_min, w, h])  # Format required by NMS
    confidences_list.append(float(confidences[i]))
    class_ids_list.append(int(class_ids[i]))

# Apply Non-Maximum Suppression (NMS)
iou_threshold = 0.4  # Adjust as needed
indices_nms = cv2.dnn.NMSBoxes(boxes, confidences_list, confidence_threshold, iou_threshold)

if len(indices_nms) > 0:
    for i in indices_nms.flatten():  # Convert to list if not empty
        x_min, y_min, w, h = map(int, boxes[i])
        x_max, y_max = x_min + w, y_min + h

        color = (255, 0, 0)  # Green bounding box
        cv2.rectangle(original_image, (x_min, y_min), (x_max, y_max), color, 2)
        label = f"Class {class_ids_list[i]}: {confidences_list[i]:.2f}"
        cv2.putText(original_image, label, (x_min, y_min - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


# Show the image with bounding boxes
plt.figure(figsize=(10, 10))
plt.imshow(cv2.cvtColor(original_image, cv2.COLOR_BGR2RGB))  # Convert BGR to RGB for display
plt.axis("off")
plt.show()
