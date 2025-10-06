import api from "../utils/api";

export const adminService = {
  login: async (name, password) => {
    const response = await api.post("/admin/login", { name, password });
    return response.data; // { message, token, admin: { name, id, role } }
  },

  verify: async () => {
    const response = await api.get("/admin/verify");
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/admin/profile");
    return response.data;
  },

  logout: async () => {
    // For now just simulate logout (or add backend logout if needed)
    return { message: "Logged out" };
  },
};
