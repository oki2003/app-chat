import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import accountAPI from "../services/accountAPI";
import { Outlet } from "react-router-dom";
import { socketContext } from "../context/socketContext";
import Navbar from "../components/Navbar";
import { dialogBoxContext } from "../context/DialogBoxContext";

function Dashboard() {
  const navigate = useNavigate();
  const { socket, setConnectSocket, currentUser, setInfoCall } =
    useContext(socketContext);
  const { getDialogBox } = useContext(dialogBoxContext);
  const socketRef = useRef(socket);
  const location = useLocation();

  const handler = async (e) => {
    if (e.detail.data.message === "Init Call Connection") {
      const response = await getDialogBox("", "call", e.detail.data.data);
      if (response === true) {
        setInfoCall({
          idFriend: e.detail.data.idFrom,
          typeCall: e.detail.data.data.typeCall,
        });
        if (!location.pathname.includes("chat")) {
          navigate("/chat", { replace: true });
        }
      } else {
        socketRef.current.send(
          JSON.stringify({
            type: "Reject Call Connection",
            to: e.detail.data.idFrom,
          })
        );
      }
    }
  };

  useEffect(() => {
    async function authUser() {
      const response = await accountAPI.auth();
      if (response.status !== 200) {
        navigate("/login", { replace: true });
      } else {
        const data = await response.json();
        currentUser.current = data.currentUser;
        setConnectSocket(true);
      }
    }
    authUser();
    document.addEventListener("WebSocketEvent", handler);
    return () => document.removeEventListener("WebSocketEvent", handler);
  }, []);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  return (
    <div className="h-screen">
      <Navbar />
      <div className="w-full h-full pt-20 p-3 bg-[#0A0E13]">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
