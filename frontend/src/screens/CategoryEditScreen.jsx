import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { CATEGORY_UPDATE_RESET } from "../constants/category.constants";
import FormContainer from "../components/FormContainer";
import {
  getCategoryDetails,
  updateCategory,
} from "../actions/category.actions";

const CategoryEdit = ({ history, match }) => {
  const [category, setCategory] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { loading, error, category: categoryDetail } = categoryDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const { success, error: updateError } = categoryUpdate;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      history.push(`/login?redirect=/category/${match.params.id}/edit`);
    } else {
      if (success) {
        setSuccessMessage(success);
        dispatch({ type: CATEGORY_UPDATE_RESET });
      }
      if (!categoryDetail || success) {
        dispatch(getCategoryDetails(match.params.id));
      } else {
        setCategory((prevValue) => {
          return {
            ...prevValue,
            name: categoryDetail.name,
            price: categoryDetail.price,
            description: categoryDetail.description,
          };
        });
        if (userInfo.role !== "admin") {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, userInfo, categoryDetail, success, match]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategory((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleCheck = (event) => {
    const { name, checked } = event.target;
    setCategory((prevValues) => {
      return { ...prevValues, [name]: checked };
    });
  };

  const submitHandler = (event) => {
    if (categoryDetail.name === category.name) {
      const { name, ...otherfields } = category;
      dispatch(updateCategory(categoryDetail.id, otherfields));
    } else {
      dispatch(updateCategory(categoryDetail.id, category));
    }
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>Edit Category</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
            {error && <Message variant="danger">{error}</Message>}
            {updateError && <Message variant="danger">{updateError}</Message>}
            {successMessage && (
              <Message variant="success">Category Updated</Message>
            )}

            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Price(NGN)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={category.price}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  onChange={handleChange}
                  name="description"
                  value={category.description}
                  rows={3}
                />
              </Form.Group>

              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Apply Price to all Items in this Category"
                  onChange={handleCheck}
                  name="setPrice"
                  value={category.setPrice}
                />
              </Form.Group>

              <Button type="submit" variant="primary" onClick={submitHandler}>
                Update
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default CategoryEdit;
