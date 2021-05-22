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
      history.push(
        url.path.includes("faqs") &&
          !url.path.includes("admin") &&
          `/faqs/search/${keyword}`
      );
      history.push(
        url.path.includes("faqs") &&
          url.path.includes("admin") &&
          `admin/faqs/search/${keyword}`
      );
      history.push(url.path.includes("/items") && `/items/search/${keyword}`);
      history.push(
        url.path.includes("/category") && `/items/search/${keyword}`
      );
      history.push(
        url.path.includes("/admin/users") && `/admin/users/search/${keyword}`
      );
    } else {
      history.push(url.path.includes("/categories") && `/categories`);
      history.push(
        url.path.includes("/faqs") && !url.path.includes("/admin") && `/faqs`
      );
      history.push(
        url.path.includes("/faqs") && url.path.includes("/admin") && `/faqs`
      );
      history.push(url.path.includes("/items") && `/items`);
      history.push(url.path.includes("/admin/users") && `/admin/users`);
      history.push(
        !url.path.includes("/categories") &&
          !url.path.includes("/items") &&
          !url.path.includes("/admin/users") &&
          !url.path.includes("/faqs") &&
          "/"
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
            : url.path === "/admin/users"
            ? "Search users ..."
            : url.path.includes("faqs")
            ? "Search FAQs"
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
