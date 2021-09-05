import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Form } from "react-bootstrap";
import { createCategory } from "../actions/category.actions";
import { getUserDetails } from "../actions/user.actions";
import { CREATE_CATEGORY_RESET } from "../constants/category.constants";

const NewCategory = ({ history }) => {
  const [category, setCategory] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [message, setMessage] = useState(undefined);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const createCategoryState = useSelector((state) => state.categoryCreate);
  const { loading, error, status: success } = createCategoryState;

  useEffect(() => {
    if (!user) {
      dispatch(getUserDetails(userInfo.id));
    } else if (user.role !== "admin") {
      history.push("/login?redirect=/createcategory");
    } else {
      if (success) {
        alert("Your category was created successfully");
        history.push("/profile");
      }
    }

    return () => {
      dispatch({ type: CREATE_CATEGORY_RESET });
    };
  }, [history, userInfo, user, dispatch, success]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategory((prevValue) => {
      return { ...prevValue, [name]: value };
    });
    if (name === "name" && value === "") {
      setMessage("This field is required");
    } else {
      setMessage(undefined);
    }
  };

  const submitHandler = (event) => {
    if (category.name === "") {
      setMessage("This field is required");
    } else {
      dispatch(createCategory(category));
    }
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>New Category</h2>

        {loading ? (
          <Loader />
        ) : (
          <>
            {error && <Message variant="danger">{error}</Message>}
            <Message variant="info">
              Fields marked with * are compulsory
            </Message>
            <Form>
              <Form.Group>
                <Form.Label>Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  placeholder="Name of Category e.g. lace, ankara etc."
                />
                {message && <Message variant="danger">{message}</Message>}
              </Form.Group>

              <Form.Group>
                <Form.Label>Price(NGN)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={category.price}
                  onChange={handleChange}
                  placeholder="Price of items in this category"
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
                  placeholder="Brief Description of the Category."
                />
              </Form.Group>

              <Button type="submit" variant="primary" onClick={submitHandler}>
                Create Category
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default NewCategory;
