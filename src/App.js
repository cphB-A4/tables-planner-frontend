import React, { useState, useEffect } from "react";
import { Switch, Route, Link, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import BoardUser from "./components/BoardUser";
import BoardAdmin from "./components/BoardAdmin";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";
import EventBoard from "./components/EventBoard";

const App = () => {
  
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    console.log(user)

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("admin"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/home">
            Home
          </NavLink>
        </li>

        {showAdminBoard && (
          <li>
            <NavLink exact activeClassName="active" to="/admin">
              Admin Board
            </NavLink>
          </li>
        )}
        {console.log(JSON.stringify(currentUser))}
        {currentUser && (
          <li>
            <NavLink exact activeClassName="active" to="/user">
              User
            </NavLink>
          </li>
        )}

        {currentUser ? (
          <>
            <li>
              <NavLink exact activeClassName="active" to="/profile">
                {currentUser.username}
              </NavLink>
            </li>
            <li>
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink exact activeClassName="active" to="/login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="active" to="/register">
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <Switch>
        <Route exact path={["/", "/home"]} component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile" component={Profile} />
        <Route path="/event/:id" component={EventBoard} />
        <Route path="/user" component={BoardUser} />
        <Route path="/admin" component={BoardAdmin} />
      </Switch>
    </>
  );
};

export default App;
