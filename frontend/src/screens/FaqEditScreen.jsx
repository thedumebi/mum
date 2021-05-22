import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { FAQ_UPDATE_RESET } from "../constants/faq.constants";
import FormContainer from "../components/FormContainer";
import { getFaqDetails, updateFaq } from "../actions/faq.actions";

const FaqEdit = ({ history, match }) => {
  const [faq, setFaq] = useState({
    question: "",
    answer: "",
  });

  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();

  const faqDetails = useSelector((state) => state.faqDetails);
  const { loading, error, faq: faqDetail } = faqDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const faqUpdate = useSelector((state) => state.faqUpdate);
  const { success, error: updateError } = faqUpdate;

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=/admin/faqs/${match.params.id}/edit`);
    } else {
      if (success) {
        setSuccessMessage(success);
        dispatch({ type: FAQ_UPDATE_RESET });
      }
      if (!faqDetail || success) {
        dispatch(getFaqDetails(match.params.id));
      } else {
        setFaq((prevValue) => {
          return {
            ...prevValue,
            question: faqDetail.question,
            answer: faqDetail.answer,
          };
        });
        if (userInfo.role !== "admin") {
          history.push("/profile");
        }
      }
    }
  }, [dispatch, history, userInfo, faqDetail, success, match]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFaq((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    dispatch(updateFaq(faqDetail.id, faq));

    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>Edit Faq</h2>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        {updateError && <Message variant="danger">{updateError}</Message>}
        {successMessage && <Message variant="success">Faq Updated</Message>}

        <Form>
          <Form.Group>
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              name="question"
              value={faq.question}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              onChange={handleChange}
              name="answer"
              value={faq.answer}
              rows={3}
            />
          </Form.Group>

          <Button type="submit" variant="primary" onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </FormContainer>
    </div>
  );
};

export default FaqEdit;
