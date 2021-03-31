import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/user.actions";
import Paginate from "../components/Paginate";
import SearchBox from "../components/SearchBox";
import { Route } from "react-router-dom";

const UserListScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users, page, pages } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.role === "admin") {
      dispatch(listUsers(keyword, pageNumber));
      if (successDelete) {
        history.push("/admin/user");
      }
    } else {
      history.push("/profile");
    }
  }, [dispatch, history, successDelete, keyword, pageNumber, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      if (window.confirm("LAST WARNING, DELETE USER?")) {
        dispatch(deleteUser(id));
      }
    }
  };

  return (
    <div>
      <Button className="btn btn-dark my-3" onClick={() => history.goBack()}>
        Back
      </Button>

      <h1>Users</h1>
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
          {users && users.length === 0 ? (
            <h1 className="big-heading">No User available</h1>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th>PHONE NUMBER</th>
                    <th>FAVORITES</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.fullName}</td>
                      <td>
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td>
                        {user.role === "admin" ? (
                          <i
                            className="fas fa-check"
                            style={{ color: "green" }}
                          ></i>
                        ) : (
                          <i
                            className="fas fa-times"
                            style={{ color: "red" }}
                          ></i>
                        )}
                      </td>
                      <td>{user.phoneNumber}</td>
                      <td>
                        <ListGroup variant="flush">
                          {user.favorites &&
                            user.favorites.map((item, index) => (
                              <ListGroup.Item key={index} item={item.name}>
                                {item.name}
                              </ListGroup.Item>
                            ))}
                        </ListGroup>
                      </td>
                      <td>
                        <LinkContainer to={`/admin/user/${user.id}/edit`}>
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteHandler(user.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ""}
                url={match}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserListScreen;
