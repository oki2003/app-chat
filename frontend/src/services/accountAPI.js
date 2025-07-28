const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const accountAPI = {
  signIn: async (username, password) => {
    return fetch(`${API_SERVER_URL}/api/signIn`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });
  },

  signUp: async (username, displayname, password) => {
    return fetch(`${API_SERVER_URL}/api/signUp`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username: username,
        displayname: displayname,
        password: password,
      }),
    });
  },

  auth: async () => {
    return fetch(`${API_SERVER_URL}/api/auth`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    });
  },
};

export default accountAPI;
