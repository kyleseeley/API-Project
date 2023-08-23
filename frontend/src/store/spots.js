export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const RECEIVE_SPOT = "spots/RECEIVE_SPOT";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const receiveSpot = (spot) => ({
  type: RECEIVE_SPOT,
  spot,
});

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");

    if (!response.ok) {
      throw new Error("Error fetching spots");
    }
    const spots = await response.json();
    dispatch(loadSpots(spots));
  } catch (error) {
    console.log("Error fetching spots", error);
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}`);

    if (!response.ok) {
      throw new Error("Error fetching spot details");
    }
    const spot = await response.json();
    dispatch(receiveSpot(spot));
  } catch (error) {
    console.log("Error fetching spot details", error);
  }
};

const initialState = {
  spots: [],
  selectedSpot: null,
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spots: Object.values(action.spots) };
    case RECEIVE_SPOT:
      return { ...state, selectedSpot: action.spot };
    default:
      return state;
  }
};

export default spotsReducer;
