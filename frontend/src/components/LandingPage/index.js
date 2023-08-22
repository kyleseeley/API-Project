import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";

const LandingPage = () => {
  const dispatch = useDispatch();

  const spotsData = useSelector((state) => state.spots.spots);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <>
      <ul>
        {spotsData.map((spotGroup) => (
          <ul key={spotGroup[0].id}>
            {spotGroup.map(
              ({ id, name, city, state, price, avgRating, previewImage }) => (
                <li key={id}>
                  <div>
                    <img src={previewImage} alt="Preview" />
                  </div>
                  <div>
                    <p>
                      {city}, {state}
                    </p>
                    <p>Price: ${price} per day</p>
                    <p>Average Rating: {avgRating}</p>
                    <p>{name}</p>
                  </div>
                  {/* <Link to={`/spots/${id}`}>{name}</Link> */}
                </li>
              )
            )}
          </ul>
        ))}
      </ul>
    </>
  );
};

export default LandingPage;
