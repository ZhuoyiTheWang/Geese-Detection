# main.py
from fastapi import FastAPI

app = FastAPI()

# Root route for testing
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend!"}

# Count route
@app.get("/count")
async def count_entries():
    # Replace this with your actual counting logic
    count = 42  # Example count value
    return {"count": count}
