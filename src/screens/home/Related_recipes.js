import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/blog.css";
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
        infinite: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
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
      blogData: [],
    };
  }
  componentDidMount() {
    const requestData = {};
    ApiRequest(requestData, "/GetCategoryBlogsMobile", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let blogDataArray = [];
          res.data.data.forEach((blog) => {
            blogDataArray.push(blog);
          });
          this.setState({
            blogData: blogDataArray,
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
      <div className="home-related-recipes-section">
        {this.state.blogData && this.state.blogData[0] && (
          <div className="b--heading-box">
            <div className="b-text-left">
              <h5 className="b-heading">Recipes</h5>
            </div>
            <div className="b-text-right">
              <Link to={"/recipes"}>view all</Link>
            </div>
          </div>
        )}
        <Slider {...feat_slider1} className="res_slide">
          {this.state.blogData && this.state.blogData[0]
            ? this.state.blogData.map((item, index) => {
                return (
                  <div>
                    <div className="b-feat-col" style={{ padding: 10 }}>
                      <div className="b-feat-fig">
                        <Link to={"/recipe/" + item.slug}>
                          {item.images && item.images[0] ? (
                            <img src={imageUrl + item.images[0].image} alt="" />
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
                          <Link to={"/recipe/" + item.slug}>{item.title}</Link>
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
