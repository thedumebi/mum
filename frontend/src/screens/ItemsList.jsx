import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../actions/item.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";
import Items from "../components/Items";
import { Route } from "react-router-dom";

const ItemsList = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const itemsList = useSelector((state) => state.itemList);
  const { loading, error, items, page, pages } = itemsList;

  useEffect(() => {
    dispatch(getItems(keyword, pageNumber));
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
          {items && items.length === 0 ? (
            <h1 className="big-heading">No Item available ☹</h1>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Row>
                {items &&
                  items.map((item) => {
                    return (
                      <Col
                        lg={3}
                        md={4}
                        xs={6}
                        key={item.id}
                        style={{ padding: 0 }}
                      >
                        <Items item={item} />
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

export default ItemsList;
