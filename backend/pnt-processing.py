#Run this file to generate write JSON files for each image with counts
#Should use all PNT files in data to write JSON files
#Don't need to run if JSON files are already created for images of interest
#Latter part of code will upload created JSON files to google drive, avoiding duplicate uploads

import json
import glob
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

for pnt_file in glob.glob("Data/*.pnt"): #for each pnt file in data folder, write JSON files for each image
    #Open pnt file:
    with open(pnt_file, 'r') as f:

        #Formatting data as dictionary
        values = json.load(f)

    #Write data to JSON files:
    for image_name, class_dict in values['points'].items(): #loop through for each image
        with open(f'Data/{image_name[:-4]}.JSON', 'w') as f: #create JSON file with image name to write to
            class_dict['Goose_count'] = len(class_dict.get('Goose','')) #write count for geese to dictionary
            class_dict['Other_count'] = len(class_dict.get('Other','')) + len(class_dict.get('Duck','')) #write count for other to dictionary
            f.write(json.dumps(class_dict)) #for each image, write dictionary to JSON file with image name
    
gauth = GoogleAuth()
gauth.CommandLineAuth() # Use command-line authorization

gauth.GetFlow()
gauth.flow.browser = 'chrome' 
gauth.LocalWebserverAuth() #should open browser that asks for identification

drive = GoogleDrive(gauth)

for JSON_file in glob.glob("Data/*.JSON"): #for every .json file in data folder, check if file is already in folder and upload
    title=JSON_file[5:] #isolate name of json file

    file_list = drive.ListFile({'q': "'1bG2NObayMcbN4XkuUUdwv9l88IzvlAFE' in parents and trashed=false"}).GetList() #get list of files in folder
    for file in file_list: #for each file in the folder
        if(file['title'] == title): #check if file in folder is file we're trying to upload
            in_folder = 1 #mark in folder as true
            break #end for loop
        else:
            in_folder = 0 #mark in folder as false and continue loop
            
            
    if (in_folder == 0): #if file is not already in folder, upload it
        gfile = drive.CreateFile({'parents': [{'id': '1bG2NObayMcbN4XkuUUdwv9l88IzvlAFE'}], 'title':title}) #create file with name in folder
        gfile.SetContentFile(JSON_file) #put contents of JSON file in file
        gfile.Upload() #upload file
        print(f'{title} uploaded to drive')
    



    

