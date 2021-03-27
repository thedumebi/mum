import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset, resetPassword } from "../actions/user.actions";
import { USER_REQUEST_RESET_PASSWORD_RESET } from "../constants/user.constants";

const ResetPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [userOTP, setUserOTP] = useState("");
  const [password, setPassword] = useState("");
  const [otpError, setOTPError] = useState(null);
  const [showPasswordField, setShowPasswordField] = useState(false);

  const dispatch = useDispatch();

  const request = useSelector((state) => state.userRequestPasswordReset);
  const { loading, user, error, success: requestSuccess } = request;

  const userResetPassword = useSelector((state) => state.userResetPassword);
  const {
    loading: passwordLoading,
    error: passwordError,
    success: passwordSucces,
  } = userResetPassword;

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (passwordSucces) {
      history.push("/profile");
    }
    if (requestSuccess) {
      setMessage(
        `Dear ${user.firstName}, please check your email for an OTP which expires in the next five(5) minutes`
      );
    } else {
      dispatch({ type: USER_REQUEST_RESET_PASSWORD_RESET });
    }
  }, [requestSuccess, passwordSucces, history, user, dispatch]);

  const submitRequest = (event) => {
    dispatch(requestPasswordReset(email));
    event.preventDefault();
  };

  const getOTP = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  const checkOTP = (event) => {
    const otp = getOTP("OTP");
    console.log({ otp });
    if (otp !== userOTP) {
      setOTPError("Sorry, invalid OTP");
      console.log("invalid");
    } else {
      console.log("valid");
      setOTPError(null);
      setShowPasswordField(true);
    }
    event.preventDefault();
  };

  const submitNewPassword = (event) => {
    if (otpError === null) dispatch(resetPassword({ email, password }));
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {message && <Message variant="success">{message}</Message>}

        <Form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {requestSuccess && (
            <Form.Group>
              <Form.Label>OTP</Form.Label>
              <Form.Control
                type="text"
                name="otp"
                value={userOTP}
                placeholder="Enter your OTP"
                onChange={(e) => setUserOTP(e.target.value)}
              />
              {otpError && <Message variant="danger">{otpError}</Message>}
            </Form.Group>
          )}

          {showPasswordField && (
            <Form.Group>
              {passwordLoading && <Loader />}
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                value={password}
                placeholder="Enter your new password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <Message variant="danger">{passwordError}</Message>
              )}
            </Form.Group>
          )}

          {showPasswordField && (
            <Button type="submit" variant="primary" onClick={submitNewPassword}>
              Save
            </Button>
          )}

          {!showPasswordField && requestSuccess && (
            <Button
              type="submit"
              variant="primary"
              className="btn-small"
              onClick={submitRequest}
            >
              Resend OTP
            </Button>
          )}
          {!showPasswordField && requestSuccess && (
            <Button type="submit" variant="primary" onClick={checkOTP}>
              Submit OTP
            </Button>
          )}
          {!requestSuccess && (
            <Button type="submit" variant="primary" onClick={submitRequest}>
              Send OTP
            </Button>
          )}
        </Form>
      </FormContainer>
    </div>
  );
};

export default ResetPassword;
