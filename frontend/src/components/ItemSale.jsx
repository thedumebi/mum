import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FormContainer from "./FormContainer";
import Message from "./Message";
import { createSale } from "../actions/sales.actions";
import { CREATE_SALES_RESET } from "../constants/sales.constants";
import { Form, ListGroup, Button } from "react-bootstrap";

const ItemSale = ({ item }) => {
  const history = useHistory();

  const [sale, setSale] = useState({
    itemId: item.id,
    quantity: 1,
    amount: item.price,
  });
  const [quantityError, setQuantityError] = useState(null);
  const [amountError, setAmountError] = useState(null);

  const dispatch = useDispatch();
  const salesCreate = useSelector((state) => state.salesCreate);
  const { success, error } = salesCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: CREATE_SALES_RESET });
      history.push(`/item/${item.id}`);
    }
  }, [history, dispatch, item, success]);

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
      dispatch(createSale(sale));
    }
  };

  return (
    <FormContainer>
      {error && <Message variant="danger">{error}</Message>}
      <h1>Add Sale</h1>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Form>
            <Form.Group>
              <Form.Label className="sub-heading">Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min={0}
                max={item.quantity}
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
                defaultValue={item.price}
                onChange={handleChange}
              />
              {amountError && <Message variant="danger">{amountError}</Message>}
            </Form.Group>

            <Button variant="primary" onClick={submitHandler}>
              Submit
            </Button>
          </Form>
        </ListGroup.Item>
      </ListGroup>
    </FormContainer>
  );
};

export default ItemSale;
