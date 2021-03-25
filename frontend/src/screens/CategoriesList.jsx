import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../actions/category.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Categories from "../components/Categories";

const CategoriesList = ({ history }) => {
  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

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
          {categories && categories.length === 0 ? (
            <h1 className="big-heading">Categories are coming soon ;)</h1>
          ) : (
            <Row>
              {categories &&
                categories.map((category) => {
                  return (
                    <Col
                      lg={3}
                      md={4}
                      xs={6}
                      key={category.id}
                      style={{ padding: 0 }}
                    >
                      <Categories category={category} />
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

export default CategoriesList;
