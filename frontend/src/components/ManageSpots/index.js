import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserSpots } from "../../store/spots";
import { Link } from "react-router-dom";
import "./ManageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  console.log("currentUser", currentUser);
  const userSpots = useSelector((state) => state.spots.userSpots);
  console.log("userSpots", userSpots);

  useEffect(() => {
    if (currentUser) {
      // Fetch spots created by the current user
      dispatch(fetchUserSpots(currentUser.id));
    }
  }, [currentUser, dispatch]);

  return (
    <>
      <h1 className="header">Manage Your Spots</h1>
      <ul className="spot-list">
        {userSpots.map(
          ({ id, name, city, state, price, avgRating, previewImage }) => (
            <li key={id} className="spot-group">
              <Link to={`/spots/${id}`} className="spot-link" data-name={name}>
                <div key={id} className="spot-item">
                  <div className="spot-image">
                    <img src={previewImage} alt="Preview" />
                  </div>
                  <div className="spot-details">
                    <p>
                      {city}, {state}
                    </p>
                    <p>${price} night</p>
                    <p className="avg-rating">
                      <i className="fa-solid fa-star"></i>
                      {avgRating ? avgRating.toFixed(1) : "New"}
                    </p>
                  </div>
                  <div className="tooltip">{name}</div>
                </div>
              </Link>
            </li>
          )
        )}
      </ul>
    </>
  );
};

export default ManageSpots;
