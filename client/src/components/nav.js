import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {NavLink}from 'react-router-dom'
import AuthButton from './AuthButton'
import DeleteAccount from './modal'
export class nav extends Component {
  static propTypes = {
    auth:PropTypes.object.isRequired
  }

  render() {
    const Userlinks= (<ul className="nav">
             
         
             < AuthButton />
             <br/>
             <DeleteAccount/>
        </ul>)
    const NonUser = (<NavLink to="/" className=" navbar-brand">
          DEMOSITE
        </NavLink>)
    const contactLink= (<span >
      <NavLink to="/" className="nav-link" style={{display:'inline'}}>
            Home
          </NavLink> 
      <NavLink to="/contact" className="nav-link" style={{display:'inline'}}>
            Contact us
          </NavLink>
           </span>)
      const {isAuthenticated}= this.props.auth
    return (
      <div>
        
          <header >
      <nav className="navbar bg-dark nav-tabs " style={{textAlign:'left'}}>
        { isAuthenticated!==true?NonUser:Userlinks}
        
        {!isAuthenticated?contactLink:null} 
       
        
      </nav>
    </header>
        
      </div>
    )
  }
}

const mapStateToProps = (state) => ({auth:state.Auth
  
})



export default connect(mapStateToProps)(nav)
