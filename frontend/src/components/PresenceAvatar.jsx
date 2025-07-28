const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

function PresenceAvatar({ imgUrl, status, isLocal }) {
  return (
    <div className={"relative items-center w-full h-full overflow-hidden"}>
      <img
        src={
          isLocal
            ? `${imgUrl}`
            : `${API_SERVER_URL}${imgUrl}?cb=${Math.random()}`
        }
        className="w-full h-full rounded-full"
      />
      {status === true && (
        <div className="absolute bottom-[-1px] right-1  w-[20%] h-[20%] bg-green-500 rounded-full"></div>
      )}
    </div>
  );
}

export default PresenceAvatar;
