import { useContext, useEffect, useState } from "react";
import friendAPI from "../../services/friendAPI";
import PresenceAvatar from "../PresenceAvatar";
import { socketContext } from "../../context/socketContext";
import { dialogBoxContext } from "../../context/DialogBoxContext";

function FriendList() {
  const [friendList, setFriendList] = useState([]);
  const { currentUser } = useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);

  async function getFriendList() {
    const response = await friendAPI.FriendShips();
    const data = await response.json();
    setFriendList(data.data);
  }

  async function handleBlock(index, friend) {
    const result = await getDialogBox(
      `Bạn có muốn tiếp tục chặn ${friend.displayname} chứ?`,
      "confirm"
    );
    if (result == true) {
      const response = await friendAPI.blockFriendRequest(friend.friendshipsID);
      const data = await response.json();
      if (response.status === 200) {
        setFriendList([
          ...friendList.slice(0, index),
          { ...friendList.at(index), isBlock: currentUser.current.id },
          ...friendList.slice(index + 1),
        ]);
        return;
      } else if (data.delete) {
        getDialogBox(data.message, "notify");
        setFriendList(friendList.filter((item, index) => index !== index));
      } else {
        setFriendList([
          ...friendList.slice(0, index),
          { ...friendList.at(index), isBlock: friend.id },
          ...friendList.slice(index + 1),
        ]);
        getDialogBox(data.message, "notify");
      }
    }
  }

  async function handleUnBlock(index, friend) {
    const response = await friendAPI.unBlockFriendRequest(friend.friendshipsID);
    if (response.status === 200) {
      setFriendList([
        ...friendList.slice(0, index),
        { ...friendList.at(index), isBlock: 0 },
        ...friendList.slice(index + 1),
      ]);
    } else {
      const data = await response.json();
      getDialogBox(data.message, "notify");
      if (data.delete) {
        setFriendList(friendList.filter((item, index) => index !== index));
      }
    }
  }

  async function handleDeleteFriend(friend) {
    const result = await getDialogBox(
      "Nếu xóa bạn, cuộc trò chuyện sẽ bị xóa.",
      "confirm"
    );
    if (result === true) {
      const oldFriendList = friendList;
      setFriendList(
        friendList.filter((item) => item.friendshipsID !== friend.friendshipsID)
      );
      const response = await friendAPI.deleteFriendRequest(
        friend.friendshipsID
      );
      if (response.status === 200) {
        return;
      } else {
        const data = await response.json();
        setFriendList([...oldFriendList]);
        getDialogBox(data.message, "notify");
      }
    }
  }

  useEffect(() => {
    getFriendList();
  }, []);

  return (
    <div className="flex">
      {friendList.length === 0 ? (
        <div className="m-auto text-center py-12">
          <p className="text-lg text-[#99A3B0]">Chưa có bạn bè</p>
          <p className="text-sm text-[#99A3B0]">
            Hãy thêm bạn để xây dựng mạng lưới của bạn!
          </p>
        </div>
      ) : (
        <div className="m-auto container">
          <div className="flex my-4">
            <div className="m-auto bg-[#1f242e] w-[60%] rounded-lg h-[46px] pr-3 flex items-center justify-between focus-within:outline-[#00CFFF] focus-within:outline focus-within:outline-1">
              {/* kính lúp */}
              <input
                className="bg-[transparent] text-white outline-none pl-3 w-[87%]"
                placeholder="Tìm kiếm bạn..."
              />
            </div>
          </div>
          <div className="w-full mt-2 grid gap-4 grid-cols-2">
            {friendList.map((request, index) => (
              <div
                key={request.id}
                className="rounded-lg border border-[#2A3540]/50 
             bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]
             text-[#F4F8FB] shadow-sm 
             hover:border-[#00BFFF]/30 transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8">
                        <PresenceAvatar
                          imgUrl={request.avatarURL}
                          status={request.status}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#E2E8F0]">
                          {request.displayname}
                        </h3>
                        <p className="text-sm text-[#94A3B8]">
                          {request.username}
                        </p>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {request.isBlock === 0 && (
                        <>
                          <button
                            onClick={() => handleBlock(index, request)}
                            className="border border-[#1F2933] bg-[#0D1218] hover:bg-[#B266FF] hover:text-[#0D1218] h-9 rounded-md px-3 gap-2 transition-colors"
                          >
                            Chặn
                          </button>

                          <button
                            onClick={() => handleDeleteFriend(request)}
                            className="bg-[#E44D4D] text-[#F4F8FB] hover:bg-[#E44D4D]/90 h-9 rounded-md px-3 gap-2 transition-colors"
                          >
                            Xóa bạn
                          </button>
                        </>
                      )}
                      {request.isBlock === currentUser.current?.id && (
                        <button
                          onClick={() => handleUnBlock(index, request)}
                          className="border border-[#1F2933] bg-[#0D1218] hover:bg-[#B266FF] hover:text-[#0D1218] h-9 rounded-md px-3 gap-2 transition-colors"
                        >
                          Bỏ chặn
                        </button>
                      )}
                      {request.isBlock !== 0 &&
                        request.isBlock !== currentUser.current?.id && (
                          <h1>Xem thêm</h1>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FriendList;
