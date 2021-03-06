import React, { useEffect, useState } from "react";
import { Row, Col, Button, Image, Form } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateDp } from "../actions/user.actions";
import { getCategories } from "../actions/category.actions";
import { Link } from "react-router-dom";
import Categories from "../components/Categories";
import { ITEM_DELETE_RESET } from "../constants/item.constants";
import { USER_UPDATE_DP_RESET } from "../constants/user.constants";

const Profile = ({ history }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { message: deleteItemMessage } = itemDelete;

  const userUpdateDp = useSelector((state) => state.userUpdateDp);
  const { error: updateDpError, success: updateDpSuccess } = userUpdateDp;

  const [dp, setDp] = useState("");
  const [overlay, setOverlay] = useState({
    src: "",
    display: "none",
    status: false,
  });

  const [edit, setEdit] = useState(false);
  const [objectUrls, setObjectUrls] = useState([]);

  const overlayHandler = (value) => {
    setOverlay({ ...overlay, src: value, display: "block", status: true });
  };

  const deleteImage = () => {
    const imageSrc = overlay.src;
    URL.revokeObjectURL(imageSrc);
    setObjectUrls((prevValues) => {
      return [...prevValues.filter((val) => val !== imageSrc)];
    });
    setDp("");
    setOverlay({ ...overlay, src: user.profileImage.url });
    setEdit(false);
    updateDp(user.id, dp);
  };

  const DeleteIcon = () => {
    return (
      <div
        className="delete-icon"
        style={{ cursor: "pointer" }}
        onClick={() => deleteImage()}
      >
        <i className="fas fa-trash fa-lg"></i>
      </div>
    );
  };

  const changeDP = (event) => {
    const data = new FormData();
    data.append("image", dp.image);
    dispatch(updateDp(user.id, data));
    removeUrls();
    event.preventDefault();
  };

  const preview = (event) => {
    const { name, files } = event.target;
    setDp((prevValues) => {
      return { ...prevValues, [name]: files[0] };
    });
    const url = URL.createObjectURL(event.target.files[0]);
    setObjectUrls((prevValues) => {
      return [...prevValues, url];
    });
    setOverlay((prevValues) => {
      return { ...prevValues, src: url };
    });
    setEdit(true);
  };

  const removeUrls = () => {
    for (let i = 0; i < objectUrls.length; i++) {
      URL.revokeObjectURL(objectUrls[i]);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      history.push("/login?redirect=/profile");
    } else {
      dispatch(getUserDetails(userInfo.id));
      dispatch(getCategories());
    }
    if (updateDpSuccess) {
      dispatch({ type: USER_UPDATE_DP_RESET });
      setOverlay({ src: "", status: false, display: "none" });
      setEdit(false);
    }
    return () => {
      dispatch({ type: ITEM_DELETE_RESET });
    };
  }, [history, userInfo, dispatch, updateDpSuccess]);

  return (
    <div>
      {overlay.status ? (
        <div
          className="overlay"
          id="overlay"
          onClick={(e) => {
            if (!document.getElementById("delete-div").contains(e.target)) {
              deleteImage();
              setOverlay({ src: "", status: false, display: "none" });
            }
          }}
          style={{ display: overlay.display }}
        >
          <Message variant="info">
            Tap anywhere outside the image box to exit full screen
          </Message>
          <div id="delete-div" className="delete-div">
            <Image
              src={overlay.src}
              alt={user && user.username}
              style={{ border: "2px solid black" }}
            />
            {user && overlay.src !== user.profileImage.url && <DeleteIcon />}
            <Button
              onClick={() => document.getElementById("image-upload").click()}
            >
              <i className="fa fa-pencil fa-lg"></i>
            </Button>
            <Form>
              <Form.Group>
                <Form.File
                  id="image-upload"
                  name="image"
                  style={{ display: "none" }}
                  onChange={preview}
                />
                {updateDpError && (
                  <Message variant="danger">{updateDpError}</Message>
                )}
              </Form.Group>
              {edit && (
                <Button className="btn-small" onClick={changeDP}>
                  Update
                </Button>
              )}
            </Form>
          </div>
        </div>
      ) : (
        ""
      )}
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {deleteItemMessage && (
            <Message variant="success">{deleteItemMessage}</Message>
          )}
          {user && user.profileImage && (
            <div className="avatar">
              <Image
                src={user.profileImage.url}
                alt={user.username}
                fluid
                onClick={() => overlayHandler(user.profileImage.url)}
              />
            </div>
          )}
          <h1 className="sub-heading"> Welcome {user && user.fullName} </h1>
          <p>{user && `Username: ${user.username}`}</p>
          <p>{user && `phone number: ${user.phoneNumber}`}</p>
        </>
      )}
      <hr />

      {user && user.role === "admin" && (
        <div className="section">
          <h2>Manage Categories</h2>
          <Row>
            {user &&
              categories &&
              categories.map((category) => {
                return (
                  <Col lg={4} key={category.id}>
                    <Categories category={category} />
                  </Col>
                );
              })}
          </Row>
          <Link className="btn btn-dark my-3" to="/createcategory">
            New Category
          </Link>
          <Link className="btn btn-dark my-3" to="/items/newitem">
            New Item
          </Link>

          <hr />
        </div>
      )}

      <Link className="btn btn-dark my-3" to="/settings">
        Edit Profile
      </Link>

      <Link className="btn btn-dark my-3" to="/favorites">
        View Favorites
      </Link>
    </div>
  );
};

export default Profile;
