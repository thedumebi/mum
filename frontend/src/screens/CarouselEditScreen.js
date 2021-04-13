import React, { useEffect, useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getCarouselDetails,
  updateCarousel,
} from "../actions/carousel.actions";
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
  const [objectUrls, setObjectUrls] = useState([]);

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
            text: carouselDetail.text !== null ? carouselDetail.text : "",
            image: carouselDetail.image !== null ? carouselDetail.image : "",
            link: carouselDetail.link !== null ? carouselDetail.link : "",
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

  const submitHandler = (e) => {
    if (carousel.name === "") {
      setNameError("This field is required!");
    } else if (nameError === null) {
      const data = new FormData();
      if (carouselDetail.name === carousel.name) {
        const { name, ...otherfields } = carousel;
        for (const name in otherfields) {
          if (
            otherfields[name] !== undefined &&
            otherfields[name] !== null &&
            otherfields[name] !== ""
          )
            data.append(name, otherfields[name]);
        }
        dispatch(updateCarousel(carouselDetail.id, data));
        removeUrls();
      } else {
        for (const name in carousel) {
          if (
            carousel[name] !== undefined &&
            carousel[name] !== null &&
            carousel[name] !== ""
          )
            data.append(name, carousel[name]);
        }
        dispatch(updateCarousel(carouselDetail.id, data));
        removeUrls();
      }
    }
    e.preventDefault();
  };

  const deleteImage = (name) => {
    const imageSrc = document.getElementById(name).src;
    URL.revokeObjectURL(imageSrc);
    setObjectUrls((prevValues) => {
      return [...prevValues.filter((val) => val !== imageSrc)];
    });
    setCarousel({ ...carousel, [name]: undefined });
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
    setCarousel((prevValues) => {
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
              <div
                className="delete-div"
                style={{ display: !carousel.image && "none" }}
              >
                <Form.Control
                  as={Image}
                  id="image"
                  src={
                    carouselDetail &&
                    carouselDetail.image &&
                    carouselDetail.image.url
                  }
                  alt={carousel.image.name}
                />
                <Form.Control
                  as={deleteIcon}
                  className="delete-icon"
                  name="image"
                />
              </div>
              {!carousel.image && (
                <Form.File
                  name="image"
                  label="Choose Image"
                  custom
                  onChange={preview}
                />
              )}
            </Form.Group>

            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control type="text" name="link" onChange={handleChange} />
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
