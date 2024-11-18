import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://JobQuest/login",
});

export default axios;