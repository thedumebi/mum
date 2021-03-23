import React, { useEffect, useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteItem,
  favoriteItem,
  unFavoriteItem,
} from "../actions/item.actions";
import Message from "../components/Message";
import { getUserDetails } from "../actions/user.actions";

const Items = ({ item }) => {
  const url = useRouteMatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { success, error } = itemDelete;

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
          id="overlay"
          onClick={() =>
            setOverlay({ src: "", status: false, display: "none" })
          }
          style={{
            textAlign: "center",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vw",
            padding: "2%",
            zIndex: 10,
            display: overlay.display,
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Message variant="info">Tap anywhere on the screen to exit</Message>
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
          {url.path === "/item/:id" && (
            <Message variant="info">
              Tap the image tile to view the full item image
            </Message>
          )}
          {item.image && (
            <div className="heading">
              {url.path === "/item/:id" ? (
                <Image
                  src={`/${item.image}`}
                  alt={item.name}
                  onClick={() => overlayHandler(`/${item.image}`)}
                />
              ) : (
                <Link to={`/item/${item.id}`}>
                  <Image src={`/${item.image}`} alt={item.name} />
                </Link>
              )}
            </div>
          )}
          <div className="content">
            <h1 className="sub-heading">{item.name}</h1>
            {item.category && <small>{item.category.name}</small>}
            <p>
              {item.quantity === null || 0
                ? "Item is out of stock"
                : item.quantity === 1
                ? `There is ${item.quantity} left in stock`
                : `There are ${item.quantity} left in stock`}
            </p>
          </div>

          <hr />

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
          {item.id &&
            url.path === "/item/:id" &&
            user &&
            user.role === "customer" &&
            !user.favorites.includes(
              user.favorites.find((el) => el.id === item.id)
            ) && (
              <Button onClick={favorite} className="btn-dark">
                Favorite
              </Button>
            )}

          {/* unfavorite button */}
          {item.id &&
            url.path === "/item/:id" &&
            user &&
            user.id !== item.userId &&
            user.favorites.includes(
              user.favorites.find((el) => el.id === item.id)
            ) && (
              <Button onClick={unfavorite} className="btn-dark">
                Unfavorite
              </Button>
            )}

          {/* visit item button */}
          {item.id &&
            (url.path === "/store/:id" ||
              url.path === "/favorites" ||
              url.path === "/items") && (
              <Link to={`/item/${item.id}`}>
                <Button className="btn-dark">View</Button>
              </Link>
            )}

          {/* add/remove item quantity */}
          {item.store &&
            user &&
            user.id === item.userId &&
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
