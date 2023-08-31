import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";

import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails";
import CreateNewSpot from "./components/CreateNewSpot";

// function App() {
//   const dispatch = useDispatch();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [userRestored, setUserRestored] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");

//     if (!userRestored && storedToken) {
//       dispatch(sessionActions.restoreUser()).then(() => {
//         setIsLoaded(true);
//         setUserRestored(true);
//       });
//     } else {
//       setIsLoaded(true);
//     }
//   }, [dispatch, sessionUser, userRestored]);

//   if (!isLoaded) {
//     return null;
//   }

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />

//       <Switch>
//         <Route exact path="/" component={LandingPage} />
//         <Route path="/spots/:id" component={SpotDetails} />
//         <Route path="/spots/new" component={CreateNewSpot} />
//       </Switch>
//     </>
//   );
// }

function App() {
  const dispatch = useDispatch();
  // const sessionUser = useSelector((state) => state.session.user);
  const [userRestored, setUserRestored] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!userRestored && storedToken) {
      dispatch(sessionActions.restoreUser()).then(() => {
        setUserRestored(true);
      });
    }
  }, [dispatch, userRestored]);

  // Set isLoaded to true as soon as the component mounts
  const isLoaded = true;

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {/* {userRestored && ( */}
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/spots/new" component={CreateNewSpot} />
        <Route path="/spots/:id" component={SpotDetails} />
      </Switch>
      {/* )} */}
    </>
  );
}

export default App;
