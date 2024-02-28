import axios from "axios";

const url = "https://65df044bff5e305f32a12cea.mockapi.io/";
const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json"
  },
});
export default instance;
