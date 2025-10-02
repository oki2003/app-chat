import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import FriendPage from "./pages/FriendPage";
import ShopPage from "./pages/ShopPage";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./layouts/Dashboard";

import NotFound from "./components/NotFound";
import AddFriend from "./components/friend/AddFriend";
import PendingFriend from "./components/friend/PendingFriend";
import FriendList from "./components/friend/FriendList";
import Invitation from "./components/friend/Invitation";
import NewsPage from "./pages/NewsPage";

function App() {
  return (
    <Router>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />}>
            <Route index element={<NewsPage />} />
            <Route path="friends" element={<FriendPage />}>
              <Route index element={<FriendList />} />
              <Route path="add" element={<AddFriend />} />
              <Route path="sent" element={<PendingFriend />} />
              <Route path="invitations" element={<Invitation />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="shop" element={<ShopPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
