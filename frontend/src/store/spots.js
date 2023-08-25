export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const RECEIVE_SPOT = "spots/RECEIVE_SPOT";
export const SPOT_REVIEWS = "/spots/SPOT_REVIEWS";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const receiveSpot = (spot) => ({
  type: RECEIVE_SPOT,
  spot,
});

export const spotReviews = (reviews) => ({
  type: SPOT_REVIEWS,
  reviews,
});

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");

    if (!response.ok) {
      throw new Error("Error fetching spots");
    }
    const spots = await response.json();
    console.log("fetchSpots before dispatch", spots);
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
    console.log("fetchSpotDetails before dispatch", spot);
    dispatch(receiveSpot(spot));
  } catch (error) {
    console.log("Error fetching spot details", error);
  }
};

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if (!response.ok) {
      throw new Error("Error fetching spot details");
    }
    const spotReview = await response.json();
    dispatch(spotReviews(spotReview));
  } catch (error) {
    console.log("Error fetching spot details", error);
  }
};

const initialState = {
  spots: [],
  selectedSpot: null,
  reviews: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spots: Object.values(action.spots) };
    case RECEIVE_SPOT:
      console.log("Received spot:", action.spot);
      return { ...state, selectedSpot: action.spot };
    case SPOT_REVIEWS:
      return { ...state, reviews: Object.values(action.reviews) };
    default:
      return state;
  }
};

export default spotsReducer;
