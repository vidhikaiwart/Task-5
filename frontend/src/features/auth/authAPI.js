import api from "../../api/axios";

export const loginAPI = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const registerAPI = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const fetchProfileAPI = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const logoutAPI = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const fetchAllUsersAPI = async () => {
  const response = await api.get("/auth/users");
  return response.data;
};

export const deleteUserAPI = async (userId) => {
  const response = await api.delete(`/auth/users/${userId}`);
  return response.data;
};

export const updateUserRoleAPI = async (userId, role) => {
  const response = await api.put(`/auth/users/${userId}/role`, { role });
  return response.data;
};