from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import goose_finder

app = FastAPI()

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only your React app to access the API
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model to define the request body
class ImageList(BaseModel):
    images: list[str]

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend!"}

@app.post("/count")
def count_entries(data: ImageList):
    time.sleep(2)  # Simulate a delay for counting logic
    image_count = len(data.images)
    counts = [42] * image_count  # Set all counts to 42
    return {"counts": counts}
