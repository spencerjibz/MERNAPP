import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import UserSignupRequest from '../actions/signupActions'
import SignForm from './signupForm'
import addFlashMessage from '../actions/flashMessages'
 class SignupPage extends Component {
  
 
  render() {
      const {UserSignupRequest,addFlashMessage} = this.props
    return (
      <div>
        <SignForm UserSignupRequest={UserSignupRequest} addFlashMessage={addFlashMessage} />
      </div>
    )
  }
}
SignupPage.propTypes = {
    UserSignupRequest: PropTypes.func.isRequired,
    addFlashMessage:PropTypes.func.isRequired

    
}


export default connect(null,{UserSignupRequest,addFlashMessage})(SignupPage)
