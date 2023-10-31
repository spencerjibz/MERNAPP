import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import addFlashMessages from "../actions/flashMessages";
export default function ({ Composed, props }) {
  class AuthCheck extends Component {
    static propTypes = {
      auth: PropTypes.bool.isRequired,
      addFlashMessages: PropTypes.func.isRequired,
    };
    static contextTypes = {
      router: PropTypes.object.isRequired,
    };
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.addFlashMessages({
          type: "Error",
          text: `Unauthorized, login to access page`,
        });
        this.context.router.history.push("/");
      }
    }
    componentWillUpdate(nextProps) {
      if (!nextProps.isAuthenticated) {
        this.context.router.history.push("/");
      }
    }
    render() {
      return <Composed {...props} />;
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.Auth.isAuthenticated,
  });

  const mapDispatchToProps = {
    addFlashMessages,
  };

  return connect(mapStateToProps, mapDispatchToProps)(AuthCheck);
}
