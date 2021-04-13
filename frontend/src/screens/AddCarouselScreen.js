import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Image } from "react-bootstrap";
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
  const [objectUrls, setObjectUrls] = useState([]);

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
    if (carousel.name === "") {
      setNameError("This field is required!");
    } else if (nameError === null) {
      const data = new FormData();
      for (var name in carousel) {
        if (
          carousel[name] !== undefined &&
          carousel[name] !== null &&
          carousel[name] !== ""
        )
          data.append(name, carousel[name]);
      }
      dispatch(createCarousel(data));
      removeUrls();
      e.preventDefault();
    }
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
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Carousel Image</Form.Label>
            <div
              className="delete-div"
              style={{ display: !carousel.image && "none" }}
            >
              <Form.Control as={Image} id="image" src="" alt="" />
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

          <Button className="btn-md btn-dark" onClick={addCarousel}>
            Create Carousel
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default AddCarouselScrren;
