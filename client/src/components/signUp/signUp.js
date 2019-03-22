import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../components/firebase/index";
import * as ROUTES from "../../constants/routes";


const SignUpPage = () => {
  return (
    <div>
      <h1>Changing This</h1>
      <SignUpForm />
    </div>
  );
};
const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmitHandler = event => {
    const { username, email, passwordOne} = this.state;
    const roles = [];
    /*I don't think we've specified roles or isAdmin yet*/
    // if (isAdmin) {
    //  roles.push(roles.isAdmin)
    // }
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        console.log(authUser);
        return this.props.firebase.user(authUser.user.uid).set(
          {
            username,
            email,
            roles
          },
          { merge: true }
        );
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.LANDING);
      })
      .catch(err => {
        // Made error codes/msg's strings until we set the value.
        if (err.code === "ERROR_CODE_ACCOUNT_EXISTS") {
          err.message = "ERROR_MSG_ACCOUNT_EXISTS";
        }

        this.setState({ err });
        console.log(err);
      });
    event.preventDefault();
  };
  onChangeHandler = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";
    return (
      <form onSubmit={this.onSubmitHandler}>
        <input
          name="username"
          value={username}
          onChange={this.onChangeHandler}
          type="text"
          placeholder="Full name"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChangeHandler}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChangeHandler}
          type="text"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChangeHandler}
          type="text"
          placeholder="Confirm password."
        />
        <button disabled={isInvalid} type="submit">
          {" "}
          Sign Up
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}
const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  );
};
const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);
// Allow SignUpForm to use Firebase and Router via recompose.

export default SignUpPage;
export { SignUpForm, SignUpLink };