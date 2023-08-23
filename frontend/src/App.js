import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route } from "react-router-dom";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRestored, setUserRestored] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!userRestored && storedToken) {
      dispatch(sessionActions.restoreUser()).then(() => {
        setIsLoaded(true);
        setUserRestored(true);
      });
    } else {
      setIsLoaded(true);
    }
  }, [dispatch, sessionUser, userRestored]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/spots/:id" component={SpotDetails} />
        </Switch>
      )}
    </>
  );
}

export default App;
