import { useContext, useEffect, useRef, useState } from "react";
import { socketContext } from "../../context/socketContext";
import chatAPI from "../../services/chatAPI";
import PresenceAvatar from "../PresenceAvatar";
import { dialogBoxContext } from "../../context/DialogBoxContext";
import { iconFile } from "../../assets/icons/icons";
import { useLocation, useNavigate } from "react-router-dom";
import friendAPI from "../../services/friendAPI";

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

function MainChat({ id, currentFriend, dataMessages, setDataMessages }) {
  const scrollRef = useRef(null);
  const { currentUser, registerDataMessages, getFriendShipsRef } =
    useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);
  const navigate = useNavigate();
  const location = useLocation();

  registerDataMessages(getDataMessage);

  async function getDataMessage() {
    const response = await chatAPI.getMessage(id);
    const data = await response.json();
    const newData = data.data.sort(
      (a, b) => new Date(a.createAt) - new Date(b.createAt)
    );
    setDataMessages([...newData]);
  }

  async function handleDeleteFriend() {
    const result = await getDialogBox(
      "Nếu xóa bạn, cuộc trò chuyện sẽ bị xóa.",
      "confirm"
    );
    if (result === true) {
      const response = await friendAPI.deleteFriendRequest(id);
      if (response.status === 200) {
        navigate("/dashboard/friend", { replace: true });
        getFriendShipsRef.current?.();
      }
    }
  }

  async function handleBlock() {
    const result = await getDialogBox(
      `Bạn có muốn tiếp tục chặn ${currentFriend?.displayname} chứ?`,
      "confirm"
    );
    if (result == true) {
      const response = await friendAPI.blockFriendRequest(id);
      const data = await response.json();
      if (response.status === 500) {
        getDialogBox(data.message, "notify");
        return;
      }
      if (response.status === 409) {
        getDialogBox(data.message, "notify");
      }
      if (data.navigate) {
        navigate("/dashboard/friend", { replace: true });
      }
      getFriendShipsRef.current?.();
    }
  }

  async function updateStatusMessage() {
    const response = await chatAPI.updateStatusMessage(id);
    if (response.status === 200) {
      getFriendShipsRef.current?.();
    }
  }

  useEffect(() => {
    getDataMessage();
  }, [id]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
    if (location.pathname === `/dashboard/chat/${id}`) {
      updateStatusMessage();
    }
  }, [dataMessages]);

  useEffect(() => {
    updateStatusMessage();
    return () => registerDataMessages(null);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto px-4 pt-4 scroll-smooth flex-1
                          [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-[#60616a]"
    >
      <div className="flex mb-4">
        <div className="rounded-full flex items-center justify-center">
          <div className="w-[80px] h-[80px] mr-[12px]">
            <PresenceAvatar imgUrl={currentFriend?.avatarURL} status={null} />
          </div>
        </div>
      </div>
      <div className="flex mb-4">
        <div className="text-white rounded-full items-center justify-center">
          <p className="mb-[24px] text-3xl font-bold">
            {currentFriend?.displayname}
          </p>
          <p className="mb-[30px] text-3xl">{currentFriend?.username}</p>
          <p className="mb-[30px]">
            Đây là sự khởi đầu cho lịch sử tin nhắn trực tiếp của bạn với{" "}
            {currentFriend?.displayname}
          </p>
          <div>
            <button
              className="text-sm px-4 py-1 rounded-lg bg-[#27272b] hover:bg-[#333338] mr-2"
              onClick={() => handleDeleteFriend()}
            >
              Xóa bạn
            </button>
            {currentFriend?.isBlock === 0 && (
              <button
                className="text-sm px-4 py-1 rounded-lg bg-[#27272b] hover:bg-[#333338]"
                onClick={() => handleBlock()}
              >
                Chặn
              </button>
            )}
          </div>
        </div>
      </div>

      {dataMessages.map((message, index) => (
        <div key={index}>
          {index == 0 && (
            <div className="flex items-center justify-center text-white mb-5">
              <div className="h-[1px] bg-[#2c2c2f] w-[40%]"></div>
              <p className="w-[20%] text-center text-[#999aa1] text-sm font-semibold">
                {new Date(message.createAt).toLocaleString("vi-VN")}
              </p>
              <div className="h-[1px] bg-[#2c2c2f] w-[40%]"></div>
            </div>
          )}
          {(new Date(message.createAt) -
            new Date(dataMessages[index - 1]?.createAt)) /
            (1000 * 60) >
            7 && (
            <div className="flex items-center justify-center text-white mb-5">
              <p className="w-[20%] text-center text-[#999aa1] text-sm font-semibold">
                {new Date(message.createAt).toLocaleString("vi-VN")}
              </p>
            </div>
          )}
          <div
            className={`flex mb-4 ${
              message.user_id_send === currentUser.current?.id &&
              "justify-end items-end"
            }`}
          >
            {message.user_id_send !== currentUser.current?.id && (
              <div className="rounded-full flex items-center justify-center">
                <div className="w-[30px] h-[30px] mr-[12px]">
                  <PresenceAvatar
                    imgUrl={currentFriend?.avatarURL}
                    status={currentFriend?.status}
                  />
                </div>
              </div>
            )}
            <div
              className={`flex max-w-96 ${
                message.typeId !== 7 &&
                (message.user_id_send === currentUser.current?.id
                  ? "bg-[#4f74ff]"
                  : "bg-[#36363a]")
              } text-white rounded-lg p-3 gap-3`}
            >
              {message.typeId === 7 ? (
                <img
                  src={`${API_SERVER_URL}/api/showImg/${id}-${message.content.replace(
                    "storage\\",
                    ""
                  )}`}
                  className="cursor-pointer rounded-lg"
                  alt="Không thể tải ảnh"
                />
              ) : (
                <div
                  className={`flex items-center ${
                    message.typeId !== 1 && "cursor-pointer"
                  }`}
                >
                  {iconFile[message.typeId]}
                  {message.content.startsWith("http://") ||
                  message.content.startsWith("https://") ? (
                    <a
                      href={`${message.content}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {message.content}
                    </a>
                  ) : (
                    <span>
                      {message.content.split("-")[1] || message.content}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {index + 1 ===
            dataMessages.length - currentFriend?.unreadMessages && (
            <div className="flex justify-end mb-4 items-end">
              <div className="w-[17px] h-[17px]">
                <PresenceAvatar
                  imgUrl={currentFriend?.avatarURL}
                  status={null}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MainChat;
