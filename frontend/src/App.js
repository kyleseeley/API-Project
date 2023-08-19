import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userRestored, setUserRestored] = useState(false);

  useEffect(() => {
    console.log("useEffect triggered is App.js");
    if (!userRestored && sessionUser) {
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
    <Switch>
      <Route path="/login">
        {sessionUser ? <Redirect to="/" /> : <LoginFormPage />}
      </Route>
      <Route path="/signup">
        {sessionUser ? <Redirect to="/" /> : <SignupFormPage />}
      </Route>
      {/* Other routes */}
    </Switch>
  );

  // return (
  //   isLoaded && (
  //     <Switch>
  //       <Route path="/login">
  //         <LoginFormPage />
  //       </Route>
  //       <Route path="/signup">
  //         <SignupFormPage />
  //       </Route>
  //     </Switch>
  //   )
  // );
}

export default App;
