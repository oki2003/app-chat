import { useEffect, useState } from "react";
import friendAPI from "../../services/friendAPI";
import PresenceAvatar from "../PresenceAvatar";

function PendingFriend({ pendingFriends, setPendingFriends, setShowPending }) {
  const [pendingList, setPendingList] = useState([]);

  async function getPendingFriends() {
    const response = await friendAPI.getPendings();
    const data = await response.json();
    setPendingList(data.data);
  }

  useEffect(() => {
    getPendingFriends();
  }, []);

  async function cancelFriendRequest(id, displayname) {
    const oldPendingList = pendingList;
    setPendingList(pendingList.filter((item) => item.id !== id));
    const response = await friendAPI.cancelFriendRequest(id, displayname);
    if (response.status === 200) {
      return;
    } else if (response.status === 409) {
      const data = await response.json();
      alert(data.message);
    } else {
      setPendingList([...oldPendingList]);
    }
  }

  return (
    <div className="flex">
      {pendingList.length === 0 ? (
        <div className="m-auto text-center py-12">
          {/* <Clock className="h-16 w-16 mx-auto text-[#99A3B0] mb-4" /> */}
          <p className="text-lg text-[#99A3B0]">Không có yêu cầu chờ xử lý</p>
          <p className="text-sm text-[#99A3B0]">
            Yêu cầu kết bạn bạn đã gửi sẽ hiển thị ở đây.
          </p>
        </div>
      ) : (
        <div className="m-auto container grid gap-4 grid-cols-2">
          {pendingList.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-[#2A3540]/50 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-[#F4F8FB] shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      <PresenceAvatar
                        imgUrl={request.avatarURL}
                        status={false}
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
                  <div className="inline-flex items-center rounded-full border border-[#FACC15]/30 bg-[#FACC15]/20 px-2.5 py-0.5 text-xs font-semibold text-[#FACC15] transition-colors">
                    Pending
                  </div>

                  <button
                    onClick={() =>
                      cancelFriendRequest(request.id, request.displayname)
                    }
                    className="text-sm border border-[#2A3540] bg-[#0F172A] hover:bg-[#334155] hover:text-[#F4F8FB] h-9 rounded-md px-3 gap-2 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingFriend;
