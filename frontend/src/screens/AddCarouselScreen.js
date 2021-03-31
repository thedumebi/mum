import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createCarousel } from "../actions/carousel.actions";
import FormContainer from "../components/FormContainer";
import { ADMIN_CREATE_CAROUSEL_RESET } from "../constants/carousel.constants";

const AddCarouselScrren = ({ history }) => {
  const [carousel, setCarousel] = useState({
    name: "",
  });

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const carouselCreate = useSelector((state) => state.carouselCreate);
  const { loading, error, success } = carouselCreate;

  const [nameError, setNameError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/add-carousel");
    } else {
      if (success) {
        history.push("/admin/carousels");
        dispatch({ type: ADMIN_CREATE_CAROUSEL_RESET });
      }
      if (userInfo.role !== "admin") {
        history.push("/profile");
      }
    }
  }, [history, dispatch, success, userInfo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCarousel((prevValue) => {
      return { ...prevValue, [name]: value };
    });
    if (name === "name" && value === "") {
      setNameError("This field is required");
    } else {
      setNameError(null);
    }
  };

  const addCarousel = (e) => {
    if (
      uploadError === "Please select images only!!!" ||
      "The maximum file size"
    ) {
      setUploadError(null);
    }
    if (carousel.name === "") {
      setNameError("This field is required!");
    } else if (uploadError === null && nameError === null) {
      dispatch(createCarousel(carousel));
    }
    e.preventDefault();
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
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

      if (
        !data.includes("Please select images only!!!") &&
        !data.includes("The maximum file size")
      ) {
        setCarousel((prevValue) => {
          return { ...prevValue, [e.target.name]: data };
        });
        setUploadError(null);
      } else {
        setUploadError(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = (name) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const image = carousel[name];

      axios.post("/api/items/delete-image", { image }, config);
    } catch (error) {
      console.log(error.message);
    }
    setCarousel({ ...carousel, [name]: undefined });
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
        <h2>Create Home Page Carousel</h2>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="name"
              type="text"
              placeholder="Enter a name for your Carousel"
              value={carousel.name}
            />
            {nameError && <Message variant="danger">{nameError}</Message>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Text</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="text"
              type="text"
              placeholder="Enter Carousel Text to be displayed"
              value={carousel.text}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Carousel Image</Form.Label>
            {carousel.image && (
              <div className="delete-div">
                <Form.Control
                  as={Image}
                  src={`/${carousel.image}`}
                  alt={carousel.image}
                />
                <Form.Control
                  as={deleteIcon}
                  className="delete-icon"
                  name="image"
                />
              </div>
            )}
            <Form.File
              name="image"
              label="Choose Image"
              custom
              onChange={uploadFileHandler}
            />
            {uploadError && <Message variant="danger">{uploadError}</Message>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              name="link"
              value={carousel.link}
              onChange={handleChange}
            />
          </Form.Group>

          <Button className="btn-md btn-dark" onClick={addCarousel}>
            Create Carousel
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default AddCarouselScrren;
