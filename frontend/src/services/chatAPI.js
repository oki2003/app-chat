const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const chatAPI = {
  getMessage: async (idChat) => {
    return fetch(`${API_SERVER_URL}/api/getMessage/${idChat}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    });
  },

  sendMessage: async (idChat, message, createAt) => {
    return fetch(`${API_SERVER_URL}/api/sendMessage`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        idChat: idChat,
        message: message,
        createAt: createAt,
      }),
    });
  },

  uploadFile: async (idChat, file, createAt) => {
    const formData = new FormData();
    formData.append("idChat", idChat);
    formData.append("file", file);
    formData.append("createAt", createAt);
    return fetch(`${API_SERVER_URL}/api/uploadFile`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  },

  downloadFile: async (idChat) => {
    return fetch(`${API_SERVER_URL}/api/downloadFile`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
  },

  showImg: async (idChat, content) => {
    return fetch(`${API_SERVER_URL}/api/showImg`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        idChat: idChat,
        content: content,
      }),
    });
  },

  updateStatusMessage: async (idChat) => {
    return fetch(`${API_SERVER_URL}/api/updateStatusMessage/${idChat}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      credentials: "include",
    });
  },
};

export default chatAPI;
