const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const friendAPI = {
  friendRequest: async (username) => {
    return fetch(`${API_SERVER_URL}/api/friendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username: username,
      }),
    });
  },

  cancelFriendRequest: async (id, displayname) => {
    return fetch(`${API_SERVER_URL}/api/cancelFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
        displayname: displayname,
      }),
    });
  },

  ignoreFriendRequest: async (id) => {
    return fetch(`${API_SERVER_URL}/api/ignoreFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  acceptFriendRequest: async (id) => {
    return fetch(`${API_SERVER_URL}/api/acceptFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  deleteFriendRequest: async (id) => {
    return fetch(`${API_SERVER_URL}/api/deleteFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  blockFriendRequest: async (id) => {
    return fetch(`${API_SERVER_URL}/api/blockFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  unBlockFriendRequest: async (id) => {
    return fetch(`${API_SERVER_URL}/api/unBlockFriendRequest`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });
  },

  PendingFriends: async () => {
    return fetch(`${API_SERVER_URL}/api/PendingFriends`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
  },

  FriendShips: async () => {
    return fetch(`${API_SERVER_URL}/api/FriendShips`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
  },
};

export default friendAPI;
