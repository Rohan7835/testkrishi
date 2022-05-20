import url from "../main_url";

// export const siteUrl = "https://api.krishicress.com/api";
export const siteUrl = url + "api"; // server

export const AdminApiRequest = (variables, endUrl, apiMethod, id) => {
  var token = localStorage.getItem("_Admin_jw_token")
    ? "Bearer " + localStorage.getItem("_Admin_jw_token")
    : "";
  if (id === "apiWithImage") {
    var init = {
      method: "post",
      headers: {
        authorization: token ? token : "",
      },
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
        console.log("main_API_call", res.status);
        if (res.status === 503) {
          alert("Please Login Again");
          window.location = "/admin-login";
          localStorage.clear("adminInfo");
        } else {
          var apiData = {
            status: res.status,
            data: data,
          };
          return apiData;
        }
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
