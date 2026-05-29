from ollama import chat

def main(): 

    #print(user_input)
    #ollama.create(model='inside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to cook inside. Ask the user what their preferences are first.')
    #ollama.create(model='outside_chatbot', from_='llama3.2', system='You are a personal assistant that helps with what to go out and eat. Ask the user what their preferences are first.')

    inside_messages = []
    outside_messages = []
    user_input = ""
    while user_input != "exit()":
        user_input = input("Enter the Number \n1.Inside \n2.Outside \n>> ")

        if user_input == '1':
            inside_messages.append({'role': 'user', 'content': 'Give me some recommendations for what dishes I should make'})
            response = chat(
                model='inside_chatbot',
                messages=inside_messages
            )
            print(response.message.content)
            inside_messages.append({'role': 'assistant', 'content': response.message.content})

            while True: 
                # break the loop if user enters "exit()"
                if user_input == "exit()": 
                    break
    
                user_input = input(">> ")
                # enter the user input into the dict for model to use
                inside_messages.append({'role': 'user', 'content': user_input})
    
                response = chat(
                    model='inside_chatbot',
                    messages=inside_messages 
                )
                inside_messages.append({'role': 'assistant', 'content': response.message.content})
                print(response.message.content)


        elif user_input == '2':
            outside_messages.append({'role': 'user', 'content': 'What can I go out and eat today'})
            response = chat(
                model='outside_chatbot', 
                messages=outside_messages
            )
            print(response.message.content)
            outside_messages.append({'role': 'assistant', 'content': response.message.content})

            while True:
                # break the loop
                if user_input == "exit()": 
                    break

                user_input = input(">> ")
                # enter the user input into the dict
                outside_messages.append({'role': 'user', 'content': user_input})

                # get the output from the model
                response = chat(
                    model='inside_chatbot',
                    messages=inside_messages 
                )

                outside_messages.append({'role': 'assistant', 'content': response.message.content})
                print(response.message.content)


        else:
            print("please enter a correct option")


if __name__ == "__main__":
    main()
