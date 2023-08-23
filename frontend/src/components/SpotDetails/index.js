import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const spot = useSelector((state) =>
    state.spots.spots.find((s) => s.id === id)
  );

  useEffect(() => {
    dispatch(fetchSpotDetails(id));
  }, [dispatch, id]);

  return <div>{spot ? <h2>{spot.name}</h2> : <p>Loading...</p>}</div>;
};

export default SpotDetails;
