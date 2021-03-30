import React, { useEffect, useState } from "react";
import axios from "axios";
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
  const { success, error: updateError } = itemUpdate;

  const [uploadError, setUploadError] = useState({
    one: null,
    two: null,
    three: null,
  });

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
            quantity: itemDetail.quantity,
            description: itemDetail.description,
            image1: itemDetail.image1,
            image2: itemDetail.image2,
            image3: itemDetail.image3,
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
  };

  const uploadFileHandler = async (event) => {
    const { name, files } = event.target;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("itemId", itemDetail.id);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      if (data !== "Please select images only!!!") {
        setItem((prevValue) => {
          return { ...prevValue, [name]: data };
        });
        if (name === "image1") {
          setUploadError({ ...uploadError, one: null });
        } else if (name === "image2") {
          setUploadError({ ...uploadError, two: null });
        } else if (name === "image3") {
          setUploadError({ ...uploadError, three: null });
        }
      } else {
        if (name === "image1") {
          setUploadError({ ...uploadError, one: data });
        } else if (name === "image2") {
          setUploadError({ ...uploadError, two: data });
        } else if (name === "image3") {
          setUploadError({ ...uploadError, three: data });
        }
      }
    } catch (error) {
      if (name === "image1") {
        console.log({ error });
        setUploadError({ ...uploadError, one: error.message });
      } else if (name === "image2") {
        setUploadError({ ...uploadError, two: error.message });
      } else if (name === "image3") {
        setUploadError({ ...uploadError, three: error.message });
      }
    }
  };

  const submitHandler = (event) => {
    for (let i = 1; i <= Object.keys(uploadError).length; i++) {
      if (
        uploadError[Object.keys(uploadError)[i]] ===
        "Please select images only!!!"
      ) {
        uploadError[Object.keys(uploadError)[i]] = null;
      }
    }
    if (
      uploadError.one === null &&
      uploadError.two === null &&
      uploadError.three === null
    ) {
      if (itemDetail.name === item.name) {
        const { name, ...otherfields } = item;
        dispatch(updateItem(itemDetail.id, otherfields));
      } else {
        dispatch(updateItem(itemDetail.id, item));
      }
    }
    event.preventDefault();
  };

  const deleteImage = (name) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const image = item[name];

      axios.post("/api/items/delete-image", { image }, config);
    } catch (error) {
      console.log(error.message);
    }
    setItem({ ...item, [name]: undefined });
  };

  const deleteIcon = ({ name }) => {
    return (
      <div className="delete-icon" onClick={() => deleteImage(name)}>
        <i className="fas fa-trash fa-lg"></i>
      </div>
    );
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>Edit Item</h2>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {updateError && <Message variant="danger">{updateError}</Message>}
        {successMessage && <Message variant="success">Item Updated</Message>}

        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              placeholder="Name of Item"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Price(NGN)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              placeholder="Price of items in this category"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              onChange={handleChange}
              name="quantity"
              value={item.quantity}
              placeholder="Number of Item."
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
              placeholder="Brief Description of the Item."
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
            <Form.Label>Item Image</Form.Label>
            {item.image1 && (
              <div className="delete-div">
                <Form.Control
                  as={Image}
                  src={`/${item.image1}`}
                  alt={item.image1}
                />
                <Form.Control
                  as={deleteIcon}
                  className="delete-icon"
                  name="image1"
                />
              </div>
            )}
            <Form.File
              name="image1"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError.one && (
              <Message variant="danger">{uploadError.one}</Message>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Second Image</Form.Label>
            {item.image2 && (
              <div className="delete-div">
                <Form.Control
                  as={Image}
                  src={`/${item.image2}`}
                  alt={item.image2}
                />
                <Form.Control
                  as={deleteIcon}
                  className="delete-icon"
                  name="image2"
                />
              </div>
            )}
            <Form.File
              name="image2"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError.two && (
              <Message variant="danger">{uploadError.two}</Message>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Third Image</Form.Label>
            {item.image3 && (
              <div className="delete-div">
                <Form.Control
                  as={Image}
                  src={`/${item.image3}`}
                  alt={item.image3}
                />
                <Form.Control
                  as={deleteIcon}
                  className="delete-icon"
                  name="image3"
                />
              </div>
            )}
            <Form.File
              name="image3"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError.three && (
              <Message variant="danger">{uploadError.three}</Message>
            )}
          </Form.Group>

          <Button type="submit" variant="primary" onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default ItemEdit;
