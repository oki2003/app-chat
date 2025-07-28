import Sidebar from "../layout/Sidebar";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import accountAPI from "../services/accountAPI";
import { Outlet } from "react-router-dom";
import { socketContext } from "../context/socketContext";

function Dashboard() {
  const navigate = useNavigate();
  const { setConnectSocket, currentUser } = useContext(socketContext);
  useEffect(() => {
    async function authUser() {
      const response = await accountAPI.auth();
      if (response.status !== 200) {
        navigate("/", { replace: true });
      } else {
        const data = await response.json();
        currentUser.current = data.currentUser;
        setConnectSocket(true);
      }
    }
    authUser();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-[85%] h-full bg-[#1a1a1e]">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
