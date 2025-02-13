import numpy as np
import tensorflow.lite as tflite
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import glob

def base64_to_pillow(base64_string):
    if base64_string.startswith("data:image"):
        base64_string = base64_string.split(",")[1]

    image_data = base64.b64decode(base64_string)
    image = Image.open(BytesIO(image_data))
    
    return image

def pillow_image_to_base64(image, format="PNG"):
    buffered = BytesIO()
    image.save(buffered, format=format)
    base64_string = base64.b64encode(buffered.getvalue()).decode("utf-8")
    base64_string = f"data:image/{format.lower()};base64,{base64_string}"

    return base64_string

def tf_count_geese(img_list):
    counts = [] #create list for counts
    result_images = [] #create list for images

    model_path = "backend/Model/custom_150_no_opt_best_saved_model/custom_150_no_opt_best_float32.tflite"
    for i, img in enumerate(img_list): #for each image give
        image_pil = base64_to_pillow(img) #convert to pillow for detection
        count, labeled_img = tf_detect(model_path, img_path=image_pil) #run detection
        labeled_img = pillow_image_to_base64(labeled_img) #convert back to base64 for front-end
        result_images.append(labeled_img) #append labeled image
        counts.append(count) #append returned count

    return counts, result_images

# Apply Non-Maximum Suppression (NMS) without OpenCV
def nms(boxes, scores, iou_threshold=0.4):
    """
    Perform Non-Maximum Suppression (NMS) to filter overlapping boxes.
    boxes: List of bounding boxes in format [x_min, y_min, x_max, y_max]
    scores: List of confidence scores
    iou_threshold: IoU threshold for filtering
    Returns indices of selected boxes.
    """
    if len(boxes) == 0:
        return []

    # Convert to numpy arrays
    boxes = np.array(boxes)
    scores = np.array(scores)

    # Compute areas of boxes
    x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
    areas = (x2 - x1 + 1) * (y2 - y1 + 1)

    # Sort boxes by confidence score (highest first)
    order = scores.argsort()[::-1]

    keep = []
    while order.size > 0:
        i = order[0]  # Pick box with highest confidence
        keep.append(i)

        # Compute IoU with remaining boxes
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])

        w = np.maximum(0, xx2 - xx1 + 1)
        h = np.maximum(0, yy2 - yy1 + 1)
        inter = w * h
        iou = inter / (areas[i] + areas[order[1:]] - inter)

        # Keep boxes with IoU below threshold
        order = order[1:][iou < iou_threshold]

    return keep


def tf_detect(model_path, img_path):
    # Load the TFLite model
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()

    # Get input & output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    # Load and preprocess the original image
    original_image = Image.open(img_path)
    original_width, original_height = original_image.size

    # Resize the image to match model input size (assuming 640x640)
    input_size = 640  # Adjust if your model uses a different input size
    input_image = original_image.resize((input_size, input_size))
    input_image = np.array(input_image, dtype=np.float32) / 255.0  # Normalize to 0-1 if needed
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

        boxes.append([x_min, y_min, x_max, y_max])
        confidences_list.append(float(confidences[i]))
        class_ids_list.append(int(class_ids[i]))

    # Apply NMS
    selected_indices = nms(boxes, confidences_list, iou_threshold=0.4)

    # Draw bounding boxes using PIL
    draw = ImageDraw.Draw(original_image)
    for i in selected_indices:
        x_min, y_min, x_max, y_max = boxes[i]
        class_id = class_ids_list[i]
        confidence = confidences_list[i]

        # Draw rectangle
        draw.rectangle([x_min, y_min, x_max, y_max], outline="blue", width=2)

        # Draw rectangle for label
        draw.rectangle([x_min, y_min-10, x_min+55, y_min+2], fill="blue")

        # Draw label
        label = f"Goose: {confidence:.2f}"
        draw.text((x_min, y_min - 10), label, fill="white")

    # Show the image with bounding boxes
    plt.figure(figsize=(10, 10))
    plt.imshow(original_image)
    plt.axis("off")

    return len(selected_indices), original_image

#TESTING:
# img_list = []
# for i, img_file in enumerate(glob.glob("backend/datasets/test/images/*.jpg")): #for image files in testing folder for model
#     #img_file = pillow_image_to_base64(img_file)
#     img_list.append(img_file)

# counts, result_imgs = tf_count_geese(img_list=img_list)
