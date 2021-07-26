import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./screens/Home";
import Login from "./screens/Login";
import NotFound from "./screens/NotFound";
import Profile from "./screens/Profile";
import NewCategory from "./screens/CategoryNew";
import CategoriesList from "./screens/CategoriesList";
import Category from "./screens/CategorySingle";
import CategoryEdit from "./screens/CategoryEditScreen";
import NewItem from "./screens/ItemNew";
import ItemsList from "./screens/ItemsList";
import ItemEdit from "./screens/ItemEditScreen";
import Item from "./screens/ItemSingle";
import Settings from "./screens/Settings";
import ResetPassword from "./screens/ResetPassword";
import ChangePassword from "./screens/ChangePasswordScreen";
import CarouselListScreen from "./screens/CarouselListScreen";
import AddCarouselScrren from "./screens/AddCarouselScreen";
import CarouselEditScreen from "./screens/CarouselEditScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import Favorites from "./screens/Favorites";
import FaqsList from "./screens/FaqList";
import FaqsAdminList from "./screens/FaqAdminList";
import FaqEditScreen from "./screens/FaqEditScreen";
import FaqNew from "./screens/FaqNew";
import FaqSingle from "./screens/FaqSingle";
import SalesList from "./screens/SalesList";
import SalesOfTheDay from "./screens/SalesOfTheDay";
import SalesSingle from "./screens/SalesSingle";
import CreateSaleScreen from "./screens/CreateSaleScreen";

const App = () => {
  const getCookie = (name) => {
    const theme = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(theme) === 0) {
        return cookie.substring(theme.length, cookie.length);
      }
    }
    return "";
  };

  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const currentTheme = getCookie("theme");
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (currentTheme === "light") {
      document.body.classList.toggle("light-theme");
      setTheme("dark");
    } else if (currentTheme === "dark") {
      document.body.classList.toggle("dark-theme");
      setTheme("light");
    } else if (prefersDarkScheme.matches) {
      document.body.classList.toggle("dark-theme");
      setTheme("light");
    } else {
      document.body.classList.toggle("light-theme");
      setTheme("dark");
    }
  }, []);

  return (
    <Router>
      <Header mode={theme} />
      <main>
        <Container fluid>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/createcategory" component={NewCategory} />
            <Route
              exact
              path="/categories/search/:keyword"
              component={CategoriesList}
            />
            <Route
              exact
              path="/categories/search/:keyword/page/:pageNumber"
              component={CategoriesList}
            />
            <Route
              exact
              path="/categories/page/:pageNumber"
              component={CategoriesList}
            />
            <Route exact path="/categories" component={CategoriesList} />
            <Route exact path="/category/:id" component={Category} />
            <Route exact path="/category/:id/edit" component={CategoryEdit} />
            <Route exact path="/items/search/:keyword" component={ItemsList} />
            <Route
              exact
              path="/items/search/:keyword/page/:pageNumber"
              component={ItemsList}
            />
            <Route exact path="/items/page/:pageNumber" component={ItemsList} />
            <Route exact path="/items" component={ItemsList} />
            <Route
              exact
              path="/items/newitem?category=:id"
              component={NewItem}
            />
            <Route exact path="/items/newitem" component={NewItem} />
            <Route exact path="/item/:id/edit" component={ItemEdit} />
            <Route path="/item/:id" component={Item} />
            <Route exact path="/favorites" component={Favorites} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/change-password" component={ChangePassword} />
            <Route exact path="/admin/sales/new" component={CreateSaleScreen} />
            <Route
              exact
              path="/admin/carousels"
              component={CarouselListScreen}
            />
            <Route
              exact
              path="/admin/carousels/add"
              component={AddCarouselScrren}
            />
            <Route
              exact
              path="/admin/carousels/:id/edit"
              component={CarouselEditScreen}
            />
            <Route
              exact
              path="/admin/users/search/:keyword"
              component={UserListScreen}
            />
            <Route
              exact
              path="/admin/users/search/:keyword/page/:pageNumber"
              component={UserListScreen}
            />
            <Route
              exact
              path="/admin/users/page/:pageNumber"
              component={UserListScreen}
            />
            <Route
              exact
              path="/admin/user/:id/edit"
              component={UserEditScreen}
            />
            <Route exact path="/admin/users" component={UserListScreen} />
            <Route exact path="/faqs/search/:keyword/" component={FaqsList} />
            <Route
              exact
              path="/faqs/search/:keyword/page/:pageNumber"
              component={FaqsList}
            />
            <Route exact path="/faqs/page/:pageNumber" component={FaqsList} />
            <Route exact path="/faqs" component={FaqsList} />
            <Route exact path="/admin/faqs/add" component={FaqNew} />
            <Route
              exact
              path="/admin/faqs/:id/edit"
              component={FaqEditScreen}
            />
            <Route
              exact
              path="/admin/faqs/search/:keyword"
              component={FaqsAdminList}
            />
            <Route
              exact
              path="/admin/faqs/search/:keyword/page/:pageNumber"
              component={FaqsAdminList}
            />
            <Route
              exact
              path="/admin/faqs/page/:pageNumber"
              component={FaqsAdminList}
            />
            <Route exact path="/admin/faqs" component={FaqsAdminList} />
            <Route exact path="/faqs/:id" component={FaqSingle} />
            <Route
              exact
              path="/admin/sales/today/search/:keyword"
              component={SalesOfTheDay}
            />
            <Route
              exact
              path="/admin/sales/today/search/:keyword/page/:pageNumber"
              component={SalesOfTheDay}
            />
            <Route
              exact
              path="/admin/sales/today/page/:pageNumber"
              component={SalesOfTheDay}
            />
            <Route exact path="/admin/sales/today" component={SalesOfTheDay} />
            <Route
              exact
              path="/admin/sales/search/:keyword"
              component={SalesList}
            />
            <Route
              exact
              path="/admin/sales/search/:keyword/page/:pageNumber"
              component={SalesList}
            />
            <Route
              exact
              path="/admin/sales/page/:pageNumber"
              component={SalesList}
            />
            <Route exact path="/admin/sales" component={SalesList} />
            <Route exact path="/admin/sales/sale/:id" component={SalesSingle} />
            <Route component={NotFound} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
