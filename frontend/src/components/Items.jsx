import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  useHistory,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { Button, Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  favoriteItem,
  unFavoriteItem,
} from "../actions/item.actions";
import Message from "../components/Message";
import { getUserDetails } from "../actions/user.actions";
import ItemQuantity from "./ItemQuantityEdit";

const Items = ({ item }) => {
  const url = useRouteMatch();
  const history = useHistory();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { success, error } = itemDelete;

  const images = [];
  for (var i = 1; i <= 3; i++) {
    if (item[`image${i}`] !== null || "" || undefined) {
      images.push(item[`image${i}`]);
    }
  }

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && userInfo) {
      dispatch(getUserDetails(userInfo.id));
    }
    if (success) {
      history.push("/profile");
    }
  }, [user, dispatch, userInfo, history, success]);

  const deleteHandler = () => {
    if (window.confirm("This is an ireversible act. Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE ITEM?")) {
        dispatch(deleteItem(item.id));
      }
    }
  };

  const favorite = () => {
    dispatch(favoriteItem(item.id, user.id));
  };

  const unfavorite = () => {
    dispatch(unFavoriteItem(item.id, user.id));
  };

  const [overlay, setOverlay] = useState({
    src: "",
    display: "none",
    status: false,
  });

  const overlayHandler = (value) => {
    setOverlay({ ...overlay, src: value, display: "block", status: true });
  };

  return (
    <div className="case">
      {url.path === "/item/:id" && overlay.status ? (
        <div
          className="overlay"
          id="overlay"
          onClick={() =>
            setOverlay({ src: "", status: false, display: "none" })
          }
          style={{
            display: overlay.display,
          }}
        >
          <Message variant="info">Tap on the image to exit full screen</Message>
          <Image
            src={overlay.src}
            alt={item.name}
            style={{
              border: "3px solid black",
              height: "80%",
            }}
          />
        </div>
      ) : (
        <>
          {error && <Message variant="danger">{error}</Message>}
          {url.path === "/item/:id" &&
            (item.image1 !== null ||
              "" ||
              undefined ||
              item.image2 !== null ||
              "" ||
              undefined ||
              item.image3 !== null ||
              "" ||
              undefined) && (
              <Message variant="info">
                Tap the image tile to view the full item image
              </Message>
            )}
          {(item.image1 !== null ||
            "" ||
            undefined ||
            item.image2 !== null ||
            "" ||
            undefined ||
            item.image3 !== null ||
            "" ||
            undefined) && (
            <div className="heading">
              {url.path === "/item/:id" ? (
                <Carousel interval={3000}>
                  {images.map((image, index) => (
                    <Carousel.Item key={index}>
                      <Image
                        src={image.url}
                        alt={item.name}
                        onClick={() => overlayHandler(image.url)}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <Link to={`/item/${item.id}`}>
                  <Image
                    src={
                      item.image1 !== null || "" || undefined
                        ? item.image1.thumbnailUrl
                        : item.image2 !== null || "" || undefined
                        ? item.image2.thumbnailUrl
                        : item.image3.thumbnailUrl
                    }
                    alt={item.name}
                  />
                </Link>
              )}
            </div>
          )}
          <div className="content">
            <h1 className="sub-heading">{item.name}</h1>
            {item.categories && (
              <small>
                {item.categories.length === 1 ? "Category: " : "Categories: "}
                {item.categories
                  .map((category) => {
                    return category.name;
                  })
                  .join(", ")}
              </small>
            )}
            <br />
            {item.description && <small>Description: {item.description}</small>}
            <p>
              {item.quantity === null || item.quantity === 0
                ? "Item is out of stock"
                : item.quantity === 1
                ? `There is ${item.quantity} left in stock`
                : `There are ${item.quantity} left in stock`}
            </p>
          </div>

          <Route exact path={`${url.path}/quantity`}>
            <ItemQuantity item={item} />
          </Route>

          {item.id &&
            url.path === "/item/:id" &&
            user &&
            user.role === "admin" && (
              <>
                {/* edit item button */}
                <Link to={`/item/${item.id}/edit`}>
                  <Button className="btn-dark">Edit</Button>
                </Link>

                {/* delete button */}
                <Button onClick={deleteHandler} className="btn-dark">
                  Delete
                </Button>
              </>
            )}

          {/* favorite button */}
          {item &&
            item.id &&
            url.path === "/item/:id" &&
            user &&
            user.role === "customer" &&
            user.favorites &&
            !user.favorites.includes(
              user.favorites.find((el) => el.id === item.id)
            ) && (
              <Button onClick={favorite} className="btn-dark">
                Favorite
              </Button>
            )}

          {/* unfavorite button */}
          {item &&
            item.id &&
            url.path === "/item/:id" &&
            user &&
            user.role === "customer" &&
            user.favorites.includes(
              user.favorites.find((el) => el.id === item.id)
            ) && (
              <Button onClick={unfavorite} className="btn-dark">
                Unfavorite
              </Button>
            )}

          {/* visit item button */}
          {item.id &&
            (url.path === "/category/:id" ||
              url.path === "/favorites" ||
              url.path === "/items") && (
              <Link to={`/item/${item.id}`}>
                <Button className="btn-dark">View</Button>
              </Link>
            )}

          {/* add/remove item quantity */}
          {item &&
            user &&
            user.role === "admin" &&
            location.pathname === url.url &&
            url.path === "/item/:id" && (
              <Link to={`/item/${item.id}/quantity`}>
                <Button className="btn-dark">Add/Remove</Button>
              </Link>
            )}

          {!user && url.path === "/item/:id" && (
            <Link to={`/login?redirect=/item/${item.id}`}>
              <Button className="btn-dark">Favorite</Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default Items;
