import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://your-mock-api.com/login",
});

export default axios;