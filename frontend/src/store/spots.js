import { csrfFetch } from "./csrf";

export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const RECEIVE_SPOT = "spots/RECEIVE_SPOT";
export const SPOT_REVIEWS = "/spots/SPOT_REVIEWS";
export const CREATE_SPOT = "spots/CREATE_SPOT";
export const ADD_SPOT_IMAGES = "spots/ADD_SPOT_IMAGES";
export const CREATE_REVIEW = "spots/CREATE_REVIEW";
export const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const DELETE_SPOT = "spots/DELETE_SPOT";

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

export const addSpotImages = (spotId, url, preview) => ({
  type: ADD_SPOT_IMAGES,
  payload: { spotId, url, preview },
});

const loadUserSpots = (spots) => ({
  type: LOAD_USER_SPOTS,
  spots,
});

export const updateSpot = (spotId, updatedSpotData) => ({
  type: UPDATE_SPOT,
  spotId,
  updatedSpotData,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");

    if (!response.ok) {
      throw new Error("Error fetching spots");
    }
    const responseData = await response.json();
    const spots = responseData.Spots;

    dispatch(loadSpots(responseData));
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
  const { address, city, state, country, lat, lng, name, description, price } =
    spotInfo;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error creating spot");
  }

  const newSpotData = await response.json();

  dispatch(createSpot(newSpotData));

  dispatch(fetchSpots());

  return newSpotData;
};

export const createSpotImages = (spotId, url, preview) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    body: JSON.stringify({ url, preview }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(addSpotImages(spotId, data.url, data.preview));
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(
      `/api/spots/${reviewData.spotId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewData.review,
          stars: reviewData.stars,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error creating review");
    }

    const newReview = await response.json();

    dispatch({
      type: CREATE_REVIEW,
      review: newReview,
    });
    dispatch(fetchSpotReviews(reviewData.spotId));
  } catch (error) {
    console.log("Error creating review", error);
    // Handle error
  }
};

export const fetchUserSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots/current");
    if (!response.ok) {
      throw new Error("Error fetching user spots");
    }
    const spots = await response.json();
    dispatch(loadUserSpots(spots.Spots));
  } catch (error) {
    console.error("Error fetching user spots:", error);
  }
};

export const deleteSpotById = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error deleting spot");
    }

    // Dispatch the DELETE_SPOT action with the deleted spot's ID
    dispatch(deleteSpot(spotId));
  } catch (error) {
    console.error("Error deleting spot:", error);
    // Handle error
  }
};

const initialState = {
  allSpots: [],
  selectedSpot: null,
  reviews: [],
  userSpots: [],
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      return { ...state, allSpots: Object.values(action.spots) };
    case RECEIVE_SPOT:
      return { ...state, selectedSpot: action.spot };
    case SPOT_REVIEWS:
      return { ...state, reviews: Object.values(action.reviews) };
    case CREATE_SPOT:
      return { ...state, spots: [...state.spots, action.spotInfo] };
    case ADD_SPOT_IMAGES: {
      const { spotId, url, preview } = action.payload;
      const updatedSpots = state.spots.map((spot) => {
        if (spot.id === spotId) {
          const updatedImageUrls = spot.imageUrls ? [...spot.imageUrls] : []; // Initialize or copy existing imageUrls
          return {
            ...spot,
            imageUrls: [...updatedImageUrls, url], // Append new URL to the array
            preview: preview,
          };
        }
        return spot;
      });
      return {
        ...state,
        spots: updatedSpots,
      };
    }
    case CREATE_REVIEW:
      return {
        ...state,
        reviews: [...state.reviews, action.review],
      };
    case LOAD_USER_SPOTS:
      return {
        ...state,
        userSpots: action.spots,
      };
    case UPDATE_SPOT: {
      const { spotId, updatedSpotData } = action;
      // Find the spot in state and update its data
      const updatedSpots = state.spots.map((spot) =>
        spot.id === spotId ? { ...spot, ...updatedSpotData } : spot
      );
      return { ...state, spots: updatedSpots };
    }
    case DELETE_SPOT:
      // Filter out the deleted spot from the state
      const updatedSpots = state.spots.filter(
        (spot) => spot.id !== action.spotId
      );
      return {
        ...state,
        spots: updatedSpots,
      };
    default:
      return state;
  }
};

export default spotsReducer;
