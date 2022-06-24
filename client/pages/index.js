// import axios from "axios";
import builtClient from "../api/built-client";
import axios from "axios";
import styles from "../styles/Home.module.css";
const LandingPage = ({ currentUser }) => {
  console.log("currentUser ", currentUser);
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
  if (typeof window === "undefined") {
    try {
      const { data } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentusers",
        { headers: req?.headers }
      );
      return data;
    } catch (err) {
      console.log(
        " Error ======= ------------------------------------------------------------",
        err,
        " End Error =======  ------------------------------------------------------------"
      );
    }
  } else {
    const { data } = await axios.get("/api/users/currentusers");
    console.log(
      "data 3333333333 ------------------------------------------------------------",
      data
    );
    return data;
  }

  // LandingPage.getInitialProps = async ( context ) => {
  //   console.log("LANDING PAGE!");
  //   const client = builtClient(context);
  //   if (client) {
  //     const { data } = await client.get("/api/users/currentusers");
  //     // console.log("----------------- data -----------------  ", data);
  //     return data;
  //   }

  /**
   *
   *
   */
  //   if (typeof window === "undefined") {
  //     const { data } = await axios.get(
  //       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentusers",
  //       { headers: req.headers }
  //     );
  //     return data;
  //   } else {
  //     const { data } = await axios.get("/api/users/currentusers");
  //     return data;
  //   }
  return {};
};

export default LandingPage;
