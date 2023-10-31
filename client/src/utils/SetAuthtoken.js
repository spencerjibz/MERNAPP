import axios from "axios";
export default function SetToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
