import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createNewSpot, createSpotImages } from "../../store/spots";
// import * as sessionActions from "../../store/session";
import "./CreateNewSpot.css";

const CreateNewSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();

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
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isPreviewImage, setIsPreviewImage] = useState(false);
  const [imageUrl1, setImageUrl1] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [imageUrl3, setImageUrl3] = useState("");
  const [imageUrl4, setImageUrl4] = useState("");
  const [imageUrl5, setImageUrl5] = useState("");
  //   const [imageUrlError1, setImageUrlError1] = useState("");
  //   const [imageUrlError2, setImageUrlError2] = useState("");
  //   const [imageUrlError3, setImageUrlError3] = useState("");
  //   const [imageUrlError4, setImageUrlError4] = useState("");
  //   const [imageUrlError5, setImageUrlError5] = useState("");

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
    // setImageUrl([]);
    setImageUrl1("");
    setImageUrl2("");
    setImageUrl3("");
    setImageUrl4("");
    setImageUrl5("");
  };

  const isValidImageUrl = (url) => {
    const pattern = /\.(png|jpg|jpeg)$/;
    const isValid = pattern.test(url.toLowerCase());
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate the Preview Image URL
    if (!isValidImageUrl(previewImageUrl)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        previewImageUrl: "Preview Image URL must be valid",
      }));
      return;
    }

    // Validate the other image URLs
    const imageUrls = [imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5];
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

    dispatch(createNewSpot(spotInfo))
      .then((createdSpot) => {
        const createdSpotId = createdSpot.id;

        // Create an array of image URLs
        const imageUrls = [
          previewImageUrl,
          imageUrl1,
          imageUrl2,
          imageUrl3,
          imageUrl4,
          imageUrl5,
        ].filter((url) => url && isValidImageUrl(url)); // Filter out invalid URLs

        const imagePromises = imageUrls.map((url) => {
          const isPreview = isPreviewImage && url === previewImageUrl;
          return dispatch(createSpotImages(createdSpotId, url, isPreview));
        });

        Promise.all(imagePromises)
          .then(() => {
            resetForm();
            history.push(`/spots/${createdSpotId}`);
          })
          .catch((imageErrors) => {
            console.error("Image upload errors:", imageErrors);
          });
      })
      .catch(async (res) => {
        console.error("Error response from createNewSpot:", res);
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

          // Check if the image URLs are valid, and set errors accordingly
          if (imageUrl1 && !isValidImageUrl(imageUrl1)) {
            errorFields.imageUrl1 =
              "Image URL must end in .png, .jpg, or .jpeg";
          }
          if (imageUrl2 && !isValidImageUrl(imageUrl2)) {
            errorFields.imageUrl2 =
              "Image URL must end in .png, .jpg, or .jpeg";
          }
          if (imageUrl3 && !isValidImageUrl(imageUrl3)) {
            errorFields.imageUrl3 =
              "Image URL must end in .png, .jpg, or .jpeg";
          }
          if (imageUrl4 && !isValidImageUrl(imageUrl4)) {
            errorFields.imageUrl4 =
              "Image URL must end in .png, .jpg, or .jpeg";
          }
          if (imageUrl5 && !isValidImageUrl(imageUrl5)) {
            errorFields.imageUrl5 =
              "Image URL must end in .png, .jpg, or .jpeg";
          }

          if (previewImageUrl && !isValidImageUrl(previewImageUrl)) {
            errorFields.previewImageUrl =
              "Image URL must end in .png, .jpg, or .jpeg";
          } else if (!previewImageUrl) {
            errorFields.previewImageUrl = "Preview Image is required";
          }

          setErrors(errorFields);
        }
      });
  };

  useEffect(() => {
    resetForm();
  }, []);

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      if (field === "previewImageUrl") {
        if (value && !isValidImageUrl(value)) {
          updatedErrors[field] = "Image URL must end in .png, .jpg, or .jpeg";
        } else {
          updatedErrors[field] = "";
        }
        setIsPreviewImage(!!value); // Set preview flag for all images
      } else if (field.startsWith("imageUrl")) {
        if (value && !isValidImageUrl(value)) {
          updatedErrors[field] = "Image URL must end in .png, .jpg, or .jpeg";
        } else {
          updatedErrors[field] = "";
        }
      } else {
        updatedErrors[field] = "";
      }

      return updatedErrors;
    });
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
              onChange={(e) => {
                setCountry(e.target.value);
                handleInputChange("country");
              }}
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
              onChange={(e) => {
                setAddress(e.target.value);
                handleInputChange("address");
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
                    handleInputChange("city");
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
                    handleInputChange("state");
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
                    handleInputChange("lat");
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
                    handleInputChange("lng");
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
              handleInputChange("description");
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
              handleInputChange("name");
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
                handleInputChange("price");
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
          <input
            className="form-input"
            type="text"
            placeholder="Image URL"
            value={imageUrl5}
            onChange={(e) => {
              setImageUrl5(e.target.value);
              handleInputChange("imageUrl5", e.target.value);
            }}
          />
          {errors.imageUrl5 && (
            <p className="error-message">{errors.imageUrl5}</p>
          )}
        </div>
        <button type="submit" className="create-spot-button">
          Create Spot
        </button>
      </form>
    </div>
  );
};

export default CreateNewSpot;
