import axios from "axios";

export default axios.create({
  baseURL: "https://cors-everywhere.herokuapp.com/http://ec2-18-188-93-72.us-east-2.compute.amazonaws.com:8080/",
  headers: {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "X-Requested-With": "XMLHttpRequest",
  }
});