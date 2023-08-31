import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";
import "./LandingPage.css";

const LandingPage = () => {
  const dispatch = useDispatch();

  const spotsData = useSelector((state) => state.spots.spots);
  console.log("spotsData", spotsData);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <ul className="spot-list">
      {spotsData.map(
        (spotGroup) => (
          console.log("spotGroup:", spotGroup),
          (
            <li key={spotGroup[0].id} className="spot-group">
              {spotGroup.map(
                ({ id, name, city, state, price, avgRating, previewImage }) => (
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
                        <p>${price}/night</p>
                        <p className="avg-rating">
                          <i className="fa-solid fa-star"></i>
                          {avgRating !== null ? avgRating : "New"}
                        </p>
                      </div>
                      <div className="tooltip">{name}</div>
                    </div>
                  </Link>
                )
              )}
            </li>
          )
        )
      )}
    </ul>
  );
};

export default LandingPage;
