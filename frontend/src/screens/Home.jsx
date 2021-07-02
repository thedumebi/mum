import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Carousel, Col, Image, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getItemOfTheDay } from "../actions/item.actions";
import { listCarousels } from "../actions/carousel.actions";

const Home = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const itemOfTheDay = useSelector((state) => state.itemOfTheDay);
  const { loading, error, item } = itemOfTheDay;

  const dispatch = useDispatch();

  const [carousel, setCarousel] = useState([
    {
      signup: {
        image: userInfo
          ? "/images/BLACK-GIRL-AVATAR-CLIPART-ANKARA-FLOWER-PATTERN-07.png"
          : "/images/BLACK-GIRL-AVATAR-CLIPART-ANKARA-FLORAL--DRESS-07.png",
        text: userInfo ? "Visit profile" : "Browse through our items",
        link: userInfo ? "/profile" : "/categories",
      },
    },
    { itemOfTheDay: undefined },
  ]);

  const carouselList = useSelector((state) => state.carouselList);
  const { carousels } = carouselList;

  useEffect(() => {
    if (!item) {
      dispatch(getItemOfTheDay());
    } else {
      if (Object.keys(item).length !== 0) {
        setCarousel((prevValues) => {
          return [
            ...prevValues,
            {
              itemOfTheDay: {
                image:
                  item.image1 !== null &&
                  item.image1 !== "" &&
                  item.image1 !== undefined
                    ? item.image1?.url
                      ? item.image1?.url
                      : ""
                    : item.imag2 !== null &&
                      item.image2 !== "" &&
                      item.image2 !== undefined
                    ? item.image2?.url
                      ? item.image2?.url
                      : ""
                    : item.image3 !== null &&
                      item.image3 !== "" &&
                      item.image3 !== undefined &&
                      item.image3?.url
                    ? item.image3?.url
                    : "",
                text: `${item.name} (item of the day)`,
                link: `/item/${item.id}`,
              },
            },
          ];
        });
      }
    }
    if (!carousels) {
      dispatch(listCarousels());
    } else {
      const carouselList = carousels.map((carousel) => ({
        [carousel.name]: {
          image: carousel.image.url ? carousel.image.url : "",
          text: carousel.text,
          link: carousel.link,
        },
      }));
      setCarousel((prevValues) => {
        return [...prevValues, ...carouselList];
      });
    }
  }, [dispatch, item, carousels]);

  const isPlainObject = (obj) => {
    return obj === null ||
      obj === undefined ||
      Array.isArray(obj) ||
      typeof obj === "function" ||
      obj.construtor === Date
      ? false
      : typeof obj === "object";
  };

  return (
    <div>
      {userInfo ? (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome back {userInfo.username}</h1>
            <p>Satisfy your fabric needs today.</p>
            <Link to="/categories">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image
              src="/images/BLACK-GIRL-AVATAR-CLIPART-ANKARA-GEOMETRICAL-DRESS-07.png"
              className="home-image"
            />
          </Col>
        </Row>
      ) : (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome to Dominion Fabrics.</h1>
            <p>
              For ankara wholesale, retail and asoebi.
              <br /> Your outlook, our pride
            </p>
            <Link to="/categories">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image
              src="/images/BLACK-GIRL-AVATAR-CLIPART-POLKA-DOTS-FULL-DRESS-08.png"
              className="home-image"
            />
          </Col>
        </Row>
      )}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Carousel interval={3000} className="home-carousel">
        {carousel
          .filter((item) => isPlainObject(item[Object.keys(item)[0]]))
          .map((item, index) => (
            <Carousel.Item key={index}>
              {item[Object.keys(item)[0]].link ? (
                <Link to={item[Object.keys(item)[0]].link}>
                  {item[Object.keys(item)[0]].image && (
                    <Image
                      src={item[Object.keys(item)[0]].image}
                      className="d-block w-100"
                      alt="carousel image"
                    />
                  )}
                </Link>
              ) : (
                item[Object.keys(item)[0]].image && (
                  <Image
                    src={item[Object.keys(item)[0]].image}
                    className="d-block w-100"
                    alt="carousel image"
                  />
                )
              )}
              <Carousel.Caption>
                <h4>{item[Object.keys(item)[0]].text}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default Home;
