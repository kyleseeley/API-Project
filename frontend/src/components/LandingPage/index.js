import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSpots } from "../../store/spots";

const LandingPage = () => {
  const dispatch = useDispatch();
  //   const spots = useSelector((state) => Object.values(state.spots));
  //   const spots = useSelector((state) => {
  //     //   return Object.values(state.spots).map((spot) => spot);
  //     return Object.values(state.spots);
  //   });

  const spots = useSelector((state) => state.spots);

  console.log("Spots from redux:", spots);

  useEffect(() => {
    dispatch(fetchSpots());
    console.log("Fetch Spots:");
  }, [dispatch]);

  return (
    <>
      <ol>
        {Object.values(spots).map(({ id, name }) => (
          <li key={id}>
            <Link to={`/spots/${id}`}>{name}</Link>
          </li>
        ))}
      </ol>
    </>
  );
};

export default LandingPage;
