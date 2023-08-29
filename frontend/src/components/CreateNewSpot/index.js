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
      <h2 className="main-header">Create a New Spot</h2>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <div className="located-header">
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <div className="located-input-group">
            <label className="form-input-label">Country</label>
            <input
              className="form-input"
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <label className="form-input-label">Street Address</label>
            <input
              className="form-input"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="input-row">
              <div className="input-column">
                <label className="form-input-label">City</label>
                <input
                  className="form-input comma-after"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="input-column">
                <label className="form-input-label">State</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-row">
              <div className="input-column">
                <label className="form-input-label">Latitude</label>
                <input
                  className="form-input comma-after"
                  type="text"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div className="input-column">
                <label className="form-input-label">Longitude</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateNewSpot;
