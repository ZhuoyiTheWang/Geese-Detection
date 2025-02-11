import tflite_runtime.interpreter as tflite
import numpy as np
from PIL import Image

# Load the TFLite model
interpreter = tflite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# Get input and output details
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Load and preprocess the input image
image = Image.open("image.jpg").resize((300, 300)) # Example size
input_data = np.expand_dims(image, axis=0)
input_data = (input_data.astype(np.float32) - 127.5) / 127.5 # Normalize

# Set the input tensor
interpreter.set_tensor(input_details[0]['index'], input_data)

# Run inference
interpreter.invoke()

# Get the output tensor
output_data = interpreter.get_tensor(output_details[0]['index'])

# Process the output data (example: print the first detection)
print(output_data[0])