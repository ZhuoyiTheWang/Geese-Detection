#Run this file to pull latest data from google drive:
#Includes image files, pnt files, and JSON files

import gdown
from git import repo
import os
import requests

def download_from_gdrive() -> None:
    """Downloads all data from the google drive into the Data folder"""
    url = "https://drive.google.com/drive/folders/1bG2NObayMcbN4XkuUUdwv9l88IzvlAFE?usp=sharing" #shareable link for google drive folder
    output = "Data/gdrive" #folder where data is being stored
    gdown.download_folder(url, output=output) #download files

    print("Folder downloaded from google drive into Data/gdrive")

def download_goose_mugshots() -> None:
    """Checks out the git with all of the goose mugshots. Data can be found at Data/goose-dataset/{images/annotations}."""

    # check if repository is already there
    if os.path.isdir("Data/goose-dataset/images") and os.path.isdir("Data/goose-dataset/annotations"):
        print("Data already exists. No action needed.")
        return

    # URL of the repository
    repo_url = 'https://github.com/steggie3/goose-dataset.git'
    # Local directory to clone the repository into
    local_dir = 'Data/goose-dataset'

    # Clone the repository
    repo.clone_from(repo_url, local_dir)
    
    print("Dataset downloaded to Data/goose-dataset")

def download_lionhead_goose() -> None:
    """Checks out the git with all of the goose mugshots. Data can be found at Data/goose-dataset/{images/annotations}."""

    # check if repository is already there
    if os.path.isdir("Data/lionhead_data/images") and os.path.isdir("Data/lionhead_data/annotations"):
        print("Data already exists. No action needed.")
        return

    # URL of the file download
    url = 'https://download.scidb.cn/download?fileId=928daf13e1010ac06d9e52797e570512&path=/V3/Small_Goose.zip&fileName=Small_Goose.zip'
    response = requests.get(url)

    if response.status_code == 200:
        with open('Data/lionhead_data', 'wb') as folder:
            folder.write(response.content)
            print("Dataset downloaded to Data/lionhead_data")
    else:
        print('Failed to download file.')
    
    


if __name__ == "__main__":

    # git download
    download_from_gdrive()
    download_goose_mugshots()
    download_lionhead_goose()
