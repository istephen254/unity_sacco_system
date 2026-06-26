import axios from "axios";

//////////////////////////////////////////////////
// 🌐 AXIOS INSTANCE
//////////////////////////////////////////////////

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

//////////////////////////////////////////////////
// 🔐 REQUEST INTERCEPTOR
//////////////////////////////////////////////////

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sacco_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    console.error("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  }
);

//////////////////////////////////////////////////
// 📡 RESPONSE INTERCEPTOR
//////////////////////////////////////////////////

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    const message = data?.message || error.message || "Unknown API error";

    //////////////////////////////////////////////////
    // 🚨 AUTH ERROR HANDLING
    //////////////////////////////////////////////////
    if (status === 401) {
      localStorage.removeItem("sacco_token");
      localStorage.removeItem("sacco_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    //////////////////////////////////////////////////
    // 🪵 DEBUG LOG
    //////////////////////////////////////////////////
    console.error("❌ API ERROR DETAILS:");
    console.error("Status:", status);
    console.error("Message:", message);
    console.error("URL:", error.config?.url);
    console.error("Method:", error.config?.method);

    return Promise.reject({
      status,
      message,
      url: error.config?.url,
      method: error.config?.method,
    });
  }
);

export default api;