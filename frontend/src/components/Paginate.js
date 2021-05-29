import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({ pages, page, isAdmin = false, keyword = "", url }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? url.path.includes("/categories")
                  ? keyword
                    ? `/categories/search/${keyword}/page/${x + 1}`
                    : `/categories/page/${x + 1}`
                  : url.path.includes("/items")
                  ? keyword
                    ? `/items/search/${keyword}/page/${x + 1}`
                    : `/items/page/${x + 1}`
                  : url.path.includes("/admin/users")
                  ? keyword
                    ? `/admin/users/search/${keyword}/page/${x + 1}`
                    : `/admin/users/page/${x + 1}`
                  : url.path.includes("/admin/sales/today")
                  ? keyword
                    ? `/admin/sales/today/search/${keyword}/page/${x + 1}`
                    : `/admin/sales/today/page/${x + 1}`
                  : url.path.includes("/admin/sales")
                  ? keyword
                    ? `/admin/sales/search/${keyword}/page/${x + 1}`
                    : `/admin/sales/page/${x + 1}`
                  : `/page/${x + 1}`
                : `/admin/items/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
