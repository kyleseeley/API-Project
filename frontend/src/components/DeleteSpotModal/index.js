import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spots";
import { useModal } from "../../context/Modal";
import { deleteSpotById } from "../../store/spots";
import "./DeleteSpotModal.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const DeleteSpotModal = ({ spotId, onClose }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const resetModalState = () => {
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(spotActions.deleteSpotById(spotId))
      .then(() => {
        resetModalState();
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors({ credential: data.message });
        }
      });
  };

  return (
    <div className="delete-spot-modal">
      <h2 className="modal-heading2">Confirm Delete</h2>
      <h3 className="modal-subheading2">
        Are you sure you want to remove this spot from the listings?
      </h3>
      <button
        type="button"
        className="yes-delete"
        onClick={() => handleSubmit(spotId)}
      >
        Yes (Delete Spot)
      </button>
      <button type="button" className="no-delete" onClick={onClose}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default DeleteSpotModal;
