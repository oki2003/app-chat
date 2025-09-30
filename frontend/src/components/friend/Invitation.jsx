import { useEffect, useState } from "react";
import friendAPI from "../../services/friendAPI";
import PresenceAvatar from "../PresenceAvatar";

function Invitation() {
  const [invitationList, setInvitationList] = useState([]);

  async function getInvitationsList() {
    const response = await friendAPI.getInvitations();
    const data = await response.json();
    setInvitationList(data.data);
  }

  async function ignoreFriendRequest(id) {
    const oldInvitationList = invitationList;
    setInvitationList(invitationList.filter((item) => item.id !== id));
    const response = await friendAPI.ignoreFriendRequest(id);
    if (response.status === 200) {
      return;
    } else {
      setInvitationList([...oldInvitationList]);
      alert("Từ chối kết bạn thất bại.");
    }
  }

  async function acceptFriendRequest(id) {
    const oldInvitationList = invitationList;
    setInvitationList(invitationList.filter((item) => item.id !== id));
    const response = await friendAPI.acceptFriendRequest(id);
    if (response.status === 200) {
      return;
    } else if (response.status === 404) {
      const data = await response.json();
      alert(data.message);
    } else {
      setInvitationList([...oldInvitationList]);
      alert("Chấp nhận kết bạn thất bại.");
    }
  }

  useEffect(() => {
    getInvitationsList();
  }, []);

  return (
    <div className="flex">
      {invitationList.length === 0 ? (
        <div className="m-auto text-center py-12">
          {/* <Clock className="h-16 w-16 mx-auto text-[#99A3B0] mb-4" /> */}
          <p className="text-lg text-[#99A3B0]">Không có lời mời kết bạn</p>
          <p className="text-sm text-[#99A3B0]">
            Các yêu cầu kết bạn đến sẽ hiển thị ở đây.
          </p>
        </div>
      ) : (
        <div className="m-auto container grid gap-4 grid-cols-2">
          {invitationList.map((request) => (
            <div
              key={request.id}
              className="rounded-lg border border-[#2A3540]/50 
             bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]
             text-[#F4F8FB] shadow-sm 
             hover:border-[#22C55E]/30 transition-all duration-300"
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptFriendRequest(request.id)}
                      className="text-sm h-9 rounded-lg px-3 gap-2 bg-[#22C55E] text-white hover:bg-[#16A34A] transition-colors"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => ignoreFriendRequest(request.id)}
                      className="text-sm border border-[#2A3540] bg-[#0F172A] hover:bg-[#334155] 
                     hover:text-[#F4F8FB] h-9 rounded-lg px-3 gap-2 transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Invitation;
