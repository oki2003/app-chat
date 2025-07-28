import { createContext, useRef, useState } from "react";
import PresenceAvatar from "../components/PresenceAvatar";
import { SvgCancelFriend, SvgVoiceCall } from "../assets/icons/icons";

export const dialogBoxContext = createContext();

export const DialogBoxProvider = ({ children }) => {
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("confirm");
  const [data, setData] = useState({});
  const resolveRef = useRef(null);

  async function getDialogBox(msg, tp, data) {
    setMessage(msg);
    setShowDialogBox(true);
    setType(tp);
    console.log({ ...data });
    setData({ ...data });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    }).then((value) => {
      setShowDialogBox(false);
      if (value === true) {
        return true;
      } else {
        return false;
      }
    });
  }
  return (
    <dialogBoxContext.Provider value={{ getDialogBox }}>
      {children}
      {showDialogBox && (
        <div className="overflow-y-auto overflow-x-hidden fixed w-full h-full flex bg-black/65 top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] justify-center items-center">
          <div className="flex relative p-4 w-full max-w-2xl max-h-full m-auto ">
            {/* <!-- Modal content --> */}
            {type === "call" ? (
              <div className="m-auto flex flex-col items-center relative text-white bg-[#242429] w-[233px] h-[266px] rounded-lg shadow-sm dark:bg-gray-700">
                <div className="relative h-[90px] w-[90px] mt-[30px] mb-[10px]">
                  <div className="absolute animate-ping w-full h-full rounded-full bg-[#3f3f3f]"></div>
                  <PresenceAvatar imgUrl={data?.avatarURL} />
                </div>
                <p className="font-semibold text-2xl">{data.displayname}</p>
                <p className="text-base">Cuộc gọi tới...</p>
                <div className="flex w-36 justify-between mt-4">
                  <button
                    className="w-[66px] h-[50px] bg-[#d6363f] flex  rounded-xl"
                    onClick={() => resolveRef.current(false)}
                  >
                    <SvgCancelFriend
                      width={20}
                      height={20}
                      className="text-white m-auto"
                    />
                  </button>
                  <button
                    className="w-[66px] h-[50px] bg-[#43a25a] flex  rounded-xl"
                    onClick={() => resolveRef.current(true)}
                  >
                    <SvgVoiceCall
                      width={20}
                      height={20}
                      className="text-white m-auto"
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative bg-white w-[55vh] h-auto rounded-lg shadow-sm dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Thông báo
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"
                    onClick={() => setShowDialogBox(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only"></span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-4 md:p-5 space-y-4">
                  <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>
                {/* <!-- Modal footer --> */}
                {type === "confirm" ? (
                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      data-modal-hide="default-modal"
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => resolveRef.current(true)}
                    >
                      Đồng ý
                    </button>
                    <button
                      data-modal-hide="default-modal"
                      type="button"
                      className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      onClick={() => resolveRef.current(false)}
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                    <button
                      data-modal-hide="default-modal"
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={() => setShowDialogBox(false)}
                    >
                      Đã hiểu
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </dialogBoxContext.Provider>
  );
};
