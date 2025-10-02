import { useContext, useEffect, useState, useRef } from "react";
import { socketContext } from "../../context/socketContext";
import chatAPI from "../../services/chatAPI";

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
import { iconFile } from "../../assets/icons/icons";
import SideChat from "./SideChat";
import InputChat from "./InputChat";
import ChatHeader from "./ChatHeader";

function ChatWindow({ friendInfo }) {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(socketContext);
  const scrollRef = useRef(null);
  const [showSideChat, setShowSideChat] = useState(false);
  const [friend, setFriend] = useState(friendInfo);

  async function getDataMessage() {
    const [resMessages, resUpdate] = await Promise.all([
      chatAPI.getMessage(friendInfo.friendshipsID),
      chatAPI.updateStatusMessage(friendInfo.friendshipsID),
    ]);
    const data = await resMessages.json();
    const newData = data.data.sort(
      (a, b) => new Date(a.createAt) - new Date(b.createAt)
    );
    setMessages([...newData]);
  }

  const handler = (e) => {
    if (e.detail.data.message === "Receive New Message") {
      if (e.detail.data.idFrom === friendInfo.id) {
        setMessages((prev) => [
          ...prev,
          {
            id: friend.friendshipsID,
            content: e.detail.data.data,
            user_id_receive: currentUser.current?.id,
            user_id_send: friend.id,
            typeId: 1,
            createAt: new Date(),
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getDataMessage();
    document.addEventListener("WebSocketEvent", handler);
    setFriend(friendInfo);
    return () => document.removeEventListener("WebSocketEvent", handler);
  }, [friendInfo]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    async function updateStatusMessage() {
      await chatAPI.updateStatusMessage(friend.friendshipsID);
    }
    updateStatusMessage();
  }, [messages]);

  return (
    <div className="relative overflow-hidden flex flex-col rounded-lg border bg-[#0D1218] text-[#F4F8FB] shadow-sm h-full bg-gradient-to-br from-[#0D1218] to-[#1F2730] border-[#2A35407F]">
      {/* Chat Header */}
      <ChatHeader
        friend={friend}
        showSideChat={showSideChat}
        setShowSideChat={setShowSideChat}
      />

      {/* Messages */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 p-4 overflow-y-scroll h-full space-y-4"
      >
        {messages.map((message, index) =>
          message.typeId === 7 ? (
            <div
              key={index}
              className={`flex ${
                message.user_id_send === currentUser.current.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <img
                src={`${API_SERVER_URL}/api/showImg/${
                  friend.friendshipsID
                }-${message.content.replace("storage\\", "")}`}
                className="flex hover:opacity-90 cursor-pointer rounded-lg"
                alt="Không thể tải ảnh"
              />
            </div>
          ) : (
            <div
              key={index}
              className={`flex ${
                message.user_id_send === currentUser.current.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.user_id_send === currentUser.current.id
                    ? "bg-[#00CFFF] text-[#0A0E13] shadow-[0_0_20px_#00CFFF4D]"
                    : "bg-[#1F2730] text-[#F4F8FB]"
                } ${message.typeId !== 1 && "cursor-pointer hover:opacity-90"}`}
              >
                {iconFile[message.typeId]}
                {message.content.startsWith("http://") ||
                message.content.startsWith("https://") ? (
                  <a
                    href={`${message.content}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-sm">{message.content}</p>
                  </a>
                ) : (
                  <span>
                    <p className="text-sm">
                      {message.content.split("-")[1] || message.content}
                    </p>
                  </span>
                )}
                <p
                  className={`text-xs mt-1 ${
                    message.user_id_send === currentUser.current.id
                      ? "text-[#0A0E13B3]"
                      : "text-[#99A3B0]"
                  }`}
                >
                  {new Date(message.createAt)
                    .toLocaleString("vi-VN")
                    .replace(/:(\d{2}) /, " ")}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Message Input */}
      <InputChat
        setMessages={setMessages}
        friend={friend}
        setFriend={setFriend}
      />

      {/* Side Chat */}
      {showSideChat && (
        <SideChat
          dataMessages={messages}
          id={friend.friendshipsID}
          currentFriend={friend}
          setShowSideChat={setShowSideChat}
        />
      )}
    </div>
  );
}

export default ChatWindow;
