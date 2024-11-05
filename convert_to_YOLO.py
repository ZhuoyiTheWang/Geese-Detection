#FILE PURPOSE: Converts from xml file in goose head database to .txt file format expected by yolo and saves images under correct name in correct folders
import xmltodict
import os
import glob
import data_download

# make sure data is downloaded
data_download.download_goose_mugshots()

#Make folder directory for storing images and labels:
os.makedirs("datasets/images/train", exist_ok=True)
os.makedirs("datasets/images/validation", exist_ok=True)
os.makedirs("datasets/images/test", exist_ok=True)
os.makedirs("datasets/labels/train", exist_ok=True)
os.makedirs("datasets/labels/validation", exist_ok=True)
os.makedirs("datasets/labels/test", exist_ok=True)

for i, xml_file in enumerate(glob.glob("Data/goose-dataset/annotations/*.xml")): #for each xml file in dataset downloaded
    with open(xml_file, 'r') as f: #opening xml file
        file = xmltodict.parse(f.read()) #convert to dictionary
        xmin = int((file["annotation"]["object"]["bndbox"]["xmin"])) #access xmin of bounding box
        ymin = int((file["annotation"]["object"]["bndbox"]["ymin"])) #access ymin of bounding box
        xmax = int((file["annotation"]["object"]["bndbox"]["xmax"])) #access xmax of bounding box
        ymax = int((file["annotation"]["object"]["bndbox"]["ymax"])) #access ymax of bounding box
        w = int((file["annotation"]["size"]["width"])) #access width of photo
        h = int((file["annotation"]["size"]["height"])) #access height of photo

    x_center_n = (xmin + xmax) / (2 * w) #calculate normalized center of bounding box in x-direction
    y_center_n = (ymin + ymax) / (2 * h) #calculate normalized center of bounding box in y-direction
    bbox_w_n = (xmax - xmin) / w #calculate normalized bounding box width
    bbox_h_n = (ymax - ymin) / h #calculate normalized bounding box height

    if i <= 800: #first 80% used for training
        split = "train"
    elif i <= 900: #next 10% used for validation
        split = "validation"
    else: #last 10% used for testing
        split = "test"

    with open(f'datasets/labels/{split}/{xml_file[-8:-4]}.txt','w') as f: #create label file
        f.write(f"0 {x_center_n} {y_center_n} {bbox_w_n} {bbox_h_n}") #write information to file - label = 0 because we're only labeling 1 class (geese)

    image_file = f'{xml_file[-22:-4]}.jpg'
    source_path = f'Data/goose-dataset/images/{image_file}' #file path we are taking from
    destination_path = f'datasets/images/{split}/{image_file[-8:]}' #file path we are moving the file to
    
    try:
        os.rename(source_path, destination_path) #store file under new name at specified path
    except FileExistsError: #if file already exists
        os.remove(destination_path) #remove file
        os.rename(source_path, destination_path) #store file under new name at specified path
    






