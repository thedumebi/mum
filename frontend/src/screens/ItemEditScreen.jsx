import React, { useEffect, useState } from "react";
import { Form, Button, Col, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { ITEM_UPDATE_RESET } from "../constants/item.constants";
import { getItemDetails, updateItem } from "../actions/item.actions";
import { getCategories } from "../actions/category.actions";

const ItemEdit = ({ history, match }) => {
  const [item, setItem] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image1: "",
    image2: "",
    image3: "",
    categories: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item: itemDetail } = itemDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const itemUpdate = useSelector((state) => state.itemUpdate);
  const { loading: loadingUpdate, success, error: updateError } = itemUpdate;

  const [nameError, setNameError] = useState(null);

  const [objectUrls, setObjectUrls] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/item/${match.params.id}/edit`);
    } else {
      dispatch(getCategories());
      if (success) {
        setSuccessMessage(success);
      }
      if (!itemDetail || !itemDetail.name || success) {
        dispatch({ type: ITEM_UPDATE_RESET });
        dispatch(getItemDetails(match.params.id));
      } else {
        setItem((prevValue) => {
          return {
            ...prevValue,
            name: itemDetail.name,
            price: itemDetail.price,
            quantity: itemDetail.quantity !== null ? itemDetail.quantity : "",
            description:
              itemDetail.description !== null ? itemDetail.description : "",
            image1: itemDetail.image1 !== null ? itemDetail.image1 : "",
            image2: itemDetail.image2 !== null ? itemDetail.image2 : "",
            image3: itemDetail.image3 !== null ? itemDetail.image3 : "",
            categories: itemDetail.categories.map((category) => category.id),
          };
        });
        if (userInfo.role !== "admin") {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, userInfo, itemDetail, success, match]);

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
    setItem((prevvalues) => {
      return {
        ...prevvalues,
        [name]: [...prevvalues.categories.filter((el) => el !== Number(value))],
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
      if (itemDetail.name === item.name) {
        const { name, ...otherfields } = item;
        for (const name in otherfields) {
          if (
            otherfields[name] !== undefined &&
            otherfields[name] !== null &&
            otherfields[name] !== ""
          )
            data.append(name, otherfields[name]);
        }
        dispatch(updateItem(itemDetail.id, data));
        removeUrls();
      } else {
        for (const name in item) {
          if (
            item[name] !== undefined &&
            item[name] !== null &&
            item[name] !== ""
          )
            data.append(name, item[name]);
        }
        dispatch(updateItem(itemDetail.id, data));
        removeUrls();
      }
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
      {loadingUpdate ? (
        <Loader />
      ) : (
        <div>
          <Button
            className="btn btn-dark my-3"
            onClick={() => history.goBack()}
          >
            Back
          </Button>

          <FormContainer>
            <h2>Edit Item</h2>
            {loading && <Loader />}
            {error && <Message variant="danger">{error}</Message>}
            {updateError && <Message variant="danger">{updateError}</Message>}
            {successMessage && (
              <Message variant="success">Item Updated</Message>
            )}

            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
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
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  onChange={handleChange}
                  name="quantity"
                  value={item.quantity}
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
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Item Categories</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    categories
                      ? categories
                          .filter(
                            (category) =>
                              item.categories &&
                              item.categories.find(
                                (el) => Number(el) === category.id
                              )
                          )
                          .map((category) => {
                            return category.name;
                          })
                      : ""
                  }
                  readOnly
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
                            item.categories &&
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
                        .filter(
                          (category) =>
                            item.categories &&
                            item.categories.find(
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
              </Form.Row>

              <Form.Group>
                <Form.Label>Item Image</Form.Label>
                <div
                  className="delete-div"
                  style={{ display: !item.image1 && "none" }}
                >
                  <Form.Control
                    as={Image}
                    id="image1"
                    src={
                      itemDetail && itemDetail.image1 && itemDetail.image1.url
                    }
                    alt={item.image1}
                  />
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
                  <Form.Control
                    as={Image}
                    id="image2"
                    src={
                      itemDetail && itemDetail.image2 && itemDetail.image2.url
                    }
                    alt={item.image2}
                  />
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
                  <Form.Control
                    as={Image}
                    id="image3"
                    src={
                      itemDetail && itemDetail.image3 && itemDetail.image3.url
                    }
                    alt={item.image3}
                  />
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
                Update
              </Button>
            </Form>
          </FormContainer>
        </div>
      )}
    </div>
  );
};

export default ItemEdit;
