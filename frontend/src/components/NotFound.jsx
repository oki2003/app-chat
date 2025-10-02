import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/friends", { replace: true });
  }, []);
  return <div></div>;
}

export default NotFound;
