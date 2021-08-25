import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { getAllItems } from "../actions/item.actions";
import { createSale } from "../actions/sales.actions";
import { CREATE_SALES_RESET } from "../constants/sales.constants";
import { Button, Col, Form, Row } from "react-bootstrap";

const CreateSaleScreen = ({ history, match }) => {
  const [itemType, setItemType] = useState("");
  const [item, setItem] = useState({});
  const [sale, setSale] = useState({
    itemId: "",
    quantity: 1,
    amount: "",
  });
  const [quantityError, setQuantityError] = useState(null);
  const [amountError, setAmountError] = useState(null);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();
  const salesCreate = useSelector((state) => state.salesCreate);
  const { success, error, loading } = salesCreate;

  const itemListAll = useSelector((state) => state.itemListAll);
  const { items } = itemListAll;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!userInfo) {
      history.push(`/login?redirect=/admin/sales/new`);
    } else {
      if (userInfo.role !== "admin") {
        history.push("/profile");
      }
      if (success) {
        dispatch({ type: CREATE_SALES_RESET });
        history.push("/admin/sales/today");
      }
      if (!items) {
        dispatch(getAllItems());
      }
    }
  }, [history, dispatch, userInfo, success, items]);

  const filterItem = (e) => {
    let { value } = e.target;
    value = Number(value);
    const foundItem = items.find((i) => i.id === value);
    setItem(foundItem);
    setSale((prevValues) => {
      return { ...prevValues, itemId: value, amount: foundItem.price };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prevValues) => {
      return { ...prevValues, [name]: Number(value) };
    });
    if (name === "quantity") {
      if (value > item.quantity) {
        setQuantityError(`The maximum number available is ${item.quantity}`);
      } else if (value < 1) {
        setQuantityError("The minimum number that can be added is one(1)");
      } else {
        setQuantityError(null);
      }
    } else if (name === "amount") {
      if (value < 1) {
        setAmountError("The amount field cannot be empty");
      } else {
        setAmountError(null);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (quantityError === null && amountError === null) {
      dispatch(createSale({ ...sale, itemId: item.id }));
    }
  };

  return (
    <div>
      <Button
        className="btn btn-dark my-3"
        onClick={() =>
          history.length >= 1 ? history.goBack() : history.push("/")
        }
      >
        Back
      </Button>

      <FormContainer>
        <h1>New Sale</h1>
        {loading ? (
          <Loader />
        ) : (
          <>
            {error && <Message variant="danger">{error}</Message>}

            <Form>
              <Form.Group className="autocomplete">
                <Form.Label>Item</Form.Label>
                <Row>
                  <Col xs={8}>
                    <Form.Control as="select" name="item" onChange={filterItem}>
                      <option value="">Select Item</option>
                      {items &&
                        items
                          .filter(
                            (i) =>
                              i.name &&
                              i.name
                                .toLowerCase()
                                .includes(itemType.toLowerCase())
                          )
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name}
                            </option>
                          ))}
                    </Form.Control>
                  </Col>
                  <Col xs={4}>
                    <Form.Control
                      type="text"
                      name="item"
                      placeholder="Filter item"
                      onChange={(e) => setItemType(e.target.value)}
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group>
                <Form.Label className="sub-heading">Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min={0}
                  max={item?.quantity}
                  defaultValue={1}
                  onChange={handleChange}
                />
                {quantityError && (
                  <Message variant="danger">{quantityError}</Message>
                )}
              </Form.Group>

              <Form.Group>
                <Form.Label className="sub-heading">Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  min={0}
                  defaultValue={item?.price}
                  onChange={handleChange}
                />
                {amountError && (
                  <Message variant="danger">{amountError}</Message>
                )}
              </Form.Group>

              <Button variant="primary" onClick={submitHandler}>
                Submit
              </Button>
            </Form>
          </>
        )}
      </FormContainer>
    </div>
  );
};

export default CreateSaleScreen;
