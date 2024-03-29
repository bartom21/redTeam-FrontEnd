import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useSelector } from 'react-redux';

export default function PrivateRoute({ component: Component, ...rest }) {
  const currentUser = useSelector(state => state.auth.currentUser);
  console.log("privateRoute")

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? <Component {...props} /> : <Redirect to="/" />
      }}
    ></Route>
  )
}
