import { useContext, useRef, useState } from "react";
import { socketContext } from "./socketContext";
import { dialogBoxContext } from "./DialogBoxContext";
import { useNavigate } from "react-router-dom";

export const SocketProvider = ({ children }) => {
  const navigate = useNavigate();
  const { getDialogBox } = useContext(dialogBoxContext);
  // pendingfriend in FriendLayout
  const getPendingFriendRef = useRef(null);
  //Sidebar
  const getFriendShipsRef = useRef(null);
  const [dataFriendShip, setDataFriendShip] = useState([]);
  //ChatLayout
  const getDataMessageRef = useRef(null);
  //Signin, Signup, Dashboard
  const currentUser = useRef(null);
  //Video
  const makeCallRef = useRef(null);
  const acceptCallRef = useRef(null);
  const receiveOfferRef = useRef(null);
  const receiveAnswerRef = useRef(null);
  const addIceCandidateRef = useRef(null);
  const endCallRef = useRef(null);
  const cameraFriendRef = useRef(null);
  const micFriendRef = useRef(null);

  const registerAcceptCall = (callback) => {
    acceptCallRef.current = callback;
  };

  const registerReceiveOffer = (callback) => {
    receiveOfferRef.current = callback;
  };

  const registerReceiveAnswer = (callback) => {
    receiveAnswerRef.current = callback;
  };

  const registerAddIceCandidate = (callback) => {
    addIceCandidateRef.current = callback;
  };

  const registerEndCall = (callback) => {
    endCallRef.current = callback;
  };

  const registerPendingFriend = (callback) => {
    getPendingFriendRef.current = callback;
  };

  const registerFriendShips = (callback) => {
    getFriendShipsRef.current = callback;
  };

  const registerDataMessages = (callback) => {
    getDataMessageRef.current = callback;
  };

  const [isConnectSocket, setConnectSocket] = useState(false);
  const [socket, setSocket] = useState(null);

  if (isConnectSocket && socket === null) {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "Add client",
        })
      );
    };
    ws.onmessage = async (event) => {
      const parsedEvent = JSON.parse(event.data);
      const message = parsedEvent.message;
      if (message === "Get Pendings") {
        getPendingFriendRef.current?.();
      }
      if (message === "Get FriendShips") {
        getFriendShipsRef.current?.();
      }
      if (message === "offline" || message === "online") {
        getFriendShipsRef.current?.();
      }
      if (message === "Receive New Message") {
        getFriendShipsRef.current?.();
        getDataMessageRef.current?.();
      }
      if (message === "Init Call Connection") {
        const currentFriend = dataFriendShip?.find(
          (friend) => parseInt(friend.id) === parsedEvent.idFrom
        );
        const response = await getDialogBox("", "call", currentFriend);
        if (response === true) {
          makeCallRef.current = parsedEvent.data;
          navigate(`/dashboard/chat/${currentFriend.friendshipsID}`, {
            replace: true,
          });
        } else {
          ws.send(
            JSON.stringify({
              type: "Reject Call Connection",
              to: parsedEvent.idFrom,
            })
          );
        }
      }
      if (message === "Reject Call Connection") {
        getDialogBox("Người này đã từ chối cuộc gọi", "notify");
        endCallRef.current?.();
      }
      if (message === "Accept Call Connection") {
        acceptCallRef.current?.(parsedEvent);
      }
      if (message === "Send Offer") {
        receiveOfferRef.current?.(parsedEvent.data);
      }
      if (message === "Send Answer") {
        receiveAnswerRef.current?.(parsedEvent.data);
      }
      if (message === "Ice Candidate") {
        addIceCandidateRef.current?.(parsedEvent.data);
      }
      if (message === "End Call") {
        endCallRef.current?.();
      }
      if (message === "Change Camera") {
        cameraFriendRef.current?.(parsedEvent.data);
      }
      if (message === "Change Mic") {
        micFriendRef.current?.(parsedEvent.data);
      }
    };
    setSocket(ws);
  }

  return (
    <socketContext.Provider
      value={{
        setConnectSocket,
        registerPendingFriend,
        registerFriendShips,
        registerDataMessages,
        getPendingFriendRef,
        getFriendShipsRef,
        dataFriendShip,
        setDataFriendShip,
        currentUser,
        socket,
        makeCallRef,
        registerAcceptCall,
        registerReceiveOffer,
        registerReceiveAnswer,
        registerAddIceCandidate,
        registerEndCall,
        cameraFriendRef,
        micFriendRef,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};
