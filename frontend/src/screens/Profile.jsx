import React, { useEffect, useState } from "react";
import { Row, Col, Button, Image, Form } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateDp } from "../actions/user.actions";
import { getCategories } from "../actions/category.actions";
import { Link } from "react-router-dom";
import Categories from "../components/Categories";
import { CREATE_CATEGORY_RESET } from "../constants/category.constants";
import { ITEM_DELETE_RESET } from "../constants/item.constants";
import axios from "axios";
import { USER_UPDATE_DP_RESET } from "../constants/user.constants";

const Profile = ({ history }) => {
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  const createCategoryState = useSelector((state) => state.categoryCreate);
  const { status: categoryCreated } = createCategoryState;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { message: deleteStoreMessage } = categoryDelete;

  const itemDelete = useSelector((state) => state.itemDelete);
  const { message: deleteItemMessage } = itemDelete;

  const userUpdateDp = useSelector((state) => state.userUpdateDp);
  const { error: updateDpError, success: updateDpSuccess } = userUpdateDp;

  const [dp, setDp] = useState({});
  const [overlay, setOverlay] = useState({
    src: "",
    display: "none",
    status: false,
  });

  const [edit, setEdit] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const overlayHandler = (value) => {
    setOverlay({ ...overlay, src: value, display: "block", status: true });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);

      if (data.url) {
        setDp(data);
        setOverlay((prevValues) => {
          return { ...prevValues, src: data.url };
        });
        setEdit(true);
        setUploadError(null);
      } else {
        setUploadError(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteImage = () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const image = dp;

      axios.post("/api/items/delete-image", { image }, config);
    } catch (error) {
      console.log(error.message);
    }
    setDp({});
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
    if (uploadError === null) {
      dispatch(updateDp(user.id, dp));
    }
    event.preventDefault();
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
      dispatch({ type: CREATE_CATEGORY_RESET });
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
              if (dp.url) {
                deleteImage();
              }
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
                  onChange={uploadFileHandler}
                />
                {uploadError && (
                  <Message variant="danger">{uploadError}</Message>
                )}
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
          {categoryCreated && (
            <Message variant="success">
              Your category was created successfully
            </Message>
          )}
          {deleteStoreMessage && (
            <Message variant="success">{deleteStoreMessage}</Message>
          )}
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
        </div>
      )}
    </div>
  );
};

export default Profile;
