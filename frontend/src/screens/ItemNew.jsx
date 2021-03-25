import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Col, Form, Image } from "react-bootstrap";
import { createItem } from "../actions/item.actions";
import { CREATE_ITEM_RESET } from "../constants/item.constants";
import axios from "axios";
import { getCategories } from "../actions/category.actions";

const NewItem = ({ history, location }) => {
  const [item, setItem] = useState({
    name: "",
    categories: [],
  });

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createItemState = useSelector((state) => state.itemCreate);
  const { loading, error, status } = createItemState;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const [nameError, setNameError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/items/newitem");
    } else {
      dispatch(getCategories());
      dispatch({ type: CREATE_ITEM_RESET });
      if (status) {
        history.push(`/categories`);
      }
      if (userInfo.role !== "admin") {
        history.push("/profile");
      }
    }
  }, [history, dispatch, status, userInfo, location]);

  const addToCategoryArray = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return {
        ...prevValue,
        [name]: [...prevValue.categories, Number(value)],
      };
    });
  };

  const removeFromCategoryArray = (event) => {
    const { name, value } = event.target;
    setItem((prevValues) => {
      return {
        ...prevValues,
        [name]: [...prevValues.categories.filter((el) => el !== Number(value))],
      };
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((prevValue) => {
      return { ...prevValue, [name]: value };
    });
    if (name === "name" && value === "") {
      setNameError("This field is required");
    } else {
      setNameError(null);
    }
  };

  const uploadFileHandler = async (event) => {
    const { name, files } = event.target;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      setItem((prevValue) => {
        return { ...prevValue, [name]: data };
      });
      setUploadError(null);
    } catch (error) {
      setUploadError(error.message);
    }
  };

  const submitHandler = (event) => {
    if (item.name === "") {
      setNameError("This field is required");
    } else if (uploadError === null && nameError === null) {
      dispatch(createItem(item));
    }
    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>New Item</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Message variant="info">Fields marked with * are compulsory</Message>
        <Form>
          <Form.Group>
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              placeholder="Name of Item"
            />
            {nameError && <Message variant="danger">{nameError}</Message>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Price(NGN)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              placeholder="Price of item"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange}
              name="quantity"
              value={item.quantity}
              placeholder="Number of Item"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              onChange={handleChange}
              name="description"
              value={item.description}
              rows={3}
              placeholder="Brief Description of the Item"
            />
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Select Category</Form.Label>
              <Form.Control
                as="select"
                name="categories"
                onChange={addToCategoryArray}
              >
                <option value="">Select Category ...</option>
                {categories &&
                  categories
                    .filter(
                      (category) =>
                        !item.categories.find(
                          (el) => Number(el) === category.id
                        )
                    )
                    .map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Remove Category</Form.Label>
              <Form.Control
                as="select"
                name="categories"
                onChange={removeFromCategoryArray}
              >
                <option value="">Select Category ...</option>
                {categories &&
                  categories
                    .filter((category) =>
                      item.categories.find((el) => Number(el) === category.id)
                    )
                    .map((category) => {
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      );
                    })}
              </Form.Control>
            </Form.Group>
          </Form.Row>

          <Form.Group>
            <Form.Label>Item Categories</Form.Label>
            <Form.Control
              type="text"
              value={
                categories
                  ? categories
                      .filter((category) =>
                        item.categories.find((el) => Number(el) === category.id)
                      )
                      .map((category) => {
                        return category.name;
                      })
                      .join(", ")
                  : ""
              }
              readOnly
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Item Image</Form.Label>
            <Form.Control as={Image} src={`/${item.image}`} alt={item.name} />
            <Form.File
              name="image"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError && <Message variant="danger">{uploadError}</Message>}
          </Form.Group>

          <Button type="submit" variant="primary" onClick={submitHandler}>
            Create Item
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default NewItem;
