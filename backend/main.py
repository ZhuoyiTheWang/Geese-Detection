from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os
from tempfile import NamedTemporaryFile
from goose_finder import count_geese
import random
from typing import List

app = FastAPI()

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://goose.minigathering.com"],  # Allow only your React app to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model to define the request body
class ImageList(BaseModel):
    images: list[str]  # List of Base64-encoded images


@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend!"}


@app.post("/count")
def count_entries(data: ImageList):
    try:
        #Call goose counting function on list of images
        #Returns list of counts and generates output images locally
        counts, output_images = count_geese(data.images)
        return {"counts": counts, "output_images": output_images}

    except Exception as e:
        return {"error": str(e)}