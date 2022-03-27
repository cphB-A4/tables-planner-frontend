import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/tables-planner/api/";

const getPublicContent = () => {
  return axios.get(API_URL + "info");
};

const createEvent = (event) => {
  return axios.post(API_URL + "user/createEvent", event, {
    headers: authHeader()
  });
};

const getAllEventsByUser = () => {
  return axios.get(API_URL + "user/get-all-events-by-user", {
    headers: authHeader()
  });
  
}

const getUserBoard = () => {
  return axios.get(API_URL + "info/user", { headers: authHeader() });
};


const getAdminBoard = () => {
  return axios.get(API_URL + "info/admin", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
  createEvent,
  getAllEventsByUser
};
