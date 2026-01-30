import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ChatPage.scss";
import ApiService, {
  startConversation,
} from "../../../../services/Api.service";
import { PulseLoader } from "react-spinners";

const ChatPage = () => {
  let [searchParams] = useSearchParams();

  const [messages, setMessages] = useState([
    {
      question: "",
      Ai_response: "Hello, How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
 
    setMessages((prev) => [...prev, { question: input, Ai_response: "" }]);

    try {
      let payload = {
        question: input,
        namespace_id: searchParams.get("namespace_id"),
        chatHistory: messages,
      };
      setInput("");

      await startConversation(payload, (chunk) => {
        const chunkText =
          typeof chunk === "string"
            ? chunk
            : chunk?.text ??
              chunk?.Ai_response ??
              chunk?.data ??
              JSON.stringify(chunk);

        setMessages((prev) => {
          const lastIdx = prev.length - 1;

          if (lastIdx < 0) return prev;

          const updated = [...prev];
          const last = { ...updated[lastIdx] };

          if (last.question === "") {
            last.Ai_response = (last.Ai_response || "") + chunkText;
            updated[lastIdx] = last;

            return updated;
          }

          return [...prev, { question: "", Ai_response: chunkText }];
        });
      });
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) => [
        ...prev,
        { question: "", Ai_response: "⚠️ Error receiving response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .replace(/For More Reference:/g, "\n\nFor More Reference:\n")
      .replace(/•/g, "\n•")
      .replace(/\. /g, ".\n")
      .replace(/- /g, "\n -")
      .trim();
  };

  return (
    <div className="pm-chat">
      <div className="pm-card pm-chat-card">
        <div className="pm-chat-head">
          <div>
            <div className="pm-eyebrow">Chat</div>
            <h3 className="pm-h3 mb-0">
              <i className="bi bi-chat-dots me-2" />
              Ask your bot
            </h3>
            <div className="pm-muted pm-small">
              Responses stream live. For best results, upload documents first.
            </div>
          </div>
          <Button
            variant="outline-secondary"
            className="px-3"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2" />
            Back
          </Button>
        </div>

        <div className="pm-chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`pm-msg-row ${msg.question ? "is-user" : "is-bot"}`}
            >
              <div className="pm-msg">
                {msg.question && <div className="pm-msg-q">{msg.question}</div>}

                {msg.Ai_response && (
                  <div className="pm-msg-a">{formatResponse(msg.Ai_response)}</div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="pm-msg-row is-bot">
              <div className="pm-msg pm-msg-loading">
                <PulseLoader
                  color="rgba(255,255,255,0.85)"
                  size={8}
                  margin={3}
                  speedMultiplier={0.7}
                />
              </div>
            </div>
          )}
        </div>

        <div className="pm-chat-input">
          <form className="d-flex gap-2" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control form-control-lg"
            />
            <button className="btn btn-primary px-4" disabled={loading}>
              <i className="bi bi-send me-2" />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
