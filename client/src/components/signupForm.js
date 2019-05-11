import React,{Component} from 'react'
import PropTypes from 'prop-types'



 const SucMsg = props=><div className=' alert alert-success'><h3>{props.msg}</h3></div>
 const ErMsg  =  props=> <div className=' alert-danger'><h3>{props.msg}</h3></div>
 const HelErr = props=> <span className='help-block 'style={{color:'red'}}>{props.msg}</span>
 class SignUp  extends Component{
 constructor(props){
 super(props)
  this.state = { name:'',email:'',password:'',confpassword:'',isError:'',IsSuccess:'',ValidationErrors:''}
  this.onChange = this.onChange.bind(this)
  this.handleSubmit = this.handleSubmit.bind(this)
 }
 static contextTypes = {
   router:PropTypes.object
 }
 onChange(e){
   this.setState({[e.target.name]:e.target.value})
  
 }
 handleSubmit(e){
 e.preventDefault()
 this.props.UserSignupRequest(this.state).then(v=>{
   
   if(v.hasOwnProperty('error')){
     this.setState({isError:v.error})
   }
   else if(v.hasOwnProperty('ValidationErrors')){
     this.setState({ValidationErrors:v.ValidationErrors})
   
   }
   else{
   this.props.addFlashMessage({
     type:'success',
     text:v.message
   })
   
   this.setState({IsSuccess:v.message,ValidationErrors:[]})
   this.context.router.history.push('/')
 }
})
 }
   
 render(){
   const {ValidationErrors} = this.state
 return(
     <div className ="container-fluid">
   
  <h2 className="regist"> REGISTRATION PAGE</h2>
    <div className="jumbotron ">
    {this.state.isError!==undefined&&this.state.isError.length>0?<ErMsg msg={this.state.isError}/>:null}
   
    {this.state.IsSuccess!==undefined&&this.state.IsSuccess.length>0?<SucMsg msg={this.state.IsSuccess}/>:null}
<form className ="jumbotron" onSubmit={this.handleSubmit} name="myforms">
 <div className="form-group">
      <label htmlFor="text">Name:</label>
      <input type="text" className="form-control"  name="name"id=" name" placeholder="Enter full name"  value={this.state.name} onChange={this.onChange}/>
      {ValidationErrors.length>0?ValidationErrors.map((v,i)=>{return v.param==='name'?<HelErr key={i} msg={v.msg}/>:null}):null}
    </div>
 <div className="form-group">
      <label htmlFor="email">Email:</label>
      <input type="email" className="form-control" name="email" id="email" placeholder="Enter email"  value={this.state.email}  onChange={this.onChange} required/>
 {ValidationErrors.length>0?ValidationErrors.map((v,i)=>{return v.param==='email'?<HelErr key={i} msg={v.msg}/>:null}):null}
    </div>
  
   <div className="form-group">
    <label htmlFor="pwd">Password:</label>
    <input type="password" className="form-control" name="password"id="pwd" placeholder="Enter Password" autoComplete ='true' value={this.state.password}   onChange={this.onChange} required/>
    {ValidationErrors.length>0?ValidationErrors.map((v,i)=>{return v.param==='password'?<HelErr key={i} msg={v.msg}/>:null}):null}
    </div>
  <div className="form-group">
    <label htmlFor="repwd">Retype Password:</label>
    <input type="password" className="form-control"  name ="confpassword" placeholder="Enter Password "  autoComplete ='true' onChange={this.onChange} value={this.state.confpassword} required/>
   {ValidationErrors.length>0?ValidationErrors.map((v,i)=>{return v.param==='confpassword'?<HelErr key={i} msg={v.msg}/>:null}):null} 
    </div> 
    <br/> <br/>
    <div>
    <input type="submit" className="btn btn-lg btn-primary active" value="Register Now" />
    </div>
    
    
    
    </form>
    </div>
    </div>
   




 )

 }


}
SignUp.contextTypes={
router:PropTypes.object,
}
SignUp.propTypes= {
  UserSignupRequest:PropTypes.func.isRequired,
  addFlashMessage:PropTypes.func.isRequired
}
export default SignUp