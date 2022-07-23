import "../styles/globals.css";
import axios from "axios";
import Header from "../components/header";
function AppComponent({ Component, pageProps, currentUser }) {
  debugger;
  return (
    <div>
      <Header currentUser={currentUser} />
      <h1>Header! {currentUser?.email}</h1>
      <Component {...pageProps} />
    </div>
  );
}
AppComponent.getInitialProps = async (appContext) => {
  let pageProps = {};
  if (appContext?.Component?.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  const { req } = appContext.ctx;
  if (typeof window === "undefined") {
    try {
      const { data } = await axios
        .get(
          "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentusers",
          {
            headers: {
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH",
              ...req.headers,
            },
          }
        )
        .catch((err) =>
          console.log(
            "&&&&&&&&&&&&&&&&&&&& err &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&",
            err
          )
        );
      return {
        pageProps: { ...pageProps },
        ...data,
      };
    } catch (err) {
      console.log(" Error ======= ------", err, " End Error =======  ");
    }
  } else {
    const { data } = await axios.get("/api/users/currentusers");
    return {
      pageProps: { ...pageProps },
      ...data,
    };
  }

  return {};
};

// AppComponent.getInitialProps = async (appContext) => {
//   const client = builtClient(appContext.ctx);
//   if (client) {
//     const { data } = await client.get("/api/users/currentusers");
//     let pageProps = {};
//     if (appContext?.Component?.getInitialProps)
//       pageProps = await appContext.Component.getInitialProps(appContext.ctx);
//     console.log("pageProps --------------------------------", pageProps);
//     return {
//       pageProps,
//       ...data,
//     };
//     // return data;
//   }
//   return {};
// };

export default AppComponent;
