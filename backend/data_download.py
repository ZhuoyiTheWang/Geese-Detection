# Run this file to pull latest data from the custom dataset github:
# Includes images and labels

import gdown
from git import Repo, rmtree
import os
import requests
import shutil
import random


def download_custom_dataset() -> None:
    """Downloads the custom labeled dataset from the Github repository and splits it for training."""

    # DOWNLOAD

    # URL of the repository
    repo_url = 'https://github.com/bbillharz/DPR-Goose-Dataset.git'
    # Local directory to clone the repository into
    local_dir = 'backend/Data/custom/'
    # Clone the repository
    Repo.clone_from(repo_url, local_dir)

    # SPLIT

    # Source directories
    images_dir = 'backend/Data/custom/processed_images/images'
    labels_dir = 'backend/Data/custom/processed_images/labels'

    # Destination directories
    train_images_dir = 'backend/datasets/train/images'
    train_labels_dir = 'backend/datasets/train/labels'
    valid_images_dir = 'backend/datasets/valid/images'
    valid_labels_dir = 'backend/datasets/valid/labels'
    test_images_dir = 'backend/datasets/test/images'
    test_labels_dir = 'backend/datasets/test/labels'

    # Function to remove and recreate directories
    # We need this to remove any pre-existing files since TVT split is randomized
    def recreate_directory(directory):
        if os.path.exists(directory):
            shutil.rmtree(directory)
        os.makedirs(directory)

    # Remove and recreate destination directories
    recreate_directory(train_images_dir)
    recreate_directory(train_labels_dir)
    recreate_directory(valid_images_dir)
    recreate_directory(valid_labels_dir)
    recreate_directory(test_images_dir)
    recreate_directory(test_labels_dir)

    # Define split ratios
    train_ratio = 0.7
    valid_ratio = 0.15
    test_ratio = 0.15

    # Get a list of all image filenames
    image_filenames = [f for f in os.listdir(images_dir) if f.endswith('.jpg')]

    # Shuffle filenames
    random.shuffle(image_filenames)

    # Calculate split indices
    total_images = len(image_filenames)
    train_index = int(train_ratio * total_images)
    valid_index = train_index + int(valid_ratio * total_images)

    # Split filenames
    train_filenames = image_filenames[:train_index]
    valid_filenames = image_filenames[train_index:valid_index]
    test_filenames = image_filenames[valid_index:]

    # Function to copy files
    def copy_files(filenames, dest_images_dir, dest_labels_dir):
        for filename in filenames:
            base_name = os.path.splitext(filename)[0]
            image_path = os.path.join(images_dir, filename)
            label_path = os.path.join(labels_dir, base_name + '.txt')
            
            shutil.copy(image_path, dest_images_dir)
            shutil.copy(label_path, dest_labels_dir)

    # Copy training files
    copy_files(train_filenames, train_images_dir, train_labels_dir)

    # Copy validation files
    copy_files(valid_filenames, valid_images_dir, valid_labels_dir)

    # Copy test files
    copy_files(test_filenames, test_images_dir, test_labels_dir)

    # Remove dataset repo
    rmtree(local_dir)

    
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
    Repo.clone_from(repo_url, local_dir)
    
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

    download_custom_dataset()
