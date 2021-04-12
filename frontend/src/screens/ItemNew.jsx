import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Col, Form, Image } from "react-bootstrap";
import { createItem } from "../actions/item.actions";
import { CREATE_ITEM_RESET } from "../constants/item.constants";
import { getCategories } from "../actions/category.actions";

const NewItem = ({ history, location }) => {
  const [item, setItem] = useState({
    name: "",
    categories: [],
  });
  const [objectUrls, setObjectUrls] = useState([]);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createItemState = useSelector((state) => state.itemCreate);
  const { loading, error, status } = createItemState;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const [nameError, setNameError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/items/newitem");
    } else {
      if (!categories) dispatch(getCategories());
      dispatch({ type: CREATE_ITEM_RESET });
      if (status) {
        history.push(`/items`);
      }
      if (categories) {
        setItem((prevValues) => {
          return {
            ...prevValues,
            categories: [
              ...prevValues.categories,
              Number(location.search.split("=")[1]),
            ],
          };
        });
      }
      if (userInfo.role !== "admin") {
        history.push("/profile");
      }
    }
  }, [history, dispatch, status, categories, location, userInfo]);

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

  const submitHandler = (event) => {
    if (item.name === "") {
      setNameError("This field is required");
    } else if (nameError === null) {
      const data = new FormData();
      for (const name in item) {
        if (
          item[name] !== undefined &&
          item[name] !== null &&
          item[name] !== ""
        )
          data.append(name, item[name]);
      }
      dispatch(createItem(data));
      removeUrls();
    }
    event.preventDefault();
  };

  const deleteImage = (name) => {
    const imageSrc = document.getElementById(name).src;
    URL.revokeObjectURL(imageSrc);
    setObjectUrls((prevValues) => {
      return [...prevValues.filter((val) => val !== imageSrc)];
    });
    setItem({ ...item, [name]: undefined });
  };

  const deleteIcon = ({ name }) => {
    return (
      <div className="delete-icon" onClick={() => deleteImage(name)}>
        <i className="fas fa-trash fa-lg"></i>
      </div>
    );
  };

  const preview = (event) => {
    const { name, files } = event.target;
    setItem((prevValues) => {
      return { ...prevValues, [name]: files[0] };
    });
    const frame = document.getElementById(name);
    const url = URL.createObjectURL(event.target.files[0]);
    setObjectUrls((prevValues) => {
      return [...prevValues, url];
    });
    frame.src = url;
  };

  const removeUrls = () => {
    for (let i = 0; i < objectUrls.length; i++) {
      URL.revokeObjectURL(objectUrls[i]);
    }
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
              min={0}
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
              min={0}
              placeholder="Number of Item"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              onChange={handleChange}
              name="description"
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
            <Form.Label>Selected Categories</Form.Label>
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
            <div
              className="delete-div"
              style={{ display: !item.image1 && "none" }}
            >
              <Form.Control id="image1" as={Image} src="" alt="" />
              <Form.Control
                as={deleteIcon}
                className="delete-icon"
                name="image1"
              />
            </div>
            {!item.image1 && (
              <Form.File
                name="image1"
                label="Choose Image"
                custom
                onChange={preview}
              />
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Second Image</Form.Label>
            <div
              className="delete-div"
              style={{ display: !item.image2 && "none" }}
            >
              <Form.Control as={Image} id="image2" src="" alt="" />
              <Form.Control
                as={deleteIcon}
                className="delete-icon"
                name="image2"
              />
            </div>
            {!item.image2 && (
              <Form.File
                name="image2"
                label="Choose Image"
                custom
                onChange={preview}
              />
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Third Image</Form.Label>
            <div
              className="delete-div"
              style={{ display: !item.image3 && "none" }}
            >
              <Form.Control as={Image} id="image3" src="" alt="" />
              <Form.Control
                as={deleteIcon}
                className="delete-icon"
                name="image3"
              />
            </div>
            {!item.image3 && (
              <Form.File
                name="image3"
                label="Choose Image"
                custom
                onChange={preview}
              />
            )}
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
