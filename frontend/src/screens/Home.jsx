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

  const [carousel, setCarousel] = useState({
    signup: {
      image: "/images/llama.svg",
      text: userInfo ? "Visit profile" : "Browse through our items",
      link: userInfo ? "/profile" : "/categories",
    },
    itemOfTheDay: undefined,
  });

  const carouselList = useSelector((state) => state.carouselList);
  const { carousels } = carouselList;

  const adminCarousels = {};

  if (carousels && carousels.length !== 0) {
    for (let i = 0; i < carousels.length; i++) {
      adminCarousels[carousels[i].name] = {
        image: carousels[i].image.url,
        text: carousels[i].text,
        link: carousels[i].link,
      };
    }
    Object.assign(carousel, adminCarousels);
  }

  useEffect(() => {
    if (!item) {
      dispatch(getItemOfTheDay());
    } else {
      setCarousel((prevValues) => {
        return {
          ...prevValues,
          itemOfTheDay: {
            image:
              item.image1 !== null || "" || undefined
                ? item.image1.url
                : item.imag2 !== null || "" || undefined
                ? item.image2.url
                : item.image3.url,
            text: `${item.name} (item of the day)`,
            link: `/item/${item.id}`,
          },
        };
      });
    }
    dispatch(listCarousels());
  }, [dispatch, item]);

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
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      ) : (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome to Tessy's Fabric Store.</h1>
            <p>We are here for all your fabric needs.</p>
            <Link to="/categories">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      )}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Carousel interval={3000} className="home-carousel">
        {Object.keys(carousel)
          .filter((item) => carousel[item] !== undefined)
          .map((item, index) => (
            <Carousel.Item key={index}>
              {carousel[item].link ? (
                <Link to={carousel[item].link}>
                  {carousel[item].image && (
                    <Image
                      src={carousel[item].image}
                      className="d-block w-100"
                      alt="carousel image"
                    />
                  )}
                </Link>
              ) : (
                carousel[item].image && (
                  <Image
                    src={carousel[item].image}
                    className="d-block w-100"
                    alt="carousel image"
                  />
                )
              )}
              <Carousel.Caption>
                <h4>{carousel[item].text}</h4>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
      </Carousel>
    </div>
  );
};

export default Home;
