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
const createTable = (table, eventId) => {
  return axios.post(API_URL + "user/createTable/" + eventId, table, {
    headers: authHeader(),
  });
};

//Might change to createPersons
const createPerson = (person, tableId) => {
  return axios.post(API_URL + "user/createPerson/" + tableId, person, {
    headers: authHeader(),
  });
};

const getAllEventsByUser = () => {
  return axios.get(API_URL + "user/get-all-events-by-user", {
    headers: authHeader()
  });
}

const getEventById = (eventId) => {
  return axios.get(API_URL + "user/event/"+ eventId , {
    headers: authHeader(),
  });
};

const getSvgById = (eventId) => {
  return axios.get(API_URL + "svg/generatesvg/" + eventId, {
    headers: authHeader(),
  });
};

const editTable = (table) => {
  return axios.put(API_URL + "user/table/" + table.tableId, table, {
    headers: authHeader(),
  });
};

const deleteTable = (tableId) => {
  return axios.delete(API_URL + "user/deleteTable/" + tableId, {
    headers: authHeader(),
  });
};

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
  getAllEventsByUser,
  getEventById,
  editTable,
  createTable,
  createPerson,
  deleteTable,
  getSvgById
};
