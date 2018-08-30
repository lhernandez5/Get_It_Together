import React from "react";
import {BrowserRouter as Router,Route,Switch,Redirect} 
from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import { Container } from "./components/Grid";
import Mortgage from "./pages/Mortgage";
import Spending from "./pages/Spending";
import Bills from "./pages/Bills";
import Organizer from "./pages/Organizer";
import Account from "./pages/Account";
// import Signup from "./pages/Signup";
import "./App.css";
//imports added by LH
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import { Component } from "react";
import { app } from "./config";
import API from "./utils/API";

function AuthenticatedRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: false,
      currentUser: null,
      loading: true,
      email: ""
    };
  }

  setCurrentUser(user) {
    if (user) {
      this.setState({
        currentUser: user,
        authenticated: true
      });
    } else {
      this.setState({
        currentUser: null,
        authenticated: false
      });
    }
  }

  componentWillMount() {
    this.removeAuthListener = app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
          email: user.email
        });
        API.saveUser({
          email: this.state.email
        })
          .then(res => console.log("this is what res " + res.config.data))
          .catch(err => console.log(err));

        // console.log("this is the email: " + user.email);
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeAuthListener();
  }

  render() {
    if (this.state.loading === true) {
      return (
        <div>
          <h3>Loading</h3>
        </div>
      );
    }
    return (
      <Router>
        <div>
          <Container>
            <Nav authenticated={this.state.authenticated} />
            <Switch>
              <Route
                exact
                path="/"
                render={props => {
                  return (
                    <Login setCurrentUser={this.setCurrentUser} authenticated={this.state.authenticated} {...props} />
                  );
                }}
              />
              <Route exact path="/logout" component={Logout} />
              {/* <Route exact path="/Home" component={Home} /> */}
              <AuthenticatedRoute
                exact
                path="/home"
                authenticated={this.state.authenticated}
                component={Home}
              />
              <AuthenticatedRoute
                exact
                path="/spending"
                authenticated={this.state.authenticated}
                component={Spending}
              />
              <AuthenticatedRoute
                exact
                path="/bills"
                authenticated={this.state.authenticated}
                component={Bills}
              />
              <AuthenticatedRoute
                exact
                path="/organizer"
                authenticated={this.state.authenticated}
                component={Organizer}
              />
              <AuthenticatedRoute
                exact
                path="/account"
                authenticated={this.state.authenticated}
                component={Account}
              />
              <AuthenticatedRoute
                exact
                path="/mortgage"
                authenticated={this.state.authenticated}
                component={Mortgage}
              />
            </Switch>
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
