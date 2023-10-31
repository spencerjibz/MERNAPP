export default {
  isAuthenticated: false,
  authenticate(cb) {
    window.isAuth = true;
    this.isAuthenticated = true;
    setTimeout(cb, 10); // fake async
  },
  signout(cb) {
    window.isAuth = false;
    this.isAuthenticated = false;
    setTimeout(cb, 10);
  },
};
