import React from "react";
import { Link } from "react-router-dom";
import { Button, Col, Image, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const Home = () => {
  const userLogin = useSelector((state) => state.loginUser);
  const { userInfo } = userLogin;

  return (
    <div>
      {userInfo ? (
        <Row className="left">
          <Col lg={6}>
            <h1 className="big-heading">Welcome back {userInfo.username}</h1>
            <p>Exchange goods in a simple way</p>
            <Link to="/items">
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
            <p>We are here for all your fabric needs</p>
            <Link to="/items">
              <Button className="btn btn-lg btn-dark">Get Started</Button>
            </Link>
          </Col>
          <Col lg={6}>
            <Image src="/images/llama.svg" className="home-image" />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Home;
