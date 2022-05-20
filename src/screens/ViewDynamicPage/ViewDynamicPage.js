import React, { useEffect, useState } from "react";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { imageUrl } from "../../imageUrl";

function ViewDynamicPage(props) {
  const [pageContent, setPageContent] = useState("");
  const [banner, setBanner] = useState("");

  useEffect(() => {
    let path = props.location.pathname;

    const requestData = { _id: path.split("/")[2] };
    ApiRequest(requestData, "/admin/page/GetOne", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setPageContent(res.data.data.detail);
          setBanner(res.data.data.image);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="page-wrapper">
      <main className="page-content">
        <section className="page-banner">
          <div className="banner-figure" style={{ textAlign: "center" }}>
            {banner ? <img src={imageUrl + banner} /> : ""}
          </div>
          <div className="banner-top-text"></div>
          <div className="banner-overlay"></div>
        </section>
        <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
      </main>
    </div>
  );
}

export default ViewDynamicPage;
