import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchSpotDetails } from "../../store/spots";
import "./SpotDetails.css";

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [popoutImage, setPopoutImage] = useState(null);

  const openPopout = (image) => {
    setPopoutImage(image);
  };

  const closePopout = () => {
    setPopoutImage(null);
  };

  const selectedSpot = useSelector((state) => state.spots.selectedSpot);

  useEffect(() => {
    dispatch(fetchSpotDetails(id));
  }, [dispatch, id]);

  if (!selectedSpot) {
    return <p>Loading...</p>;
  }

  const handleReserveClick = () => {
    alert("Feature Coming Soon...");
  };

  const mainImage = selectedSpot.SpotImages.find((image) => image.preview);
  const otherImages = selectedSpot.SpotImages.filter((image) => !image.preview);
  const hostFirstName = selectedSpot.Owner.firstName;
  const hostLastName = selectedSpot.Owner.lastName;

  return (
    <div className="spot-details-container">
      <h1 className="Name">{selectedSpot.name}</h1>
      <h3 className="Location">
        {selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}
      </h3>
      <div className="images-container">
        <div className="main-image">
          <img
            src={mainImage.url}
            alt={selectedSpot.name}
            onClick={() => openPopout(mainImage)}
          />
        </div>
        <div className="other-images">
          {otherImages.map((image) => (
            <img
              className="other-image"
              key={image.id}
              src={image.url}
              alt={selectedSpot.name}
              onClick={() => openPopout(image)}
            />
          ))}
        </div>
      </div>
      <h2 className="Name">
        Hosted by {hostFirstName} {hostLastName}
      </h2>
      <div className="details-container">
        <p className="description">{selectedSpot.description}</p>
        <div className="spot-info">
          <div className="spot-info-top">
            <p className="spot-price">${selectedSpot.price}/night</p>
            <p className="spot-avgRating">
              <i className="fa-solid fa-star"></i>
              {selectedSpot.avgStarRating}
            </p>
            <p className="spot-numReviews">{selectedSpot.numReviews} reviews</p>
          </div>
          <button className="reserve" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>
      </div>
      {popoutImage && (
        <div className="popout">
          <div className="popout-content">
            <span className="close-popout" onClick={closePopout}>
              &times;
            </span>
            <img src={popoutImage.url} alt={selectedSpot.name} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotDetails;
