from ollama import chat
from fastapi import FastAPI
import ollama
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from outside import router as outside_router

#print(user_input)
# ollama.create(model='inside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to cook inside. Ask the user what their preferences are first.')
# ollama.create(model='outside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to go out and eat. Ask the user what their preferences are first.')

class ChatRequest(BaseModel): 
    message: str
    mode: str
class Message(BaseModel): 
    message: str

app = FastAPI()

# include outside_router
app.include_router(outside_router)
 
# where to accept inputs from
# right now @xyve7 is hosting 
origins = [
    #"http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

inside_messages = []
outside_messages = []

@app.get("/")
def read_root(): 
    return {"Hello": "World"}

@app.post("/chat")
def chat_endpoint(request: ChatRequest): 
    if request.mode == "inside": 
        # if the array is empty then add the first input manually
        if not inside_messages or request.message == "inside":
            inside_messages.append({'role': 'user', 'content': 'Give me some recommendations for what dishes I should make'})
        else: # if array isn't empty (not the first message) append the user input
            inside_messages.append({'role': 'user', 'content': request.message})

        # get response from bot
        response = chat(
            model='inside_chatbot', 
            messages=inside_messages
        )
        # add bot output into array
        inside_messages.append({'role': 'assistant', 'content': response.message.content})

        # return message from bot
        return {"reply": response.message.content}
    elif request.mode == "outside": 
        # if the array is empty then add the first input manually
        if not outside_messages or request.message == "outside":
            outside_messages.append({'role': 'user', 'content': 'Give me some recommendations for what dishes I should make'})
        else: # if array isn't empty (not the first message) append the user input
            outside_messages.append({'role': 'user', 'content': request.message})

        # get response from bot
        response = chat(
            model='outside_chatbot', 
            messages=outside_messages
        )
        # add bot output into array
        outside_messages.append({'role': 'assistant', 'content': response.message.content})

        # return message from bot
        return {"reply": response.message.content}


@app.post("/reset")
def reset_chat():
    # clear both arrays so we can use it again
    inside_messages.clear()
    outside_messages.clear()

    # return a ok message
    return {"status": "ok"} 

@app.post("/format-recipe")
def format_recipe(botMessage: Message): 
    print("")