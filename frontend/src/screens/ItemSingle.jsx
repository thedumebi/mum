import React, { useEffect } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Items from "../components/Items";
import { useDispatch, useSelector } from "react-redux";
import { getItemDetails } from "../actions/item.actions";
import { Button } from "react-bootstrap";

const Item = ({ history, match }) => {
  const dispatch = useDispatch();

  const itemDetails = useSelector((state) => state.itemDetails);
  const { loading, error, item } = itemDetails;

  useEffect(() => {
    dispatch(getItemDetails(match.params.id));
  }, [dispatch, match]);

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
        item && <Items item={item} />
      )}
    </div>
  );
};
export default Item;
