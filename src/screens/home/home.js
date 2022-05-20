import React from "react";
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router";
import { Link, NavLink } from "react-router-dom";
import Slider from "react-slick";
import LoadingBar from "react-top-loading-bar";
import swal from "sweetalert";
import { addToCart, userdetails } from "../../../src/redux/actions/actions";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/cart.css";
import logo from "../../assets/img/krish-cress-logo.png";
import Cart from "../../components/Cart/Cart";
import Footer from "../../components/footer";
import Product from "../../components/product";
import Sidebar from "../../components/sidebar";
import { imageUrl } from "../../imageUrl";
import LastOrders from "./LastOrders";
import Related_recipes from "./Related_recipes";

var feat_slider1 = {
  dots: true,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  infinite: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
};
var filterArray = [];

class HOME extends React.Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("contact");
    this.state = {
      acc: dt,
      catData: [],
      productData: [],
      basketLength: this.props.dataInCart ? this.props.dataInCart.length : 0,
      finalData: [],
      mini: "",
      firstTimeHomeLoading: true,
      maintance_banner_closeed_ststus: sessionStorage.getItem(
        "maintancebannerclose_status"
      )
        ? window.sessionStorage.getItem("maintancebannerclose_status") == "true"
          ? true
          : false
        : false,
      maintenance:
        window.sessionStorage.getItem("maintenanceStatus") == "true"
          ? true
          : false,
      maintenanceBanner: window.sessionStorage.getItem("maintenanceBanner"),
      maintenanceLink: window.sessionStorage.getItem("maintenanceLink"),
      updateCartValue: false,
      cartItems: this.props.dataInCart && this.props.dataInCart,
      navOpen: false,

      closeMobileDropdown: false,
      dropdown: false,
      dropdown1: false,
      regionPopup: localStorage.getItem("selectedRegionId") ? false : true,
      searchKey: "",
      searchItem: [],
      showLoadingIcon: false,
      filteredProducts: [],
      selectedCategory: "",
      progress: 0,
      showCart: false,
      // showCatLoading: true,
      showAll: false,
      reRenderer: true,
      status: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
      renderer: false,
      allRegion: [],
      showTopTenList: false,
      selectedRegion: localStorage.getItem("seletedRegionId")
        ? JSON.parse(localStorage.getItem("seletedRegionId"))
        : "",
      addedItemNotification: false,
      intervalSearch: "",
      dynamicLinks: [],
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.closeMaintanceModal = this.closeMaintanceModal.bind(this);

    var cartDatabyAPI = [];
    let dtaa = {};
    if (this.props.user_details._id) {
      ApiRequest(dtaa, "/get/addtocart/" + this.props.user_details._id, "GET")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            localStorage.setItem("status", Boolean(res.data.data.subscribe));
            res.data.data.cartDetail &&
              res.data.data.cartDetail.map((item) => {
                cartDatabyAPI.push({
                  _id: item.product_id._id,
                  product_name: item.product_id.product_name,
                  longDesc: item.product_id.longDesc,
                  product_name: item.product_id.product_name,
                  shortDesc: item.product_id.shortDesc,
                  attachment: item.product_id.attachment,
                  banner: item.product_id.banner,
                  productThreshold: item.product_id.productThreshold,
                  productSubscription: item.product_id.productSubscription,
                  salesTaxOutSide: item.product_id.salesTaxOutSide,
                  salesTaxWithIn: item.product_id.salesTaxWithIn,
                  purchaseTax: item.product_id.purchaseTax,
                  hsnCode: item.product_id.hsnCode,
                  unitMeasurement:
                    item.unitMeasurement || item.product_id.unitMeasurement,
                  TypeOfProduct: item.product_id.TypeOfProduct,
                  SKUCode: item.product_id.SKUCode,
                  __v: item.product_id.__v,
                  created_at: item.product_id.created_at,
                  status: item.product_id.status,
                  hsnCode: item.product_id.hsnCode,
                  bookingQuantity: +item.product_id.bookingQuantity,
                  productQuantity: item.product_id.productQuantity,
                  availableQuantity: +item.product_id.availableQuantity,
                  ProductRegion: item.product_id.ProductRegion,
                  relatedProduct: item.product_id.relatedProduct,
                  configurableData: [],
                  images: item.product_id.images,
                  qty: item.qty,
                  price: item.price,
                  totalprice: item.totalprice,
                  groupData: item.groupData,
                  unitQuantity: item.unitQuantity,
                  slug: item.slug,
                  configurableItem: item.configurableItem,
                  unique_id: item.unique_id || null,
                  simpleData: item.simpleItem.packet_size
                    ? [
                        {
                          package: [
                            {
                              packet_size: item.simpleItem.packet_size,
                              packetLabel: item.simpleItem.packetLabel,
                              selling_price: item.simpleItem.selling_price,
                              packetmrp: item.simpleItem.packetmrp,
                              _id: item.simpleItem._id,
                              quantity: item.qty,
                              selected: true,
                              B2B_price: item.simpleItem.B2B_price,
                              Retail_price: item.simpleItem.Retail_price,
                            },
                          ],
                          availableQuantity:
                            item.product_id.simpleData[0].availableQuantity,
                        },
                      ]
                    : [
                        {
                          RegionSellingPrice: item.price,
                          mrp: item.product_id.totalprice,
                          total_amount: item.product_id.totalprice,
                          quantity: item.product_id.qty,
                          ExpirationDate: null,
                          _id: item.product_id._id,
                          package: [],
                          userQuantity: item.qty,
                          RegionB2BPrice:
                            item.product_id.simpleData[0].RegionB2BPrice,
                          RegionRetailPrice:
                            item.product_id.simpleData[0].RegionRetailPrice,
                          availableQuantity:
                            item.product_id.simpleData[0].availableQuantity,
                        },
                      ],
                });
              });
            this.props.addToCart(cartDatabyAPI);
            localStorage.setItem("cartItem", JSON.stringify(cartDatabyAPI));
            this.setState({
              loading: false,
              cartItems: cartDatabyAPI,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  closeMaintanceModal = () => {
    window.sessionStorage.setItem("maintancebannerclose_status", true);
    this.setState({
      maintenance: false,
      maintance_banner_closeed_ststus: true,
    });
  };
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
        localStorage.setItem("cartItem", a);
        localStorage.clear();
        window.location.reload();
      }
    });
    <Redirect to="/home" />;
  };

  applycouponefromhome = (data, couponvalue) => {
    var sub_total = 0;
    var gst = 0;
    var cart_total = 0;
    this.props.dataInCart.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package[0]
          ? item.simpleData[0].package
              .filter((dta) => dta.selected == true)
              .map((data, ind) => {
                sub_total = sub_total + data.selling_price * data.quantity;
              })
          : (sub_total =
              sub_total +
              item.simpleData[0].RegionSellingPrice *
                item.simpleData[0].userQuantity)
        : (sub_total = sub_total + item.price * item.qty)
    );
    gst = gst;
    cart_total = gst + sub_total;

    if (this.props.dataInCart && this.props.dataInCart.length > 0) {
      if (couponvalue <= cart_total) {
        var requestData = {
          coupon_code: data,
        };
        ApiRequest(requestData, "/GetCouponByCode", "POST", "", "")
          .then(async (res) => {
            var response = res.data.data;
            if (res.data.message === "ok") {
            } else {
              swal({
                title: "Sorry",
                text: response,
                icon: "warning",
                dangerMode: true,
              });
              var valueErr = document.getElementsByClassName("err");
              for (var i = 0; i < valueErr.length; i++) {
                valueErr[i].innerText = "";
              }
              valueErr = document.getElementsByClassName(
                "err_couponecodevalidation"
              );
              valueErr[0].innerText = res.data.data;
            }

            localStorage.setItem("couponId", res.data.data._id);
            localStorage.setItem("coupon_code", res.data.data.coupon_code);
            if (res.data.data.coupon_code) {
              this.props.history.push("/cart");
            }
          })
          // .then(() => {
          //   this.calculateDiscountPerItem();
          // })
          .catch((error) => {
            console.log(error);
          });
      } else {
        swal({
          title: "Sorry",
          text:
            "To apply " +
            data +
            ", minimum cart value needs to be " +
            couponvalue,
          icon: "warning",
          dangerMode: true,
        });
      }
    } else {
      swal({
        title: "Sorry",
        text: "Please add the products to your cart before applying the coupon.",
        icon: "warning",
        dangerMode: true,
      });
    }
  };

  showAllProducts = () => {
    const sidebarLinks = document.querySelectorAll(".side-bar-header");
    sidebarLinks.forEach((li) => li.classList.remove("open"));
    this.setState({
      showAll: !this.state.showAll,
      // renderer: !this.state.renderer,
      showTopTenList: false,
      // showCatLoading: true,
    });
  };

  handleChangeStatus(checked) {
    this.setState({
      progress: 30,
    });
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
      subscribe: checked ? true : false,
    };
    ApiRequest(requestData, "/addtocart", "POST")
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      cartItems: [],
      searchKey: "",
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.addToCartPopup !== this.props.addToCartPopup) {
      this.setState({
        addedItemNotification: true,
        cartItems: this.props.dataInCart,
        updateCartValue: !this.state.updateCartValue,
      });
      setTimeout(() => {
        this.setState({
          addedItemNotification: false,
        });
      }, 3000);
    }
    if (
      this.props.dataInCart !== undefined &&
      prevProps.dataInCart.length < this.props.dataInCart.length
    ) {
      this.setState({
        addedItemNotification: true,
        cartItems: this.props.dataInCart,
      });
      setTimeout(() => {
        this.setState({
          addedItemNotification: false,
        });
      }, 1500);
    }
    if (
      this.props.dataInCart !== undefined &&
      prevProps.dataInCart.length !== this.props.dataInCart.length
    ) {
      this.setState({
        cartItems: this.props.dataInCart,
      });
    }
    if (prevState.updateCartValue !== this.state.updateCartValue) {
      this.setState({
        cartItems: this.props.dataInCart && this.props.dataInCart,
      });
    }
  }
  rerenderParentCallback() {
    this.forceUpdate();
  }
  GetPaymentKeys() {
    let data = {};
    ApiRequest(data, "/admin/page/GetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            dynamicLinks: res.data.data,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async componentDidMount() {
    this.setState({
      catData: await this.props.categories.data,
      productData: await this.props.products.data,
    });
    this.GetPaymentKeys();
    ApiRequest({}, "/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            maintenance: res.data.data[0].maintenanceStatus,
            maintenanceLink: res.data.data[0].maintenanceLink,
            maintenanceBanner: res.data.data[0].maintenanceBanner,
          });
          window.sessionStorage.setItem(
            "maintenanceStatus",
            res.data.data[0].maintenanceStatus
          );
          window.sessionStorage.setItem(
            "maintenanceBanner",
            res.data.data[0].maintenanceBanner
          );
          window.sessionStorage.setItem(
            "maintenanceLink",
            res.data.data[0].maintenanceLink
          );
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
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
    var closingTags = document.querySelectorAll(".closenavbaronclick");

    closingTags.forEach((tag) => {
      tag.addEventListener("click", () => {
        this.setState({ navOpen: false });
      });
    });

    const reqdata = {};
    ApiRequest(reqdata, "/coupons/getAllForHomePage", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            coupon_data: res.data.data,
          });
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
    const sidebarLinks = document.querySelector(".header-bar");
    const opensidebarLink = document.querySelector(".sarch-dekstop");
    if (opensidebarLink !== null) {
      opensidebarLink.addEventListener("click", () => {
        sidebarLinks.classList.toggle("open");
        document.getElementById("searchProductInput").focus();
        this.setState({
          searchKey: "",
        });
      });
    }

    let requestData = {};
    ApiRequest(requestData, "/getActiveSlide", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allslides: res.data.data,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    ApiRequest(requestData, "/GetAllActiveRegion", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var activ_supplier = [];
          res.data.data.map((item, index) => {
            activ_supplier.push({
              value: item._id,
              name: item.name,
            });
            this.setState({
              allRegion: activ_supplier,
            });
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //closing navbar when clicking on navLinks

  updateBasket = (node) => {
    // same as Hooks example
    this.setState({
      basketLength: this.props.dataInCart ? this.props.dataInCart.length : 0,
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
      showLoadingIcon: true,
    });
    clearTimeout(this.state.intervalSearch);
    this.setState({
      intervalSearch: setTimeout(() => {
        if (this.state.searchKey.length >= 1) {
          let requestData = {
            product_name: e.target.value,
            RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
            subscribe: localStorage.getItem("status")
              ? localStorage.getItem("status")
              : false,
          };
          ApiRequest(requestData, "/searchProduct", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                this.setState({
                  searchItem: res.data.data,
                });
              } else {
                var title =
                  res.data.status.charAt(0).toUpperCase() +
                  res.data.status.slice(1);
                swal({
                  title: title,
                  text: res.data.result,
                  icon: "warning",
                  dangerMode: true,
                });
              }
            })
            .then(() => {
              this.setState({
                showLoadingIcon: false,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else if (this.state.searchKey.length === 0) {
          this.setState({
            searchItem: [],
            showLoadingIcon: false,
          });
        } else if (this.state.searchKey.length < 2) {
          this.setState({
            searchItem: [],
            showLoadingIcon: false,
          });
        }
      }, 1000),
    });

    this.forceUpdate();
  };

  filteredProducts() {
    this.setState({
      filteredProducts:
        localStorage.getItem("filteredProducts").length === 0
          ? []
          : JSON.parse(localStorage.getItem("filteredProducts")),
    });
    this.setState({
      progress: 100,
      showCatLoading: false,
    });
  }
  topTenListOpen(e) {
    this.setState({
      showTopTenList: e,
    });
  }

  handleRegionChange = (e) => {
    this.setState({
      selectedRegion: e.target.value,
      showTopTenList: false,
    });
    this.showAllProducts();
  };

  popupSelected = (value) => {
    this.setState({
      selectedRegion: value,
      showTopTenList: false,
    });
  };

  render() {
    return (
      <>
        <header>
          {this.state.showCart && (
            <Cart
              hideCart={() => {
                this.setState({
                  updateCartValue: false,
                  showCart: false,
                });
                this.forceUpdate();
              }}
              renderParent={() => this.forceUpdate()}
            />
          )}
          <div className="container-fluid">
            <div className="header-bar">
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
                                    My account
                                  </a>
                                  <span className="side-right"></span>
                                  <div className="sidebar-sub-menu">
                                    <ul>
                                      <li className="closenavbaronclick">
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
                                      <li className="closenavbaronclick">
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
                                      <li className="closenavbaronclick">
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
                                      <li className="closenavbaronclick">
                                        <NavLink
                                          activeClassName="active-sidelink"
                                          to="/my-wallet"
                                        >
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
                                      <li className="closenavbaronclick">
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

                                      <li className="closenavbaronclick">
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
                                    </ul>
                                  </div>
                                </li>
                              ) : (
                                <li className="side-bar-nav closenavbaronclick">
                                  <Link to="/account">
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
                                  activeClassName="active-sidelink"
                                  to="/recipes"
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
                              <li className="side-bar-nav closenavbaronclick">
                                <NavLink
                                  activeClassName="active-sidelink"
                                  to="/contact-us"
                                >
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
                                  activeClassName="active-sidelink"
                                  to="/FAQ"
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
                              {this.state.dynamicLinks.map((dy) => {
                                return (
                                  dy.status && (
                                    <li className="side-bar-nav closenavbaronclick">
                                      <NavLink
                                        activeClassName="active-sidelink"
                                        to={"/view/" + dy._id}
                                      >
                                        <img src={imageUrl + dy.icon} alt="" />
                                        {dy.name}
                                      </NavLink>
                                    </li>
                                  )
                                );
                              })}
                            </ul>
                            <div className="new-side-lists">
                              <ul>
                                <li className="side-bar-nav closenavbaronclick">
                                  <Link to="/about">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/About Us.jpg"
                                      }
                                      alt=""
                                    />
                                    About Us
                                  </Link>
                                </li>
                                <li className="side-bar-nav closenavbaronclick hide_on_mobile">
                                  <Link to="/terms&conditions">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/img/icons/T&C.jpg"
                                      }
                                      alt=""
                                    />
                                    Terms & Condition
                                  </Link>
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
              <div
                className="co-logo"
                onClick={() => {
                  sessionStorage.setItem("catId", "");
                  this.showAllProducts();
                  this.setState({
                    selectedCategory: "",
                    searchKey: "",
                    closeMobileDropdown: !this.state.closeMobileDropdown,
                  });
                }}
              >
                <Link to="/">
                  <img src={logo} />
                </Link>
              </div>
              <div className="header-search">
                {this.state.showLoadingIcon ? (
                  ""
                ) : (
                  <i className="fa fa-search" aria-hidden="true"></i>
                )}
                <input
                  type="text"
                  onChange={(e) => this.handleSearch(e)}
                  placeholder="E.g: Potato, Broccoli..."
                  value={this.state.searchKey}
                  id="searchProductInput"
                />
                {this.state.showLoadingIcon ? (
                  <i
                    className="fa fa-spinner searchLoading responsive-loader"
                    aria-hidden="true"
                  ></i>
                ) : (
                  ""
                )}
              </div>
              <div className="header-list">
                <ul>
                  <li className="location-tt">
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
                      <span className="header-loc-text">
                        {/* {this.props.deliveryInfo.Pincode || ""} */}
                        {localStorage.getItem("selectedRegionId")
                          ? this.props.deliveryInfo.Pincode || ""
                          : ""}
                      </span>
                    </span>
                  </li>
                  <li>
                    <Link to="/about"> About Krishi Cress</Link>
                  </li>
                  <li>
                    <Link to="/recipes">Recipes</Link>
                  </li>
                  <li className="sarch-dekstop">
                    <span>
                      {" "}
                      <i className="fa fa-search" aria-hidden="true"></i>{" "}
                      <i className="fa fa-times" aria-hidden="true"></i>
                    </span>{" "}
                  </li>
                  <li
                    className="minicart"
                    onClick={() => {
                      this.setState({
                        updateCartValue: true,
                        showCart: true,
                      });
                      this.forceUpdate();
                    }}
                  >
                    <div style={{ cursor: "pointer" }}>
                      <img
                        src={process.env.PUBLIC_URL + "/img/icons/Cart.jpg"}
                        alt=""
                      />
                      <span className="count-product">
                        {this.state.cartItems ? this.state.cartItems.length : 0}
                      </span>
                    </div>
                    {this.state.addedItemNotification ? (
                      <div className="added_notification">Item Added!</div>
                    ) : (
                      ""
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        <div
          className="page-wrapper"
          style={{ position: "relative" }}
          onClick={() =>
            document.querySelector(".header-bar").classList.remove("open")
          }
        >
          {this.state.maintenance &&
          this.state.maintance_banner_closeed_ststus === false ? (
            <div className="fullpage-maintance">
              <a className="image_maintance">
                <button
                  type="button"
                  className="close_maintance"
                  onClick={() => this.closeMaintanceModal()}
                >
                  &times;
                </button>
                <a href={this.state.maintenanceLink}>
                  <img
                    style={{ height: "70vh" }}
                    src={imageUrl + this.state.maintenanceBanner}
                    alt="Maintance"
                  />
                </a>
              </a>
            </div>
          ) : (
            ""
          )}

          {this.state.firstTimeHomeLoading ? (
            <div className="fullpage-loading">
              <ReactLoading
                type={"bubbles"}
                color={"#febc15"}
                height={"50px"}
                width={"100px"}
              />
            </div>
          ) : (
            ""
          )}
          <main className="page-content">
            <section className="sidebar-layout">
              <aside className="side-left-col">
                {this.state.reRenderer ? (
                  <Sidebar
                    filterPass={() => {
                      this.filteredProducts();
                      this.setState({ searchKey: "" });
                    }}
                    productCount={(e) => this.setState({ productCount: e })}
                    // callbackAgain={this.callbackAgain}
                    renderer={this.state.renderer}
                    topTenListOpen={(e) => this.topTenListOpen(e)}
                    startProgressBar={() => {
                      this.setState({
                        progress: 30,
                        showCatLoading: true,
                      });
                    }}
                    subscribe_status={this.state.status}
                    changeHeaderStatus={(e) => this.handleChangeStatus(e)}
                    selectedCategory={(e) =>
                      this.setState({ selectedCategory: e })
                    }
                    closeMobileDropdown={this.state.closeMobileDropdown}
                  />
                ) : (
                  <Sidebar
                    filterPass={() => {
                      this.filteredProducts();
                      this.setState({ searchKey: "" });
                    }}
                    productCount={(e) => this.setState({ productCount: e })}
                    topTenListOpen={(e) => this.topTenListOpen(e)}
                    // callbackAgain={this.callbackAgain}
                    startProgressBar={() =>
                      this.setState({
                        progress: 30,
                        showCatLoading: true,
                      })
                    }
                    renderer={this.state.renderer}
                    subscribe_status={this.state.status}
                    changeHeaderStatus={(e) => this.handleChangeStatus(e)}
                    selectedCategory={(e) =>
                      this.setState({ selectedCategory: e })
                    }
                    closeMobileDropdown={this.state.closeMobileDropdown}
                  />
                )}
              </aside>

              <div
                className="right-col-content"
                style={{ position: "relative" }}
              >
                <LoadingBar
                  color="#febc15"
                  progress={this.state.progress}
                  className="top-progress-bar"
                  height="3px"
                  shadow={false}
                  onLoaderFinished={() =>
                    this.setState({
                      progress: 0,
                    })
                  }
                />
                {this.state.showCatLoading ? (
                  <div className="homepage-loading">
                    <ReactLoading
                      type={"bubbles"}
                      color={"#febc15"}
                      height={"50px"}
                      width={"100px"}
                    />
                  </div>
                ) : (
                  ""
                )}
                <Slider {...feat_slider1} className="new_slik_slider">
                  {this.state.allslides &&
                    this.state.allslides.map((item) => (
                      <a href={item.link} target="_blank">
                        <div className="home_page_slidder">
                          <img src={imageUrl + item.image} />
                        </div>
                      </a>
                    ))}
                </Slider>
                {this.state.coupon_data &&
                  this.state.coupon_data.map((itemc, indexc) => (
                    <div key={indexc}>
                      {itemc.status ? (
                        <div className="home-coupon">
                          <div className="home-coupan-data">
                            {itemc.image ? (
                              <a href={imageUrl + itemc.image} target="_blank">
                                <img src={imageUrl + itemc.image} alt="" />
                              </a>
                            ) : (
                              <a
                                href={
                                  process.env.PUBLIC_URL +
                                  "/img/icons/pngicon.png"
                                }
                                target="_blank"
                              >
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/img/icons/pngicon.png"
                                  }
                                  alt=""
                                />
                              </a>
                            )}
                            <h5>{itemc.coupon_code}</h5>
                          </div>
                          <div className="home-coupan-data">
                            {/* <h4>Get 60% off</h4> */}
                            <p>{itemc.description}</p>
                          </div>
                          <div className="home-coupan-data">
                            <button
                              onClick={() =>
                                this.applycouponefromhome(
                                  itemc.coupon_code,
                                  itemc.couponValue
                                )
                              }
                              className="btn btn-primary"
                            >
                              APPLY COUPON
                            </button>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}

                {window.screen.width < 1025 &&
                this.state.selectedCategory.length > 0 ? (
                  <p style={{ color: "#000", margin: "20px 0px" }}>
                    Selected Category:{" "}
                    <span style={{ color: "#febc15" }}>
                      {this.state.selectedCategory}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                {this.state.showTopTenList ? <LastOrders /> : ""}
                <div className="inner-right">
                  {" "}
                  <Product
                    search={this.state.searchItem}
                    productCount={this.state.productCount}
                    openCart={() => {
                      //not to open cart ,it is to update cart value
                      this.setState({
                        updateCartValue: !this.state.updateCartValue,
                      });
                      this.forceUpdate();
                    }}
                    allFilterItems={this.state.filteredProducts}
                    showAll={this.state.showAll}
                    changeSubscribeTrue={() => {
                      this.setState({ status: true });
                    }}
                    showTopTenList={this.state.showTopTenList}
                    allRegion={this.state.allRegion}
                    openRegionPopup={this.state.regionPopup}
                    closeRegionPopup={() => {
                      this.setState({
                        regionPopup: false,
                        updateCartValue: !this.state.updateCartValue,
                      });
                      this.forceUpdate();
                    }}
                    selectedReg={this.state.selectedRegion} //to send selected region to child component and call api
                    popupSelected={this.popupSelected} //to recieve selected region from regionPopup
                    subscription={this.state.status}
                    finishLoading={(percent) =>
                      this.setState({
                        progress: percent,
                        showCatLoading: false,
                        firstTimeHomeLoading: false,
                      })
                    }
                  ></Product>
                </div>
                <Related_recipes />
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  dataInCart: state.dataInCart,
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HOME));
