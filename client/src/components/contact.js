import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { ErMsg, SucMsg } from "./FlashMessage";
const { log } = console;
const HelErr = (props) => (
  <span className="help-block " style={{ color: "red" }}>
    {props.msg}
  </span>
);
export class contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      subject: "",
      email: "",
      message: "",
      isError: false,
      Errors: [],
      Sucess: "",
      isSucess: false,
      ValidationErrors: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleForm = this.handleForm.bind(this);
  }

  handleForm(e) {
    e.preventDefault();
    let { name, email, message, subject } = this.state;
    axios
      .post("/api/contact", { name, subject, email, message })
      .then((info) => {
        if (info.data.hasOwnProperty("error")) {
          this.setState({ isError: true, Errors: info.data.error });
        } else if (info.data.hasOwnProperty("ValidationErrors")) {
          this.setState({ ValidationErrors: info.data.ValidationErrors });
          log(info.data.ValidationErrors);
        } else {
          this.setState({ Sucess: info.data.message, isSucess: true });
        }
      });
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { isError, isSucess, ValidationErrors } = this.state;
    return (
      <section>
        <div>
          <div className="container-fluid">
            <span className="place-header">
              {" "}
              <h2 className="regist"> CONTACT US</h2>{" "}
            </span>
            <div className="jumbotron text-center">
              {isError === true ? <ErMsg msg={this.state.Errors} /> : null}
              {isSucess === true ? <SucMsg msg={this.state.Sucess} /> : null}
              <form onSubmit={this.handleForm}>
                <div className="form-group" style={{ margin: "auto" }}>
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={this.state.name}
                      onChange={this.handleChange}
                      placeholder="ENTER FULL NAME"
                    />
                    {ValidationErrors.length > 0
                      ? ValidationErrors.map((v, i) => {
                          return v.param === "name" ? (
                            <HelErr key={i} msg={v.msg} />
                          ) : null;
                        })
                      : null}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-10">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={this.state.value}
                      onChange={this.handleChange}
                      placeholder="ENTER EMAIL ADDRESS"
                      required
                    />
                    {ValidationErrors.length > 0
                      ? ValidationErrors.map((v, i) => {
                          return v.param === "email" ? (
                            <HelErr key={i} msg={v.msg} />
                          ) : null;
                        })
                      : null}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-10">
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={this.state.subject}
                      onChange={this.handleChange}
                      placeholder="SUBJECT"
                    />
                    {ValidationErrors.length > 0
                      ? ValidationErrors.map((v, i) => {
                          return v.param === "subject" ? (
                            <HelErr key={i} msg={v.msg} />
                          ) : null;
                        })
                      : null}
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-10">
                    <textarea
                      className="form-control"
                      rows="10"
                      name="message"
                      id="message"
                      value={this.state.message}
                      onChange={this.handleChange}
                      placeholder="TYPE IN YOUR MESSAGE"
                    ></textarea>
                    {ValidationErrors.length > 0
                      ? ValidationErrors.map((v, i) => {
                          return v.param === "message" ? (
                            <HelErr key={i} msg={v.msg} />
                          ) : null;
                        })
                      : null}
                    <br />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-10 col-sm-offset-2">
                    <input
                      id="submit"
                      name="submit"
                      type="submit"
                      value="Send"
                      className="btn-primary"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(contact);
