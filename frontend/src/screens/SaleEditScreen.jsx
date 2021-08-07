import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getSaleDetails, updateSale } from "../actions/sales.actions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { SALES_UPDATE_RESET } from "../constants/sales.constants";

const SaleEditScreen = ({ history, match }) => {
  const [sale, setSale] = useState({
    quantity: "",
    amount: "",
  });
  const [quantityError, setQuantityError] = useState(null);
  const [amountError, setAmountError] = useState(null);

  const dispatch = useDispatch();

  const salesDetail = useSelector((state) => state.salesDetail);
  const { loading, error, sale: saleDetail } = salesDetail;

  const salesUpdate = useSelector((state) => state.salesUpdate);
  const { loading: loadingUpdate, success, error: updateError } = salesUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userInfo && userInfo.role === "admin") {
      if (success) {
        dispatch({ type: SALES_UPDATE_RESET });
        history.push(`/admin/sales`);
      }
      if (!saleDetail) {
        dispatch(getSaleDetails(match.params.id));
      } else {
        setSale((prevValues) => {
          return {
            ...prevValues,
            quantity: saleDetail.quantity,
            amount: saleDetail.amount,
          };
        });
      }
    } else {
      history.push("/profile");
    }
  }, [dispatch, history, userInfo, saleDetail, success, match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prevValues) => {
      return { ...prevValues, [name]: value };
    });
    if (name === "quantity") {
      if (value > saleDetail?.item?.quantity) {
        setQuantityError(
          `The maximum number available is ${saleDetail?.item?.quantity}`
        );
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
    dispatch(updateSale(saleDetail.id, sale));
  };

  return (
    <div>
      {loadingUpdate ? (
        <Loader />
      ) : (
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
            <h2>Edit Sale</h2>
            {loading ? (
              <Loader />
            ) : (
              <>
                {error && <Message variant="danger">{error}</Message>}
                {updateError && (
                  <Message variant="danger">{updateError}</Message>
                )}

                <Form>
                  <Form.Group className="autocomplete">
                    <Form.Label>Item</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={saleDetail?.item?.name}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="sub-heading">Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      min={0}
                      max={sale?.item?.quantity}
                      defaultValue={saleDetail?.quantity}
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
                      defaultValue={saleDetail?.amount}
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
      )}
    </div>
  );
};

export default SaleEditScreen;
