import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserSpots } from "../../store/spots";
import { Link, NavLink } from "react-router-dom";
import UpdateSpot from "../UpdateSpot";
import { deleteSpotById } from "../../store/spots";
import DeleteSpotModal from "../DeleteSpotModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useModal } from "../../context/Modal";
import "./ManageSpots.css";

const ManageSpots = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const userSpots = useSelector((state) => state.spots.userSpots);
  const { setModalContent } = useModal();
  const spot = useSelector((state) => state.spots.spot);

  const [editingSpotId, setEditingSpotId] = useState(null);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [spotIdToDelete, setSpotIdToDelete] = useState(null);

  const handleDeleteButtonClick = (spotId) => {
    setSpotIdToDelete(spotId);
    setModalContent(
      <DeleteSpotModal
        spotId={spotId} // Pass the spotId to the modal
        onClose={() => {
          setModalContent(null);
          setSpotIdToDelete(null); // Reset spotIdToDelete when modal is closed
        }}
      />
    );
  };

  useEffect(() => {
    if (currentUser) {
      // Fetch spots created by the current user
      dispatch(fetchUserSpots(currentUser.id));
    }
  }, [currentUser, dispatch]);

  return (
    <>
      <h1 className="header1">Manage Spots</h1>
      <div className="create-spot-link1">
        <button>
          <NavLink to="/spots/new">Create a New Spot</NavLink>
        </button>
      </div>
      <ul className="spot-list1">
        {userSpots.map(
          ({ id, name, city, state, price, avgRating, previewImage }) => (
            <li key={id} className="spot-group1">
              <Link to={`/spots/${id}`} className="spot-link1" data-name={name}>
                <div key={id} className="spot-item1">
                  <div className="spot-image1">
                    <img src={previewImage} alt="Preview" />
                  </div>
                  <div className="spot-details1">
                    <p>
                      {city}, {state}
                    </p>
                    <p>${price} night</p>
                    <p className="avg-rating1">
                      <i className="fa-solid fa-star"></i>
                      {avgRating ? avgRating.toFixed(1) : "New"}
                    </p>
                  </div>
                  <div className="tooltip1">{name}</div>
                </div>
              </Link>
              <button
                className="update-button1"
                onClick={() => setEditingSpotId(id)}
              >
                <Link
                  to={`/spots/${id}/edit`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Update
                </Link>
              </button>
              <button
                className="delete-button1"
                onClick={() => handleDeleteButtonClick(id)}
              >
                <OpenModalMenuItem
                  itemText="Delete"
                  modalComponent={
                    <DeleteSpotModal
                      spotId={spotIdToDelete}
                      onClose={() => setModalContent(null)}
                    />
                  }
                />
              </button>
            </li>
          )
        )}
      </ul>
      {editingSpotId && spot && (
        <UpdateSpot spotId={editingSpotId} spot={spot} />
      )}
    </>
  );
};

export default ManageSpots;
