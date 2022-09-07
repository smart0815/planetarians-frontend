import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "XMLHttpRequest",
  }
});