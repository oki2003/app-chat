import { useState } from "react";
import accountAPI from "../services/accountAPI";
import { socketContext } from "../context/socketContext";
import { useContext } from "react";

function Signin({ setLogin, navigate }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { currentUser } = useContext(socketContext);

  async function handleSignin(e) {
    e.preventDefault();
    if (userName === "" || password === "") {
      alert("Không được để trống.");
    } else {
      const response = await accountAPI.signIn(userName, password);
      const data = await response.json();
      if (response.status === 200) {
        alert(data.message);
        currentUser.current = data.currentUser;
        navigate("/Dashboard/friend", { replace: true });
      } else if (response.status === 401) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    }
  }

  return (
    <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
      <div className="flex-1">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
            FAC
          </h2>

          <p className="mt-3 text-gray-500 dark:text-gray-300">
            Đăng nhập để bắt đầu cuộc trò chuyện
          </p>
        </div>

        <div className="mt-8">
          <form>
            <div>
              <input
                type="email"
                name="username"
                id="username"
                placeholder="Tên đăng nhập"
                onChange={(e) => setUserName(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-6">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-6">
              <button
                onClick={(e) => handleSignin(e)}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-center text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <span
              className="text-blue-500 focus:outline-none focus:underline hover:underline cursor-pointer"
              onClick={() => setLogin(false)}
            >
              Đăng kí
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
