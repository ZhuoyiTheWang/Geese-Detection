#FILE PURPOSE: Converts from xml file in lion head goose database to .txt file format expected by yolo and saves images under correct name in correct folders
import xmltodict
import os
import glob
import data_download
import re


#Make folder directory for storing images and labels:
os.makedirs("datasets/images/train", exist_ok=True)
os.makedirs("datasets/images/validation", exist_ok=True)
os.makedirs("datasets/images/test", exist_ok=True)
os.makedirs("datasets/labels/train", exist_ok=True)
os.makedirs("datasets/labels/validation", exist_ok=True)
os.makedirs("datasets/labels/test", exist_ok=True)

for i, xml_file in enumerate(glob.glob("Data/lionhead-dataset/Annotations/*.xml")): #for each xml file in dataset downloaded
    if i <= 360: #first 80% used for training
        split = "train"
    elif i <= 405: #next 10% used for validation
        split = "validation"
    else: #last 10% used for testing
        split = "test"
    #just get digits of file without other characters
    file_digits = re.search(r'(\d+)\.xml', xml_file).group(1)
    
    with open(f'datasets/labels/{split}/{file_digits}.txt', 'w') as f: #create file
        print(f'File {file_digits}.txt created')
        f.write("")
    with open(f'datasets/labels/{split}/{file_digits}.txt','a') as file_to_write: #append to file
        with open(xml_file, 'r') as f: #opening xml file
            file = xmltodict.parse(f.read()) #convert to dictionary
            w = int((file["annotation"]["size"]["width"])) #access width of photo
            h = int((file["annotation"]["size"]["height"])) #access height of photo
            if "object" not in file["annotation"]:
                continue
            elif isinstance(file["annotation"]["object"], dict):
                object = file["annotation"]["object"]
                xmin = int((object["bndbox"]["xmin"])) #access xmin of bounding box
                ymin = int((object["bndbox"]["ymin"])) #access ymin of bounding box
                xmax = int((object["bndbox"]["xmax"])) #access xmax of bounding box
                ymax = int((object["bndbox"]["ymax"])) #access ymax of bounding box
                
                x_center_n = (xmin + xmax) / (2 * w) #calculate normalized center of bounding box in x-direction
                y_center_n = (ymin + ymax) / (2 * h) #calculate normalized center of bounding box in y-direction
                bbox_w_n = (xmax - xmin) / w #calculate normalized bounding box width
                bbox_h_n = (ymax - ymin) / h #calculate normalized bounding box height

                file_to_write.write(f"0 {x_center_n} {y_center_n} {bbox_w_n} {bbox_h_n} \n") #write information to file - label = 0 because we're only labeling 1 class (geese)

            else:
                for object in file["annotation"]["object"]:
                    xmin = int((object["bndbox"]["xmin"])) #access xmin of bounding box
                    ymin = int((object["bndbox"]["ymin"])) #access ymin of bounding box
                    xmax = int((object["bndbox"]["xmax"])) #access xmax of bounding box
                    ymax = int((object["bndbox"]["ymax"])) #access ymax of bounding box
                    
                    x_center_n = (xmin + xmax) / (2 * w) #calculate normalized center of bounding box in x-direction
                    y_center_n = (ymin + ymax) / (2 * h) #calculate normalized center of bounding box in y-direction
                    bbox_w_n = (xmax - xmin) / w #calculate normalized bounding box width
                    bbox_h_n = (ymax - ymin) / h #calculate normalized bounding box height

                    file_to_write.write(f"0 {x_center_n} {y_center_n} {bbox_w_n} {bbox_h_n} \n") #write information to file - label = 0 because we're only labeling 1 class (geese)
            
    
    source_path = f'Data\lionhead-dataset\JPEGImages\small_goose_json2yolo_{file_digits}.jpg' #file path we are taking from
    destination_path = f'datasets/images/{split}/{file_digits}.jpg' #file path we are moving the file to
    
    #try:
       #os.rename(source_path, destination_path) #store file under new name at specified path
    #except FileExistsError: #if file already exists
        #os.remove(destination_path) #remove file
     #os.rename(source_path, destination_path) #store file under new name at specified path
    






