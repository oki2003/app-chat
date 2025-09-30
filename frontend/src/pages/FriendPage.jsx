import SvgFriend from "../assets/icons/SvgFriend";
import { Link, Outlet, useLocation } from "react-router-dom";

function FriendPage() {
  const location = useLocation();

  return (
    <div className="flex">
      <div className="w-[60%] m-auto">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#4CC9F0] via-[#4361EE] to-[#7209B7]">
            Network Hub
          </h1>

          <p className="text-[#99A3B0] mt-2">
            Quản lý các mối quan hệ của bạn.
          </p>
        </div>
        <div className="flex mb-2">
          <div className="flex m-auto p-1 container bg-[#1f242e] text-[#95aab3] rounded-xl">
            <Link
              className={`flex rounded-lg flex-1 items-center justify-center h-9 ${
                (location.pathname === "/friends" ||
                  location.pathname === "/") &&
                "bg-[#111111] text-white"
              }`}
              to="/friends"
            >
              <SvgFriend width={24} height={24} />
              Bạn bè
            </Link>
            <Link
              className={`flex rounded-lg flex-1 items-center justify-center h-9 ${
                location.pathname === "/friends/add" &&
                "bg-[#111111] text-white"
              }`}
              to="/friends/add"
            >
              Thêm bạn
            </Link>
            <Link
              className={`flex rounded-lg flex-1 items-center justify-center h-9 ${
                location.pathname === "/friends/sent" &&
                "bg-[#111111] text-white"
              }`}
              to="/friends/sent"
            >
              Đã gửi
            </Link>
            <Link
              className={`flex rounded-lg flex-1 items-center justify-center h-9 ${
                location.pathname === "/friends/invitations" &&
                "bg-[#111111] text-white"
              }`}
              to="/friends/invitations"
            >
              Lời mời
            </Link>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default FriendPage;
