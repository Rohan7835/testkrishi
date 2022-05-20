import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { ApiRequest } from "../../../apiServices/ApiRequest";
import logo from "../../../assets/img/krish-cress-logo.png";
import "../../../css/margins-min.css";
import "../../../css/material-dashboard.css?v=2.1.1";
import "../../../css/style.css";

class Adminsiderbar extends Component {
  constructor(props) {
    super(props);
    var path = window.location.href;
    var routeName = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (routeName === "admin-Stock") {
      routeName = "admin-Stock";
    } else if (routeName === "admin-orderdetails") {
      routeName = "admin-orderdetails";
    } else if (routeName === "admin-Subscription") {
      routeName = "admin-Subscription";
    } else if (routeName === "admin-dashboard") {
      routeName = "admin-dashboard";
    } else if (routeName === "admin-Category") {
      routeName = "admin-Category";
    } else if (routeName === "admin-Coupon") {
      routeName = "admin-Coupon";
    } else if (routeName === "admin-allstock") {
      routeName = "admin-allstock";
    } else if (routeName === "admin-availablestock") {
      routeName = "admin-availablestock";
    } else if (routeName === "admin-reportgeneration") {
      routeName = "admin-reportgeneration";
    } else if (routeName === "admin-suppliers  ") {
      routeName = "admin-suppliers    ";
    } else if (routeName === "admin-user") {
      routeName = "admin-user";
    } else if (routeName === "admin-Add_stock") {
      routeName = "admin-Add_stock";
    } else if (routeName === "Payment-keys") {
      routeName = "Payment-keys";
    } else if (routeName === "currency") {
      routeName = "currency";
    } else if (routeName === "adminblog") {
      routeName = "adminblog";
    } else if (routeName === "admin-tax") {
      routeName = "admin-tax";
    } else if (routeName === "add-inventory") {
      routeName = "add-inventory";
    } else if (routeName === "lost-damage") {
      routeName = "lost-damage";
    } else if (routeName === "return-damage") {
      routeName = "return-damage";
    } else if (path.includes("edit-product")) {
      routeName = "edit-product";
    } else if (path.includes("admin-faq")) {
      routeName = "admin-faq";
    } else if (routeName === "inhouse-usage") {
      routeName = "inhouse-usage";
    }
    this.state = {
      routeName: routeName,
      userData: JSON.parse(localStorage.getItem("adminInfo")),
      permits: [],
    };
  }

  async componentDidMount() {
    // document.getElementById("check").click();
    this.setState({ permits: await this.state.userData.user_role.modules });
  }

