import { SvgFriend } from "../../assets/icons/icons";

function FriendHeader({ showLayout, setShowLayout, pendingFriends }) {
  return (
    <div className="flex items-center p-2 mx-2 text-white border-b border-[#313136]">
      <SvgFriend width={24} height={24} />

      <span>Bạn bè</span>
      <div className=" bg-white w-1 h-1 rounded-full mx-3"></div>

      <button
        onClick={() => setShowLayout(2)}
        className={`outline-none px-2 py-1 mr-3 rounded-md ${
          showLayout === 2
            ? "bg-[#333338] text-white cursor-default"
            : "text-[#b0bacd] hover:text-white hover:bg-[#333338]"
        } 
            ${
              pendingFriends.pendingSent?.length === 0 &&
              pendingFriends.pendingReceive?.length === 0 &&
              "hidden"
            }
          `}
      >
        Chờ duyệt
      </button>

      <button
        onClick={() => setShowLayout(1)}
        className={`outline-none px-2 py-1 rounded-md ${
          showLayout === 1
            ? "bg-[#242640] text-[#8a9fff] cursor-default"
            : "bg-[#5865f2] text-white cursor-pointer hover:bg-[#4654c0]"
        }`}
      >
        Thêm bạn
      </button>
    </div>
  );
}

export default FriendHeader;
