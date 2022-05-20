import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/blog.css";
import sideBannerImg from "../../assets/img/receie-left-bg.png";
import { imageUrl } from "../../components/imgUrl";
import { userdetails } from "../../redux/actions/actions";
const noImage = require("../../assets/img/noImage.jpg");

var feat_slider1 = {
  dots: false,
  arrows: true,
  infinite: false,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
};
var chef_slider = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
};

var vegan_slider = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
};

class Blog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchItem: [],
      showLoadingIcon: false,
      searchKey: "",
      num: 0,
      intervalSearch: "",
      noBlogsFound: false,
    };
  }

  handleSearch = async (e) => {
    this.setState({
      searchKey: e.target.value,
      showLoadingIcon: true,
    });

    clearTimeout(this.state.intervalSearch);
    this.setState({
      intervalSearch: setTimeout(() => {
        let requestData = {
          keyword: e.target.value,
          RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
        };
        ApiRequest(requestData, "/SearchBlog", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              if (res.data.data.length === 0) {
                this.setState({ searchItem: [], noBlogsFound: true });
              } else {
                let blogData = [];
                let mediaCat = true;
                res.data.data.forEach((data, index) => {
                  data.parentCat_id.forEach((cat) => {
                    if (cat.name.toLowerCase() !== "media coverage") {
                      mediaCat = false;
                    }
                  });

                  if (!mediaCat) {
                    blogData.push(data);
                  }
                });
                this.setState({
                  searchItem: blogData,
                  showLoadingIcon: false,
                  noBlogsFound: false,
                });
              }
            } else if (res.status === 400) {
              if (res.data.status === "error") {
                this.setState({
                  searchItem: [],
                  noBlogsFound: false,
                });
              }
            }
            this.setState({ num: this.state.num + 1 });
          })
          .then(() => {
            this.setState({
              showLoadingIcon: false,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }, 1000),
    });

    this.forceUpdate();
  };
  enterKeyHandler = (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  };
  componentDidMount() {
    const requestData = {};
    ApiRequest(requestData, "/GetCategoryBlogs", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let blogData = [];
          res.data.data.forEach((data, index) => {
            if (data.name.toLowerCase() !== "media coverage") {
              blogData.push(data);
            }
          });
          this.setState({
            blog: blogData,
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
  render() {
    return (
      <>
        <main className="page-content">
          <section className="page-banner">
            <div className="banner-figure">
              <img alt="" src={process.env.PUBLIC_URL + "/img/Recipes.jpg"} />
              {/* <img src={blogBanner} /> */}
            </div>
            <div className="banner-top-text">
              {/* <h1 style={{ color: "white" }}>Recipes</h1> */}
            </div>
            <div className="banner-overlay"></div>
          </section>
          <section className="b-sarch-wrp">
            <div className="container">
              <div className="b-search">
                <input
                  type="text"
                  onChange={(e) => {
                    this.handleSearch(e);
                    // this.setState({ searchKey: e.target.value });
                  }}
                  // onKeyPress={(e) => this.enterKeyHandler(e)}
                  value={this.state.searchKey}
                  placeholder="Search recipe by ingredient or dish"
                  className="searchBlog"
                />
                {this.state.showLoadingIcon ? (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 60,
                      lineHeight: "50px",
                    }}
                  >
                    <i
                      className="fa fa-spinner searchLoading"
                      aria-hidden="true"
                    ></i>
                  </span>
                ) : (
                  ""
                )}
                <a>
                  <i
                    className="fa fa-search"
                    onClick={() => this.handleSearch()}
                    style={{ padding: 20, cursor: "pointer" }}
                  ></i>
                </a>
              </div>
            </div>
          </section>
          {this.state.searchItem.length === 0 ? (
            !this.state.noBlogsFound ? (
              this.state.blog &&
              this.state.blog.map((itm, ind) => {
                if (itm.blogData && itm.blogData[0] && ind % 3 === 0) {
                  return (
                    <section className="b-featured" key={ind}>
                      <div className="bg-b-back">
                        <img src={sideBannerImg} alt="side banner" />
                      </div>
                      <div className="container">
                        <div className="b--heading-box">
                          <div className="b-text-left">
                            <h5
                              className="b-heading"
                              style={{ textTransform: "capitalize" }}
                            >
                              {itm.name}
                            </h5>
                          </div>
                          <div className="b-text-right">
                            <Link to={"/recipe-category/" + itm.slug}>
                              view all
                            </Link>
                          </div>
                        </div>

                        <Slider {...feat_slider1} className="res_slide">
                          {itm.blogData && itm.blogData[0]
                            ? itm.blogData.map((item, index) => {
                                return (
                                  <div>
                                    <div
                                      className="b-feat-col"
                                      style={{ padding: 10 }}
                                    >
                                      <div className="b-feat-fig">
                                        <Link to={"/recipe/" + item.slug}>
                                          {item.images && item.images[0] ? (
                                            <img
                                              src={
                                                imageUrl + item.images[0].image
                                              }
                                              alt=""
                                            />
                                          ) : (
                                            ""
                                          )}
                                        </Link>
                                      </div>
                                      <div className="b-feat-ctxt">
                                        <h6
                                          style={{
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          <Link to={"/recipe/" + item.slug}>
                                            {item.title}
                                          </Link>
                                        </h6>
                                        <div className="tim-feat-b">
                                          {item.prepTime ? (
                                            <div className="feat-top-b">
                                              <span>Time</span>
                                              <p>{item.prepTime}</p>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          {item.noOfServe ? (
                                            <div className="feat-top-b-righ">
                                              <span>Portion</span>
                                              <p>{item.noOfServe} Persons</p>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            : ""}
                        </Slider>
                      </div>
                    </section>
                  );
                } else if (itm.blogData && itm.blogData[0] && ind % 3 === 1) {
                  return (
                    <section className="b-chef-box" key={ind}>
                      <div className="container">
                        <div className="b--heading-box">
                          <div className="b-text-left">
                            <h5
                              className="b-heading"
                              style={{ textTransform: "capitalize" }}
                            >
                              {itm.name}
                            </h5>
                          </div>
                          <div className="b-text-right">
                            <Link to={"/recipe-category/" + itm.slug}>
                              view all
                            </Link>
                          </div>
                        </div>
                        <Slider {...chef_slider}>
                          {itm.blogData.map((item, index) => {
                            return (
                              <div>
                                <div className="chef-box-wrp">
                                  <div className="chef-content">
                                    <h6 style={{ textTransform: "capitalize" }}>
                                      <Link
                                        to={"/recipe/" + item.slug}
                                        style={{ color: "black" }}
                                      >
                                        {item.title}
                                      </Link>
                                    </h6>
                                    {this.convertHTML(item.description1)}
                                  </div>
                                  <div className="chef-figure">
                                    <Link to={"/recipe/" + item.slug}>
                                      <img
                                        src={imageUrl + item.images[0].image}
                                        alt=""
                                      />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    </section>
                  );
                } else if (itm.blogData && itm.blogData[0] && ind % 3 === 2) {
                  return (
                    <section className="b-rec-in-wrap" key={ind}>
                      <div className="container">
                        <div className="b--heading-box">
                          <div className="b-text-left">
                            <h5
                              className="b-heading"
                              style={{ textTransform: "capitalize" }}
                            >
                              {itm.name}
                            </h5>
                          </div>
                          <div className="b-text-right">
                            <Link to={"/recipe-category/" + itm.slug}>
                              view all
                            </Link>
                          </div>
                        </div>
                        <div className="b-ingredient-text">
                          {itm.blogData.map((item, index) => {
                            if (index === 0) {
                              return (
                                <div className="b-ing-left">
                                  <Link
                                    to={"/recipe/" + item.slug}
                                    className="linking-recipe-des"
                                  >
                                    <div className="top-right-b-ing">
                                      <p> {item.title}</p>
                                    </div>
                                  </Link>
                                  <Link
                                    to={"/recipe/" + item.slug}
                                    style={{ color: "black" }}
                                  >
                                    <div className="top-right-fig">
                                      <img
                                        src={imageUrl + item.images[0].image}
                                        alt=""
                                      />
                                    </div>
                                  </Link>
                                </div>
                              );
                            }
                          })}
                          <div className="b-ing-right">
                            <div className="b-ing-top">
                              {itm.blogData.map((item, index) => {
                                if (index === 1 || index === 2) {
                                  return (
                                    <div className="b-top-left">
                                      <div className="top-right-b-ing">
                                        <p>
                                          {" "}
                                          <Link to={"/recipe/" + item.slug}>
                                            {item.title}
                                          </Link>
                                        </p>
                                      </div>
                                      <Link
                                        to={"/recipe/" + item.slug}
                                        style={{ color: "black" }}
                                      >
                                        <div className="top-right-fig">
                                          <img
                                            src={
                                              imageUrl + item.images[0]?.image
                                            }
                                            alt=""
                                          />
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                            <div className="b-ing-bottom">
                              {itm.blogData.map((item, index) => {
                                if (index === 3) {
                                  return (
                                    <div className="b-ing-bottom">
                                      <div className="top-right-b-ing">
                                        <p>
                                          {" "}
                                          <Link to={"/recipe/" + item.slug}>
                                            {item.title}
                                          </Link>
                                        </p>
                                      </div>
                                      <Link
                                        to={"/recipe/" + item.slug}
                                        style={{ color: "black" }}
                                      >
                                        <div className="top-right-fig">
                                          <img
                                            src={
                                              imageUrl + item.images[0].image
                                            }
                                            alt=""
                                          />
                                        </div>
                                      </Link>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                }
              })
            ) : (
              <section className="b-sarch-wrp">
                <div className="container">
                  <div style={{ marginBottom: 20 }}>
                    <span
                      style={{ color: "black", fontWeight: 500, fontSize: 14 }}
                    >
                      Search Results For
                    </span>{" "}
                    <span
                      style={{ color: "black", fontWeight: 800, fontSize: 18 }}
                    >
                      {this.state.searchKey}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    <p>No Recipes Found</p>
                  </div>
                </div>
              </section>
            )
          ) : (
            <section className="b-sarch-wrp">
              <div className="container">
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{ color: "black", fontWeight: 500, fontSize: 14 }}
                  >
                    Search Results For
                  </span>{" "}
                  <span
                    style={{ color: "black", fontWeight: 800, fontSize: 18 }}
                  >
                    {this.state.searchKey}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {this.state.searchItem.length > 0 ? (
                    this.state.searchItem.map((itm, ix) => {
                      return (
                        <div
                          key={ix}
                          style={{
                            maxWidth: 350,
                            width: "100%",
                            minHeight: 391,
                            margin: "auto 5px",
                          }}
                        >
                          <div className="b-feat-col">
                            <div
                              className="b-feat-fig"
                              style={{ minHeight: 290 }}
                            >
                              <Link to={"/recipe/" + itm.slug}>
                                <img
                                  src={imageUrl + itm.images[0].image}
                                  alt=""
                                />
                              </Link>
                            </div>
                            <div className="b-feat-ctxt">
                              <h6 style={{ textTransform: "uppercase" }}>
                                <Link to={"/recipe/" + itm.slug}>
                                  {itm.title}
                                </Link>
                              </h6>
                              <div className="tim-feat-b">
                                {itm.prepTime ? (
                                  <div className="feat-top-b">
                                    <span>Time</span>
                                    <p>{itm.prepTime}</p>
                                  </div>
                                ) : (
                                  ""
                                )}
                                {itm.noOfServe ? (
                                  <div className="feat-top-b-righ">
                                    <span>Portion</span>
                                    <p>{itm.noOfServe} Persons</p>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No Recipes Found</p>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});
const dispatchStateToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Blog);
