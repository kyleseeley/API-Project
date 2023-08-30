import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createNewSpot } from "../../store/spots";
import * as sessionActions from "../../store/session";
// import { csrfFetch } from "../../store/csrf";
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
  const [errors, setErrors] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    name: "",
    description: "",
    price: "",
  });

  const resetForm = () => {
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setLat("");
    setLng("");
    setName("");
    setDescription("");
    setPrice("");
    // setPreviewImageUrl("");
    // setImageUrl([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const spotInfo = {
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

    dispatch(createNewSpot(spotInfo))
      .then()
      .catch(async (res) => {
        const data = await res.json();
        console.log("data", data);
        if (data && data.message) {
          setErrors({
            country: data.errors.country || "",
            address: data.errors.address || "",
            city: data.errors.city || "",
            state: data.errors.state || "",
            lat: data.errors.lat || "",
            lng: data.errors.lng || "",
            name: data.errors.name || "",
            description: data.errors.description || "",
            price: data.errors.price || "",
          });
        }
      });
    // try {
    //   dispatch(createNewSpot(spotInfo));
    //   //   resetForm(); // Move resetForm() here
    // } catch (error) {
    //   console.error("Error after catch:", error);
    //   if (error.response && error.response.data && error.response.data.errors) {
    //     const responseData = error.response.data.errors;
    //     setErrors({
    //       country: responseData.country || "",
    //       address: responseData.address || "",
    //       city: responseData.city || "",
    //       state: responseData.state || "",
    //       lat: responseData.lat || "",
    //       lng: responseData.lng || "",
    //       name: responseData.name || "",
    //       description: responseData.description || "",
    //       price: responseData.price || "",
    //     });
    //   } else {
    //     console.error("Error after else:", error);
    //   }
    // }
  };

  useEffect(() => {
    resetForm();
  }, []);

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
              //   required
            />
            {errors.country && (
              <p className="error-message">{errors.country}</p>
            )}
            <label className="form-input-label">Street Address</label>
            <input
              className="form-input"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <p className="error-message">{errors.address}</p>
            )}
            <div className="input-row">
              <div className="input-column">
                <label className="form-input-label">City</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                {errors.city && <p className="error-message">{errors.city}</p>}
              </div>
              <div className="input-column">
                <label className="form-input-label">State</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                {errors.state && (
                  <p className="error-message">{errors.state}</p>
                )}
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
                {errors.lat && <p className="error-message">{errors.lat}</p>}
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
                {errors.lng && <p className="error-message">{errors.lng}</p>}
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
          {errors.description && (
            <p className="error-message">{errors.description}</p>
          )}
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
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="section-header">
          <h3>Set a base price for your spot</h3>
          <p>
            Competetive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="price-input-container">
            <span className="dollar-sign">$</span>
            <input
              className="form-input price-input"
              type="text"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {errors.price && <p className="error-message">{errors.price}</p>}
        </div>
        {/* <div className="section-header">
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
          <button className="add-image" type="button" onClick={handleImageAdd}>
            Add Image
          </button>
        </div> */}
        <button type="submit" className="create-spot-button">
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default CreateNewSpot;
