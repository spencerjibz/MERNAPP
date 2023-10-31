export default function userSignupRequest(userData) {
  return (dispatch) => {
    return fetch("/api/create", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    }).then((res) => res.json());
  };
}
