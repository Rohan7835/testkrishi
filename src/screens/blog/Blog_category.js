import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/blog.css";
import { imageUrl } from "../../components/imgUrl";
import { addToCart } from "../../redux/actions/actions";

function Blog_category(props) {
  const [blogsByCategory, setBlogsByCategory] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  var path = props.location.pathname;
  var categoryId = path.split("/")[2];

  useEffect(() => {
    let requestData = {
      categoryName: categoryId,
    };
    ApiRequest(requestData, "/GetAllBlogByCategory", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setBlogsByCategory(res.data.data[0]);
          setDataLoaded(true);
        } else {
        }
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <main className="page-content">
      {dataLoaded ? (
        ""
      ) : (
        <div className="fullpage-loading">
          <ReactLoading
            type={"bubbles"}
            color={"#febc15"}
            height={"50px"}
            width={"100px"}
          />
        </div>
      )}
      <section className="page-banner">
        <div className="banner-figure">
          {dataLoaded ? (
            blogsByCategory.banner ? (
              <img src={imageUrl + blogsByCategory.banner} />
            ) : (
              <img src={imageUrl + localStorage.getItem("banner")} />
            )
          ) : (
            ""
          )}
          {/* <img src={featuredBanner} /> */}
        </div>
        <div className="banner-top-text">
          {/* <h1 style={{ textTransform: "uppercase" }}>
            {blogsByCategory && blogsByCategory.name}
          </h1> */}
        </div>
        <div className="banner-overlay"></div>
      </section>

      <section className="b-featured">
        <div className="container">
          <div className="featured-all-page view-all-post">
            {blogsByCategory &&
              blogsByCategory.blogData !== undefined &&
              blogsByCategory.blogData.map((blog) => {
                return (
                  <div className="b-feat-col cate-blog-view">
                    <div className="b-feat-fig">
                      <Link to={"/recipe/" + blog.slug}>
                        <img src={imageUrl + blog.images[0].image} />
                      </Link>
                    </div>
                    <div className="b-feat-ctxt">
                      <h6 style={{ textTransform: "capitalize" }}>
                        <Link to={"/recipe/" + blog.slug}>{blog.title}</Link>
                      </h6>
                      <div className="tim-feat-b">
                        {blog.prepTime ? (
                          <div className="feat-top-b">
                            <span>Time</span>
                            <p>{blog.prepTime}</p>
                          </div>
                        ) : (
                          ""
                        )}
                        {blog.noOfServe ? (
                          <div className="feat-top-b-righ">
                            <span>Portion</span>
                            <p>{blog.noOfServe} Persons</p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </main>
  );
}
const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Blog_category)
);
