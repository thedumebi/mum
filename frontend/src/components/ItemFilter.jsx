import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { parseQueryString } from "./parseQueryString";

const ItemFilter = ({
  categories,
  output,
  setOverlay,
  overlay,
  history,
  location,
  match,
}) => {
  const { categories: categoriesFilter, prices: priceFilter } =
    parseQueryString(location?.search);

  const [filter, setFilter] = useState({
    categories: Array.isArray(categoriesFilter) ? [...categoriesFilter] : [],
    prices: Array.isArray(priceFilter) ? [...priceFilter] : [],
  });

  const handleView = () => {
    setOverlay(!overlay);
  };

  const filterCategories = (e) => {
    const { name, checked } = e.target;
    const index = filter.categories.findIndex((c) => c.hasOwnProperty([name]));
    setFilter((prevValues) => {
      return index === -1
        ? {
            ...prevValues,
            categories: [...prevValues.categories, { [name]: checked }],
          }
        : {
            ...prevValues,
            categories: [
              ...prevValues.categories.slice(0, index),
              { [name]: checked },
              ...prevValues.categories.slice(index + 1),
            ],
          };
    });
  };

  const filterPrice = (e) => {
    const { name, checked } = e.target;
    const index = filter.prices.findIndex((p) => p.hasOwnProperty([name]));
    setFilter((prevValues) => {
      return index === -1
        ? {
            ...prevValues,
            prices: [...prevValues.prices, { [name]: checked }],
          }
        : {
            ...prevValues,
            prices: [
              ...prevValues.prices.slice(0, index),
              { [name]: checked },
              ...prevValues.prices.slice(index + 1),
            ],
          };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let filterString = "";
    let counter = 0;
    for (const key in filter) {
      if (filter.hasOwnProperty(key) && filter[key].length > 0) {
        for (var i = 0; i < filter[key].length; i++) {
          if (filter[key][i][Object.keys(filter[key][i])] === true) {
            counter++;
            if (counter > 1) {
              filterString += "&";
            }
            filterString +=
              `${[key]}[${Object.keys(filter[key][i])[0]}]` +
              "=" +
              filter[key][i][Object.keys(filter[key][i])];
          }
        }
      }
    }

    history.push(`${match?.url}?${filterString}`);
    handleView()
    // output(filterString);
  };

  return (
    <div>
      {overlay ? (
        <div style={{ zIndex: 10 }}>
          <Button onClick={handleView}>X</Button>
          <div
            style={{
              backgroundColor: "#4f5c4f",
              padding: "2%",
              margin: "0 auto",
              textAlign: "center",
              width: "200px",
              color: "white",
              zIndex: 10,
            }}
          >
            <Form>
              <Form.Group>
                <Form.Label className="sub-heading">Categories</Form.Label>
                {categories.map((category, index) => (
                  <Form.Check
                    style={{ textAlign: "left" }}
                    key={index}
                    type="checkbox"
                    name={category.name}
                    label={category.name}
                    value={
                      filter.categories[category.name]?.checked
                        ? filter.categories[category.name]?.checked
                        : ""
                    }
                    defaultChecked={
                      Array.isArray(categoriesFilter) &&
                      categoriesFilter.findIndex((c) =>
                        c.hasOwnProperty(category.name)
                      ) > -1
                        ? Object.values(
                            categoriesFilter.find((c) =>
                              c.hasOwnProperty(category.name)
                            )
                          )[0]
                        : false
                    }
                    onChange={filterCategories}
                  />
                ))}
              </Form.Group>

              <Form.Group>
                <Form.Label className="sub-heading">Price</Form.Label>
                {["0-2,000", "2,000-5,000", "5,000-10,000", "10,000-above"].map(
                  (price, index) => (
                    <Form.Check
                      key={index}
                      style={{ textAlign: "left" }}
                      type="checkbox"
                      name={price.replace(/,/g, "")}
                      label={price}
                      value={
                        filter.prices[price]?.checked
                          ? filter.prices[price]?.checked
                          : ""
                      }
                      defaultChecked={
                        Array.isArray(priceFilter) &&
                        priceFilter.findIndex((c) =>
                          c.hasOwnProperty(price.replace(/,/g, ""))
                        ) > -1
                          ? Object.values(
                              priceFilter.find((c) =>
                                c.hasOwnProperty(price.replace(/,/g, ""))
                              )
                            )[0]
                          : false
                      }
                      onChange={filterPrice}
                    />
                  )
                )}
              </Form.Group>

              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: "#222" }}
              >
                Apply
              </Button>
            </Form>
          </div>
        </div>
      ) : (
        <div>
          <Button onClick={handleView}>Filter</Button>
        </div>
      )}
    </div>
  );
};

export default ItemFilter;
