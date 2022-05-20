import React, { useEffect, useState } from "react";
import { ApiRequest } from "../../apiServices/ApiRequest";

function ViewDynamicPage(props) {
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    let path = props.location.pathname;

    const requestData = { _id: path.split("/")[2] };
    ApiRequest(requestData, "/admin/page/GetOne", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setPageContent(res.data.data.detail);
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
        <div dangerouslySetInnerHTML={{ __html: pageContent }}></div>
      </main>
    </div>
  );
}

export default ViewDynamicPage;
