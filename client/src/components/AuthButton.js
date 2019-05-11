import React ,{Component} from 'react'
import {NavLink} from 'react-router-dom'
import Auth from '../Auth'
import {signout} from '../actions/loginAction'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class AuthBut extends Component {
  constructor(){
    super()
    this.signout = this.signout.bind(this)
  }
  static propTypes = {
    auth: PropTypes.object.isRequired
  }
  static contextTypes = {
    router:PropTypes.object
  }
  signout(){

  Auth.signout(() => this.context.router.history.push("/"));
  this.props.signout()

  }
  render() {
    const {isAuthenticated} = this.props.auth
    return isAuthenticated?(
      <div>
        <span className='nav'>
        <NavLink to="/contact" className="nav-link">
            Contact us
          </NavLink>
     <NavLink to="/profile" className="nav-link">
            {" profile"}
          </NavLink>
          <NavLink to="/about" className="nav-link">
            {" about"}
          </NavLink>
        < button className='nav-link'
          onClick={this.signout}
        >
          Sign out
        </ button>
    </span>
      </div>
    ):null
  }
}

const mapStateToProps = (state) => ({
  auth:state.Auth
})



export default connect(mapStateToProps,{signout})(AuthBut)




