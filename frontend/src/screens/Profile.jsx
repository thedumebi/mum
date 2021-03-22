import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/user.actions";
import { getCategories } from "../actions/category.actions";
import { Link } from "react-router-dom";
import Categories from "../components/Categories";
import { CREATE_CATEGORY_RESET } from "../constants/category.constants";

const Profile = ({ history }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const createCategoryState = useSelector((state) => state.categoryCreate);
  const { status: categoryCreated } = createCategoryState;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { message: deleteStoreMessage } = categoryDelete;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { message: deleteItemMessage } = itemDelete;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/profile");
    } else {
      dispatch(getUserDetails(userInfo.id));
      dispatch(getCategories());
      dispatch({ type: CREATE_CATEGORY_RESET });
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
              Your category was created successfully
            </Message>
          )}
          {deleteStoreMessage && (
            <Message variant="success">{deleteStoreMessage}</Message>
          )}
          {deleteItemMessage && (
            <Message variant="success">{deleteItemMessage}</Message>
          )}
          <h1 className="sub-heading"> Welcome {user && user.fullName} </h1>
          <p>{user && `Username: ${user.username}`}</p>
          <p>{user && `phone number: ${user.phoneNumber}`}</p>
        </>
      )}
      <hr />
      {user && user.role === "admin" && (
        <div className="section">
          <h2>Manage Categories</h2>
          <Row>
            {user &&
              categories &&
              categories.map((category) => {
                return (
                  <Col lg={4} key={category.id}>
                    <Categories category={category} />
                  </Col>
                );
              })}
          </Row>
          <Link className="btn btn-dark my-3" to="/createcategory">
            New Category
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
