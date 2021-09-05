import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { Button, Form } from "react-bootstrap";
import { createFaq } from "../actions/faq.actions";
import { getUserDetails } from "../actions/user.actions";

const NewFaq = ({ history }) => {
  const [faq, setFaq] = useState({
    question: "",
    answer: "",
  });
  const [message, setMessage] = useState(undefined);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const createFaqState = useSelector((state) => state.faqCreate);
  const { loading, error, status: success } = createFaqState;

  useEffect(() => {
    if (!user && userInfo) {
      dispatch(getUserDetails(userInfo.id));
    } else if (user && user.role !== "admin") {
      history.push("/profile");
    } else if (!user || !userInfo) {
      history.push("/login?redirect=/admin/faqs/add");
    } else {
      if (success) {
        history.push("/admin/faqs/");
      }
    }
  }, [history, userInfo, user, dispatch, success]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFaq((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const submitHandler = (event) => {
    if (faq.question === "" || faq.question === "") {
      setMessage("Missing required fields");
    } else {
      setMessage(undefined);
    }
    if (!message) dispatch(createFaq(faq));

    event.preventDefault();
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <FormContainer>
        <h2>New Faq</h2>

        {loading ? (
          <Loader />
        ) : (
          <>
            {error && <Message variant="danger">{error}</Message>}
            {message && <Message variant="danger">{message}</Message>}
            <Message variant="info">
              Fields marked with * are compulsory
            </Message>
            <Form>
              <Form.Group>
                <Form.Label>
                  Question <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="question"
                  value={faq.question}
                  onChange={handleChange}
                  placeholder="Question"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Answer <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  onChange={handleChange}
                  name="answer"
                  value={faq.answer}
                  rows={3}
                  placeholder="Answer to the question."
                />
              </Form.Group>

              <Button type="submit" variant="primary" onClick={submitHandler}>
                Create Faq
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default NewFaq;
