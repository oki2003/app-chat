import { useRef, useState } from "react";
import { socketContext } from "./socketContext";
const WS_SERVER_URL = import.meta.env.VITE_WS_SERVER_URL;

export const SocketProvider = ({ children }) => {
  const currentUser = useRef(null);
  const [infoCall, setInfoCall] = useState(null);

  const [isConnectSocket, setConnectSocket] = useState(false);
  const [socket, setSocket] = useState(null);

  if (isConnectSocket && socket === null) {
    const ws = new WebSocket(WS_SERVER_URL);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "Add client",
        })
      );
    };

    let myEvent = new CustomEvent("WebSocketEvent", {
      detail: { data: null },
    });

    ws.onmessage = async (event) => {
      const parsedEvent = JSON.parse(event.data);
      myEvent.detail.data = parsedEvent;
      document.dispatchEvent(myEvent);
    };
    setSocket(ws);
  }

  return (
    <socketContext.Provider
      value={{
        setConnectSocket,
        socket,
        currentUser,
        infoCall,
        setInfoCall,
      }}
    >
      {children}
    </socketContext.Provider>
  );
};

// Socket with Video call - i will update later

//   if (message === "Init Call Connection") {
//     const currentFriend = dataFriendShip?.find(
//       (friend) => parseInt(friend.id) === parsedEvent.idFrom
//     );
//     const response = await getDialogBox("", "call", currentFriend);
//     if (response === true) {
//       makeCallRef.current = parsedEvent.data;
//       navigate(`/dashboard/chat/${currentFriend.friendshipsID}`, {
//         replace: true,
//       });
//     } else {
//       ws.send(
//         JSON.stringify({
//           type: "Reject Call Connection",
//           to: parsedEvent.idFrom,
//         })
//       );
//     }
//   }
//   if (message === "Reject Call Connection") {
//     getDialogBox("Người này đã từ chối cuộc gọi", "notify");
//     endCallRef.current?.();
//   }
//   if (message === "Accept Call Connection") {
//     acceptCallRef.current?.(parsedEvent);
//   }
//   if (message === "Send Offer") {
//     receiveOfferRef.current?.(parsedEvent.data);
//   }
//   if (message === "Send Answer") {
//     receiveAnswerRef.current?.(parsedEvent.data);
//   }
//   if (message === "Ice Candidate") {
//     addIceCandidateRef.current?.(parsedEvent.data);
//   }
//   if (message === "End Call") {
//     endCallRef.current?.();
//   }
//   if (message === "Change Camera") {
//     cameraFriendRef.current?.(parsedEvent.data);
//   }
//   if (message === "Change Mic") {
//     micFriendRef.current?.(parsedEvent.data);
//   }
// };
