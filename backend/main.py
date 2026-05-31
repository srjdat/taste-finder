from ollama import chat
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

class ChatRequest(BaseModel): 
    message: str
    mode: str

app = FastAPI()

# fix CORS issues I HATE WEB DEV
origins = [
    "http://localhost:3000"
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
        if not inside_messages:
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
        if not outside_messages:
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

# everything on the bottom is terminal based so i might just recode it 
#def main(): 

    #print(user_input)
    #ollama.create(model='inside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to cook inside. Ask the user what their preferences are first.')
    #ollama.create(model='outside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to go out and eat. Ask the user what their preferences are first.')


# user_input = ""
# while user_input != "exit()": 
#     user_input = input("Enter the Number \n1.Inside \n2.Outside \n>> ")

#     if user_input == '1':
#         inside_messages.append({'role': 'user', 'content': 'Give me some recommendations for what dishes I should make'})
#         response = chat(
#             model='inside_chatbot',
#             messages=inside_messages
#         )
#         print(response.message.content)
#         inside_messages.append({'role': 'assistant', 'content': response.message.content})

#         while True: 
#             # break the loop if user enters "exit()"
#             if user_input == "exit()": 
#                 break

#             user_input = input(">> ")
#             # enter the user input into the dict for model to use
#             inside_messages.append({'role': 'user', 'content': user_input})

#             response = chat(
#                 model='inside_chatbot',
#                 messages=inside_messages 
#             )
#             inside_messages.append({'role': 'assistant', 'content': response.message.content})
#             print(response.message.content)


#     elif user_input == '2':
#         outside_messages.append({'role': 'user', 'content': 'What can I go out and eat today'})
#         response = chat(
#             model='outside_chatbot', 
#             messages=outside_messages
#         )
#         print(response.message.content)
#         outside_messages.append({'role': 'assistant', 'content': response.message.content})

#         while True:
#             # break the loop
#             if user_input == "exit()": 
#                 break

#             user_input = input(">> ")
#             # enter the user input into the dict
#             outside_messages.append({'role': 'user', 'content': user_input})

#             # get the output from the model
#             response = chat(
#                 model='inside_chatbot',
#                 messages=inside_messages 
#             )

#             outside_messages.append({'role': 'assistant', 'content': response.message.content})
#             print(response.message.content)


#     else:
#         print("please enter a correct option")