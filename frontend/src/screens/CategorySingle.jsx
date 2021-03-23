import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Categories from "../components/Categories";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryDetails } from "../actions/category.actions";
import { Button } from "react-bootstrap";

const Category = ({ history, match }) => {
  const dispatch = useDispatch();

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { loading, error, category } = categoryDetails;

  useEffect(() => {
    dispatch(getCategoryDetails(match.params.id));
  }, [dispatch, match]);

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
        category && <Categories category={category} />
      )}
    </div>
  );
};

export default Category;
