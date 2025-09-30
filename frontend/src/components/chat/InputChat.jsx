import SvgPaperClip from "../../assets/icons/SvgPaperClip";
import { useContext, useState } from "react";
import { socketContext } from "../../context/socketContext";
import { useNavigate } from "react-router-dom";
import chatAPI from "../../services/chatAPI";

function InputChat({ setMessages, friend }) {
  const [inputMessage, setInputMessage] = useState("");
  const { socket, currentUser } = useContext(socketContext);
  const navigate = useNavigate();

  async function handleUploadFileBtn(e) {
    const file = e.target.files[0];
    if (file) {
      let typeId = 1;
      if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        typeId = 3;
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        typeId = 4;
      } else if (file.type === "text/plain") {
        typeId = 5;
      } else if (file.type === "application/pdf") {
        typeId = 6;
      } else if (file.type === "image/png") {
        typeId = 7;
      } else {
        typeId = 2;
      }
      const createAt = new Date();
      const response = await chatAPI.uploadFile(
        friend.friendshipsID,
        file,
        createAt
      );
      const data = await response.json();
      if (response.status === 200) {
        setMessages((prev) => [
          ...prev,
          {
            id: friend.friendshipsID,
            content: data.nameFile,
            user_id_send: currentUser.current?.id,
            user_id_receive: friend.id,
            typeId: typeId,
            createAt: createAt,
          },
        ]);
      } else {
        // getDialogBox(data.message, "notify");
        alert(data.message);
        if (response.status === 404) {
          navigate("/friends", { replace: true });
        }
      }
    }
  }
  console.log(friend);

  function handleSendMessage() {
    const createAt = new Date();
    setMessages((prev) => [
      ...prev,
      {
        id: friend.friendshipsID,
        content: inputMessage,
        user_id_send: currentUser.current?.id,
        user_id_receive: friend.id,
        typeId: 1,
        createAt: createAt,
      },
    ]);
    socket.send(
      JSON.stringify({
        type: "Send Message",
        idChat: friend.friendshipsID,
        idUserReceive: friend.id,
        messageContent: inputMessage,
        createAt: createAt,
      })
    );
    setInputMessage("");
  }

  return (
    <div className="p-4 border-t border-[#2A35407F]">
      {friend.isBlock === 0 && (
        <div className="flex items-center gap-2">
          <button
            className="group flex hover:bg-[#C266FF] w-10 h-10 rounded-lg transition-all"
            onClick={() => document.getElementById("UploadFileBtn").click()}
          >
            <SvgPaperClip
              width={17}
              height={17}
              className="m-auto text-white group-hover:text-black transition-all"
            />
            <input
              type="file"
              className="w-0"
              id="UploadFileBtn"
              onChange={(e) => handleUploadFileBtn(e)}
            />
          </button>
          <div className="flex-1">
            <input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage(e.target.value)
              }
              placeholder="Nhập tin nhắn của bạn..."
              className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-[#1F2730] border-[#2A3540] focus:outline-none focus:border-[#00CFFF]"
            />
          </div>
        </div>
      )}
      {friend.isBlock !== 0 && friend.isBlock === currentUser.current.id && (
        <div className="text-center py-8 flex justify-center items-center">
          <p className="text-[#99A3B0]">
            Bạn đã chặn tin nhắn và cuộc gọi từ {friend.displayname}
          </p>
        </div>
      )}
      {friend.isBlock !== 0 && friend.isBlock !== currentUser.current.id && (
        <div className="text-center py-8">
          <p className="text-[#99A3B0] mb-4">
            Hiện không thể liên lạc với người này trên TechSocial.
          </p>
        </div>
      )}
    </div>
  );
}

export default InputChat;
