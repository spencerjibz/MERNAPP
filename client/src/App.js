import React, { Component} from "react";
import {Provider,useSelector} from 'react-redux'
import {createStore,applyMiddleware,compose}  from 'redux'

import thunk  from 'redux-thunk'
import {BrowserRouter, Route, Switch,Redirect} from "react-router-dom";

import Footer from "./components/footer";
import About from "./components/about";
import Contact from "./components/contact";
import Profile from "./components/profile";
import Nav from './components/nav'
import Message from './components/main'
import SignupPage from './components/SignupPage'
import ForgotPass from './components/forgot_pass'
import "./styles.css";
import SetAuth from './utils/SetAuthtoken'
// add reducers 
import rootReducer from './rootReducer'
// add actions
import {fetchUser} from './actions/loginAction'
import addFlashMessage from './actions/flashMessages'
// lazy 

//middleware 
let middleware = [thunk]
const {log} = console
//
 const store = createStore(rootReducer,compose(
   applyMiddleware(...middleware),
   window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f

 ))
 


const Error = props => {
  log(props.msg===undefined)
  return (
    <div className="alert text-center ">
      <h3 className={" alert-danger"}> {props.msg===undefined?`Error: path doesn't exist`:props.msg}</h3>
    </div>
  );
};

class App extends Component {
  componentDidMount(){
if (localStorage.jwttoken) {
  
  SetAuth(localStorage.jwttoken)

  
  store.dispatch(fetchUser())

  
}


  }
 
  render() {


 

    return (
      <Provider store={store}>
      <BrowserRouter>
        <div>
          <Nav/>
          
          <div>
            <Switch>
              <Route path="/" component={props=><Message {...props}/>} exact={true}/>
              <Route path="/about" component={About} />
              <PrivateRoute path="/profile" component={Profile}/>
              <Route path="/contact" component={props=><Contact{...props}/>} />
              <Route path="/signup" component={props=><SignupPage{...props}/>} />
              <Route path="/forgot_pass" component={props => <ForgotPass/>} />
              <Route component={Error} />
            </Switch>
          </div>
          
          <Footer />
        </div>
      </BrowserRouter>
      </Provider>
    );
  }
}

function PrivateRoute({component:Component, ...rest }) {
  const auth = useSelector(state=>state.Auth)
  return (
    <Route
      {...rest}
      render={(props) =>{
        if (auth.isAuthenticated) {
          return (<Component {
            ...props
          }
          />
        )
        }
  
      else {
        store.dispatch(addFlashMessage({type:'Error',text:`unauthorized, login to access this page`}))
         return ( <
          Redirect to = {
            {
              pathname: "/",
              state: {
                from: props.location
              }
            }
          }
          />
        )
      }
        
        
      }
    }

    />
  );
}
export default App
