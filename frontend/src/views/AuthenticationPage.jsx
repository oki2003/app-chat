import { useEffect } from "react";
import Signin from "../layout/Signin";
import Signup from "../layout/Signup";
import { useState } from "react";
import accountAPI from "../services/accountAPI";
import { useNavigate } from "react-router";

function Authentication() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(true);

  useEffect(() => {
    async function authUser() {
      const response = await accountAPI.auth();
      if (response.status === 200) {
        navigate("/Dashboard/friend", { replace: true });
      }
    }
    authUser();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">FUN AND CHAT</h2>

              <p className="max-w-xl mt-3 text-gray-300">
                Ứng dụng chat của chúng tôi giúp bạn kết nối dễ dàng với bạn bè,
                chia sẻ những khoảnh khắc vui vẻ và tận hưởng từng cuộc trò
                chuyện. Dù ở bất cứ đâu, bạn vẫn luôn cảm thấy gần gũi và ấm áp
                như đang trò chuyện trực tiếp.
              </p>
            </div>
          </div>
        </div>
        {login ? (
          <Signin setLogin={setLogin} navigate={navigate} />
        ) : (
          <Signup setLogin={setLogin} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

export default Authentication;
