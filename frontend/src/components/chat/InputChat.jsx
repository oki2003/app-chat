import { useContext, useState } from "react";
import { socketContext } from "../../context/socketContext";
import { dialogBoxContext } from "../../context/DialogBoxContext";
import { SvgUploadFile } from "../../assets/icons/icons";
import chatAPI from "../../services/chatAPI";
import { useNavigate } from "react-router-dom";
import friendAPI from "../../services/friendAPI";

function InputChat({ id, currentFriend, setDataMessages }) {
  const [message, setMessage] = useState("");
  const { currentUser, getFriendShipsRef } = useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);
  const navigate = useNavigate();

  async function handleUnBlock() {
    const response = await friendAPI.unBlockFriendRequest(id);
    if (response.status === 200) {
      getFriendShipsRef.current?.();
    } else {
      const data = await response.json();
      getDialogBox(data.message, "notify");
      if (data.navigate) {
        navigate("/dashboard/friend", { replace: true });
        getFriendShipsRef.current?.();
      }
    }
  }

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
      const createAt = new Date(Date.now()).toString();
      const response = await chatAPI.uploadFile(id, file, createAt);
      const data = await response.json();
      if (response.status === 200) {
        setDataMessages((prev) => [
          ...prev,
          {
            id: id,
            content: data.nameFile,
            user_id_send: currentUser.current?.id,
            user_id_receive: id
              .replace("_", "")
              .replace(currentUser.current?.id, ""),
            typeId: typeId,
            createAt: createAt,
          },
        ]);
      } else {
        getDialogBox(data.message, "notify");
        if (response.status === 404) {
          navigate("/dashboard/friend", { replace: true });
        }
        getFriendShipsRef.current?.();
      }
    }
  }

  async function handleSendMessage() {
    const createAt = new Date(Date.now()).toString();
    const response = await chatAPI.sendMessage(id, message, createAt);
    const data = await response.json();
    if (response.status === 200) {
      setDataMessages((prev) => [
        ...prev,
        {
          id: id,
          content: message,
          user_id_send: currentUser.current?.id,
          user_id_receive: id
            .replace("_", "")
            .replace(currentUser.current?.id, ""),
          typeId: 1,
          createAt: createAt,
        },
      ]);
    } else {
      getDialogBox(data.message, "notify");
      if (response.status === 404) {
        navigate("/dashboard/friend", { replace: true });
      }
      getFriendShipsRef.current?.();
    }
    setMessage("");
  }

  return (
    <footer className="w-full h-[75px] px-2">
      {currentFriend?.isBlock === 0 && (
        <div className="flex items-center rounded-lg bg-[#222327]">
          <div
            onClick={() => document.getElementById("UploadFileBtn").click()}
            className="text-[#aaaab1] hover:text-white w-[60px] h-[60px] cursor-pointer flex items-center justify-center"
          >
            <SvgUploadFile width={20} height={20} />
            <input
              type="file"
              className="w-0"
              id="UploadFileBtn"
              onChange={(e) => handleUploadFileBtn(e)}
            />
          </div>
          <input
            id="inputSendMessage"
            type="text"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            value={message}
            placeholder={`Tin nhắn @${currentFriend?.displayname}`}
            className="w-full outline-none h-[60px] bg-transparent text-white"
          />
        </div>
      )}
      {currentFriend?.isBlock === currentUser.current?.id && (
        <div className="flex h-[70px] items-center rounded-lg bg-[#222327] text-white">
          <div className="m-auto text-center">
            <p className="cursor-default">
              Bạn đã chặn tin nhắn và cuộc gọi từ tài khoản FAC của{" "}
              {currentFriend?.displayname}
            </p>
            <p className="mt-2">
              <span
                onClick={() => handleUnBlock()}
                className="cursor-pointer border-b-[1px] hover:opacity-65"
              >
                Bỏ chặn
              </span>
            </p>
          </div>
        </div>
      )}
      {currentFriend?.isBlock !== currentUser.current?.id &&
        currentFriend?.isBlock !== 0 && (
          <div className="flex h-[60px] items-center rounded-lg bg-[#222327]">
            <p className="text-white m-auto">
              Hiện không thể liên lạc với người này trên FAC.
            </p>
          </div>
        )}
    </footer>
  );
}

export default InputChat;
