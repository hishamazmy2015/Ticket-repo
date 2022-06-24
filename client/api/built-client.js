import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    console.log(
      "Req Headers --------------------------------------------------- ",
      req.headers
    );

    try {
      return axios
        .create({
          baseURL:
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
          headers: req?.headers,
        })
        .patch(function (error) {
          console.log("Error: " + error);
        });
    } catch (err) {
      console.log(
        "err =============================================================== ",
        err
      );
    }
  } else {
    axios.create({
      baseURL: "/",
    });
  }
};
