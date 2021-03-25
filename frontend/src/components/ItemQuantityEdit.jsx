import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addToItem, removeFromItem } from "../actions/item.actions";
import { ITEM_ADD_RESET, ITEM_REMOVE_RESET } from "../constants/item.constants";
import FormContainer from "./FormContainer";
import Message from "./Message";

const ItemQuantity = ({ item }) => {
  const history = useHistory();

  const [addCount, setAddCount] = useState(1);
  const [addCountError, setAddCountError] = useState(null);

  const [removeCount, setRemoveCount] = useState(1);
  const [removeCountError, setRemoveCountError] = useState(null);

  const dispatch = useDispatch();
  const itemAdd = useSelector((state) => state.itemAdd);
  const { status: addStatus, error: addError } = itemAdd;

  const itemRemove = useSelector((state) => state.itemRemove);
  const { status: removeStatus, error: removeError } = itemRemove;

  useEffect(() => {
    if (addStatus || removeStatus) {
      history.push(`/item/${item.id}`);
      dispatch({ type: ITEM_ADD_RESET });
      dispatch({ type: ITEM_REMOVE_RESET });
    }
  }, [history, addStatus, removeStatus, item, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "addCount") {
      setAddCount(Number(value));
      if (value < 1) {
        setAddCountError("The minimum number that can be added is one(1)");
      } else {
        setAddCountError(null);
      }
    } else if (name === "removeCount") {
      setRemoveCount(Number(value));
      if (value > item.quantity) {
        setRemoveCountError(`The maximum number available is ${item.quantity}`);
      } else if (value < 1) {
        setRemoveCountError("The minimum number that can be removed is one(1)");
      } else {
        setRemoveCountError(null);
      }
    }
  };

  const addSubmit = (event) => {
    if (addCountError === null) {
      dispatch(addToItem(item.id, addCount));
    }
    event.preventDefault();
  };

  const removeSubmit = (event) => {
    if (removeCountError === null) {
      dispatch(removeFromItem(item.id, removeCount));
    }
  };

  return (
    <FormContainer>
      {addError && <Message variant="danger">{addError}</Message>}
      {removeError && <Message variant="danger">{removeError}</Message>}
      <h1>Edit Quantity</h1>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <Form>
            <Form.Group>
              <Form.Label className="sub-heading">Add</Form.Label>
              <Form.Control
                type="number"
                name="addCount"
                min={0}
                defaultValue={1}
                onChange={handleChange}
              />
              {addCountError && (
                <Message variant="danger">{addCountError}</Message>
              )}
            </Form.Group>
            <Button variant="primary" onClick={addSubmit}>
              Add
            </Button>
          </Form>
        </ListGroup.Item>

        {item.quantity !== 0 && item.quantity !== null && (
          <ListGroup.Item>
            <Form>
              <Form.Group>
                <Form.Label className="sub-heading">Remove</Form.Label>
                <Form.Control
                  type="number"
                  name="removeCount"
                  max={item.quantity}
                  min={0}
                  defaultValue={1}
                  onChange={handleChange}
                />
                {removeCountError && (
                  <Message variant="danger">{removeCountError}</Message>
                )}
              </Form.Group>
              <Button variant="primary" onClick={removeSubmit}>
                Remove
              </Button>
            </Form>
          </ListGroup.Item>
        )}
      </ListGroup>
    </FormContainer>
  );
};

export default ItemQuantity;
