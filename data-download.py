#Run this file to pull latest data from google drive:
#Includes image files, pnt files, and JSON files

import gdown

url = "https://drive.google.com/drive/folders/1bG2NObayMcbN4XkuUUdwv9l88IzvlAFE?usp=sharing" #shareable link for google drive folder
output = "Data/" #folder where data is being stored
gdown.download_folder(url, output=output) #download files