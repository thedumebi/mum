import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { changePassword, getUserDetails } from "../actions/user.actions";
import { Link } from "react-router-dom";
import { USER_CHANGE_PASSWORD_RESET } from "../constants/user.constants";

export const ChangePassword = ({ history }) => {
  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [viewPassword, setViewPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const userChangePassword = useSelector((state) => state.userChangePassword);
  const { loading, error, success } = userChangePassword;

  const userDetail = useSelector((state) => state.userDetails);
  const { user } = userDetail;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.])(?=.{8,})/;
    const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

    setPassword((prevValues) => {
      return { ...prevValues, [name]: value };
    });

    if (name === "new") {
      if (password.new !== "") {
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

    if (name === "confirm" && value !== password.new) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (message === null) {
      dispatch(changePassword(user.id, password));
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/change-password");
    } else if (!user) {
      dispatch(getUserDetails(userInfo.id));
    }
    if (success) {
      alert("Password Change successful");
      history.push("/profile");
    }
    return () => {
      dispatch({ type: USER_CHANGE_PASSWORD_RESET });
    };
  }, [success, history, dispatch, userInfo, user]);

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <Form>
          <Form.Group>
            <Form.Label>Old Password</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={handleChange}
                name="old"
                type={viewPassword.old ? "text" : "password"}
                placeholder="Enter your old password"
                value={password.old}
              />
              <InputGroup.Append>
                <InputGroup.Text
                  onClick={() =>
                    setViewPassword({
                      ...viewPassword,
                      old: !viewPassword.old,
                    })
                  }
                >
                  {viewPassword.old ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>New Password</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={handleChange}
                name="new"
                type={viewPassword.new ? "text" : "password"}
                placeholder="Enter your new password"
                value={password.new}
              />
              <InputGroup.Append>
                <InputGroup.Text
                  onClick={() =>
                    setViewPassword({
                      ...viewPassword,
                      new: !viewPassword.new,
                    })
                  }
                >
                  {viewPassword.new ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
          {password.new !== "" && (
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
                onChange={handleChange}
                name="confirm"
                type={viewPassword.confirm ? "text" : "password"}
                placeholder="Confirm password"
                value={password.confirm}
              />
              <InputGroup.Append>
                <InputGroup.Text
                  onClick={() =>
                    setViewPassword({
                      ...viewPassword,
                      confirm: !viewPassword.confirm,
                    })
                  }
                >
                  {viewPassword.confirm ? (
                    <i className="fas fa-eye-slash"></i>
                  ) : (
                    <i className="fas fa-eye"></i>
                  )}
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            {message && <Message variant="danger">{message}</Message>}
          </Form.Group>

          <Button type="submit" onClick={submitHandler}>
            Change Password
          </Button>
        </Form>
      </FormContainer>
      <small>
        Forgotten Password?
        <Link to="/reset-password">
          <Button className="btn-sm">Reset</Button>
        </Link>
      </small>
    </div>
  );
};
