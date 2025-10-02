import { useContext, useEffect, useRef, useState } from "react";
import PresenceAvatar from "../components/PresenceAvatar";
import friendAPI from "../services/friendAPI";
import ChatWindow from "../components/chat/ChatWindow";
import { useNavigate } from "react-router-dom";
import { socketContext } from "../context/socketContext";

function ChatPage2() {
  const [friendShips, setFriendShips] = useState([]);
  const [friend, setFriend] = useState({});
  const navigate = useNavigate();
  const { infoCall } = useContext(socketContext);

  async function getFriendShips() {
    const response = await friendAPI.FriendShips();
    const data = await response.json();
    if (response.status !== 200) {
      alert(data.message);
    }
    setFriendShips(data.data);
    if (infoCall) {
      const friendCall = data.data.filter(
        (item) => item.id === infoCall.idFriend
      );
      setFriend(friendCall[0]);
    }
  }

  const handler = (e) => {
    if (
      e.detail.data.message === "Receive New Message" &&
      e.detail.data.idFrom === friend.id
    ) {
      return;
    }
    if (
      e.detail.data.message === "online" ||
      e.detail.data.message === "offline" ||
      e.detail.data.message === "Get FriendShips" ||
      e.detail.data.message === "Receive New Message"
    ) {
      getFriendShips();
    }
  };

  useEffect(() => {
    getFriendShips();
  }, []);

  useEffect(() => {
    document.addEventListener("WebSocketEvent", handler);
    return () => document.removeEventListener("WebSocketEvent", handler);
  }, [friend]);

  useEffect(() => {
    if (friendShips.length !== 0) {
      if (friend.id !== infoCall.idFriend) {
        const friendCall = friendShips.filter(
          (item) => item.id === infoCall.idFriend
        );
        setFriend(friendCall[0]);
      }
    }
  }, [infoCall]);

  function updateFriendShips(friendship, index) {
    const arr = friendShips;
    const newFriendShip = {
      ...friendship,
      unreadMessages: 0,
    };
    arr[index] = newFriendShip;
    setFriendShips([...arr]);
    setFriend(newFriendShip);
  }

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-[#0D1218] text-[#F4F8FB] shadow-sm h-full bg-gradient-to-br from-[#0D1218] to-[#1F2730] border-[#2A35407F]">
            <div className="flex flex-col space-y-1.5 p-6 pb-3">
              <h2 className="font-semibold text-[#F4F8FB]">
                Trò chuyện trực tiếp
              </h2>
            </div>
            {friendShips.map((friendship, index) => (
              <div className="space-y-1" key={friendship.friendshipsID}>
                <button
                  onClick={() => updateFriendShips(friendship, index)}
                  className={`flex items-center justify-between w-full p-3 text-left hover:bg-[#1F2730]/50 transition-colors ${
                    friend.friendshipsID === friendship.friendshipsID &&
                    "bg-[#00CFFF1A] border-r-2 border-[#00CFFF]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      <PresenceAvatar
                        imgUrl={friendship.avatarURL}
                        status={friendship.status}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {friendship.displayname}
                      </p>
                      Online
                    </div>
                  </div>
                  {friendship.unreadMessages > 0 &&
                    friendship.userIdReceive !== friendship.id && (
                      <div className="flex text-xs bg-red-600 w-5 h-5 rounded-full">
                        <span className="m-auto text-white">
                          {friendship.unreadMessages}
                        </span>
                      </div>
                    )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-3 overflow-hidden">
          {Object.keys(friend).length == 0 ? (
            <div className="relative overflow-hidden flex flex-col rounded-lg border bg-[#0D1218] text-[#F4F8FB] shadow-sm h-full bg-gradient-to-br from-[#0D1218] to-[#1F2730] border-[#2A35407F]">
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <img
                  src="/src/assets/logo.png"
                  className="w-20 h-20 rounded-lg mr-4"
                />
                <h3 className="text-xl font-semibold text-[#F4F8FB] mb-3">
                  Chào mừng đến với Tech Chat
                </h3>
                <p className="text-[#99A3B0] mb-6 max-w-md">
                  Kết nối với cộng đồng công nghệ và bắt đầu những cuộc trò
                  chuyện ý nghĩa về đổi mới, phát triển và tương lai.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/friends/add", { replace: true })}
                    className="rounded-lg px-3 py-2 bg-gradient-to-r from-[#00CFFF] to-[#C266FF] text-[#0A0E13] hover:shadow-[0_0_20px_#00CFFF4D]"
                  >
                    Thêm bạn mới
                  </button>
                  <p className="text-sm text-[#99A3B0]">
                    Danh sách bạn bè của bạn đang có sẵn bên trái. Hãy chọn một
                    người bạn để bắt đầu trò chuyện ngay bây giờ!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ChatWindow friendInfo={friend} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage2;
