import React, { useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Items from "../components/Items";
import { getUserDetails } from "../actions/user.actions";

const Favorites = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/favorites");
    } else {
      dispatch(getUserDetails(userInfo.id));
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
          {user && user.favorites.length === 0 ? (
            <>
              <h1 className="big-heading">You don't have any favorite items</h1>
              <Link to="/items">
                <Button className="btn btn-lg btn-dark">Get Started</Button>
              </Link>
            </>
          ) : (
            <Row>
              {user &&
                user.favorites.map((item) => {
                  return (
                    <Col lg={3} md={4} xs={6} key={item.id}>
                      <Items item={item} />
                    </Col>
                  );
                })}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites;
