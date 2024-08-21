import { useState } from "react";

import Message from "./chatBot/Message";
import Input from "./chatBot/Input";
import History from "./chatBot/History";
import Clear from "./chatBot/Clear";
import styles from "./Chat_App.module.css";
import axios from "axios";
import Loading from "./chatBot/loading";
import ChatHero from "./chatBot/Hero";

var History_new;
const userName = localStorage.getItem('username');


export default function Chat_App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username");
  let data;

  const handleSubmit = () => {
    const newMessage = { role: "user", content: input };
    let res = {};
    setLoading(true); 

    axios
      .post("http://localhost:12000/chatbot-", {
        context: [window.History_new],
        prompt: input,
        userName: userName,
      })
      .then((response) => {
        res = { role: "assistant", content: response.data.response };
        setMessages([...messages, newMessage, res]);

        const updatedHistory = [
          ...history,
          { question: input, answer: res.content },
        ];
        setHistory(updatedHistory);
        window.History_new = updatedHistory;
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setInput("");
        setLoading(false); 
      });
  };

  const clear = () => {
    setMessages([]);
    setHistory([]); 
  };

  return (
    <div className={styles.Main}>
      <div className={styles.Column}>
        <h3 className={styles.Title}>Chat Messages</h3>

        {messages.length === 0 && (
          <div className={styles.ChatHeroContainer}>
            <ChatHero />
          </div>
        )}

        <div className={styles.Content}>
          {messages.map((el, i) => {
            return (
              <Message
                key={i}
                role={el.role}
                content={el.content}
              />
            );
          })}
          {loading && <Loading />} 
        </div>

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onClick={input ? handleSubmit : undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input) {
              handleSubmit();
            }
          }}
        />
      </div>
    </div>
  );
}
