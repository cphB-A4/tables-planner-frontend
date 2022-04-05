import axios from "axios";

const API_URL = "https://mustitokmak.com/tomcat/tables-planner/api/";

const register = (username, password, email) => {
  return axios.post(API_URL + "register", {
    username,
    password,
    email
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "login", {
      'username': username,
      'password': password
    })
    .then((response) => {
      console.log(response)
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
