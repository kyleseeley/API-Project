export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const RECEIVE_SPOT = "spots/RECEIVE_SPOT";
export const SPOT_REVIEWS = "/spots/SPOT_REVIEWS";
export const CREATE_SPOT = "spots/CREATE_SPOT";
export const ADD_SPOT_IMAGES = "spots/ADD_SPOT_IMAGES";

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

export const createSpot = (spotInfo) => ({
  type: CREATE_SPOT,
  spotInfo,
});

export const addSpotImages = (spotId, imageUrl) => ({
  type: ADD_SPOT_IMAGES,
  spotId,
  imageUrl,
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
  if (spotId !== "new") {
    // Check if spotId is not "new"
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
  }
};

export const fetchSpotReviews = (spotId) => async (dispatch) => {
  if (spotId !== "new") {
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
  }
};

export const createNewSpot = (spotInfo) => async (dispatch) => {
  try {
    const response = await fetch("/api/spots/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(spotInfo),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Error creating spot");
    }

    const newSpot = await response.json();
    dispatch(createSpot(newSpot));
  } catch (error) {
    console.error("Error creating new spot:", error);
  }
};

export const addImagesToSpot = (spotId, images) => async (dispatch) => {
  try {
    const imagesWithStatus = images.map((image) => ({
      url: image.url,
      isPreview: image.isPreview,
    }));

    dispatch(addSpotImages(spotId, imagesWithStatus));
  } catch (error) {
    console.error("Error adding images to spot:", error);
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
      return { ...state, selectedSpot: action.spot };
    case SPOT_REVIEWS:
      return { ...state, reviews: Object.values(action.reviews) };
    case CREATE_SPOT:
      return { ...state, spots: [...state.spots, action.spotInfo] };
    case ADD_SPOT_IMAGES:
      const { spotId, images } = action;
      const updatedSpots = state.spots.map((spot) =>
        spot.id === spotId
          ? {
              ...spot,
              SpotImages: [
                ...spot.SpotImages,
                ...images.map((image) => ({
                  url: image.url,
                  preview: image.isPreview,
                })),
              ],
            }
          : spot
      );
      return { ...state, spots: updatedSpots };
    default:
      return state;
  }
};

export default spotsReducer;
