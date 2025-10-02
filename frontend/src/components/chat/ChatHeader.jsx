import PresenceAvatar from "../PresenceAvatar";
import SvgVoiceCall from "../../assets/icons/SvgVoiceCall";
import SvgVideoCall from "../../assets/icons/SvgVideoCall";
import SvgInfo from "../../assets/icons/SvgInfo";
import { useContext, useEffect, useState } from "react";
import { socketContext } from "../../context/socketContext";
import { dialogBoxContext } from "../../context/DialogBoxContext";
import Video from "./Video";

function ChatHeader({ friend, setShowSideChat, showSideChat }) {
  const [showCall, setShowCall] = useState(false);
  const [type, setType] = useState("voice");
  const { socket, currentUser, infoCall } = useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);

  function makeCall(type) {
    setShowCall(true);
    setType(type);
    socket.send(
      JSON.stringify({
        type: "Init Call Connection",
        to: friend.id,
        data: {
          typeCall: type,
          displayname: currentUser.current.displayname,
          avatarURL: currentUser.current.avatarURL,
        },
        id: friend.friendshipsID,
      })
    );
  }

  useEffect(() => {
    if (infoCall) {
      setShowCall(true);
    }
  }, [infoCall]);

  const handler = (e) => {
    if (e.detail.data.message === "Reject Call Connection") {
      setShowCall(false);
      getDialogBox("Người này đã từ chối cuộc gọi", "notify");
    }
  };

  useEffect(() => {
    document.addEventListener("WebSocketEvent", handler);
    return () => document.removeEventListener("WebSocketEvent", handler);
  }, []);

  return (
    <div className="p-6 space-y-0 pb-3 border-b border-[#2A35407F]">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8">
            <PresenceAvatar imgUrl={friend.avatarURL} status={friend.status} />
          </div>
          <div>
            <h3 className="font-semibold">{friend.displayname}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {friend.isBlock === 0 && !showCall && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => makeCall("voice")}
                className="group flex hover:bg-[#C266FF] w-10 h-10 rounded-lg transition-all"
              >
                <SvgVoiceCall
                  width={17}
                  height={17}
                  className="m-auto text-white group-hover:text-black transition-all"
                />
              </button>
              <button
                onClick={() => makeCall("video")}
                className="group flex hover:bg-[#C266FF] w-10 h-10 rounded-lg transition-all"
              >
                <SvgVideoCall
                  width={18}
                  height={18}
                  className="m-auto text-white group-hover:text-black transition-all"
                />
              </button>
            </div>
          )}
          <button
            onClick={() => setShowSideChat(!showSideChat)}
            className="group flex hover:bg-[#C266FF] w-10 h-10 rounded-lg transition-all"
          >
            <SvgInfo
              width={17}
              height={17}
              className="m-auto text-white group-hover:text-black transition-all"
            />
          </button>
        </div>
      </div>

      {showCall && (
        <Video
          type={type}
          currentFriend={friend}
          // isSend={showCall.isSend}
          // isReceive={showCall.isReceive}
          setShowCall={setShowCall}
        />
      )}
    </div>
  );
}

export default ChatHeader;
