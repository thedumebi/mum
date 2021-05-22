import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFaqs } from "../actions/faq.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Faqs from "../components/Faqs";
import { Route } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";

const FaqsList = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const dispatch = useDispatch();

  const faqList = useSelector((state) => state.faqList);
  const { loading, error, faqs, page, pages } = faqList;

  useEffect(() => {
    dispatch(getFaqs(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

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
              <Row>
                {faqs &&
                  faqs.map((faq) => {
                    return (
                      <Col
                        lg={3}
                        md={4}
                        xs={6}
                        key={faq.id}
                        style={{ padding: 0 }}
                      >
                        <Faqs faq={faq} />
                      </Col>
                    );
                  })}
              </Row>
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
