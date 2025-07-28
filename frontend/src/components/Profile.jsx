import { useContext, useEffect, useRef, useState } from "react";
import PresenceAvatar from "./PresenceAvatar";
import { socketContext } from "../context/socketContext";
import { SvgEdit } from "../assets/icons/icons";
import Loading from "./Loading";
import profileAPI from "../services/profileAPI";
import { dialogBoxContext } from "../context/DialogBoxContext";
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

function Profile({ setShowProfile, currentFriend }) {
  console.log(currentFriend);
  const { currentUser, getFriendShipsRef } = useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);
  const [profileUser, setProfileUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    if (currentFriend) {
      setProfileUser(currentFriend);
    } else {
      setProfileUser(currentUser.current);
    }
  }, [currentUser.current]);

  async function handlechangeImage(e, type) {
    const file = e.target.files[0];
    if (file) {
      const response = await profileAPI.changeImage(file, type);
      if (response.status == 200) {
        const { filePath } = await response.json();
        getFriendShipsRef.current?.();
        currentUser.current = {
          ...currentUser.current,
          [type]: filePath,
        };
      } else {
        getDialogBox("Cập nhật ảnh đại diện thất bại", "notify");
      }
    }
  }

  function handleKeyDownNote(e) {
    if (e.key === "Enter") {
      console.log("xu li");
    }
    if (e.key === "Enter" && e.shiftKey) {
    }
  }

  return (
    <div className="fixed w-full h-full flex top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]">
      <div
        onClick={() => setShowProfile(false)}
        className="absolute w-full h-full bg-black/65"
      ></div>
      <div className="relative p-4 w-full max-w-2xl max-h-full m-auto ">
        {/* <!-- Modal content --> */}
        <div className="flex flex-col justify-between bg-[#242429] w-[85vh] h-[90vh] rounded-xl overflow-hidden shadow-sm dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="relative h-[210px] bg-pink-600">
            {profileUser?.backgroundURL && (
              <img
                className="hover:opacity-65 cursor-pointer w-full h-full"
                src={`${API_SERVER_URL}${
                  profileUser?.backgroundURL
                }?cb=${Math.random()}`}
              />
            )}
            <div className="group absolute bottom-[-20%] left-6 w-[123px] h-[123px] rounded-full cursor-pointer">
              <div className="group-hover:flex absolute z-20 w-full h-full bg-black/25 rounded-full hidden"></div>
              <PresenceAvatar
                imgUrl={profileUser?.avatarURL}
                status={profileUser?.status}
              />
            </div>
          </div>
          {/* <!-- Modal body --> */}
          <div className="flex-1 px-4 mt-20 text-white">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold">{profileUser?.displayname}</p>
              {!currentFriend && (
                <button
                  onClick={() => setShowEdit(!showEdit)}
                  onBlur={() => setShowEdit(false)}
                  className="relative outline-none flex items-center bg-[#5663ec] text-white hover:bg-[#4451b9] hover-text-[#fefefe] cursor-pointer rounded-lg px-5 py-2"
                >
                  <SvgEdit width={20} height={20} className="mr-1" />
                  Chỉnh sửa
                  <div
                    className={`absolute ${
                      showEdit
                        ? "w-40 border border-[#303136]"
                        : "w-0 h-0 overflow-hidden"
                    } text-left top-0 right-[107%] z-10 bg-[#2c2d32] rounded-lg py-2`}
                  >
                    <div>
                      <p
                        onClick={(e) =>
                          document.getElementById("changeAvatar").click()
                        }
                        className="cursor-pointer p-2 text-[#aaaab1] hover:bg-[#34353a] hover:text-white"
                      >
                        Đổi ảnh đại diện
                      </p>
                      <input
                        type="file"
                        id="changeAvatar"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handlechangeImage(e, "avatarURL")}
                      />
                    </div>
                    <div>
                      <p
                        onClick={(e) =>
                          document.getElementById("changeBackground").click()
                        }
                        className="cursor-pointer p-2 text-[#aaaab1] hover:bg-[#34353a] hover:text-white"
                      >
                        Đổi ảnh nền
                      </p>
                      <input
                        type="file"
                        id="changeBackground"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handlechangeImage(e, "backgroundURL")}
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>
            <p className="text-sm">{profileUser?.username}</p>
            <p className="text-xs font-semibold mt-5 mb-2">Tham gia từ</p>
            <p className="text-sm">7/5/2025</p>
            {currentFriend && (
              <>
                <p className="text-xs font-semibold mt-5 mb-2">
                  Ghi chú (chỉ có bạn nhìn thấy)
                </p>
                <textarea
                  onKeyDown={(e) => handleKeyDownNote(e)}
                  placeholder="Nhấn vào để ghi chú"
                  className="w-full h-auto rounded-lg overflow-hidden pl-2 text-sm bg-transparent focus:bg-black outline-[#303136] border-none focus:outline"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
