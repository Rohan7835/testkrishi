import React from "react";
import Moment from "react-moment";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { imageUrl } from "../../components/imgUrl";

class about_us extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mediaData: [],
    };
  }
  componentDidMount() {
    const requestData = {};
    ApiRequest(requestData, "/GetCategoryBlogs", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          const mediaEl = [];
          res.data.data.forEach((dta) => {
            if (dta.name.toLowerCase() === "media coverage") {
              dta.blogData.forEach((b) => {
                mediaEl.push(b);
              });
            }
          });
          this.setState({
            mediaData: mediaEl ? mediaEl : [],
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  convertHTML = (e) => {
    var temp = document.createElement("p");
    temp.innerHTML = e;
    return temp.textContent;
  };
  go_to_home = () => {
    this.props.history.push("/");
  };

  render() {
    return (
      <>
        <main className="page-content">
          <section className="page-banner">
            <div className="banner-figure" style={{ textAlign: "center" }}>
              <img alt="" src={process.env.PUBLIC_URL + "/img/Media Coverage.jpg"} />
              {/* <img src={BannerImg} /> */}
            </div>
            <div className="banner-top-text">
              {/* <h1>Media Coverage</h1> */}
            </div>
            <div className="banner-overlay"></div>
          </section>
          <div className="container-fluid">
            {/* Media Cards Container section Start*/}
            <div className="media-cards-section">
              {/* Media Card Start*/}
              {this.state.mediaData && this.state.mediaData.length !== 0
                ? this.state.mediaData.map((data) => (
                    <div className="media-card">
                      <div className="media-overlay-image">
                        <a href={data.mediaLink} target="_blank">
                          <img
                            src={imageUrl + data.images[0].image}
                            alt="media-banner"
                          />
                        </a>
                      </div>
                      <div className="media-content">
                        <div className="media-date">
                          <span>
                            <Moment format="DD/MM/YYYY">
                              {data.date}
                            </Moment>
                          </span>
                        </div>
                        <div className="media-info">
                          <p>
                            <a href={data.mediaLink} target="_blank">
                              {this.convertHTML(data.description1)}
                            </a>
                          </p>
                        </div>
                        <div
                          className="media-footer"
                          style={{ textTransform: "capitalize" }}
                        >
                          <p>{this.convertHTML(data.title)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
              {/* Media Card End*/}
            </div>
            {/* Media Cards Container section end*/}
          </div>
        </main>
      </>
    );
  }
}

export default about_us;
