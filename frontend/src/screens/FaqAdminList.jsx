import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { getFaqs, deleteFaq } from "../actions/faq.actions";
import { Button, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Route, Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";

const FaqsAdminList = ({ history, match }) => {
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
    window.scrollTo(0, 0);
    if (userInfo && userInfo.role === "admin") {
      dispatch(getFaqs(keyword, pageNumber));
      if (successDelete) {
        history.push("/admin/faqs");
      }
    } else {
      history.push("/profile");
    }
  }, [dispatch, history, successDelete, keyword, pageNumber, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE QUESTION?")) {
        dispatch(deleteFaq(id));
      }
    }
  };

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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {faqs &&
                    faqs.map((faq) => (
                      <tr key={faq.id}>
                        <td>{faq.id}</td>
                        <td>{faq.question}</td>
                        <td>{faq.answer}</td>
                        <td>
                          <LinkContainer to={`/admin/faqs/${faq.id}/edit`}>
                            <Button variant="light" className="btn-sm">
                              <i className="fas fa-edit"></i>
                            </Button>
                          </LinkContainer>
                          <Button
                            variant="danger"
                            className="btn-sm"
                            onClick={() => deleteHandler(faq.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          )}
          <Link to={`/admin/faqs/add`}>
            <Button variant="dark" className="btn-sm">
              Create a new FAQ
            </Button>
          </Link>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
            url={match}
          />
        </>
      )}
    </div>
  );
};

export default FaqsAdminList;
