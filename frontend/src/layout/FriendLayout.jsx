import { useContext, useEffect, useState } from "react";
import friendAPI from "../services/friendAPI";
import FriendHeader from "../components/friend/FriendHeader";
import AddFriend from "../components/friend/AddFriend";
import PendingFriend from "../components/friend/PendingFriend";
import { socketContext } from "../context/socketContext";

function FriendLayout() {
  const [showLayout, setShowLayout] = useState(1);

  const { registerPendingFriend } = useContext(socketContext);

  const [pendingFriends, setPendingFriends] = useState({});

  async function getPendingFriends() {
    const response = await friendAPI.PendingFriends();
    const data = await response.json();
    setPendingFriends(data.data);
  }
  registerPendingFriend(getPendingFriends);

  useEffect(() => {
    getPendingFriends();
  }, []);

  return (
    <div className="flex-1">
      <FriendHeader
        showLayout={showLayout}
        setShowLayout={setShowLayout}
        pendingFriends={pendingFriends}
      />

      <div className="flex">
        <div className="text-white px-[30px] py-[23px] w-[70%]">
          {/* Add Friend */}
          {showLayout === 1 && (
            <AddFriend getPendingFriends={getPendingFriends} />
          )}

          {/* Pending Friends */}
          {showLayout === 2 && (
            <PendingFriend
              pendingFriends={pendingFriends}
              setPendingFriends={setPendingFriends}
              setShowLayout={setShowLayout}
            />
          )}
        </div>
        <div className="px-[30px] py-[23px] w-[30%] bg-[#202024] h-screen border-l border-[#313136]">
          <p className="text-2xl text-white font-semibold">Đang hoạt động</p>
          <div className="text-center text-white mt-[33px]">
            <p>Hiện tại chưa có hoạt động nào ...</p>
            <p className="text-[#bab3be] text-sm mt-3">
              Khi 1 nhóm bắt đầu hoạt động — như là gọi video nhóm — chúng tôi
              sẽ hiển thị các hoạt động tại đây!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendLayout;
