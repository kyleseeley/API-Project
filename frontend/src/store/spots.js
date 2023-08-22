export const LOAD_SPOTS = "spots/LOAD_SPOTS";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");

    if (!response.ok) {
      throw new Error("Error fetching spots");
    }
    const spots = await response.json();
    console.log("spots before dispatch", spots);
    dispatch(loadSpots(spots));
  } catch (error) {
    console.log("Error fetching spots", error);
  }
};

const initialState = {
  spots: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, spots: Object.values(action.spots) };
    default:
      return state;
  }
};

export default spotsReducer;
