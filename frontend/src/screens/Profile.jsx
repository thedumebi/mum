import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/user.actions";
import { getCategories } from "../actions/category.actions";
import { Link } from "react-router-dom";
import Categories from "../components/Categories";

const Profile = ({ history }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { categories } = categoryDetails;

  const createCategoryState = useSelector((state) => state.createCategory);
  const { status: categoryCreated } = createCategoryState;

  const categoryDelete = useSelector((state) => state.deleteCategory);
  const { message: deleteStoreMessage } = categoryDelete;

  const itemDelete = useSelector((state) => state.deleteItem);
  const { message: deleteItemMessage } = itemDelete;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/profile");
    } else {
      dispatch(getUserDetails(userInfo._id));
      dispatch(getCategories());
    }
  }, [history, userInfo, dispatch]);

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {categoryCreated && (
            <Message variant="success">
              Your shop was created successfully
            </Message>
          )}
          {deleteStoreMessage && (
            <Message variant="success">{deleteStoreMessage}</Message>
          )}
          {deleteItemMessage && (
            <Message variant="success">{deleteItemMessage}</Message>
          )}
          <h1 className="sub-heading"> Welcome {user && user.name} </h1>
          <p>{user && user.username}</p>
          <p>{user && user.phoneNumber}</p>
        </>
      )}
      <hr />
      {user && user.role === "admin" && (
        <div className="section">
          <h2>Manage Categories</h2>
          <Row>
            {user &&
              categories.map((category) => {
                return (
                  <Col lg={4} key={category.id}>
                    <Categories category={category} />
                  </Col>
                );
              })}
          </Row>
        </div>
      )}
      <Link className="btn btn-dark my-3" to="/registerstore">
        New Store
      </Link>
    </div>
  );
};

export default Profile;
