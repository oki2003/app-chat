import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard/friend", { replace: true });
  }, []);
  return <div></div>;
}

export default NotFound;
