import React, { useState, useRef, useEffect } from "react";

function App() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const firstMsgRef = useRef();
  const msgRef = useRef();
  const chatBoxRef = useRef();

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text, type) => {
    setMessages((prev) => [...prev, { text, type }]);
  };

  const askBot = async (text) => {
    try {
      const res = await fetch("https://rag-ai.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      addMessage(data.reply, "bot");
    } catch {
      addMessage("Backend not reachable.", "bot");
    }
  };

  const startChat = async () => {
    const text = firstMsgRef.current.value.trim();
    if (!text) return;
    setStarted(true);
    addMessage(text, "user");
    await askBot(text);
  };

  const send = async () => {
    const text = msgRef.current.value.trim();
    if (!text) return;
    msgRef.current.value = "";
    addMessage(text, "user");
    await askBot(text);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      if (started) send();
      else startChat();
    }
  };

  return (
    <div onKeyDown={handleKey} tabIndex="0">
      <div className="topbar">AI Student Assistant</div>

      {!started && (
        <div className="landing">
          <h1>How can I help you today?</h1>
          <div className="search-box">
            <input
              ref={firstMsgRef}
              placeholder="Ask about subjects, coding, exams, assignments..."
            />
            <button onClick={startChat}>Ask</button>
          </div>
        </div>
      )}

      {started && (
        <div className="chat-screen">
          <div className="chat-box" ref={chatBoxRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.type}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input ref={msgRef} placeholder="Type your message..." />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
