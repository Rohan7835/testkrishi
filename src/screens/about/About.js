import React from "react";
import { Link } from "react-router-dom";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/loyality-referral.css";
const fbq = window.fbq;
class about_us extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeLink: "three",
      htmldata: "",
      partners: "",
      Philosophy: "",
      Journey: "",
      Team: "",
    };
  }

  componentDidMount() {
    console.log(fbq);
    this.setState({ loading: true });
    let user = {};
    ApiRequest(user, "/Setting/getAbout", "GET")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            htmldata: res.data.data.desc,
            partners: res.data.data.partners,
            Philosophy: res.data.data.Philosophy,
            Journey: res.data.data.Journey,
            Team: res.data.data.Team,
          });
          this.setState({ loading: false });
        }
      })
      .catch((err) => console.log(err));

    // $(".tab_content").hide(); //Hide all content
    // $("ul.tabs li:first").addClass("current").show();
    // $(".tab_content:first").show();
    // $("ul.tabs li").click(function () {
    //   $("ul.tabs li").removeClass("current");
    //   $(this).addClass("current");
    //   $(".tab_content").hide();
    //   var activeTab = $(this).find("a").attr("href");
    //   $(activeTab).fadeIn();
    //   return false;
    // });
  }

  go_to_home = () => {
    this.props.history.push("/");
  };
  changeActiveLink = (e, num) => {
    e.preventDefault();
    this.setState({ activeLink: num });
  };

  render() {
    return (
      <>
        <main className="page-content">
          {/* <div className="thankxbg comming_s content-page-text-detail">
                  <div className="container">
                    <div className="about-page">
                      <div
                        dangerouslySetInnerHTML={{ __html: this.state.htmldata }}
                      />
                    </div>
                  </div>
                </div> */}
          <section className="page-banner">
            <div className="banner-figure">
              {/* <img src="/img/about-main-banner.jpg" /> */}
              <img alt="" src={process.env.PUBLIC_URL + "/img/About Us.jpg"} />
            </div>
          </section>
          <div className="container">
            <ul className="tabs about-main">
              <li className={this.state.activeLink === "one" ? "current" : ""}>
                <a href="#" onClick={(e) => this.changeActiveLink(e, "one")}>
                  <span className="icon-accor-tab">
                    <img
                      src={process.env.PUBLIC_URL + "/img/icons/Journey.jpg"}
                      alt=""
                    />
                  </span>
                  <span className="accor-list-text">Journey</span>
                </a>
              </li>
              {this.state.activeLink === "one" && (
                <div className="tab_content">
                  <div className="tab-acord-data">
                    <p>
                      A graduate of Le Cordon Bleu in Adelaide and New York's
                      International Culinary Centre Achintya Anand's
                      entrepreneurial journey began in 2014 when he started
                      supplying micro-greens to prominent restaurants in Delhi,
                      like Chef Manish Mehrotra's Indian Accent and Tres by Chef
                      Julia Carmen.Since then, Anand has scaled Krishi Cress'
                      perations from an eight-by-eight wooden crate to a
                      ull-fledged farming initiative in New Delhi's Chhatarpur
                      rea.With a vision to bring lesser-known farm products ch
                      as Kombucha to the discerning Indian consumer, Anand
                      currently expanding Krishi Cress' extensive range of
                      oducts to cities like Kolkata, Kanpur, Lucknow, medabad,
                      Pune and Mumbai, while catering to a growing demand
                      products in New Delhi.
                    </p>
                  </div>
                  <div className="tab-journey-figure">
                    <img src="/img/about-banner-top.jpg" />
                  </div>
                </div>
              )}
              <li className={this.state.activeLink === "two" ? "current" : ""}>
                <a href="#" onClick={(e) => this.changeActiveLink(e, "two")}>
                  <span className="icon-accor-tab">
                    <img
                      src={process.env.PUBLIC_URL + "/img/icons/Philosophy.jpg"}
                      alt=""
                    />
                  </span>
                  <span className="accor-list-text">Philosophy</span>
                </a>
              </li>
              {this.state.activeLink === "two" && (
                <div id="two" className="tab_content">
                  <div className="tab-acord-data">
                    <p>
                      We believe that Indian produce is at par if not better
                      than the produce grown anywhere else in the world.
                      However, poor harvesting practices and post harvest
                      handling compromise the quality and nutrition of produce
                      and often lead to high amounts of food wastage.We support
                      ur farmer partners in adopting better harvesting and
                      torage practices, to get better value from their roducts,
                      while also ensuring a better product for our customers.
                    </p>
                    <p>
                      At KC we are always working towards our goal of ‘zero
                      waste’ wherein items that are generally wasted in the food
                      processing and packaging stages are enhanced and enriched
                      by us in our farm kitchen to give our customers nutritious
                      and sustainable products such as our Kombucha, dips,
                      syrups, dressings and much more.This allows farmers to
                      enefit from increased value for their existing produce, s
                      well as reduced environmental waste, while providing ur
                      customers with exceptional quality and wide range of
                      kitchen products.
                    </p>
                  </div>
                  <div className="Philosophy-figure">
                    <div className="phil-figure">
                      <img src="/img/farmer_1.jpg" />
                    </div>
                    <div className="phil-figure">
                      <img src="/img/farmer_3.jpg" />
                    </div>
                    <div className="phil-figure">
                      <img src="/img/farmer_4.jpg" />
                    </div>
                  </div>
                </div>
              )}
              <li className={this.state.activeLink === "four" ? "current" : ""}>
                <a href="#" onClick={(e) => this.changeActiveLink(e, "four")}>
                  <span className="icon-accor-tab">
                    <img
                      src={process.env.PUBLIC_URL + "/img/icons/Partners.jpg"}
                      alt=""
                    />
                  </span>
                  <span className="accor-list-text">partners</span>
                </a>
              </li>
              {this.state.activeLink === "four" && (
                <div id="four" className="tab_content">
                  <div className="abt-partner">
                    <img src="/img/partners-01.jpg" />
                  </div>
                </div>
              )}
              <li className={this.state.activeLink === "five" ? "current" : ""}>
                <a href="#" onClick={(e) => this.changeActiveLink(e, "five")}>
                  <span className="icon-accor-tab">
                    <img
                      src={process.env.PUBLIC_URL + "/img/icons/Team.jpg"}
                      alt=""
                    />
                  </span>
                  <span className="accor-list-text">Team</span>
                </a>
              </li>
              {this.state.activeLink === "five" && (
                <div id="five" className="tab_content">
                  <div className="tab-acord-data">
                    <p>
                      We are a team of 70+ people, and are lucky enough to be
                      growing every year. Members in our team have diverse skill
                      sets, ranging from horticulturalists, food technologists
                      and culinary arts, to sales, logistics and packaging. It
                      is the Krishi Cress team's hard work that makes it
                      possible for us to deliver fresh and local produce to our
                      customers, every day.{" "}
                    </p>
                  </div>
                  <div className="acord-banner">
                    <img src="/img/team photo.jpg" />
                  </div>
                </div>
              )}{" "}
              <li
                className={this.state.activeLink === "three" ? "current" : ""}
              >
                <a href="#" onClick={(e) => this.changeActiveLink(e, "three")}>
                  <span className="icon-accor-tab">
                    {this.state.activeLink !== "three" ? (
                      <img
                        src={process.env.PUBLIC_URL + "/img/icons/About Us.jpg"}
                        alt=""
                      />
                    ) : (
                      <img
                        src={process.env.PUBLIC_URL + "/img/icons/About Us.jpg"}
                        alt=""
                      />
                    )}
                  </span>
                  <span className="accor-list-text">about us</span>
                </a>
              </li>
              {this.state.activeLink === "three" && (
                <div id="three" className="tab_content">
                  <div className="acord-banner">
                    <img src="/img/About Us1.jpg" />
                  </div>
                  <div className="tab-acord-data">
                    <p>
                      Krishi Cress grows and delivers fresh farm produce- from
                      salad greens to seasonal fruits and edible flowers to
                      everyday veggies-to many homes and restaurants in
                      Delhi-NCR.Thriving relationships with our partner farms
                      across North India ensures that the Krishi Cress online
                      store is always stocked with exotic, delicious and
                      seasonal foods.
                    </p>
                    <p>
                      In addition, a line of farm products-including 14 variants
                      of freshly-brewed Kombucha and more than 12 kinds of
                      artisanal cheese-round out the Krishi Cress experience
                      that has been designed to inspire enthusiasts to reimagine
                      their relationship with food.The goal?To put local foods d
                      Indian ingredients on the world's culinary radar while
                      powering the country's farmers with access to knowledge
                      and technology.
                    </p>
                  </div>
                </div>
              )}
            </ul>
          </div>
          <div className="cta-wrapper-main">
            <div className="container">
              <div className="about-cta-box">
                <h2>If you're interested in working with us</h2>
                <Link to="/contact-us">Contact us</Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

export default about_us;
