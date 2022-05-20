import swal from "sweetalert";
import url from "../main_url";

// export const siteUrl = "https://api.krishicress.com/api";
export const siteUrl = url + "api"; // server

export const ApiRequest = (variables, endUrl, apiMethod, token, id) => {
  if (id === "apiWithImage") {
    var init = {
      method: "post",
      body: variables,
    };
  } else {
    init =
      apiMethod === "GET"
        ? {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              authorization: token ? token : "",
            },
          }
        : {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token ? token : "",
            },
            body: JSON.stringify(variables),
          };
  }
  return fetch(siteUrl + endUrl, init)
    .then((res) =>
      res.json().then((data) => {
        const token = localStorage.getItem("_jw_token")
          ? "Bearer " + localStorage.getItem("_jw_token")
          : "";
        if (res.status === 503) {
          var apiData = {
            status: res.status,
            data: data,
          };
          // if (token) {
          localStorage.clear();
          swal({
            title: "Session expired!",
            text: "Please login again.",
            icon: "warning",
            dangerMode: true,
          }).then(() => {
            window.location = "/";
          });
          // }
        } else {
          var apiData = {
            status: res.status,
            data: data,
          };
        }
        return apiData;
      })
    )
    .catch((err) => {
      var apiData = {
        status: 900,
        data: "Please check your internet connection",
      };
      return apiData;
    });
};
