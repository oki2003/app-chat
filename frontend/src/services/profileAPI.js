const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const profileAPI = {
  changeImage: async (file, type) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);
    return fetch(`${API_SERVER_URL}/api/changeImage`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  },
};

export default profileAPI;
