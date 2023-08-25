import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { fetchSpotDetails, fetchSpotReviews } from "../../store/spots";
import "./SpotDetails.css";

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const popoutRef = useRef();
  const [popoutImage, setPopoutImage] = useState(null);

  const openPopout = (image) => {
    setPopoutImage(image);
  };

  const closePopout = () => {
    setPopoutImage(null);
  };

  const selectedSpot = useSelector((state) => state.spots.selectedSpot);
  const spotReviews = useSelector((state) => state.spots.reviews);

  console.log("spotReviews", spotReviews);

  useEffect(() => {
    dispatch(fetchSpotDetails(id));
    dispatch(fetchSpotReviews(id));
  }, [dispatch, id]);

  const isClickInsidePopout = (event) => {
    if (popoutRef.current && popoutRef.current.contains(event.target)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (!isClickInsidePopout(event)) {
        closePopout();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

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
            {spotReviews[0] ? (
              <p className="spot-numReviews">
                {spotReviews[0].length}{" "}
                {spotReviews[0].length === 1 ? "review" : "reviews"}
              </p>
            ) : (
              <p>No reviews available</p>
            )}
          </div>
          <button className="reserve" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>
      </div>
      {spotReviews[0] ? (
        <div className="reviews">
          <h3 className="review-heading">
            <i className="fa-solid fa-star"></i>
            {selectedSpot.avgStarRating} &nbsp; &middot; &nbsp;
            {spotReviews[0].length}{" "}
            {spotReviews[0].length === 1 ? "review" : "reviews"}
          </h3>
          {spotReviews[0].map((review) => (
            <div key={review.id} className="review-container">
              <div className="review-header">
                <h4 className="review-name">{review.User.firstName}</h4>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="review">{review.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available</p>
      )}
      {popoutImage && (
        <div class="popout-overlay">
          <div className="popout" ref={popoutRef}>
            <div className="popout-content">
              <span className="close-popout" onClick={closePopout}>
                &times;
              </span>
              <img src={popoutImage.url} alt={selectedSpot.name} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotDetails;
