# Tutorial for basic image processing operations

# cv2 is the open-cv library for python.
# We will use it to handle most of our images
import cv2   # If this throws an error run pip install opencv-python in your terminal


# READ IMAGE
goose_image = cv2.imread("tutorial/1.jpg")

# SHOW IMAGE
cv2.imshow("window name", goose_image)
cv2.waitKey(0) # waits for a key press
cv2.destroyAllWindows()

# ACCESS IMAGE COMPONENTS
print("Image dimensions: ", goose_image.shape)
b = goose_image[:,:,0]
g = goose_image[:,:,1]   # open cv uses BGR instead of RGB for some reason
r = goose_image[:,:,2]
print("Red dimensions: ", r.shape)

# display red
cv2.imshow("R", r)
cv2.waitKey(0) # waits for a key press
cv2.destroyAllWindows()

# display green
cv2.imshow("G", g)
cv2.waitKey(0) # waits for a key press
cv2.destroyAllWindows()

# dislpay blue
cv2.imshow("B", b)
cv2.waitKey(0) # waits for a key press
cv2.destroyAllWindows()


# Grayscale
gray_image = cv2.cvtColor(goose_image, cv2.COLOR_BGR2GRAY)

# display grayscale image
cv2.imshow("grayscale", gray_image)
cv2.waitKey(0) # waits for a key press
cv2.destroyAllWindows()