import { useEffect, useState } from "react";
import { iconFile } from "../../assets/icons/icons";
import Profile from "../Profile";
const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

function SideChat({ dataMessages, id, currentFriend, setShowSideChat }) {
  const [imgList, setImgList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const imgArr = [];
    const fileArr = [];
    const linkArr = [];
    dataMessages?.forEach((item) => {
      if (item.typeId === 7) {
        imgArr.push(item);
      }
      if (
        item.typeId === 2 ||
        item.typeId === 3 ||
        item.typeId === 4 ||
        item.typeId === 5 ||
        item.typeId === 6
      ) {
        fileArr.push(item);
      }
      if (
        item.content.startsWith("http://") ||
        item.content.startsWith("https://")
      ) {
        linkArr.push(item);
      }
    });
    setImgList(imgArr.reverse());
    setFileList(fileArr.reverse());
    setLinkList(linkArr.reverse());
  }, [dataMessages]);

  return (
    <div className="w-[40%] h-[100%] absolute top-0 right-0 bg-gradient-to-br from-[#0D1218] to-[#1F2730]">
      <div className="flex items-center text-center px-[30px] py-[23px] h-[65px] border-b border-[#313136]">
        <button
          onClick={() => setShowSideChat(false)}
          className="group flex hover:bg-[#C266FF] w-10 h-10 rounded-lg transition-all"
        >
          <span className="m-auto group-hover:text-black transition-all">
            X
          </span>
        </button>
        <p className=" flex-1 text-2xl text-white font-semibold">
          Thông tin hội thoại
        </p>
      </div>
      <div
        className="px-[10px] py-[23px] overflow-y-auto scroll-smooth h-[85%]
                          [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:rounded-full
                        [&::-webkit-scrollbar-thumb]:bg-[#60616a]"
      >
        <div className="text-white">
          <p>Ảnh/Video</p>
          {imgList.length === 0 ? (
            <p className="text-center text-[#bab3be] text-sm mt-3">
              Chưa có Ảnh/Video được chia sẻ trong hội thoại này.
            </p>
          ) : (
            <div className="mt-3 flex flex-wrap w-full justify-center">
              {imgList.map((item, index) => {
                if (index <= 7)
                  return (
                    <div
                      key={index}
                      className="group relative w-[75px] h-[75px] mb-4 mx-1 hover:cursor-pointer rounded-lg overflow-hidden"
                    >
                      <div className="absolute w-full h-full opacity-0 bg-black group-hover:opacity-45"></div>
                      <img
                        src={`${API_SERVER_URL}/api/showImg/${id}-${item.content.replace(
                          "storage\\",
                          ""
                        )}`}
                        alt="lỗi"
                        className="w-full h-full"
                      />
                    </div>
                  );
              })}
            </div>
          )}
          {imgList.length > 8 && (
            <button className=" bg-[#313131] hover:bg-[#393939] transition duration-200 rounded-lg w-full h-[38px]">
              Xem tất cả
            </button>
          )}
        </div>
        <div className="text-white mt-[33px]">
          <p>File</p>
          {fileList.length === 0 ? (
            <p className="text-center text-[#bab3be] text-sm mt-3">
              Chưa có File được chia sẻ trong hội thoại này.
            </p>
          ) : (
            <div className="mt-3 w-full ">
              {fileList.map((item, index) => {
                if (index <= 2)
                  return (
                    <div
                      key={index}
                      className="flex hover:cursor-pointer rounded-lg h-[65px] hover:bg-gray-600 mb-1 pl-3 items-center"
                    >
                      {iconFile[item.typeId]}
                      <p className="text-sm ml-3">
                        {item.content.split("-")[1]}
                      </p>
                    </div>
                  );
              })}
              {fileList.length > 3 && (
                <button className=" bg-[#313131] hover:bg-[#393939] transition duration-200 rounded-lg w-full h-[38px]">
                  Xem tất cả
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-white mt-[33px]">
          <p>Link</p>
          {linkList.length === 0 ? (
            <p className="text-[#bab3be] text-sm mt-3 text-center">
              Chưa có Link được chia sẻ trong hội thoại này.
            </p>
          ) : (
            <div className="mt-3 w-full ">
              {linkList.map((item, index) => {
                if (index <= 2)
                  return (
                    <div
                      key={index}
                      className="flex hover:cursor-pointer rounded-lg h-[50px] hover:bg-gray-600 items-center"
                    >
                      <a
                        href={`${item.content}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm ml-3"
                      >
                        {item.content}
                      </a>
                    </div>
                  );
              })}
            </div>
          )}
          {linkList.length > 3 && (
            <button className=" bg-[#313131] hover:bg-[#393939] transition duration-200 rounded-lg w-full h-[38px]">
              Xem tất cả
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowProfile(true)}
        className="absolute bottom-0 w-full text-[#b1b1b8] text-sm text-center h-[45px] border-t border-[#313136] hover:text-white"
      >
        Xem trang cá nhân
      </button>
      {showProfile && (
        <Profile
          setShowProfile={setShowProfile}
          currentFriend={currentFriend}
        />
      )}
    </div>
  );
}

export default SideChat;
