import { useLocation, useNavigate } from "react-router-dom";
import PresenceAvatar from "../components/PresenceAvatar";
import friendAPI from "../services/friendAPI";
import { useState, useEffect, useContext } from "react";
import { socketContext } from "../context/socketContext";
import { SvgFriend, SvgShop } from "../assets/icons/icons";
import Profile from "../components/Profile";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { registerFriendShips, currentUser, setDataFriendShip } =
    useContext(socketContext);

  const [friendShips, setFriendShips] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  async function getFriendShips() {
    const response = await friendAPI.FriendShips();
    const data = await response.json();
    if (response.status !== 200) {
      alert(data.message);
    }
    setFriendShips(data.data);
    setDataFriendShip(data.data);
  }

  registerFriendShips(getFriendShips);

  useEffect(() => {
    getFriendShips();
  }, []);

  return (
    <div className="w-[15%] bg-[#121214] text-[#94959c] relative">
      <div className="flex p-4 items-center justify-center">
        <img
          src="/src/assets/logo.png"
          className="w-[40px] h-[40px] rounded-lg mr-4"
        />
        <span className="text-4xl text-white">FAC</span>
      </div>
      <div
        onClick={() => navigate("/dashboard/friend", { replace: true })}
        className={`flex p-2 mx-2 cursor-pointer mb-2 rounded-lg ${
          location.pathname === "/dashboard/friend"
            ? "bg-[#393939] text-white"
            : "transition duration-200 hover:bg-[#27272b] hover:text-white"
        }`}
      >
        <SvgFriend width={24} height={24} />
        <span>Bạn bè</span>
      </div>
      <div
        onClick={() => navigate("/dashboard/shop", { replace: true })}
        className={`flex p-2 mx-2 cursor-pointer mb-2 rounded-lg ${
          location.pathname === "/dashboard/shop"
            ? "bg-[#393939] text-white"
            : "transition duration-200 hover:bg-[#27272b] hover:text-white"
        }`}
      >
        <SvgShop width={24} height={24} />
        <span>Cửa hàng</span>
      </div>
      <div className="px-3">
        <div className="border-b border-gray-500"></div>
        <p className="flex p-2 mx-2 cursor-default mb-2 text-[#7f8089] font-medium">
          Direct message
        </p>
        {friendShips?.length > 0 && (
          <div>
            {friendShips.map((friendship) => (
              <div
                key={friendship.friendshipsID}
                className={`group h-[40px] rounded-lg p-3 flex items-center justify-between cursor-pointer mb-3 ${
                  location.pathname.startsWith(
                    `/dashboard/chat/${friendship.friendshipsID}`
                  )
                    ? "bg-[#393939] text-white"
                    : "transition duration-200 hover:bg-[#27272b] hover:text-white"
                }`}
                onClick={() => {
                  navigate(`/dashboard/chat/${friendship.friendshipsID}`, {
                    replace: true,
                  });
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-[30px] h-[30px] mr-[12px]">
                    <PresenceAvatar
                      imgUrl={friendship.avatarURL}
                      status={friendship.status}
                    />
                  </div>
                  <p
                    className={`${
                      location.pathname.startsWith(
                        `/dashboard/chat/${friendship.friendshipsID}`
                      )
                        ? "text-white"
                        : "text-[#a1a2a9]"
                    }`}
                  >
                    {friendship.displayname}
                  </p>
                </div>
                {friendship.unreadMessages > 0 &&
                  friendship.userIdReceive !== friendship.id && (
                    <div className="flex text-xs bg-red-600 w-5 h-5 rounded-full">
                      <span className="m-auto text-white">
                        {friendship.unreadMessages}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        onClick={() => setShowProfile(true)}
        className="group bg-[#202024] cursor-pointer w-[90%] pl-3 absolute bottom-[10px] left-[50%] translate-x-[-50%] h-[57px] rounded-lg flex items-center"
      >
        <div className="flex items-center w-[90%] rounded-l-full group-hover:bg-[#37373b]">
          <div className="w-[40px] h-[40px]">
            <PresenceAvatar
              imgUrl={currentUser.current?.avatarURL}
              status={true}
            />
          </div>
          <div className="pl-4 h-[40px] rounded-r-full group-hover:bg-[#37373b]">
            <p className="text-white">{currentUser.current?.displayname}</p>
            <div className="">
              <p className="text-xs group-hover:translate-y-[-100%] duration-200 group-hover:opacity-0">
                Online
              </p>
              <p className="opacity-0 text-xs group-hover:translate-y-[-100%] duration-200 group-hover:opacity-100">
                {currentUser.current?.username}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-r-full group-hover:bg-[#37373b] w-2 h-[40px]"></div>
      </div>
      {showProfile && <Profile setShowProfile={setShowProfile} />}
    </div>
  );
}

export default Sidebar;
