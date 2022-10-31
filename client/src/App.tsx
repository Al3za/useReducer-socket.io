import { useEffect, useReducer, useState } from "react";
import "./App.css";
import MessageList from "./components/MessageList";
import Message from "./components/Message";
import MessageSender from "./components/MessageSender";
import axios from "axios";

const uuid = () => window.crypto.randomUUID();

const API_ENDPOINT = "http://localhost:4000";

const sendNewMessage = async (message: Message): Promise<Message[]> => {
  await axios.post(`${API_ENDPOINT}/chat`, message, {
    withCredentials: true,
    // withCredentials : true,  allow you to set a cookie value in this origin domain as a response from another domain
    // without u cannot set a cookie value as a response from t.ex a fech to another url.
  });

  return getMessages();
};

const getMessages = async () => {
  const response = await axios.get<Message[]>(`${API_ENDPOINT}/chat`, {
    withCredentials: true,
  });
  return response.data;
};

type MessageAction = {
  type: "add" | "remove" | "replace";
  message?: Message;
  messages?: Message[];
};
const messageReducer = (state: Message[], action: MessageAction): Message[] => {
  if (action.type === "add" && action.message) {
    return [...state, action.message];
  } else if (action.type === "remove" && action.message) {
    return state.filter((m) => action.message?.id !== m.id);
  } else if (action.type === "replace" && action.messages) {
    return action.messages;
  } else {
    return state;
  }
};

function App() {
  const [text, setText] = useState<string>("");
  //const [messages, setMessages] = useState<Message[]>([]);
  const [messages, dispatch] = useReducer(messageReducer, []);

  useEffect(() => {
    const intervall = setInterval(() => {
      getMessages().then((messages) => {
        dispatch({ type: "replace", messages: messages });
      });
    }, 2500);
    return () => clearInterval(intervall);
  });

  const sendMessage = (message: Message) => {
    sendNewMessage(message).then((messages) => {
      dispatch({ type: "replace", messages: messages });
    });
  };

  return (
    <article>
      <header>
        <h2>Async Chat Demo</h2>
      </header>
      <main>
        <MessageList messages={messages} />
      </main>
      <footer>
        <MessageSender
          tex={text}
          onChang={setText}
          onSend={() => {
            sendMessage({ id: uuid(), text: text });
            setText("");
          }}
        />
      </footer>
    </article>
  );
}

export default App;
