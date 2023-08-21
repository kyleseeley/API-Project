import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch } from "react-router-dom";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRestored, setUserRestored] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered is App.js");
    const storedToken = localStorage.getItem("token");

    if (!userRestored && storedToken) {
      dispatch(sessionActions.restoreUser()).then(() => {
        setIsLoaded(true);
        setUserRestored(true);
        console.log("setLoaded if in App.js");
      });
    } else {
      setIsLoaded(true);
      console.log("setLoaded else in App.js");
    }
  }, [dispatch, sessionUser, userRestored]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
    </>
  );
}

export default App;
