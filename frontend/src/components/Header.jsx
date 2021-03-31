import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/user.actions";
import DarkModeButton from "./DarkModeButton";

function Header({ mode }) {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header className="colored-section">
      <Navbar collapseOnSelect variant="dark" expand="md">
        <Container fluid>
          <Navbar.Brand href="/">Tessy</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/categories">Categories</Nav.Link>
              <Nav.Link href="/items">Items</Nav.Link>
              {userInfo ? (
                <NavDropdown
                  title={userInfo.username}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/favorites">
                    Favorites
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  {userInfo.role === "admin" && (
                    <>
                      <NavDropdown.Item href="/admin/userlist">
                        Users
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/admin/dispatchlist">
                        Dispatch
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/admin/carousels">
                        Carousels
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">
                  <i className="fas fa-user"></i>Sign In
                </Nav.Link>
              )}
              <DarkModeButton mode={mode} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
