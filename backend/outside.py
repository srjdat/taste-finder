import ollama
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter

router = APIRouter()

# file genuinely does nothing right now
# get google places API and work on this page 

@router.post("outside/places")
def get_restaurants(): 
    print("hello")
