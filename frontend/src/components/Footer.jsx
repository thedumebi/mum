import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="colored-section">
      <a href="tel:+2348028611554">
        <Button className="btn-small">
          <i className="fas fa-phone" />
        </Button>
      </a>
      <a href="mailto:tchiwuzoh@gmail.com">
        <Button className="btn-small">
          <i className="fas fa-envelope" />
        </Button>
      </a>
      <p>
        Copyright &copy; {year} Tessy Chiwuzoh | <Link to="/FAQs">FAQS</Link>
      </p>
      <p className="pb-3">
        Designed by <a href="https://chiwuzoh.com.ng">DMB</a>
      </p>
    </footer>
  );
};

export default Footer;
