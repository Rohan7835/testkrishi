import React from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../apiServices/ApiRequest";
import "../assets/css/cart.css";
import logo from "../assets/img/krish-cress-logo.png";
import {
  addToCart,
  deleteSelected,
  userdetails,
} from "../redux/actions/actions";
import Cart from "./Cart/Cart";
import RegionPopup from "./RegionPopup";

var filterArray = [];

class Header extends React.Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("contact");
    if (localStorage.getItem("selectedRegionId")) {
    } else {
      this.props.history.push("/");
    }
    this.state = {
      acc: dt,
      catData: [],
      productData: [],
      basketLength: this.props.dataInCart ? this.props.dataInCart.length : 0,
      finalData: [],
      mini: "",
      cartOpen: false,
      cartItems: this.props.dataInCart ? this.props.dataInCart : [],
      navOpen: false,
      regionPopup: false,
      dropdown: false,
      dropdown1: false,
      status: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
      searchKey: "",
      searchItem: {},
      allRegion: [],
      redirectToHome: null,
      addedItemNotification: false,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
      localStorage.setItem("status", true);
      localStorage.setItem("cartItem", []);
      let a = [];
      this.props.addToCart(a);
      this.forceUpdate();
    } else {
      this.setState({ status: false });
      localStorage.setItem("status", false);
      localStorage.setItem("cartItem", []);
      let a = [];
      this.props.addToCart(a);

      this.forceUpdate();
    }
    const requestData = {
      user_id: this.props.user_details._id,
      CartDetail: [],
      regionID: localStorage.getItem("selectedRegionId")
        ? JSON.parse(localStorage.getItem("selectedRegionId"))
        : "",
      totalCartPrice: 0,
      subscribe: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
    };
    ApiRequest(requestData, "/addtocart", "POST")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
        }
        this.props.history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout = async () => {
    await swal({
      title: "Logout",
      text: "Are you sure you want to logout ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        localStorage.setItem("contact", "");
        let a = [];
        this.props.userdetails(a);
        this.props.addToCart(a);
        window.location.replace("/");

        localStorage.clear();
      }
    });
    this.setState({
      redirectToHome: "/",
    });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.cartOpen !== this.state.cartOpen) {
      this.setState({
        cartItems: this.props.dataInCart ? this.props.dataInCart : [],
      });
    }
  }
  rerenderParentCallback() {
    this.forceUpdate();
  }

  async componentDidMount() {
    // this.props.getCategories()
    this.setState({
      catData: await this.props.categories.data,
      productData: await this.props.products.data,
    });

    for (var arr in this.state.productData) {
      for (var filter in this.state.catData) {
        if (
          this.state.productData[arr].product_cat_id._id ==
          this.state.catData[filter]._id
        ) {
          filterArray.push(this.state.catData[filter]);
        }
      }
    }

    filterArray = filterArray.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t._id === thing._id)
    );
    this.setState({ finalData: await filterArray });

    // this.setState(this.state);
  }

  //closing navbar when clicking on navLinks
  componentDidMount() {
    // if (this.props.user_details._id) {
    //   const expiryTokenDate = new Date(
    //     JSON.parse(localStorage.getItem("session"))
    //   );
    //   const currentDate = new Date();
    //   if (currentDate.getTime() > expiryTokenDate.getTime()) {
    //     localStorage.setItem("contact", "");
    //     let a = [];
    //     this.props.userdetails(a);
    //     this.props.addToCart(a);
    //     localStorage.setItem("cartItem", a);
    //     const regionName = localStorage.getItem("selectedRegionName");
    //     const regionId = localStorage.getItem("selectedRegionId");
    //     const regionDetails = localStorage.getItem("regionDetails");
    //     localStorage.clear();
    //     localStorage.setItem("selectedRegionName", regionName);
    //     localStorage.setItem("selectedRegionId", regionId);
    //     localStorage.setItem("regionDetails", regionDetails);
    //     window.location.reload();
    //   }
    // }
    var closingTags = document.querySelectorAll(".closenavbaronclick");

    closingTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        setTimeout(() => {
          this.setState({ navOpen: false });
        }, 50);
      });
    });
  }
  updateBasket = (node) => {
    // same as Hooks example
    this.setState({
      basketLength: localStorage.getItem("cartData")
        ? JSON.parse(localStorage.getItem("cartData")).length
        : 0,
    });
    this.forceUpdate();
  };

  addingclass = () => {
    let a = this.state.mini;
    if (a == "") {
      this.setState({
        mini: "active",
      });
    } else {
      this.setState({
        mini: "",
      });
    }
  };

  _goToCategory = (item) => {
    localStorage.setItem("search", item);
    window.location.replace("/category");

    // this.props.history.replace({ pathname: "category", search: item })
  };

  handleSearch = async (e) => {
    this.setState({
      searchKey: e.target.value,
    });
    if (this.state.searchKey.length >= 2) {
      let requestData = {
        product_name: e.target.value,
      };
      ApiRequest(requestData, "/searchProduct", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({
              searchItem: res.data.data,
            });
            localStorage.setItem("searchItem", JSON.stringify(res.data.data));
          } else {
            swal({
              title: "Network Issue",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (this.state.searchKey === "") {
      localStorage.removeItem("searchItem");
    } else if (this.state.searchKey < 2) {
      localStorage.removeItem("searchItem");
    }
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.props.dataInCart !== undefined &&
      prevProps.dataInCart.length < this.props.dataInCart.length
    ) {
      this.setState({
        addedItemNotification: true,
      });
      setTimeout(() => {
        this.setState({
          addedItemNotification: false,
        });
      }, 3000);
    }
    // if (
    //   // prevProps.dataInCart !== this.props.dataInCart &&
    //   this.props.dataInCart !== undefined &&
    //   prevProps.dataInCart.length !== this.props.dataInCart.length
    // ) {
    //   var cart_data_dt = [];
    //   let localPrice = 0;

    //   this.props.dataInCart.map((item, index) =>
    //     item.simpleData &&
    //     item.simpleData.length > 0 &&
    //     item.TypeOfProduct === "simple"
    //       ? item.simpleData[0].package
    //           .filter((dta) => dta.selected == true)
    //           .map((data, ind) => {
    //             if (this.props.user_details.length !== 0) {
    //               if (this.props.user_details.user_type === "b2b") {
    //                 localPrice = data.B2B_price;
    //               } else if (this.props.user_details.user_type === "retail") {
    //                 localPrice = data.Retail_price;
    //               } else if (
    //                 this.props.user_details.user_type === "user" ||
    //                 this.props.user_details.user_type === null
    //               ) {
    //                 localPrice = data.selling_price;
    //               }
    //             } else {
    //               if (data.selling_price) {
    //                 localPrice = data.selling_price;
    //               } else {
    //                 localPrice = data.packetmrp;
    //               }
    //             }
    //             cart_data_dt.push({
    //               product_categories: item.product_categories || [],
    //               product_cat_id: item.product_cat_id
    //                 ? item.product_cat_id._id
    //                 : null,
    //               product_subCat1_id: item.product_subCat1_id
    //                 ? item.product_subCat1_id._id
    //                 : null,
    //               product_id: item._id,
    //               preOrder: item.preOrder,
    //               preOrderRemainQty: item.preOrderRemainQty,
    //               product_name: item.product_name,
    //               productItemId: data._id,
    //               TypeOfProduct: item.TypeOfProduct,
    //               packet_size: data.packet_size,
    //               packetLabel: data.packetLabel,
    //               qty: data.quantity,
    //               price: localPrice,
    //               totalprice: data.quantity * localPrice,
    //               without_package: false,
    //             });
    //           })
    //       : (localPrice = item.totalprice)
    //   );

    //   this.props.dataInCart.map((item, index) => {
    //     if (item.TypeOfProduct === "simple") {
    //       if (this.props.user_details.length !== 0) {
    //         if (this.props.user_details.user_type === "b2b") {
    //           localPrice = item.simpleData[0].RegionB2BPrice;
    //         } else if (this.props.user_details.user_type === "retail") {
    //           localPrice = item.simpleData[0].RegionRetailPrice;
    //         } else if (
    //           this.props.user_details.user_type === "user" ||
    //           this.props.user_details.user_type === null
    //         ) {
    //           localPrice = item.simpleData[0].RegionSellingPrice;
    //         }
    //       } else {
    //         if (item.selling_price) {
    //           localPrice = item.simpleData[0].RegionSellingPrice;
    //         } else {
    //           localPrice = item.simpleData[0].packetmrp;
    //         }
    //       }
    //     } else {
    //       localPrice = item.totalPrice;
    //     }
    //     if (item.simpleData) {
    //       if (item.simpleData.length > 0) {
    //         if (item.TypeOfProduct === "simple") {
    //           if (item.simpleData[0].package.length === 0) {
    //             cart_data_dt.push({
    //               product_categories: item.product_categories || [],
    //               product_cat_id: item.product_cat_id
    //                 ? item.product_cat_id._id
    //                 : null,
    //               product_subCat1_id: item.product_subCat1_id
    //                 ? item.product_subCat1_id._id
    //                 : null,
    //               product_id: item._id,
    //               preOrder: item.preOrder,
    //               preOrderRemainQty: item.preOrderRemainQty,
    //               product_name: item.product_name,
    //               productItemId: item.simpleData[0]._id,
    //               TypeOfProduct: item.TypeOfProduct,
    //               packet_size: null,
    //               packetLabel: null,
    //               unitQuantity: item.unitQuantity,
    //               unitMeasurement:
    //                 item.unitMeasurement.name || item.unitMeasurement,
    //               qty: item.simpleData[0].userQuantity,
    //               price: localPrice,
    //               totalprice: item.simpleData[0].userQuantity * localPrice,
    //               without_package: true,
    //             });
    //           }
    //         }
    //       }
    //     }
    //     if (item.TypeOfProduct === "group") {
    //       cart_data_dt.push({
    //         product_categories: item.product_categories || [],
    //         ...item,
    //         product_id: item._id,
    //         qty: item.qty,
    //         totalprice: item.qty * item.price,
    //         without_package: true,
    //       });
    //     }
    //     if (item.TypeOfProduct === "configurable") {
    //       cart_data_dt.push({
    //         product_cat_id: null,
    //         product_subCat1_id: null,
    //         product_id: item._id,
    //         preOrder: false,
    //         preOrderRemainQty: item.preOrderRemainQty,
    //         product_name: item.product_name,
    //         productItemId: null,
    //         TypeOfProduct: "configurable",
    //         unitQuantity: item.unitQuantity,
    //         unitMeasurement: item.unitMeasurement,
    //         qty: item.qty,
    //         price: item.price,
    //         totalprice: item.price * item.qty,
    //         without_package: null,
    //         variant_name: item.variant_name,
    //       });
    //     }
    //   });
    //   const requestData = {
    //     user_id: this.props.user_details._id,
    //     CartDetail: cart_data_dt,
    //     regionID: localStorage.getItem("selectedRegionId")
    //       ? JSON.parse(localStorage.getItem("selectedRegionId"))
    //       : "",
    //     totalCartPrice: 0,
    //     subscribe: localStorage.getItem("status")
    //       ? JSON.parse(localStorage.getItem("status"))
    //       : false,
    //   };
    //   await ApiRequest(requestData, "/addtocart", "POST")
    //     .then((res) => {})
    //     .catch((error) => {
    //       console.log(error);
    //     });
    //   // alert(1);
    //   // localStorage.setItem("coupon_code", "");
    //   // localStorage.setItem("couponId", "");
    //   // localStorage.setItem("freepackage", "");
    //   // localStorage.setItem("freeproduct", "");
    //   // localStorage.setItem("couponStatus", 2);
    //   // localStorage.setItem("discount_amount", "");
    //   this.forceUpdate();
    // }
    if (prevProps.addToCartPopup !== this.props.addToCartPopup) {
      this.setState({
        addedItemNotification: true,
      });
      setTimeout(() => {
        this.setState({
          addedItemNotification: false,
        });
      }, 3000);
    }
  }
  selectedRegionValue = (value, name) => {
    localStorage.setItem("selectedRegionId", JSON.stringify(value));
    localStorage.setItem("selectedRegionName", JSON.stringify(name));
    const requestData = {
      RegionId: value,
      subscribe: false,
    };
    if (value.length > 0) {
      const requestData2 = {
        user_id: this.props.user_details._id,
        CartDetail: [],
        regionID: value,
        totalCartPrice: 0,
        subscribe: localStorage.getItem("status")
          ? JSON.parse(localStorage.getItem("status"))
          : false,
      };
      ApiRequest(requestData2, "/addtocart", "POST")
        .then((res) => {
          ApiRequest(requestData, "/product/forHome/byregion", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  regionPopup: false,
                });
              } else {
              }
              this.props.history.push("/");
              window.location.reload();
            })
            .then(() => {})
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  closeNavFunction() {
    setTimeout(() => this.setState({ navOpen: false }), 50);
  }
  render() {
    // if (this.state.redirectToHome) {
    //   return <Redirect to={this.state.redirectToHome} />;
    // }
    const currentPathName = this.props.location.pathname;
    return (
      <>
        {this.state.regionPopup ? (
          <RegionPopup
            selectedRegionValue={(v, n) => this.selectedRegionValue(v, n)}
            closePopup={() => {
              this.setState({
                regionPopup: false,
              });
            }}
            parentName="header"
          />
        ) : (
          ""
        )}
        <header className="responsive_header_des">
          {this.state.cartOpen && (
            <Cart
              hideCart={() => {
                this.forceUpdate();
                this.setState({
                  cartOpen: false,
                });
              }}
              renderParent={() => this.forceUpdate()}
            />
          )}
          <div className="container-fluid">
            <div className="header-bar">
              {/* hidden nav */}
              <nav>
                <ul>
                  <li className="menu">
                    <div
                      className={
                        this.state.navOpen
                          ? "mdl-layout__obfuscator show-box"
                          : "mdl-layout__obfuscator"
                      }
                      onClick={() =>
                        this.setState({
                          navOpen: false,
                        })
                      }
                    ></div>
                    <section className="mobile-header">
                      <div className="mob-nav-bx">
                        <div className="mobile-slide">
                          <button
                            type="button"
                            onClick={() =>
                              this.setState({
                                navOpen: true,
                              })
                            }
                          >
                            <span></span>
                            <span></span>
                            <span></span>
                          </button>
                          <div
                            className={
                              this.state.navOpen
                                ? "mobile-nav-content main"
                                : "mobile-nav-content"
                            }
                          >
                            <div className="mobile-logo">
                              <span className="larg-logo">
                                <Link to="/">
                                  <img src={logo} alt="" />
                                </Link>
                              </span>
                            </div>
                            <ul>
                              {this.props.user_details.name &&
                              localStorage.getItem("_jw_token") ? (
                                <li
                                  className={
                                    this.state.dropdown1
                                      ? "side-bar-nav open"
                                      : "side-bar-nav"
                                  }
                                  onClick={() =>
                                    this.setState({
                                      dropdown1: !this.state.dropdown1,
                                      navOpen: true,
                                    })
                                  }
                                >
                                  <a style={{ userSelect: "none" }}>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/Profile.jpg"
                                      }
                                      alt=""
                                    />
                                    My Account
                                  </a>
                                  <span className="side-right"></span>
                                  <div className="sidebar-sub-menu">
                                    <ul>
                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/my-profile"
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Profile.jpg"
                                            }
                                            alt=""
                                          />
                                          Profile
                                        </NavLink>
                                      </li>
                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/manage-address"
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Address.jpg"
                                            }
                                            alt=""
                                          />
                                          Address
                                        </NavLink>
                                      </li>
                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/order"
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Order.jpg"
                                            }
                                            alt=""
                                          />
                                          Orders
                                        </NavLink>
                                      </li>
                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/my-wallet"
                                        >
                                          {" "}
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Wallet.jpg"
                                            }
                                            alt=""
                                          />
                                          Wallet
                                        </NavLink>
                                      </li>
                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/my-Seed"
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Seeds.jpg"
                                            }
                                            alt=""
                                          />
                                          Seeds
                                        </NavLink>
                                      </li>

                                      <li
                                        onClick={() => this.closeNavFunction()}
                                      >
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/referral"
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Referral.jpg"
                                            }
                                            alt=""
                                          />
                                          Referral
                                        </NavLink>
                                      </li>

                                      <li className="closenavbaronclick">
                                        <a onClick={() => this.logout()}>
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/img/icons/Log Out.jpg"
                                            }
                                            alt=""
                                          />
                                          Logout
                                        </a>
                                      </li>
                                      {/* <li className="closenavbaronclick">
                                      <Link to="/manage-address">Cart</Link>
                                    </li> */}
                                      {/* <li className="closenavbaronclick">
                                      <Link to="/checkout">checkout</Link>
                                    </li> */}
                                    </ul>
                                  </div>
                                </li>
                              ) : (
                                <li
                                  className="side-bar-nav"
                                  onClick={() => this.closeNavFunction()}
                                >
                                  <Link to="/cart">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/Profile.jpg"
                                      }
                                      alt=""
                                    />
                                    My account
                                  </Link>
                                </li>
                              )}
                              {/* <li
                                className={
                                  this.state.dropdown
                                    ? "side-bar-nav open"
                                    : "side-bar-nav"
                                }
                                onClick={() =>
                                  this.setState({
                                    dropdown: !this.state.dropdown,
                                  })
                                }
                              >
                                <a>Shop</a>
                                <span className="side-right"></span>
                                <div className="sidebar-sub-menu">
                                  <ul>
                                    <li className="closenavbaronclick">
                                      <Link to="/cart">
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/img/icons/Cart.jpg"
                                          }
                                          alt=""
                                        />
                                        Cart
                                      </Link>
                                    </li>
                                    {/* <li className="closenavbaronclick">
                                      <Link to="/checkout">checkout</Link>
                                    </li> */}
                              {/* </ul>
                                </div>
                              </li> */}
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  activeClassName="active-sidelink"
                                  to="/referral"
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/Referral.jpg"
                                    }
                                    alt=""
                                  />
                                  Referral
                                </NavLink>
                              </li>
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  activeClassName="active-sidelink"
                                  to="/loyalty"
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/Loyalty.jpg"
                                    }
                                    alt=""
                                  />
                                  Loyalty
                                </NavLink>
                              </li>

                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  activeClassName="active-sidelink"
                                  to="/media-coverage"
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/Media Coverage.jpg"
                                    }
                                    alt=""
                                  />
                                  Media Coverage
                                </NavLink>
                              </li>
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  to="/recipes"
                                  activeClassName="active-sidelink"
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/Recipes.jpg"
                                    }
                                    alt=""
                                  />
                                  Recipes
                                </NavLink>
                              </li>
                              {/* <li className="side-bar-nav">
                              <a href="#">FAQs</a>
                            </li>
                            <li className="side-bar-nav">
                              <a href="#">Terms &amp; Conditions</a>
                            </li> */}
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  to="/contact-us"
                                  activeClassName="active-sidelink"
                                >
                                  {" "}
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/Contact.jpg"
                                    }
                                    alt=""
                                  />
                                  Contact
                                </NavLink>
                              </li>
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  to="/FAQ"
                                  activeClassName="active-sidelink"
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/img/icons/FAQ.jpg"
                                    }
                                    alt=""
                                  />
                                  FAQs
                                </NavLink>
                              </li>
                            </ul>
                            <div className="new-side-lists">
                              <ul>
                                <li className="side-bar-nav closenavbaronclick">
                                  <NavLink
                                    to="/about"
                                    activeClassName="active-sidelink"
                                  >
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/About Us.jpg"
                                      }
                                      alt=""
                                    />
                                    About Us
                                  </NavLink>
                                </li>
                                <li className="side-bar-nav closenavbaronclick">
                                  <NavLink
                                    to="/term&condition"
                                    activeClassName="active-sidelink"
                                  >
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/T&C.jpg"
                                      }
                                      alt=""
                                    />
                                    Terms & Condition
                                  </NavLink>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </li>
                </ul>
              </nav>
              <div className="co-logo">
                <Link to="/">
                  <img src={logo} />
                </Link>
              </div>
              <div className="header-search">
                {/* <i className="fa fa-search" aria-hidden="true"></i>
                <input type="text" onChange={this.handleSearch} /> */}
              </div>
              <div className="header-list">
                <ul>
                  {/* <li className="dd-switch">
                    <Switch
                      onChange={this.handleChangeStatus}
                      checked={this.state.status}
                      onColor="#ffde8a"
                      onHandleColor="#febc15"
                      handleDiameter={30}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                      height={20}
                      width={48}
                      className="react-switch"
                      id="material-switch"
                    />
                  </li> */}
                  <li className="location-tt" style={{ userSelect: "none" }}>
                    <span
                      onClick={() => {
                        this.setState({
                          regionPopup: true,
                        });
                      }}
                      style={{
                        textTransform: "capitalise",
                        cursor: "pointer",
                        fontFamily: '"Montserrat-Light"',
                        color: "#5a5a5a",
                      }}
                    >
                      <img
                        src={
                          process.env.PUBLIC_URL +
                          "/img/icons/Change Location.jpg"
                        }
                        alt=""
                        style={{ marginRight: 5 }}
                      />
                      {/* <i
                        className="fa fa-map-marker"
                        style={{ marginRight: 3 }}
                      ></i> */}
                      <span className="header-loc-text">
                        {localStorage.getItem("selectedRegionId")
                          ? this.props.deliveryInfo.Pincode || ""
                          : ""}
                        {/* {this.props.deliveryInfo.Pincode || ""} */}
                      </span>
                    </span>
                  </li>
                  <li>
                    <Link to="/about">
                      {/* <img
                        src={process.env.PUBLIC_URL + "/img/icons/About Us.jpg"}
                        alt=""
                      /> */}
                      About Krishi Cress
                    </Link>
                  </li>
                  <li>
                    <Link to="/recipes">
                      {/* <img
                        src={process.env.PUBLIC_URL + "/img/icons/recipess.jpg"}
                        alt=""
                      /> */}
                      Recipes
                    </Link>
                  </li>

                  {currentPathName.includes("checkout") ? (
                    ""
                  ) : (
                    <li
                      className="minicart"
                      onClick={() => {
                        this.setState({
                          cartOpen: true,
                        });
                        this.forceUpdate();
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={process.env.PUBLIC_URL + "/img/icons/Cart.jpg"}
                        alt=""
                      />
                      <span className="count-product">
                        {this.props.dataInCart && this.props.dataInCart.length}
                      </span>

                      {this.state.addedItemNotification ? (
                        <div className="added_notification">Item Added!</div>
                      ) : (
                        ""
                      )}
                      {/* {this.props.addToCartPopup ? (
                        <div className="added_notification">Item Added!</div>
                      ) : (
                        ""
                      )}  */}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state,
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  deleteSelected: () => dispatch(deleteSelected()),
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
