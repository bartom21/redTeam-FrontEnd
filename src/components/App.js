import React, { useEffect} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import withRoot from "../withRoot"
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import modalReducer from '../store/reducers/modal';
import calendarReducer from '../store/reducers/calendar';
import authReducer from '../store/reducers/auth';
import userReducer from '../store/reducers/user';
import resourceReducer from '../store/reducers/resource';
import notificationReducer from '../store/reducers/notification';
import billingReducer from '../store/reducers/billing';
import AppContent from "./AppContent"

const rootReducer = combineReducers({
  modal: modalReducer,
  calendar: calendarReducer,
  auth: authReducer,
  user: userReducer,
  resource: resourceReducer,
  notification: notificationReducer,
  billing: billingReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
  useEffect(() => {
    document.title = "Asociacion Franco Uz";  
  }, []);

  return (
        <Router>
          <Provider store={store}>
              <AppContent/>
          </Provider>
        </Router>
  )
}

export default withRoot(App);
