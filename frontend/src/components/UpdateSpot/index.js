import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSpot } from "../../store/spots";
import { fetchSpotDetails } from "../../store/spots";

const UpdateSpot = ({ spotId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch the action to fetch spot details when the component mounts
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  const spot = useSelector((state) =>
    state.spots.allSpots.find((s) => s.id === spotId)
  );
  console.log("spot", spot);

  // State to hold form data
  const [formData, setFormData] = useState({
    name: spot.name,
    // Include other fields here
  });

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch the updateSpot action
    dispatch(updateSpot(spotId, formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render input fields for each spot property */}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {/* Include other input fields here */}
      <button type="submit">Update Spot</button>
    </form>
  );
};

export default UpdateSpot;