  checkPermit(element) {
    return this.state.permits.find((i) => {
      return i.toLowerCase() === element.toLowerCase();
    });
  }
  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      const requestData = {
        email: this.state.userData.email,
        password: this.state.userData.password,
      };
      ApiRequest(requestData, "/adminLogin", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            localStorage.setItem("_Admin_jw_token", res.data.token);
          } else {
          }
        })
        .catch((error) => {
          localStorage.setItem("adminInfo", "");
          this.props.history.push("/admin-login");
        });
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    return (
      <div
        className="sidebar"
        data-color="purple"
        data-background-color="white"
        data-image="../assets/img/sidebar-1.jpg"
      >
        <div className="logo">
          <a href="/" className="simple-text logo-normal">
            <img
              src={logo}
              alt="logo_image"
              className="img-responsive"
              style={{ height: "30px", width: "150px" }}
            />
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            <li
              className={
                this.state.routeName === "admin-dashboard"
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link to="/admin-dashboard" className="nav-link">
                <i className="material-icons">dashboard</i>
                <p>Home</p>
              </Link>
            </li>

            {/* <li
              className={
                this.state.routeName === "analytics-dashboard"
                  ? "nav-item active"
                  : "nav-item"
              }
            >
              <Link to="/analytics-dashboard" className="nav-link">
                <i className="material-icons">dashboard</i>
                <p>Analytic Dashboard</p>
              </Link>
            </li> */}

            {this.checkPermit("driver") || this.checkPermit("Order") ? (
              <li
                className={
                  this.state.routeName === "admin-orderdetails" ||
                  this.state.routeName === "admin-Subscription" ||
                  this.state.routeName === "driver"
                    ? "nav-item dropdown active"
                    : "nav-item dropdown"
                }
              >
                <a
                  className="nav-link"
                  href=""
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-icons">receipt</i>
                  Sales
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-right master-mg-ul"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {this.checkPermit("Order") ? (
                    <Link to="/admin-orderdetails">
                      <li className="dropdown-item">Orders</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("Subscribe") ? (
                    <Link to="/admin-Subscription">
                      <li className="dropdown-item">Subscription</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("driver") ? (
                    <Link to="/admin-driver">
                      <li className="dropdown-item">Drivers</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                </ul>
              </li>
            ) : (
              ""
            )}

            {this.checkPermit("Coupon") ||
            this.checkPermit("Feedback") ||
            this.checkPermit("admin-loyality") ||
            this.checkPermit("admin-wallet") ||
            this.checkPermit("Subscribe") ||
            this.checkPermit("report") ||
            this.checkPermit("customer") ? (
              <li
                className={
                  this.state.routeName === "admin-Coupon" ||
                  this.state.routeName === "feedback" ||
                  this.state.routeName === "admin-loyality" ||
                  this.state.routeName === "admin-wallet" ||
                  this.state.routeName === "subscribe" ||
                  this.state.routeName === "customer" ||
                  this.state.routeName === "admin-reportgeneration"
                    ? "nav-item dropdown active"
                    : "nav-item dropdown"
                }
              >
                <a
                  className="nav-link"
                  href=""
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-icons">store</i>
                  Marketing
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-right master-mg-ul"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {this.checkPermit("customer") ? (
                    <Link to="/admin-customer">
                      <li className="dropdown-item">Customers</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("Feedback") ? (
                    <Link to="/admin-feedback">
                      <li className="dropdown-item">Contact us</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("report") ? (
                    <Link to="/admin-reportgeneration">
                      <li className="dropdown-item">Report</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {/* {this.checkPermit("Subscribe") ? (
                    <Link to="/subscribe">
                      <li className="dropdown-item">Subscribe</li>
                    </Link>
                  ) : (
                    <></>
                  )} */}

                  {this.checkPermit("Coupon") ? (
                    <Link to="/admin-Coupon">
                      <li className="dropdown-item">Coupon</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("addloyalitypoints") ? (
                    <Link to="/admin-loyalty">
                      <li className="dropdown-item">Loyalty</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("wallet") ? (
                    <Link to="/admin-wallet">
                      <li className="dropdown-item">Wallet</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                </ul>
              </li>
            ) : (
              ""
            )}

            {this.checkPermit("Category") ||
            this.checkPermit("Variant") ||
            this.checkPermit("variantcat") ||
            this.checkPermit("Supplier") ||
            this.checkPermit("addinventory") ||
            this.checkPermit("lostdamage") ||
            this.checkPermit("returndamage") ||
            this.checkPermit("inhouseusage") ||
            this.checkPermit("viewproduct") ||
            this.checkPermit("viewinventory") ? (
              <li
                className={
                  this.state.routeName === "admin-Category" ||
                  this.state.routeName === "variant-master" ||
                  this.state.routeName === "admin-suppliers" ||
                  this.state.routeName === "add-inventory" ||
                  this.state.routeName === "lost-damage" ||
                  this.state.routeName === "return-damage" ||
                  this.state.routeName === "return-damage" ||
                  this.state.routeName === "inhouse-usage" ||
                  this.state.routeName === "view-product" ||
                  this.state.routeName === "edit-product" ||
                  this.state.routeName === "view-inventory"
                    ? "nav-item dropdown active"
                    : "nav-item dropdown"
                }
              >
                <a
                  className="nav-link"
                  href=""
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-icons">inventory_2</i>
                  Stock
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-right master-mg-ul"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {this.checkPermit("Category") ? (
                    <Link to="/admin-Category">
                      <li className="dropdown-item">Category</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("viewproduct") ? (
                    <Link to="/admin-view-product">
                      <li className="dropdown-item">Product Inventory</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("viewinventory") ? (
                    <Link to="/admin-view-inventory">
                      <li className="dropdown-item">Bill Detail</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("addinventory") ? (
                    <Link to="/admin-add-inventory">
                      <li className="dropdown-item">Add Inventory</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("lostdamage") ? (
                    <Link to="/admin-lost-damage">
                      <li className="dropdown-item">Lost/Damage Inventory</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("returndamage") ? (
                    <Link to="/admin-return-inventory">
                      <li className="dropdown-item">Return Inventory</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("inhouseusage") ? (
                    <Link to="/admin-inhouse-inventory">
                      <li className="dropdown-item">Inhouse Inventory</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("Variant") ? (
                    <Link to="/variant-category">
                      <li className="dropdown-item">Variant Category</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("Variant") ? (
                    <Link to="/variant-master">
                      <li className="dropdown-item">Variant</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("Supplier") ? (
                    <Link to="/admin-suppliers">
                      <li className="dropdown-item">Supplier</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                </ul>
              </li>
            ) : (
              ""
            )}

            {this.checkPermit("Banners") ||
            this.checkPermit("Slides") ||
            this.checkPermit("blog") ||
            this.checkPermit("blogcat") ? (
              <li
                className={
                  this.state.routeName === "admin-slides" ||
                  this.state.routeName === "admin-faq" ||
                  this.state.routeName === "adminblog" ||
                  this.state.routeName === "admin-loyality-badge" ||
                  this.state.routeName === "admin-about" ||
                  this.state.routeName === "admin-privacy" ||
                  this.state.routeName === "admin-term_condition" ||
                  this.state.routeName === "blog_master"
                    ? "nav-item dropdown active"
                    : "nav-item dropdown"
                }
              >
                <a
                  className="nav-link"
                  href=""
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-icons">web_asset</i>
                  Website
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-right master-mg-ul"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {this.checkPermit("blog") ? (
                    <Link to="/admin-recipe">
                      <li className="dropdown-item">Recipes</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("blogcat") ? (
                    <Link to="/admin-recipe-category">
                      <li className="dropdown-item">Recipes Category</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("Slides") ? (
                    <Link to="/admin-slides">
                      <li className="dropdown-item">Slider</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("faq") ? (
                    <Link to="/admin-faq">
                      <li className="dropdown-item">FAQ</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("about_us") ? (
                    <Link to="/admin-about">
                      <li className="dropdown-item">About us</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("privacy_policy") ? (
                    <Link to="/admin-privacy">
                      <li className="dropdown-item">Privacy Policy</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("tearm_condition") ? (
                    <Link to="/admin-term_condition">
                      <li className="dropdown-item">Terms & Conditions</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {/* {this.checkPermit("Banners") ? (
                    <Link to="/admin-banners">
                      <li className="dropdown-item">Banner</li>
                    </Link>
                  ) : (
                    <></>
                  )} */}
                </ul>
              </li>
            ) : (
              ""
            )}

            {this.checkPermit("Payment Api") ||
            this.checkPermit("Region") ||
            this.checkPermit("Measurement") ||
            this.checkPermit("tax") ||
            this.checkPermit("adminuser") ||
            this.checkPermit("adminuserrole") ? (
              <li
                className={
                  this.state.routeName === "Payment-keys" ||
                  this.state.routeName === "admin-tax" ||
                  this.state.routeName === "admin-user" ||
                  this.state.routeName === "admin-user-role" ||
                  this.state.routeName === "admin-region" ||
                  this.state.routeName === "admin-measurenment"
                    ? "nav-item dropdown active"
                    : "nav-item dropdown"
                }
              >
                <a
                  className="nav-link"
                  href=""
                  id="navbarDropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="material-icons">settings_applications</i>
                  Settings
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-right master-mg-ul"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  {/* {this.checkPermit("Region") ? ( */}
                  {this.checkPermit("general") ? (
                    <Link to="/admin-general-setting">
                      <li className="dropdown-item">General</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {this.checkPermit("delivery") ? (
                    <Link to="/admin-delivery">
                      <li className="dropdown-item">Delivery</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {/* <Link to="/delivery-setting">
                    <li className="dropdown-item">Devliery Settings</li>
                  </Link> */}
                  {/* ) : (
                    <></>
                  )} */}
                  {/* <Link to="/notification-settings">
                    <li className="dropdown-item">Notifications</li>
                  </Link> */}
                  {/* <Link to="/email-template">
                    <li className="dropdown-item">Email Templates</li>
                  </Link> */}
                  {this.checkPermit("Region") ? (
                    <Link to="/admin-region">
                      <li className="dropdown-item">Inventory Region</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("loyalty_program") ? (
                    <Link to="/admin-loyalty-badge">
                      <li className="dropdown-item">Loyalty Programme</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {/* {this.checkPermit("Region") ? ( */}

                  {/* ) : (
                    <></>
                  )} */}

                  {/* {this.checkPermit("Measurement") ? (
                    <Link to="/admin-measurenment">
                      <li className="dropdown-item">Measurement</li>
                    </Link>
                  ) : (
                    <></>
                  )} */}

                  {/* {this.checkPermit("Payment Api") ? (
                    <Link to="/Payment-keys">
                      <li className="dropdown-item">Payment Gateway</li>
                    </Link>
                  ) : (
                    <></>
                  )} */}

                  {this.checkPermit("tax") ? (
                    <Link to="/admin-tax">
                      <li className="dropdown-item">Tax</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("adminuser") ? (
                    <Link to="/admin-user">
                      <li className="dropdown-item">Users</li>
                    </Link>
                  ) : (
                    <></>
                  )}

                  {this.checkPermit("adminuserrole") ? (
                    <Link to="/admin-user-role">
                      <li className="dropdown-item">User Role</li>
                    </Link>
                  ) : (
                    <></>
                  )}
                </ul>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(Adminsiderbar);
