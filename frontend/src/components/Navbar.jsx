import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  return (
    <nav className="border-b border-[#2A3540] bg-[#0D1218] fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center text-2xl font-bold bg-gradient-to-r from-[#00CFFF] to-[#C266FF] bg-clip-text text-transparent">
            <img
              src="/src/assets/logo.png"
              className="w-[40px] h-[40px] rounded-lg mr-4"
            />
            TechSocial
          </div>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/"
                  ? "bg-[#00CFFF] text-[#0A0E13] shadow-[0_0_20px_#00CFFF4D]"
                  : "text-[#99A3B0] hover:text-[#F4F8FB] hover:bg-[#1F2730]"
              }`}
            >
              <span className="font-medium">Tin tức</span>
            </Link>
            <Link
              to="/friends"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname.includes("/friends")
                  ? "bg-[#00CFFF] text-[#0A0E13] shadow-[0_0_20px_#00CFFF4D]"
                  : "text-[#99A3B0] hover:text-[#F4F8FB] hover:bg-[#1F2730]"
              }`}
            >
              <span className="font-medium">Bạn bè</span>
            </Link>
            <Link
              to="/shop"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/shop"
                  ? "bg-[#00CFFF] text-[#0A0E13] shadow-[0_0_20px_#00CFFF4D]"
                  : "text-[#99A3B0] hover:text-[#F4F8FB] hover:bg-[#1F2730]"
              }`}
            >
              <span className="font-medium">Cửa hàng</span>
            </Link>
            <Link
              to="/chat"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                location.pathname === "/chat"
                  ? "bg-[#00CFFF] text-[#0A0E13] shadow-[0_0_20px_#00CFFF4D]"
                  : "text-[#99A3B0] hover:text-[#F4F8FB] hover:bg-[#1F2730]"
              }`}
            >
              <span className="font-medium">Trò chuyện</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
