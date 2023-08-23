import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchSpotDetails } from "../../store/spots";

const SpotDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const selectedSpot = useSelector((state) => state.spots.selectedSpot);

  console.log("SpotDetails Spot", selectedSpot);

  useEffect(() => {
    dispatch(fetchSpotDetails(id));
  }, [dispatch, id]);

  return (
    <div>
      <h2>{selectedSpot.name}</h2>
      <h3>
        {selectedSpot.city}, {selectedSpot.state}, {selectedSpot.country}
      </h3>
    </div>
  );
};

export default SpotDetails;
