import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/user.actions";
import {
  USER_UPDATE_RESET,
  USER_DETAILS_RESET,
} from "../constants/user.constants";

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id;

  const [role, setRole] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userUpdate = useSelector((state) => state.userUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/admin/user/${userId}/edit`);
    } else {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET });
        dispatch({ type: USER_DETAILS_RESET });
        history.push("/admin/users");
      }
      if (userInfo.role !== "admin") {
        history.push("/profile");
      }
      if (!user) {
        dispatch(getUserDetails(userId));
      } else {
        setRole(user.role);
      }
    }
  }, [dispatch, history, userId, user, userInfo, successUpdate]);

  const handleChange = (event) => {
    const { value } = event.target;
    setRole(value);
  };

  const submitHandler = (e) => {
    dispatch(updateUser(user.id, { role }));

    e.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h1>Edit User Role</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={user && user.firstName}
                  readOnly
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={user && user.lastName}
                  readOnly
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} xs={8}>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user && user.email}
                  readOnly
                ></Form.Control>
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={user && user.username}
                  readOnly
                />
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                name="phoneNumber"
                type="text"
                value={user && user.phoneNumber}
                readOnly
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" onClick={submitHandler}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditScreen;
