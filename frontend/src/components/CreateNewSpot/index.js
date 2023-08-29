import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { createNewSpot, addImagesToSpot } from "../../store/spots";
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
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState([]);

  const ownerId = useSelector((state) => state.session.user.id);

  const handleSubmit = async (e) => {
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

    const newSpot = await dispatch(createNewSpot(spotInfo));

    // After creating the spot, add images to the spot using the API
    if (newSpot.id && imageUrl.length > 0) {
      const newImages = imageUrl.map((url, index) => ({
        url,
        preview: index === 0,
      }));
      newImages[0].preview = true;
      await Promise.all(
        newImages.map((image) => dispatch(addImagesToSpot(newSpot.id, image)))
      );
    }
  };

  const handleImageAdd = () => {
    setImageUrl([...imageUrl, ""]);
  };

  return (
    <div className="create-spot-container">
      <h2 className="main-header">Create a New Spot</h2>
      <form onSubmit={handleSubmit} className="create-spot-form">
        <div className="section-header">
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
                  className="form-input"
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
                  className="form-input"
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
        <div className="section-header">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            className="description-text"
            type="text"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="section-header">
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special
          </p>
          <input
            className="form-input"
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="section-header">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
          <input
            className="form-input"
            type="text"
            placeholder="Preview Image URL"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
          />
          {imageUrl.map((url, index) => (
            <input
              key={index}
              className="form-input"
              type="text"
              placeholder={`Image URL`}
              value={url}
              onChange={(e) => {
                const updatedUrls = [...imageUrl];
                updatedUrls[index] = e.target.value;
                setImageUrl(updatedUrls);
              }}
            />
          ))}
          <button type="button" onClick={handleImageAdd}>
            Add Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewSpot;
