import React, { useEffect, useState } from "react";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getSaleDetails, deleteSale } from "../actions/sales.actions";
import { Button, Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SALES_DELETE_RESET, SALES_DETAILS_RESET } from "../constants/sales.constants";

const SalesSingle = ({ history, match }) => {
  const [overlay, setOverlay] = useState({
    src: "",
    display: "none",
    status: false,
  });

  const dispatch = useDispatch();

  const salesDetail = useSelector((state) => state.salesDetail);
  const { loading, error, sale } = salesDetail;

  const salesDelete = useSelector((state) => state.salesDelete);
  const { success, message, error: deleteError } = salesDelete;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      if (success) {
        alert(message);
        dispatch({type: SALES_DELETE_RESET})
        history.push("/admin/sales");
      }
      dispatch(getSaleDetails(match.params.id));
    } else {
      history.push("/profile");
    }

    return () => {
      dispatch({ type: SALES_DETAILS_RESET });
    };
  }, [dispatch, match, userInfo, history, message, success]);

  const overlayHandler = (value) => {
    setOverlay({ ...overlay, src: value, display: "block", status: true });
  };

  const images = [];
  for (var i = 1; i <= 3; i++) {
    if (
      sale &&
      sale.item &&
      sale.item[`image${i}`] !== null &&
      sale.item[`image${i}`] !== "" &&
      sale.item[`image${i}`] !== undefined
    ) {
      images.push(sale.item[`image${i}`]);
    }
  }

  const deleteHandler = () => {
    if (window.confirm("This is an irreversible act. Are you sure ?")) {
      if (window.confirm("LAST WARNING, DELETE SALE?")) {
        dispatch(deleteSale(sale.id));
      }
    }
  };

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
          {deleteError && <Message variant="danger">{deleteError}</Message>}
          <div className="case">
            {overlay.status ? (
              <div
                className="overlay"
                id="overlay"
                onClick={() =>
                  setOverlay({ src: "", status: false, display: "none" })
                }
                style={{ display: overlay.display }}
              >
                <Message variant="info">
                  Tap on the image to exit full screen
                </Message>
                <Image
                  src={overlay.src}
                  alt={sale.item.name}
                  style={{
                    border: "3px solid black",
                    height: "80%",
                  }}
                />
              </div>
            ) : (
              <>
                {sale &&
                  sale.item &&
                  ((sale.item.image1 !== null &&
                    sale.item.image1 !== "" &&
                    sale.item.image1 !== undefined) ||
                    (sale.item.image2 !== null &&
                      sale.item.image2 !== "" &&
                      sale.item.image2 !== undefined) ||
                    (sale.item.image3 !== null &&
                      sale.item.image3 !== "" &&
                      sale.item.image3 !== undefined)) && (
                    <Message variant="info">
                      Tap the image tile to view the full item image
                    </Message>
                  )}
                {sale &&
                  sale.item &&
                  ((sale.item.image1 !== null &&
                    sale.item.image1 !== "" &&
                    sale.item.image1 !== undefined) ||
                    (sale.item.image2 !== null &&
                      sale.item.image2 !== "" &&
                      sale.item.image2 !== undefined) ||
                    (sale.item.image3 !== null &&
                      sale.item.image3 !== "" &&
                      sale.item.image3 !== undefined)) && (
                    <div className="heading">
                      {
                        <Carousel interval={3000}>
                          {images.map((image, index) => (
                            <Carousel.Item key={index}>
                              <Image
                                src={image.url}
                                alt={sale.item.name}
                                onClick={() => overlayHandler(image.url)}
                              />
                            </Carousel.Item>
                          ))}
                        </Carousel>
                      }
                    </div>
                  )}
                <div className="content" style={{ height: "auto" }}>
                  <h1 className="sub-heading">{sale && sale.name}</h1>
                  {sale && sale?.item?.categories && (
                    <small>
                      {sale?.item?.categories?.length === 1
                        ? "Category: "
                        : "Categories: "}
                      {sale?.item?.categories
                        .map((category) => {
                          return category.name;
                        })
                        .join(", ")}
                    </small>
                  )}
                  <br />
                  <p>{sale && `${sale?.quantity} sold`}</p>
                  <p>sold for NGN {sale?.amount} per quantity</p>
                  <p>
                    {sale &&
                      sale.item &&
                      (sale?.item?.quantity === null ||
                      sale?.item?.quantity === 0
                        ? "Item is out of stock"
                        : sale?.item?.quantity === 1
                        ? `There is ${sale?.item?.quantity} left in stock`
                        : `There are ${sale?.item?.quantity} left in stock`)}
                  </p>

                  <Link to={`/admin/sales/sale/${sale?.id}/edit`}>
                    <Button>Edit</Button>
                  </Link>

                  <Button onClick={deleteHandler} className="btn-dark">
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesSingle;
