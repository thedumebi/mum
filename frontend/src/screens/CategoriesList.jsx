import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../actions/category.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Categories from "../components/Categories";
import { Route } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";

const CategoriesList = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories, page, pages } = categoryList;

  useEffect(() => {
    dispatch(getCategories(keyword, pageNumber));
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
          {categories && categories.length === 0 ? (
            <h1 className="big-heading">Categories are coming soon ;)</h1>
          ) : (
            <>
              <h1 className="big-heading">Categories</h1>
              <div style={{ textAlign: "center" }}>
                <Row>
                  {categories &&
                    categories.map((category) => {
                      return (
                        <Col
                          lg={3}
                          md={4}
                          xs={4}
                          key={category.id}
                          style={{ padding: 0 }}
                        >
                          <Categories category={category} />
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesList;
