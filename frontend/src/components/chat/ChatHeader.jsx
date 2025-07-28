import PresenceAvatar from "../PresenceAvatar";
import { SvgInfo, SvgVideoCall, SvgVoiceCall } from "../../assets/icons/icons";
import { socketContext } from "../../context/socketContext";
import { useContext, useEffect, useState } from "react";
import Video from "./Video";

function ChatHeader({ currentFriend, id, setShowSideChat, showSideChat }) {
  const { makeCallRef } = useContext(socketContext);
  const [type, setType] = useState("video");
  const [showCall, setShowCall] = useState({
    isShow: false,
    isSend: true,
    isReceive: false,
  });

  async function makeCall(type, call) {
    setType(type);
    setShowCall(call || { isShow: true, isSend: true, isReceive: false });
  }

  useEffect(() => {
    if (showCall.isShow) {
      setShowSideChat(false);
    }
  }, [showCall]);

  useEffect(() => {
    if (makeCallRef.current) {
      makeCall(makeCallRef.current, {
        isShow: true,
        isSend: false,
        isReceive: true,
      });
    }
  }, [makeCallRef.current]);

  return (
    <header
      className={`h-auto text-white px-4 w-full border-b border-[#313136]`}
    >
      <div
        key={id}
        className="h-[65px] flex items-center justify-between w-full"
      >
        <div className="flex">
          <div className="w-[30px] h-[30px] mr-[12px]">
            <PresenceAvatar
              imgUrl={currentFriend?.avatarURL}
              status={currentFriend?.status}
            />
          </div>
          <h1 className="text-2xl font-semibold">
            {currentFriend?.displayname}
          </h1>
        </div>
        <div className="flex text-[#94959c]">
          {!showCall.isShow && currentFriend?.isBlock === 0 && (
            <div className="flex">
              <SvgVoiceCall
                width={18}
                height={18}
                className="mr-[22px] cursor-pointer hover:text-[#aaaab1]"
                onClick={() =>
                  makeCall({
                    video: false,
                    audio: true,
                  })
                }
              />
              <SvgVideoCall
                width={18}
                height={18}
                className="mr-[22px] cursor-pointer hover:text-[#aaaab1]"
                onClick={() =>
                  makeCall({
                    video: true,
                    audio: true,
                  })
                }
              />
            </div>
          )}
          <SvgInfo
            width={19}
            height={19}
            className={`cursor-pointer hover:text-[#aaaab1] ${
              showSideChat && "text-white"
            }`}
            onClick={() => setShowSideChat(!showSideChat)}
          />
        </div>
      </div>
      {showCall.isShow && (
        <Video
          type={type}
          currentFriend={currentFriend}
          isSend={showCall.isSend}
          isReceive={showCall.isReceive}
          setShowCall={setShowCall}
        />
      )}
    </header>
  );
}

export default ChatHeader;
