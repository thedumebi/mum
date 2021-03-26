import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history, url }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    if (keyword.trim()) {
      history.push(
        url.path.includes("/categories") && `/categories/search/${keyword}`
      );
      history.push(url.path.includes("/items") && `/items/search/${keyword}`);
      history.push(
        url.path.includes("/category") && `/items/search/${keyword}`
      );
    } else {
      history.push(url.path.includes("/categories") && `/categories`);
      history.push(url.path.includes("/items") && `/items`);

      history.push(
        !url.path.includes("/categories") && !url.path.includes("/items") && "/"
      );
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={
          url.path === "/categories"
            ? "Search categories ..."
            : "Search items ..."
        }
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2 btn-dark">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
