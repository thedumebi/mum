import React, { useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getCarouselDetails,
  updateCarousel,
} from "../actions/carousel.actions";
import axios from "axios";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { ADMIN_UPDATE_CAROUSEL_RESET } from "../constants/carousel.constants";

const CarouselEditScreen = ({ match, history }) => {
  const carouselId = match.params.id;
  const [carousel, setCarousel] = useState({
    name: "",
    text: "",
    image: "",
    link: "",
  });

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const carouselDetails = useSelector((state) => state.carouselDetails);
  const { loading, error, carousel: carouselDetail } = carouselDetails;

  const carouselUpdate = useSelector((state) => state.carouselUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = carouselUpdate;

  const [nameError, setNameError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/carousels/${carouselId}/edit`);
    } else {
      if (successUpdate) {
        history.push("/admin/carousels");
        dispatch({ type: ADMIN_UPDATE_CAROUSEL_RESET });
      }
      if (!carouselDetail) {
        dispatch(getCarouselDetails(carouselId));
      } else {
        setCarousel((prevValue) => {
          return {
            ...prevValue,
            name: carouselDetail.name,
            text: carouselDetail.text,
            image: carouselDetail.image,
            link: carouselDetail.link,
          };
        });

        if (userInfo.role !== "admin") {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, carouselId, successUpdate, userInfo, carouselDetail]);

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

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);

      if (data.url) {
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

  const submitHandler = (e) => {
    if (
      uploadError === "Please select images only!!!" ||
      "The maximum file size"
    ) {
      setUploadError(null);
    }
    if (carousel.name === "") {
      setNameError("This field is required!");
    } else if (uploadError === null && nameError === null) {
      if (carouselDetail.name === carousel.name) {
        const { name, ...otherfields } = carousel;
        dispatch(updateCarousel(carouselDetail.id, otherfields));
      } else {
        dispatch(updateCarousel(carouselDetail.id, carousel));
      }
    }
    e.preventDefault();
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
        <h2>Edit Carousel</h2>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
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
                    src={carousel.image.url}
                    alt={carousel.image.name}
                  />
                  <Form.Control
                    as={deleteIcon}
                    className="delete-icon"
                    name="image"
                  />
                </div>
              )}
              {!carousel.image && (
                <Form.File
                  name="image"
                  label="Choose Image"
                  custom
                  onChange={uploadFileHandler}
                />
              )}

              {uploadError && <Message variant="danger">{uploadError}</Message>}
            </Form.Group>

            <Button className="btn-md btn-dark" onClick={submitHandler}>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default CarouselEditScreen;
