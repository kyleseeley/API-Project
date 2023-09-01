import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as spotActions from "../../store/spots";
import { useModal } from "../../context/Modal";
import "./ReviewModal.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";

const ReviewModal = ({ spotId, onClose }) => {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});

  const { closeModal } = useModal();

  const handleStarChange = (selectedStars) => {
    setStars(selectedStars);
  };

  const resetModalState = () => {
    setReview("");
    setStars(0);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars,
      spotId,
    };

    dispatch(spotActions.createReview(newReview))
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

  const isButtonDisabled = review.length < 10 || stars <= 0;

  return (
    <div className="review-modal">
      <h2 className="modal-heading">How was your stay?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="text-area"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
          rows={4}
          required
        />
        <label className="star-rating-label">
          Rate your stay:
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${value <= stars ? "selected" : ""}`}
                onClick={() => handleStarChange(value)}
              >
                <i className="fa-solid fa-star"></i>
              </span>
            ))}
          </div>
        </label>

        <button type="submit" disabled={isButtonDisabled}>
          Submit your review
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ReviewModal;
