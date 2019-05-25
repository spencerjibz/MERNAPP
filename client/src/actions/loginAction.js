import axios from 'axios'
import {SET_CURRENT_USER} from './types'
import setAuthtoken from '../utils/SetAuthtoken'

import addFlashMessage from './flashMessages'
import Auther from '../Auth'

export function login(data){

return dispatch=>{
    return axios.post('/api/login',data)
}

}
export function setCurrentUser(user){
    return{
        type:SET_CURRENT_USER,
        user
    };
}
export function fetchUser(){
    return dispatch=>{
        return axios.post('/api/post').then(
     res => {
               if(res.data.hasOwnProperty('error')) {
                
                   
                     dispatch(signout(()=>dispatch(addFlashMessage({type:'Error',txt:`session has expired, login again`}))))
               } else {
  dispatch(setCurrentUser(res.data.user))

            
               }
         
     
      } )
 
}
}

export function signout(cb){
    return dispatch=>{
        localStorage.removeItem('jwttoken')
        localStorage.removeItem('auth')
        setAuthtoken(false)
      
       Auther.signout(() => dispatch(setCurrentUser()))
        dispatch(ClearMessage())
    }
}
export function ClearMessage(){

 return dispatch => {
     dispatch(addFlashMessage({}))
 }

}