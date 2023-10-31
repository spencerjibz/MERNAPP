import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";

import { signout } from "../actions/loginAction";
import addFlashMessage from "../actions/flashMessages";
import { ErMsg } from "./FlashMessage";
import axios from "axios";
const { log } = console;
export class modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      show: false,
      isError: false,
      error_msg: "",
      Redirect: false,
      DeleteAccount: false,
      SucessMessage: "",
    };
    this.DeleteUser = this.DeleteUser.bind(this);
  }
  static propTypes = {
    addFlashMessage: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired,
  };
  static contextTypes = {
    router: PropTypes.object,
  };
  handleForm(e) {
    this.setState({ username: e.target.value });
  }
  handleShow() {
    this.setState({ show: true });
  }
  handleSubmit() {
    let { username } = this.state;
    let exp = /\W[a-z]+\.[a-z]+/;
    let isEmail = exp.test(username);
    if (username.length === 0) {
      this.setState({ isError: true, error_msg: "no empty usernames" });
    } else if (isEmail === false) {
      this.setState({
        isError: true,
        error_msg: "invalid email format",
      });
    } else {
      this.DeleteUser(username, () => {
        if (this.state.DeleteAccount) {
          this.props.signout();
          this.props.addFlashMessage({
            type: "success",
            text: this.state.SucessMessage,
          });
          this.context.router.history.push("/");
        }
      });
    }
  }
  DeleteUser(username, cb) {
    axios.post("/api/deleteone", { email: username }).then((v) => {
      let { data } = v;
      log(data);
      if (data.hasOwnProperty("error")) {
        this.setState({ isError: true, error_msg: data.error, show: true });
        cb(null);
      } else {
        this.setState({
          show: false,
          Redirect: true,
          DeleteAccount: true,
          SucessMessage: data.message,
        });

        cb();
      }
    });
  }
  render() {
    return (
      <div>
        <Button
          variant="default"
          className="nav-link "
          onClick={this.handleShow.bind(this)}
          style={{ color: "white" }}
        >
          Delete Account
        </Button>

        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false, isError: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title className="regist text-center">
              {" "}
              Delete Account
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="alert-warning">
              {" "}
              CONFIRM WITH YOUR USERNAME TO DELETE ACCOUNT{" "}
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              {this.state.isError ? (
                <span>
                  <ErMsg msg={this.state.error_msg} />
                </span>
              ) : null}
              <div className="jumbotron">
                <label htmlFor="password"> Username</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter email"
                  onChange={this.handleForm.bind(this)}
                  required
                />
                <br />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              className="text-left"
              variant="left"
              onClick={() => this.setState({ show: false, isError: false })}
            >
              close
            </Button>

            <Button
              type="submit"
              variant="secondary"
              onClick={this.handleSubmit.bind(this)}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Auth,
});

const mapDispatchToProps = {
  addFlashMessage,
  signout,
};

export default connect(mapStateToProps, mapDispatchToProps)(modal);
