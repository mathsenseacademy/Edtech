import axios from "axios";
const api = axios.create({
  // baseURL: "http://mathsenseacademy.com:7000/",
  baseURL:"https://api.mathsenseacademy.com",
  // 'https://api.mathsenseacademy.com/'
  headers: { "Content-Type": "application/json" },
});

/* ---- request: attach JWT ---------------------------------------- */
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("accessToken");
  // console.log("🔐 Sending token in request:", token);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

/* ---- response: auto-logout on 401 *only if* we sent a token -------- */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const sentAuth = !!err.config?.headers?.Authorization;

    // Only force a logout if this request actually included our JWT
    if (status === 401 && sentAuth) {
      localStorage.removeItem("accessToken");
      window.location.href = "/register?expired=1";
    }

    return Promise.reject(err);
  }
);

export default api;
