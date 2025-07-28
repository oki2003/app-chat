import Dashboard from "./views/Dashboard";
import AuthenticationPage from "./views/AuthenticationPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FriendLayout from "./layout/FriendLayout";
import ShopLayout from "./layout/ShopLayout";
import ChatLayout from "./layout/ChatLayout";
import NotFound from "./components/NotFound";
import { SocketProvider } from "./context/SocketProvider";
function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<AuthenticationPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="friend" element={<FriendLayout />} />
            <Route path="shop" element={<ShopLayout />} />
            <Route path="chat/:id" element={<ChatLayout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
