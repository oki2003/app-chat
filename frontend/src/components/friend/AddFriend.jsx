import { useState } from "react";
import friendAPI from "../../services/friendAPI";
function AddFriend() {
  const [responseFriendRequest, setResponseFriendRequest] = useState({
    status: 0,
    message: "",
  });
  const [userNameRequest, setUserNameRequest] = useState("");

  async function sendFriendRequest() {
    if (userNameRequest === "") {
      return;
    }
    const response = await friendAPI.friendRequest(userNameRequest);

    if (response.status !== 403) {
      const data = await response.json();
      setResponseFriendRequest((prev) => ({
        status: response.status,
        message: data.message,
      }));
      setUserNameRequest("");
    }
  }

  return (
    <>
      <div className="flex">
        <div className="text-white px-[30px] py-[23px] w-full">
          <div>
            <div className="flex justify-between pr-5">
              <p className="font-normal mt-2 mb-4 flex items-end">
                Bạn có thể thêm bạn bè với tên đăng nhập.
              </p>
              <img alt="Wumpus Waving" src="../src/assets/Wumpus Waving.png" />
            </div>
            <div
              className={`bg-[#1e1f22] rounded-lg h-[46px] pr-3 flex items-center justify-between focus-within:outline-[#00CFFF] focus-within:outline focus-within:outline-1 ${
                responseFriendRequest?.status === 200
                  ? "border border-green-500"
                  : responseFriendRequest?.status === 0
                  ? ""
                  : "border border-red-500"
              }`}
            >
              <input
                className="bg-[#1e1f22] outline-none pl-3 w-[87%]"
                value={userNameRequest}
                placeholder="Bạn có thể kết bạn với tên đăng nhập của họ"
                onChange={(e) => {
                  setUserNameRequest(e.target.value);
                  setResponseFriendRequest((prev) => ({
                    status: 0,
                    message: "",
                  }));
                }}
              />
              <button
                disabled={userNameRequest === ""}
                onClick={() => sendFriendRequest()}
                className={`px-4 h-[30px] rounded-lg text-sm font-medium ${
                  userNameRequest === ""
                    ? "bg-[#3b428a] text-[#989893] cursor-not-allowed"
                    : "bg-[#5865f2] text-white"
                } `}
              >
                Kết bạn
              </button>
            </div>
            <p
              className={
                responseFriendRequest.status === 200
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {responseFriendRequest.message}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddFriend;
