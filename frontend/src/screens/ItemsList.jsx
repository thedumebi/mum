import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../actions/item.actions";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";
import Items from "../components/Items";
import { Route } from "react-router-dom";
import { getAllCategories } from "../actions/category.actions";
import ItemFilter from "../components/ItemFilter";

const ItemsList = ({ history, match, location }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const filter = location.search.slice(1);

  const [overlay, setOverlay] = useState(false);

  const dispatch = useDispatch();

  const itemsList = useSelector((state) => state.itemList);
  const { loading, error, items, page, pages } = itemsList;

  const categoryListAll = useSelector((state) => state.categoryListAll);
  const { categories } = categoryListAll;

  useEffect(() => {
    dispatch(getItems(keyword, pageNumber, filter));
    dispatch(getAllCategories());
  }, [dispatch, keyword, pageNumber, filter]);

  const filterItems = (string) => {
    dispatch(getItems(keyword, pageNumber, string));
    setOverlay(!overlay);
  };

  const setBGOverlay = (bool) => setOverlay(bool);

  return (
    <div>
      {overlay ? (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.08)",
            height: "100vh",
          }}
        >
          {categories && Number(pageNumber) === 1 && (
            <ItemFilter
              categories={categories}
              output={filterItems}
              overlay={overlay}
              setOverlay={setBGOverlay}
              history={history}
              location={location}
              match={match}
            />
          )}
        </div>
      ) : (
        <>
          <Button
            className="btn btn-dark my-3"
            onClick={() => history.goBack()}
          >
            Back
          </Button>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <>
              {categories && Number(pageNumber) === 1 && (
                <ItemFilter
                  categories={categories}
                  output={filterItems}
                  overlay={overlay}
                  setOverlay={setBGOverlay}
                  history={history}
                  location={location}
                  match={match}
                />
              )}
              <Route
                render={({ history, match }) => (
                  <SearchBox history={history} url={match} />
                )}
              />
              {items && items.length === 0 ? (
                <h1 className="big-heading">No Item available ☹</h1>
              ) : (
                <>
                  <div style={{ textAlign: "center" }}>
                    <Row style={{ justifyContent: "center" }}>
                      {items &&
                        items.map((item) => {
                          return (
                            <Col
                              lg={2}
                              md={4}
                              xs={4}
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
                      filter={filter}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ItemsList;
