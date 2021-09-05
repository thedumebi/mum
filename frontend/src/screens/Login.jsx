import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Col, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { login, register } from "../actions/user.actions";

const Login = ({ location, history, match }) => {
  const url = match.url;
  const [registerUser, setRegisterUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    email: "",
  });
  const [loginUser, setLoginUser] = useState({
    input: "",
    password: "",
  });
  const [viewPassword, setViewPassword] = useState(false);
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;
  const userRegister = useSelector((state) => state.userRegister);
  const { loading: registerLoading, error: registerError } = userRegister;

  const redirect = location.search ? location.search.split("=")[1] : "/";
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  function handleRegister(event) {
    const { name, value } = event.target;
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/;
    const mediumRegex =
      /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    setRegisterUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });

    if (name === "password") {
      if (registerUser.password !== "") {
        if (strongRegex.test(value)) {
          document.getElementById("password-strength").style.backgroundColor =
            "green";
          document.getElementById("password-strength-text").innerText =
            "strong";
        } else if (mediumRegex.test(value)) {
          document.getElementById("password-strength").style.backgroundColor =
            "orange";
          document.getElementById("password-strength-text").innerText =
            "medium";
        } else {
          document.getElementById("password-strength").style.backgroundColor =
            "red";
          document.getElementById("password-strength-text").innerText = "weak";
        }
      }
    }

    if (name === "confirmPassword") {
      if (value !== registerUser.password) {
        setMessage("Passwords do not match");
      } else {
        setMessage(null);
      }
    }
  }

  function handleLogin(event) {
    const { name, value } = event.target;
    setLoginUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function submitHandler() {
    if (url === "/login") {
      dispatch(login(loginUser));
    } else if (url === "/register") {
      if (registerUser.password !== registerUser.confirmPassword) {
        setMessage("Please ensure your password matches");
      } else {
        dispatch(register(registerUser));
      }
    }
  }

  return (
    <FormContainer>
      <h2>{url === "/login" ? "Welcome back" : "Get Started"}</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          {error && <Message variant="danger">{error}</Message>}
          {registerError && <Message variant="danger">{registerError}</Message>}
          {registerLoading && <Loader />}
          <Form className="form">
            <Form.Group>
              <Form.Label>
                {url === "/login"
                  ? "Email address or Username"
                  : "Email address"}
              </Form.Label>
              <Form.Control
                onChange={url === "/login" ? handleLogin : handleRegister}
                name={url === "/login" ? "input" : "email"}
                type={url === "/login" ? "text" : "email"}
                placeholder={
                  url === "/login" ? "Enter email or username" : "Enter email"
                }
                value={url === "/login" ? loginUser.input : registerUser.email}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={url === "/login" ? handleLogin : handleRegister}
                  name="password"
                  type={viewPassword ? "text" : "password"}
                  placeholder="Password"
                  value={
                    url === "/login"
                      ? loginUser.password
                      : registerUser.password
                  }
                />
                <InputGroup.Append>
                  <InputGroup.Text
                    onClick={() => setViewPassword(!viewPassword)}
                  >
                    {viewPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            {url === "/register" && (
              <div>
                {registerUser.password !== "" && (
                  <Form.Group>
                    <Form.Text>Password strength</Form.Text>
                    <Form.Control id="password-strength" readOnly />
                    <Form.Text id="password-strength-text"></Form.Text>
                  </Form.Group>
                )}

                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={viewConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={registerUser.confirmPassword}
                      onChange={handleRegister}
                    />
                    <InputGroup.Append>
                      <InputGroup.Text
                        onClick={() =>
                          setViewConfirmPassword(!viewConfirmPassword)
                        }
                      >
                        {viewConfirmPassword ? (
                          <i className="fas fa-eye-slash"></i>
                        ) : (
                          <i className="fas fa-eye"></i>
                        )}
                      </InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  {message && <Message variant="danger">{message}</Message>}
                </Form.Group>
                <Form.Row>
                  <Form.Group as={Col}>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="John"
                      name="firstName"
                      onChange={handleRegister}
                      value={registerUser.firstName}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Doe"
                      name="lastName"
                      onChange={handleRegister}
                      value={registerUser.lastName}
                    />
                  </Form.Group>
                </Form.Row>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    onChange={handleRegister}
                    name="username"
                    type="text"
                    placeholder="Pick a username"
                    value={registerUser.username}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    onChange={handleRegister}
                    name="phoneNumber"
                    type="text"
                    placeholder="Phone number"
                    value={registerUser.phoneNumber}
                  />
                </Form.Group>
              </div>
            )}
            <Button variant="primary" onClick={submitHandler} type="button">
              {url === "/login" ? "Login" : "Register"}
            </Button>
          </Form>
        </>
      )}

      <small>
        Forgot password?
        <Link to="/reset-password">
          <Button className="btn-dark btn-sm">Reset</Button>
        </Link>
      </small>
      {url === "/login" && (
        <p>
          Don't have an account yet?
          <Link to="/register">
            <Button className="btn btn-dark">Register</Button>
          </Link>
        </p>
      )}
      {url === "/register" && (
        <p>
          Have an account?
          <Link to="/login">
            <Button className="btn btn-dark">Login</Button>
          </Link>
        </p>
      )}
    </FormContainer>
  );
};

export default Login;
