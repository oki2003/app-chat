import { useState } from "react";
import { useContext } from "react";
import accountAPI from "../services/accountAPI";
import { socketContext } from "../context/socketContext";
import { useNavigate } from "react-router";
import { containsVietnameseChars } from "../utils/calculator";

function Register() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const { currentUser } = useContext(socketContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (displayName.length > 30) {
      alert("Tên hiện thị không quá 30 kí tự");
    } else if (containsVietnameseChars(userName)) {
      alert("Tên đăng nhập không được chứa dấu tiếng việt");
    } else if (userName.length > 20) {
      alert("Tên đăng nhập không quá 20 kí tự");
    } else if (containsVietnameseChars(password)) {
      alert("Mật khẩu không được chứa dấu tiếng việt");
    } else if (password !== rePassword) {
      alert("Mật khẩu nhập lại không trùng khớp");
    } else {
      const response = await accountAPI.signUp(userName, displayName, password);
      const data = await response.json();
      if (response.status === 200) {
        currentUser.current = data.currentUser;
        navigate("/", { replace: true });
      } else {
        alert(data.message);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="rounded-lg border bg-[#0D1218] text-[#F4F8FB] shadow-sm w-full max-w-md bg-[#0D1218]/50 backdrop-blur-sm border-[#00CFFF33]">
        <div className="flex flex-col p-6 space-y-1">
          <h3 className="leading-none tracking-tight text-2xl font-bold text-center bg-gradient-to-r from-[#00CFFF] to-[#C266FF] bg-clip-text text-transparent">
            Tạo tài khoản mới
          </h3>
          <p className="text-sm text-[#99A3B0] text-center">
            Nhanh chóng và dễ dàng
          </p>
        </div>
        <div className="p-6 pt-0">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullname">Tên hiện thị</label>
              <input
                type="text"
                placeholder="Tên hiện thị"
                className="h-10 w-full rounded-md border border-[#1F2730] bg-[#0A0E13] px-3 py-2 text-sm placeholder:text-[#99A3B0] bg-[#0A0E13]/50 focus:border-[#00CFFF] focus:outline-none"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                autoComplete="username"
                placeholder="Tên đăng nhập"
                className="h-10 w-full rounded-md border border-[#1F2730] bg-[#0A0E13] px-3 py-2 text-sm placeholder:text-[#99A3B0] bg-[#0A0E13]/50 focus:border-[#00CFFF] focus:outline-none"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Mật khẩu mới"
                className="h-10 w-full rounded-md border border-[#1F2730] bg-[#0A0E13] px-3 py-2 text-sm placeholder:text-[#99A3B0] bg-[#0A0E13]/50 focus:border-[#00CFFF] focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Xác nhận mật khẩu</label>
              <input
                type="password"
                autoComplete="new-password"
                placeholder="Xác nhận mật khẩu"
                className="h-10 w-full rounded-md border border-[#1F2730] bg-[#0A0E13] px-3 py-2 text-sm placeholder:text-[#99A3B0] bg-[#0A0E13]/50 focus:border-[#00CFFF] focus:outline-none"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="rounded-md text-sm font-medium transition-all duration-300 text-[#0A0E13] h-10 px-4 py-2 w-full bg-gradient-to-r from-[#00CFFF] to-[#C266FF] hover:from-[#00CFFF]/90 hover:to-[#C266FF]/90"
            >
              Đăng kí
            </button>
            <div className="text-center text-sm text-[#99A3B0]">
              <span>Bạn đã có tài khoản?</span>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="ml-2 text-[#00CFFF] hover:text-[#C266FF] transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
