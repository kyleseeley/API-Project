import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="navigation-menu">
      <li>
        <NavLink exact to="/" style={{ color: "red", fontSize: "24px" }}>
          <i className="fa-brands fa-skyatlas" />
          {"  "}
          skyrnr
        </NavLink>
      </li>
      {isLoaded && (
        <li className="profile-button-container">
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
