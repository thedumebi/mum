import React, { useEffect } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button } from "react-bootstrap";
import Items from "./Items";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../actions/category.actions";
import Message from "./Message";

const Categories = ({ category }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { success, error } = categoryDelete;

  const dispatch = useDispatch();

  const deleteHandler = (event) => {
    if (window.confirm("This is an irreversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE CATEGORY?")) {
        dispatch(deleteCategory(category.id));
      }
    }
  };

  useEffect(() => {
    if (success) {
      history.push("/profile");
    }
  }, [history, success]);

  return (
    <div className="case">
      {error && <Message variant="danger">{error}</Message>}
      <div
        className="content"
        style={{ height: url.path === "/category/:id" && "auto" }}
      >
        <h1 className="sub-heading">{category.name}</h1>
        <small>Description: {category.description}</small>
        {category.items &&
          category.items.map((item) => <Items key={item.id} item={item} />)}
      </div>

      {category.id &&
        url.path === "/category/:id" &&
        userInfo &&
        userInfo.role === "admin" && (
          <>
            <Button className="btn-dark" type="button" onClick={deleteHandler}>
              Delete
            </Button>

            <Link to={`/category/${category.id}/edit`}>
              <Button className="btn-dark" type="button">
                Edit
              </Button>
            </Link>
          </>
        )}

      {category.id &&
        (url.path === "/category/:id" || url.path === "/profile") && (
          <Link
            to={
              url.path === "/profile"
                ? `/items/newitem?category=${category.id}`
                : `/items/newitem`
            }
          >
            <Button className="btn-dark" type="button">
              Add a new item
            </Button>
          </Link>
        )}

      {category.id && url.path !== "/category/:id" && (
        <Link to={`/category/${category.id}`}>
          <Button className="btn-dark" type="button">
            View
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Categories;
