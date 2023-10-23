// import { Navigate, Route } from "react-router-dom";

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         localStorage.getItem("authToken") ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to="/login" />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;

// import { Route, Outlet, useNavigate } from "react-router-dom";

// const PrivateRoute = ({ element: Element, ...rest }) => {
//     const navigate = useNavigate();
  
//     if (!localStorage.getItem("authToken")) {
//       // If the user is not authenticated, navigate to the login page
//       navigate('/login');
//       return null; // You can return an error message or a loading spinner here.
//     }
  
//     return (
//       <Route
//         {...rest}
//         element={<Element />}
//       >
//         <Outlet />
//       </Route>
//     );
//   };
  
//   export default PrivateRoute;


// import { Route, Navigate } from "react-router-dom";

// const PrivateRoute = ({ element: Element, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       element={(props) =>
//         localStorage.getItem("authToken") ? (
//           <Element {...props} />
//         ) : (
//           <Navigate to="/login" replace />
//         )
//       }
//     />
//   );
// };

// export default PrivateRoute;
