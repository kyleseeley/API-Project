import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { editCurrentSpot, createSpotImages } from "../../store/spots";
// import * as sessionActions from "../../store/session";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";
import "./UpdateSpot.css";

const UpdateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const spot = useSelector((state) => state.spots.selectedSpot);
  const { spotId } = useParams();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(
    spot.previewImageUrl || ""
  );
  const [imageUrl1, setImageUrl1] = useState(spot.imageUrl1 || "");
  const [imageUrl2, setImageUrl2] = useState(spot.imageUrl2 || "");
  const [imageUrl3, setImageUrl3] = useState(spot.imageUrl3 || "");
  const [imageUrl4, setImageUrl4] = useState(spot.imageUrl4 || "");

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
    setPreviewImageUrl("");
    setImageUrl1("");
    setImageUrl2("");
    setImageUrl3("");
    setImageUrl4("");
  };

  const isValidImageUrl = (url) => {
    const pattern = /\.(png|jpg|jpeg)$/;
    const isValid = pattern.test(url.toLowerCase());
    return isValid;
  };

  const validateForm = () => {
    setErrors({});

    if (!country) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        country: "Country is required",
      }));
    }

    if (!address) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        address: "Street Address is required",
      }));
    }

    if (!city) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        city: "City is required",
      }));
    }

    if (!state) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    }

    if (!lat) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lat: "Latitude is required",
      }));
    }

    if (!lng) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        lng: "Longitude is required",
      }));
    }

    if (!name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name of your spot is required",
      }));
    }

    if (!description || description.length < 30) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        description:
          "Description is required and should be at least 30 characters",
      }));
    }

    if (!price) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        price: "Price per night is required",
      }));
    }
  };

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot && spot.SpotImages) {
      // Set the preview image URL
      const previewImage = spot.SpotImages.find((image) => image.preview);
      setPreviewImageUrl(previewImage ? previewImage.url : "");

      // Set the image URLs
      spot.SpotImages.forEach((image, index) => {
        switch (index) {
          case 0:
            setImageUrl1(image.url || "");
            break;
          case 1:
            setImageUrl2(image.url || "");
            break;
          case 2:
            setImageUrl3(image.url || "");
            break;
          case 3:
            setImageUrl4(image.url || "");
            break;
          default:
            break;
        }
      });

      // Now you can access other properties like address, city, etc.
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setState(spot.state || "");
      setCountry(spot.country || "");
      setLat(spot.lat || "");
      setLng(spot.lng || "");
      setName(spot.name || "");
      setDescription(spot.description || "");
      setPrice(spot.price || "");
    }
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    validateForm();
    // Validate the Preview Image URL
    if (!isValidImageUrl(previewImageUrl)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        // previewImageUrl: "Preview Image is required",
      }));
      return;
    }

    // Validate the other image URLs
    const imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4];
    const invalidImageUrls = imageUrls.filter(
      (url) => url && !isValidImageUrl(url)
    );
    if (invalidImageUrls.length > 0) {
      const imageErrors = {};
      invalidImageUrls.forEach((url, index) => {
        imageErrors[`imageUrl${index + 1}`] = "Image URL must be valid";
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...imageErrors,
      }));
      return;
    }

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
    dispatch(editCurrentSpot(spotId, spotInfo))
      .then((updatedSpot) => {
        const updatedSpotId = updatedSpot.id;

        // Create an array of image URLs
        const imageUrls = [
          previewImageUrl,
          imageUrl1,
          imageUrl2,
          imageUrl3,
          imageUrl4,
        ].filter((url) => url && isValidImageUrl(url)); // Filter out invalid URLs

        const imagePromises = imageUrls.map((url) => {
          const isPreview = isPreviewImage && url === previewImageUrl;
          return dispatch(createSpotImages(updatedSpotId, url, isPreview));
        });

        Promise.all(imagePromises)
          .then(() => {
            resetForm();
            history.push(`/spots/${spotId}`);
          })
          .catch((imageErrors) => {
            console.error("Image upload errors:", imageErrors);
          });
      })
      .catch(async (res) => {
        console.error("Error response from updateNewSpot:", res);
        let data;
        try {
          data = await res.json();
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
        }
        if (data && data.message) {
          const errorFields = {
            country: data.errors.country || "",
            address: data.errors.address || "",
            city: data.errors.city || "",
            state: data.errors.state || "",
            lat: data.errors.lat || "",
            lng: data.errors.lng || "",
            name: data.errors.name || "",
            description: data.errors.description || "",
            price: data.errors.price || "",
            previewImageUrl: "Preview Image is required" || "",
          };

          setErrors(errorFields);
        }
      });
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (field === "previewImageUrl") {
        if (value && !isValidImageUrl(value)) {
          updatedErrors[field] = "Image URL must end in .png, .jpg, or .jpeg";
        } else {
          updatedErrors[field] = "";
        }
        setIsPreviewImage(!!value);
      } else if (field.startsWith("imageUrl")) {
        if (value && !isValidImageUrl(value)) {
          updatedErrors[field] = "Image URL must end in .png, .jpg, or .jpeg";
        } else {
          updatedErrors[field] = ""; // Clear the error message for valid URLs
        }
      } else if (field === "country") {
        if (!value) {
          updatedErrors.country = "Country is required";
        } else {
          updatedErrors.country = "";
        }
      } else if (field === "address") {
        if (!value) {
          updatedErrors.address = "Address is required";
        } else {
          updatedErrors.address = "";
        }
      } else if (field === "city") {
        if (!value) {
          updatedErrors.city = "City is required";
        } else {
          updatedErrors.city = "";
        }
      } else if (field === "state") {
        if (!value) {
          updatedErrors.state = "State is required";
        } else {
          updatedErrors.state = "";
        }
      } else if (field === "lat") {
        if (!value) {
          updatedErrors.lat = "Latitude is required";
        } else {
          updatedErrors.lat = "";
        }
      } else if (field === "lng") {
        if (!value) {
          updatedErrors.lng = "Longitude is required";
        } else {
          updatedErrors.lng = "";
        }
      } else if (field === "description") {
        if (!value || value.length < 30) {
          updatedErrors.description =
            "Description is required and should be at least 30 characters";
        } else {
          updatedErrors.description = "";
        }
      } else if (field === "name") {
        if (!value) {
          updatedErrors.name = "Name of your spot is required";
        } else {
          updatedErrors.name = "";
        }
      } else if (field === "price") {
        if (!value) {
          updatedErrors.price = "Price is required";
        } else {
          updatedErrors.price = "";
        }
      }
      return updatedErrors;
    });
  };

  return (
    <div className="update-spot-container">
      <h2 className="main-header">Update Your Spot</h2>
      <form onSubmit={handleSubmit} className="update-spot-form">
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
              onChange={(e) => {
                setCountry(e.target.value);
                handleInputChange("country", e.target.value);
              }}
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
              onChange={(e) => {
                setAddress(e.target.value);
                handleInputChange("address", e.target.value);
              }}
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
                  onChange={(e) => {
                    setCity(e.target.value);
                    handleInputChange("city", e.target.value);
                  }}
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
                  onChange={(e) => {
                    setState(e.target.value);
                    handleInputChange("state", e.target.value);
                  }}
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
                  onChange={(e) => {
                    setLat(e.target.value);
                    handleInputChange("lat", e.target.value);
                  }}
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
                  onChange={(e) => {
                    setLng(e.target.value);
                    handleInputChange("lng", e.target.value);
                  }}
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
            onChange={(e) => {
              setDescription(e.target.value);
              handleInputChange("description", e.target.value);
            }}
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
            onChange={(e) => {
              setName(e.target.value);
              handleInputChange("name", e.target.value);
            }}
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
              onChange={(e) => {
                setPrice(e.target.value);
                handleInputChange("price", e.target.value);
              }}
            />
          </div>
          {errors.price && <p className="error-message">{errors.price}</p>}
        </div>
        <div className="section-header">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
          <input
            className="form-input"
            type="text"
            placeholder="Preview Image URL"
            value={previewImageUrl}
            onChange={(e) => {
              setPreviewImageUrl(e.target.value);
              setIsPreviewImage(true);
              handleInputChange("previewImageUrl", e.target.value);
            }}
          />
          {errors.previewImageUrl && (
            <p className="error-message">{errors.previewImageUrl}</p>
          )}
          <input
            className="form-input"
            type="text"
            placeholder="Image URL"
            value={imageUrl1}
            onChange={(e) => {
              setImageUrl1(e.target.value);
              handleInputChange("imageUrl1", e.target.value);
            }}
          />
          {errors.imageUrl1 && (
            <p className="error-message">{errors.imageUrl1}</p>
          )}
          <input
            className="form-input"
            type="text"
            placeholder="Image URL"
            value={imageUrl2}
            onChange={(e) => {
              setImageUrl2(e.target.value);
              handleInputChange("imageUrl2", e.target.value);
            }}
          />
          {errors.imageUrl2 && (
            <p className="error-message">{errors.imageUrl2}</p>
          )}
          <input
            className="form-input"
            type="text"
            placeholder="Image URL"
            value={imageUrl3}
            onChange={(e) => {
              setImageUrl3(e.target.value);
              handleInputChange("imageUrl3", e.target.value);
            }}
          />
          {errors.imageUrl3 && (
            <p className="error-message">{errors.imageUrl3}</p>
          )}
          <input
            className="form-input"
            type="text"
            placeholder="Image URL"
            value={imageUrl4}
            onChange={(e) => {
              setImageUrl4(e.target.value);
              handleInputChange("imageUrl4", e.target.value);
            }}
          />
          {errors.imageUrl4 && (
            <p className="error-message">{errors.imageUrl4}</p>
          )}
        </div>
        <button type="submit" className="update-spot-button">
          Update Your Spot
        </button>
      </form>
    </div>
  );
};

export default UpdateSpot;
