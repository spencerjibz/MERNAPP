import React,{Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import axios from 'axios';
import $ from 'jquery'
//import Axios from 'axios';

const {log} = console
class App extends Component{
  constructor(){
    super()
    this.state ={
      userdata:[],
      photodata:[]
      ,isUser:false,
      Nophoto:true,
      file:{},
      isError:false,
      Errmessage:''
      
    }
    this.handleform = this.handleform.bind(this)
    this.handleFiles = this.handleFiles.bind(this)
    this.fetchPhoto = this.fetchPhoto.bind(this)
  }
  handleform(e){
    e.preventDefault()
  if(true){
    let {file_type,event} = this.state.file 
  
    let data= new FormData()
    data.append('avatar',file_type)
   event==='uploadphoto'?
    axios.post('/api/photo',data,{headers:{'content-type':'multipart/form-data; boundary=----WebKitFormBoundaryAtnbRG4IWrG5y81e'}})
    .then(v=>{
 v.data.hasOwnProperty('error')?this.setState({isError:true,Errmessage:v.data.error}):
 this.setState({Nophoto:false,photodata:[v.data.img]})
}):

axios.post('/api/updatephoto',data,{headers:{'content-type':'multipart/form-data; boundary=----WebKitFormBoundaryAtnbRG4IWrG5y81e'}})
.then(v=>{
v.data.hasOwnProperty('error')?this.setState({isError:true,Errmessage:v.data.error}):
 this.fetchPhoto()
 


})
  }
  }
  handleFiles(e){
    
      let fil = e.target.files[0]
      if(fil!==undefined&&e.target.files.length>0){
  e.target.id.includes('updatephoto')?this.setState({file:{event:'updatephoto',file_type:fil}}):
    e.target.id.includes('upload')?   
    this.setState({file:{event:'uploadphoto',file_type:fil}}):
    log(this.state.file.event)
      }
 else{
   this.setState({isError:true,Errmessage:'cant submit empty files'})
 }
    


  }
  fetchPhoto(){
    axios.post('/api/profile-photo', { email: this.props.user.username }).then(
      v => {
        
        v.data.hasOwnProperty('error') ? this.setState({ Nophoto: true }) : this.setState({ Nophoto: false, isError:false,photodata: [v.data.photodata] })

  
           $('#changeinfo').hide()
          let but = $('#changebut')
          but.position='200px'
   but.show()
             

}
      
    )

  }

  componentDidMount(){
   window.Nophoto =false
 
 this.setState({userdata:[this.props.user],isUser:true})
 this.fetchPhoto()
 




  }
  render(){
    return(<div className='container' id='container'>

<PageTitle/>
 {this.state.isError?( <ErrorMsg msg={this.state.Errmessage}/>):null}
<div className='jumbotron' id='grid'>

   { this.state.Nophoto === false ? this.state.photodata.map((result) => < Photo key = { result._id}
   data = {`http://localhost:5000/${result.photoPath}` }
         />):null}

   <br/>

   {this.state.isUser===true? this.state.userdata.map((results,i)=><Results key={i} user={results}/>):null}
   <br/> 
 
   <Uploadfile handleme={this.handleform} handleFile={this.handleFiles} photoStatus={this.state.Nophoto}/>





     </div>







     </div>  )
  }
}

class Photo extends Component{
  render(){
    return(<div id='profile-photo'>
  <img   id ='myphoto' src={this.props.data} alt='null' width='200'></img>

      </div>)
  }
}

class Results extends Component{
render(){
return (<div id='Results'  className='text-right'>
<ul className='form-group' >

<li name='id' > ID:{ this.props.user!==undefined?this.props.user._id:null}</li>


<li name='name' > Name: {this.props.user!==undefined?this.props.user.name:null}</li>


<li name='email'>Email:{this.props.user!==undefined?this.props.user.username:null}</li>


</ul>

  </div>)

}

}
function PageTitle(){
  return(<div className=' alert alert-info'><h3 className='text-center'> MY PROFILE </h3> </div>)
}
class Uploadfile extends Component{
render(){
  return(
    <div>
{this.props.photoStatus===true?(
<button  className='btn-default' id='but' > uploadimage</button>):null
}
<div className="container" id='forms'>
  { this.props.photoStatus===true?
           <form action="/uploads" method="post" id="myform" className='form-upload form-group' onSubmit={this.props.handleme}>
       <input type='file' name='avatar' id='uploadphoto' onChange={this.props.handleFile}/>
       <input type='submit'  value='submit'  />


       </form>:
       null
         } <br/>
         {this.props.photoStatus===false?<ChangeBut/>:null}
           <br/>
{this.props.photoStatus===false?


<form  action='/updatephoto' method='post' encType='multipart/form-data' id='changeinfo' className='text-right' onSubmit={this.props.handleme} >
<input type='file' name='avatar' id='updatephoto' onChange={this.props.handleFile} />
<input type='submit' value='upload'  />

</form>:null
}           </div>
</div>
  )
}
}
class ChangeBut extends Component {
  constructor(){
    super()
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){
   
    $('#changebut').hide()
     $('#changeinfo').show()
  }
 render(){
   return (
     <button onClick={this.handleClick} className='btn-default text-center' id='changebut'>
       ChangePhoto
     </button>
   )
 }


}
function ErrorMsg(props){


  if(props.msg!==undefined){
    return(<div className='text-center alert alert-danger'>
  <h4 >{props.msg}</h4>

  </div>)


}
else{
  return(<div></div>)
}

}
App.propTypes = {
  user:PropTypes.object.isRequired
}
function mapStatetoProps(state) {
  return {
    user:state.Auth.user
  }
  
}


export default connect(mapStatetoProps) (App);
