import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../actions/sales.actions";
import { Button, Table } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Route, Link } from "react-router-dom";
import SearchBox from "../components/SearchBox";
import Paginate from "../components/Paginate";

const SalesList = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber;

  const dispatch = useDispatch();

  const salesList = useSelector((state) => state.salesList);
  const { loading, error, sales, page, pages } = salesList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      dispatch(getSales(keyword, pageNumber));
    } else {
      history.push("/profile");
    }
  }, [dispatch, history, userInfo, keyword, pageNumber]);

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
        <>
          <Route
            render={({ history, match }) => (
              <SearchBox history={history} url={match} />
            )}
          />
          {sales && sales.length === 0 ? (
            <h1 className="big-heading">Sales are coming soon ;)</h1>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>S/N</th>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>AMOUNT</th>
                    <th>EXPECTED AMOUNT</th>
                    <th>PROFIT/LOSS</th>
                    <th>TIME</th>
                  </tr>
                </thead>
                <tbody>
                  {sales &&
                    sales.map((sale, index) => (
                      <tr key={sale.id}>
                        <td>
                          <Link to={`/admin/sales/sale/${sale.id}`}>
                            {index + 1}
                          </Link>
                        </td>
                        <td>
                          <Link to={`/admin/sales/sale/${sale.id}`}>
                            {sale.name}
                          </Link>
                        </td>
                        <td>{sale.quantity}</td>
                        <td>{sale.amount}</td>
                        <td>{sale?.item?.price * sale.quantity}</td>
                        <td>
                          {sale.amount - sale?.item?.price * sale.quantity}
                        </td>
                        <td>{new Date(sale.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div>
                Total Sales: NGN{" "}
                {sales &&
                  sales.reduce((a, b) => ({ amount: a.amount + b.amount }))
                    .amount}
              </div>
              <div>
                Expected Sales: NGN{" "}
                {sales &&
                  sales.reduce(
                    (a, b) => {
                      return { amount: a.amount + b?.item?.price * b.quantity };
                    },
                    { amount: 0 }
                  ).amount}
              </div>
              <div>
                Profit/Loss: NGN{" "}
                {sales &&
                  sales.reduce(
                    (a, b) => {
                      console.log({
                        acc: a,
                        1: a.amount + b.amount,
                        2: a.amount + b?.item?.price * b.quantity,
                      });
                      return {
                        amount:
                          a.amount +
                          a.amount +
                          b.amount -
                          (a.amount + b?.item?.price * b.quantity),
                      };
                    },
                    { amount: 0 }
                  ).amount}
              </div>
            </div>
          )}

          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
            url={match}
          />
        </>
      )}
    </div>
  );
};

export default SalesList;
