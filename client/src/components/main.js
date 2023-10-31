import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login, fetchUser, ClearMessage } from "../actions/loginAction";
import addFlashMessage from "../actions/flashMessages";
import SetAuthToken from "../utils/SetAuthtoken";
import getUnique from "../utils/deleteDuplicates";
import { ErMsg, SucMsg } from "./FlashMessage";
const { log } = console;

class Main extends Component {
  state = {
    redirectToReferrer: false,
    Userdata: [],
    Errmessage: [],
    Sucmessage: [],
  };
  componentDidMount() {
    if (this.props.message.length > 0) {
      this.setState({
        Errmessage: this.props.message.filter((v) => v.type === "Error"),
        Sucmessage: this.props.message.filter((v) => v.type !== "Error"),
      });
    }
  }
  componentWillUpdate(nextProps) {
    setTimeout(() => {
      nextProps.message.fill("");
    }, 2000);
  }
  login = (e) => {
    e.preventDefault();
    let post = {
      email: this.username.value,
      password: this.password.value,
    };
    this.props
      .login(post)
      .then((info) => {
        if (info.data.hasOwnProperty("error")) {
          this.state.Errmessage.shift();
          this.props.addFlashMessage({
            type: "Error",
            text: info.data.error,
          });
          this.setState({
            isError: true,
            redirectToReferrer: false,
            Errmessage: this.props.message,
          });
        } else {
          const { token } = info.data;
          localStorage.setItem("jwttoken", token);
          SetAuthToken(token);
          this.props.ClearMessage();
          this.props.fetchUser(() =>
            this.setState({ redirectToReferrer: true }),
          );
        }
      })
      .catch((e) => log(e));
  };

  render() {
    let { from } = this.props.location.state || {
      from: { pathname: "/profile" },
    };
    let { redirectToReferrer } = this.state;
    let { isAuthenticated } = this.props.auth;
    let { Errmessage, Sucmessage } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    } else {
      return (
        <div>
          <section className="hero">
            <div className="hero-content">
              {!isAuthenticated ? (
                <div className="form-group">
                  {this.state.Errmessage.length === 1 &&
                  Sucmessage.length < 1 ? (
                    <ErMsg msg={Errmessage.map((v) => v.text)} />
                  ) : Errmessage.length > 1 ? (
                    <ErMsg msg={Errmessage.pop().text} />
                  ) : null}
                  {this.state.Sucmessage.length === 1 ? (
                    <SucMsg msg={Sucmessage.map((v) => v.text)} />
                  ) : Sucmessage.length > 1 ? (
                    <SucMsg msg={Sucmessage.pop().text} />
                  ) : null}
                  <form id="contact-form" onSubmit={this.login}>
                    <label
                      htmlFor="username"
                      style={{ color: "aqua" }}
                      className="inp-lg"
                    >
                      Username
                      <input
                        type="text"
                        ref={(input) => (this.username = input)}
                        required
                      />
                    </label>{" "}
                    <br />
                    <label htmlFor="password" style={{ color: "aqua" }}>
                      {" "}
                      Password
                      <input
                        type="password"
                        ref={(input) => (this.password = input)}
                        autoComplete="true"
                        required
                      />
                    </label>
                    <br />
                    <br />
                    <input
                      type="submit"
                      className="btn btn-lg btn-primary"
                      value="login"
                    />{" "}
                    <br />
                  </form>{" "}
                  <br />
                  <input
                    type="button"
                    value="Signup"
                    className="btn btn-lg btn-primary"
                    onClick={() => this.props.history.push("/signup")}
                  />
                  <br />
                  <br />
                  <button
                    onClick={() => this.props.history.push("/forgot_pass")}
                    style={{ display: "inline" }}
                  >
                    <span id="forgot" className="alert-danger">
                      FORGOT PASSWORD
                    </span>{" "}
                  </button>
                </div>
              ) : null}
            </div>
          </section>
          <div className="container">
            <div className="jumbotron text-center">Home Page </div>
          </div>
        </div>
      );
    }
  }
}
Main.propTypes = {
  login: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  message: PropTypes.array.isRequired,
  ClearMessage: PropTypes.func.isRequired,
};
function mapStatetoProps(state) {
  return {
    auth: state.Auth,
    message: getUnique(state.flashMessages, "text"),
  };
}
export default connect(mapStatetoProps, {
  login,
  fetchUser,
  addFlashMessage,
  ClearMessage,
})(Main);
