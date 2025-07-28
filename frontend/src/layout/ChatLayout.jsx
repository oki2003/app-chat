import { useState } from "react";
import { useParams } from "react-router-dom";
import { socketContext } from "../context/socketContext";
import { useContext } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import MainChat from "../components/chat/MainChat";
import InputChat from "../components/chat/InputChat";
import SideChat from "../components/chat/SideChat";

function ChatLayout() {
  const { id } = useParams();
  const { dataFriendShip } = useContext(socketContext);
  const [dataMessages, setDataMessages] = useState([]);
  const [showSideChat, setShowSideChat] = useState(true);

  const currentFriend = dataFriendShip?.find(
    (item) => item.friendshipsID === id
  );

  return (
    <div className="flex h-full">
      <div
        className={`${showSideChat ? "w-[70%]" : "w-[100%]"} 
        h-full
        flex flex-col
        justify-between
        duration-300`}
      >
        {/* Chat Header */}
        <ChatHeader
          currentFriend={currentFriend}
          id={id}
          setShowSideChat={setShowSideChat}
          showSideChat={showSideChat}
        />
        {/* Chat Messages */}
        <MainChat
          id={id}
          currentFriend={currentFriend}
          dataMessages={dataMessages}
          setDataMessages={setDataMessages}
        />
        {/* Chat Input */}
        <InputChat
          id={id}
          currentFriend={currentFriend}
          setDataMessages={setDataMessages}
        />
      </div>
      <div
        className={`${
          showSideChat ? "w-[30%]" : "w-0"
        } duration-300 bg-[#202024] h-screen border-l border-[#313136]`}
      >
        {/* Side Chat */}
        <SideChat
          dataMessages={dataMessages}
          id={id}
          currentFriend={currentFriend}
        />
      </div>
    </div>
  );
}

export default ChatLayout;
