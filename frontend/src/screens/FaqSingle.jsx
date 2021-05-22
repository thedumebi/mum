import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Faqs from "../components/Faqs";
import { useDispatch, useSelector } from "react-redux";
import { getFaqDetails } from "../actions/faq.actions";
import { Button } from "react-bootstrap";

const Faq = ({ history, match }) => {
  const dispatch = useDispatch();

  const faqDetails = useSelector((state) => state.faqDetails);
  const { loading, error, faq } = faqDetails;

  useEffect(() => {
    dispatch(getFaqDetails(match.params.id));
  }, [dispatch, match]);

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        faq && <Faqs faq={faq} />
      )}
    </div>
  );
};

export default Faq;
