import React, { useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteFaq } from "../actions/faq.actions";
import Message from "./Message";

const Faqs = ({ faq }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const faqDelete = useSelector((state) => state.faqDelete);
  const { success, error } = faqDelete;

  const dispatch = useDispatch();

  const deleteHandler = (event) => {
    if (window.confirm("This is an irreversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE FAQ?")) {
        dispatch(deleteFaq(faq.id));
      }
    }
  };

  useEffect(() => {
    if (success) {
      history.push("/admin/faqs");
    }
  }, [history, success]);

  return (
    <div className="case">
      {error && <Message variant="danger">{error}</Message>}
      <div
        className="content"
        style={{ height: url.path === "/faq/:id" && "auto" }}
      >
        <h1 className="sub-heading">Question: {faq.question}</h1>
        <small>Answer: {faq.answer}</small>
      </div>

      {faq.id &&
        url.path === "/faqs/:id" &&
        userInfo &&
        userInfo.role === "admin" && (
          <>
            <Button className="btn-dark" type="button" onClick={deleteHandler}>
              Delete
            </Button>

            <Link to={`/admin/faqs/${faq.id}/edit`}>
              <Button className="btn-dark" type="button">
                Edit
              </Button>
            </Link>
          </>
        )}

      {faq.id && url.path !== "/faqs/:id" && (
        <Link to={`/faqs/${faq.id}`}>
          <Button className="btn-dark" type="button">
            View
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Faqs;
