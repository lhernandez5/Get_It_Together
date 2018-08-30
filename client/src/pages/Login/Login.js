import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Toaster, Intent } from "@blueprintjs/core";
import { app } from "../../config";


const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px",
  backgroundColor: "white"
};


class Login extends Component {
  constructor(props) {
    super(props);
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this);
  }


  authWithEmailPassword(event) {
    event.preventDefault();
    const email = this.emailInput.value;
    const password = this.passwordInput.value;

    app.auth().fetchSignInMethodsForEmail(email)
      .then(providers => {
        if (providers.length === 0) {
          // create user
          return app.auth().createUserWithEmailAndPassword(email, password);
        } else {
          // sign user in
          return app.auth().signInWithEmailAndPassword(email, password);
        }
      })
      .then(user => {
        if (user && user.user.email) {
          //this.loginForm.reset();
          this.props.setCurrentUser(user);
          this.setState({ redirect: true });
        }
      })
      .catch(error => {
        this.toaster.show({ intent: Intent.DANGER, message: error.message });
      });
  }

  render() {
    // console.log(this.state)
    if (this.props.authenticated) {
      return <Redirect to="/home" />;
    }
    return (
      <div style={loginStyles}>
        <Toaster
          ref={element => {
            this.toaster = element;
          }}
        />
        <hr style={{ marginTop: "10px", marginBottom: "10px" }} />
        <form
          onSubmit={event => {
            this.authWithEmailPassword(event);
          }}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <div
            style={{ marginBottom: "10px" }}
            className="pt-callout pt-icon-info-sign"
          >
          </div>
          <label className="pt-label">
            Email
            <input
              style={{ width: "100%" }}
              className="form-control"
              name="email"
              type="email"
              ref={input => {
                this.emailInput = input;
              }}
              placeholder="Email"
            />
          </label>
          <label className="pt-label">
            Password
            <input
              style={{ width: "100%" }}
              className="form-control"
              name="password"
              type="password"
              ref={input => {
                this.passwordInput = input;
              }}
              placeholder="Password"
            />
          </label>
          <input
            style={{ width: "100%" }}
            type="submit"
            className="pt-button pt-intent-primary"
            value="Log In/Create an Account"
          />
        </form>
      </div>
    );
  }
  
}


export default Login;
