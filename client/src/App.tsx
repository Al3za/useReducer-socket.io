import { useEffect, useReducer, useState } from "react";
import "./App.css";
import MessageList from "./components/MessageList";
import Message from "./components/Message";
import MessageSender from "./components/MessageSender";
import axios from "axios";
import { io, Socket } from "socket.io-client";

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
  const [sOcket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io(API_ENDPOINT, { withCredentials: true });
    // explains wich url path sockets has to talk with
    setSocket(socket);
    socket.on("message", (data) => {
      /// same thing as happen below hapen here
      const mess = data as Message;
      dispatch({ type: "add", message: mess });
    });

    socket.on("messages", (data) => {
      // "messages" är communication path mellan backend och frontend socket.io
      // det är viktigt att det matchar
      // messages från backend fångas och hamnar i dispach, som renderar vidare innehållet av den som fick från backend socket.io
      const msgs = data as Message[];
      dispatch({type:'replace', messages:msgs})
    });
  }, [dispatch]);

  const sendMessage = (message: Message) => {
    sOcket?.emit('messagez', message)
    // här skickar vi den nya meddelandet till socket.io i backend
    // och sedamn för vi meddelande som blir fångad i socket.io här övan 
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

// React.StrictMode i index.tsx kör 2 ggr statements av en ogrundligt anledning.
// ta bort det för tillfället