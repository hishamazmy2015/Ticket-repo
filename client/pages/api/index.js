// import axios from "axios";
// import builtClient from "../api/built-client";
import axios from "axios";
import styles from "../styles/Home.module.css";
const LandingPage = ({ currentUser }) => {
  console.log("I am in the compone nt ");
  console.log("I am in the compone nt ", currentUser);
  return currentUser ? (
    <h1>You are signed in </h1>
  ) : (
    <h1>You are not sign in </h1>
  );
  // const response = axios.get("/api/users/currentuser");
  // console.log("currentuser ", response.currentuser);
  // return response.data;

  // return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  debugger
  // console.log("req.headers", req?.headers);
  // console.log("context", context);

  const client = builtClient(context);
  const { data } = await client.get("/api/users/currentusers");
  return data; 
  /**
   *
   *
   */
  // if (typeof window === "undefined") {
  //   const { data } = await axios.get(
  //     "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentusers",
  //     { headers: req.headers }
  //   );
  //   return data;
  // } else {
  //   const { data } = await axios.get("/api/users/currentusers");
  //   return data;
  // }
  // console.log("client", client);
  return {};
};

export default LandingPage;
