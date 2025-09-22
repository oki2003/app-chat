import { useContext, useState } from "react";
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
import friendAPI from "../../services/friendAPI";
import { socketContext } from "../../context/socketContext";
import {
  SvgCancelFriend,
  SvgIgnoreFriend,
  SvgAcceptFriend,
  SvgSearch,
  SvgClear,
} from "../../assets/icons/icons";

function PendingFriend({ pendingFriends, setPendingFriends, setShowLayout }) {
  const [search, setSeach] = useState("");
  const { getFriendShipsRef } = useContext(socketContext);

  async function cancelFriendRequest(id, displayname) {
    const oldPendingSent = pendingFriends.pendingSent;
    setPendingFriends((prev) => ({
      ...prev,
      pendingSent: pendingFriends.pendingSent.filter((item) => item.id !== id),
    }));
    const response = await friendAPI.cancelFriendRequest(id, displayname);
    const data = await response.json();
    if (response.status === 200) {
      if (
        pendingFriends.pendingSent.length === 1 &&
        pendingFriends.pendingReceive.length === 0
      ) {
        setShowLayout(1);
      }
    } else if (response.status === 409) {
      setShowLayout(1);
    } else {
      setPendingFriends((prev) => ({
        ...prev,
        pendingSent: oldPendingSent,
      }));
    }
  }

  async function ignoreFriendRequest(id) {
    const oldPendingReceive = pendingFriends.pendingReceive;
    setPendingFriends((prev) => ({
      ...prev,
      pendingReceive: pendingFriends.pendingReceive.filter(
        (item) => item.id !== id
      ),
    }));
    const response = await friendAPI.ignoreFriendRequest(id);
    if (response.status === 200) {
      if (
        pendingFriends.pendingReceive.length === 1 &&
        pendingFriends.pendingSent.length === 0
      ) {
        setShowLayout(1);
      }
    } else {
      setPendingFriends((prev) => ({
        ...prev,
        pendingReceive: oldPendingReceive,
      }));
      alert("Từ chối kết bạn thất bại.");
    }
  }

  async function acceptFriendRequest(id) {
    const oldPendingReceive = pendingFriends.pendingReceive;
    const response = await friendAPI.acceptFriendRequest(id);
    if (response.status === 404) {
      const data = await response.json();
    }
    if (
      pendingFriends.pendingReceive.length === 1 &&
      pendingFriends.pendingSent.length === 0
    ) {
      setShowLayout(1);
    }
    setPendingFriends((prev) => ({
      ...prev,
      pendingReceive: pendingFriends.pendingReceive.filter(
        (item) => item.id !== id
      ),
    }));
    getFriendShipsRef.current();
    if (response.status !== 404 && response.status !== 200) {
      setPendingFriends((prev) => ({
        ...prev,
        pendingReceive: oldPendingReceive,
      }));
    }
  }
  return (
    <div>
      <div className="flex pr-3 items-center justify-between bg-[#121214] h-[38px] rounded-lg outline outline-1 outline-[gray] focus-within:outline-[#539af2] focus-within:outline focus-within:outline-1">
        <input
          className="bg-[#121214] pl-3 rounded-lg outline-none h-full w-full"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSeach(e.target.value)}
        />
        {search === "" ? (
          <SvgSearch width={17} height={17} />
        ) : (
          <SvgClear width={17} height={17} onClick={() => setSeach("")} />
        )}
      </div>
      <div
        className={`h-[60px] flex items-center border-b border-[#313136] ${
          pendingFriends.pendingSent.length === 0 && "hidden"
        }`}
      >
        Đã gửi - {pendingFriends.pendingSent.length}
      </div>
      {pendingFriends.pendingSent
        .filter(
          (pendingFriend) =>
            pendingFriend.username
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            pendingFriend.displayname
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            search === ""
        )
        .map((pendingFriend) => (
          <div
            key={pendingFriend.id}
            className="group h-[60px] hover:bg-[#242428] rounded-lg p-3 flex items-center justify-between cursor-pointer mb-3"
          >
            <div className="flex items-center">
              <img
                src={`${API_SERVER_URL}${pendingFriend.avatarURL}`}
                className="w-[32px] h-[32px] mr-[12px] rounded-lg"
              />
              <div>
                <p>{pendingFriend.displayname}</p>
                <p className="text-[#aeaeb6] text-xs">
                  {pendingFriend.username}
                </p>
              </div>
            </div>
            <div
              className="group/cover p-2 group-hover:bg-[#111113] rounded-full"
              onClick={() =>
                cancelFriendRequest(pendingFriend.id, pendingFriend.displayname)
              }
            >
              <SvgCancelFriend
                width={20}
                height={20}
                className="text-[#afafb6] group-hover/cover:text-red-600"
              />
            </div>
          </div>
        ))}

      <div
        className={`h-[60px] flex items-center border-b border-[#313136] ${
          pendingFriends.pendingReceive.length === 0 && "hidden"
        }`}
      >
        Đã nhận - {pendingFriends.pendingReceive.length}
      </div>
      {pendingFriends.pendingReceive
        .filter(
          (pendingFriend) =>
            pendingFriend.username
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            pendingFriend.displayname
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            search === ""
        )
        .map((pendingFriend) => (
          <div
            key={pendingFriend.id}
            className="group h-[60px] hover:bg-[#242428] rounded-lg p-3 flex items-center justify-between cursor-pointer mb-3"
          >
            <div className="flex items-center">
              <img
                src={`${API_SERVER_URL}${pendingFriend.avatarURL}`}
                className="w-[32px] h-[32px] mr-[12px] rounded-lg"
              />
              <div>
                <p>{pendingFriend.displayname}</p>
                <p className="text-[#aeaeb6] text-xs">
                  {pendingFriend.username}
                </p>
              </div>
            </div>
            <div className="flex">
              <div
                className="group/cover mr-3 p-2 group-hover:bg-[#111113] rounded-full"
                onClick={() => ignoreFriendRequest(pendingFriend.id)}
              >
                <SvgIgnoreFriend
                  width={20}
                  height={20}
                  className="text-[#afafb6] group-hover/cover:text-red-600"
                />
              </div>
              <div
                className="group/cover p-2 group-hover:bg-[#111113] rounded-full"
                onClick={() => acceptFriendRequest(pendingFriend.id)}
              >
                <SvgAcceptFriend width={20} height={20} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PendingFriend;
