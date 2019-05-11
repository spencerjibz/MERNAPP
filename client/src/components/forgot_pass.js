import React, { Component } from 'react'

import { connect } from 'react-redux'
import axios from 'axios'
import {ErMsg,SucMsg} from './FlashMessage'
const {log} = console
export class forgot_pass extends Component {
  constructor(props){
    super(props)
    this.handleForm= this.handleForm.bind(this)
    this.state = {
      isError:false,
      Errors:[],
      message:[],
      isSucess:false,
    }
    
  }
  
   handleForm(e){
   e.preventDefault()
  axios.post('/api/forgot_pass',{email:this.email.value}).then(v=>{
    let {data}= v
    log(v.data)
    data.hasOwnProperty('error')?this.setState({isError:true,Errors:data.error}):
    this.setState({message:data.message,isSucess:true})

  })



   }
  
  render() {
    const {isError,isSucess} = this.state
    return (
      <div className="container-fluid">
         <h2 className="regist"> FOGOTTEN PASSWORD</h2>
        <div className="text-center " >
 <div className='jumbotron' id='mist'>
    {isError===true?(<ErMsg msg={this.state.Errors}/>):null}
    {isSucess===true?(<SucMsg msg={this.state.message}/>):null}
        <span className="alert-info">
        <p>
            If you have forgotten your password, enter your email address below and check your email for instructions on resetting your password
            </p>
        
        
        
        </span>
      <form className="form-horizontal" onSubmit={this.handleForm} >
         <div className='form-group'>
         <label htmlFor="email" className="form-item"> Email </label>
      <input  type="email" id='email' className='col-lg-5  form-item' ref ={input=>this.email=input} required />
     

       <input type ="submit" className="btn-secondary form-item" value="submit" onSubmit={this.handleForm} /> <br/>
         </div>
   </form> 
   </div>
    </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(forgot_pass)
