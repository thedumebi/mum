import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFaqs } from "../actions/faq.actions";
import { Button, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Route } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";

const FaqsList = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const dispatch = useDispatch();

  const faqList = useSelector((state) => state.faqList);
  const { loading, error, faqs, page, pages } = faqList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const faqDelete = useSelector((state) => state.faqDelete);
  const { success: successDelete } = faqDelete;

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      dispatch(getFaqs(keyword, pageNumber));
      if (successDelete) {
        history.push("/admin/faqs");
      }
    } else {
      history.push("/profile");
    }
  }, [dispatch, history, successDelete, keyword, pageNumber, userInfo]);

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
        <>
          <Route
            render={({ history, match }) => (
              <SearchBox history={history} url={match} />
            )}
          />
          {faqs && faqs.length === 0 ? (
            <h1 className="big-heading">Faqs are coming soon ;)</h1>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>QUESTION</th>
                    <th>ANSWER</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs &&
                    faqs.map((faq) => (
                      <tr key={faq.id}>
                        <td>{faq.id}</td>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ""}
                url={match}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaqsList;
