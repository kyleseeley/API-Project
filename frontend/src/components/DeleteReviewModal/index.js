import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

const DeleteReviewModal = ({ reviewId, spotId, onClose }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const resetModalState = () => {
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(spotActions.deleteReviewById(reviewId, spotId))
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
    <div className="delete-review-modal">
      <h2 className="modal-heading3">Confirm Delete</h2>
      <h3 className="modal-subheading3">
        Are you sure you want to delete this review?
      </h3>
      <button type="button" className="yes-delete3" onClick={handleSubmit}>
        Yes (Delete Review)
      </button>
      <button type="button" className="no-delete3" onClick={onClose}>
        No (Keep Review)
      </button>
    </div>
  );
};

export default DeleteReviewModal;
