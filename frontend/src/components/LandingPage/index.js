import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();

  const spotsData = useSelector((state) => state.spots.allSpots) || [];

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <>
      {spotsData.length > 0 ? (
        <ul className="spot-list">
          {spotsData.map((spotGroup) => (
            <li key={spotGroup[0].id} className="spot-group">
              {spotGroup.map(
                ({ id, name, city, state, price, avgRating, previewImage }) => {
                  const formattedAvgRating =
                    avgRating !== null ? avgRating.toFixed(1) : "New";

                  return (
                    <Link
                      to={`/spots/${id}`}
                      className="spot-link"
                      key={id}
                      data-name={name}
                    >
                      <div key={id} className="spot-item">
                        <div className="spot-image">
                          <img src={previewImage} alt="Preview" />
                        </div>
                        <div className="spot-details">
                          <p>
                            {city}, {state}
                          </p>
                          <p>${price} night</p>
                          <p className="avg-rating">
                            <i className="fa-solid fa-star"></i>
                            {formattedAvgRating}
                          </p>
                        </div>
                        <div className="tooltip">{name}</div>
                      </div>
                    </Link>
                  );
                }
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default LandingPage;
