import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createNewSpot } from "../../store/spots";
import "./CreateNewSpot.css";

const CreateNewSpot = () => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const ownerId = useSelector((state) => state.session.user.id);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object with the form data
    const spotInfo = {
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    dispatch(createNewSpot(spotInfo));
  };

  return (
    <div className="create-spot-container">
      <h2>Create a New Spot</h2>
      <form onSubmit={handleSubmit} className="create-spot-form">
        {/* Input fields for each form field */}
        {/* Remember to use the appropriate onChange handlers */}
        {/* Submit button */}
      </form>
    </div>
  );
};

export default CreateNewSpot;
