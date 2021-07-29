import React, { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { getUserDetails, updateUserProfile } from "../actions/user.actions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/user.constants";
import FormContainer from "../components/FormContainer";

const Settings = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user: userDetail } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success, error: updateError } = userUpdateProfile;

  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      history.push("/login?redirect=/settings");
    } else {
      if (success) {
        setSuccessMessage(success);
      }
      if (!userDetail || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails(userInfo.id));
      } else {
        setUser((prevValue) => {
          return {
            ...prevValue,
            firstName: userDetail.firstName,
            lastName: userDetail.lastName,
            username: userDetail.username,
            email: userDetail.email,
            phoneNumber: userDetail.phoneNumber,
          };
        });
      }
    }
  }, [dispatch, history, userInfo, userDetail, success]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    if (user.username === userDetail.username) {
      if (user.email === userDetail.email) {
        const { username, email, ...otherfields } = user;
        dispatch(updateUserProfile(userDetail.id, otherfields));
      } else {
        const { username, ...otherfields } = user;
        dispatch(updateUserProfile(userDetail.id, otherfields));
      }
    } else if (user.email === userDetail.email) {
      const { email, ...otherfields } = user;
      dispatch(updateUserProfile(userDetail.id, otherfields));
    } else {
      dispatch(updateUserProfile(userDetail.id, user));
    }

    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>User Settings</h2>

        {loading ? (
          <Loader />
        ) : (
          <>
            {error && <Message variant="danger">{error}</Message>}
            {updateError && <Message variant="danger">{updateError}</Message>}
            {successMessage && (
              <Message variant="success">Profile Updated</Message>
            )}

            <Form>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form.Row>

              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                ></Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="phoneNumber"
                  type="text"
                  value={user.phoneNumber}
                />
              </Form.Group>

              <Button type="submit" variant="primary" onClick={submitHandler}>
                Update
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
      <Link to="/change-password">
        <Button className="btn-sm">Change Password</Button>
      </Link>
    </div>
  );
};

export default Settings;
