import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactWhatsapp from "react-whatsapp";

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
      <Button
        as={ReactWhatsapp}
        number="+2348022111180"
        message="Good day, I would like to make an enquiry about ..."
      >
        <i className="fa fa-whatsapp fa-lg" />
      </Button>
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
