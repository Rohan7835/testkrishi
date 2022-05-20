import React, { useEffect, useState } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Switch from "react-switch";
import swal from "sweetalert";
import { ApiRequest } from "../apiServices/ApiRequest";
import { userdetails } from "../redux/actions/actions";
import { imageUrl } from "./imgUrl";

function Sidebar({
  filterPass,
  renderer,
  startProgressBar,
  user_details,
  topTenListOpen,
  subscribe_status,
  changeHeaderStatus,
  selectedCategory,
  dataInCart,
  closeMobileDropdown,
  productCount,
}) {
  const [sidebar_menu, setting_menu] = useState([]);
  const [subscription_pop_up, setSubscription_pop_up] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [dropdown, setDropdown] = useState(true);
  const [navChange, setNavChange] = useState(true);
  const [status, setStatus] = useState(
    localStorage.getItem("status") === true ? true : false
  );
  const [allFilterProducts, setAllFilterProducts] = useState([]);
  const [selectedLink, setSelectedLink] = useState(
    sessionStorage.getItem("catIndex") !== "undefined"
      ? JSON.parse(sessionStorage.getItem("catIndex"))
      : undefined
  );
  const [mobileMainDropdown, setMobileMainDropdown] = useState(false);
  const [haveOrders, setHaveOrders] = useState(false);

  useEffect(() => {
    setReRender(!reRender);
  }, [renderer]);

  useEffect(() => {
    setMobileMainDropdown(false);
  }, [closeMobileDropdown]);

  const orderdetails = () => {
    console.log(user_details);
    if (Array.isArray(user_details) === false) {
      const requestData = {
        skip: 0,
        limit: 5,
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/getUserBooking", "POST", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.data.length === 0) {
              setHaveOrders(false);
            } else {
              setHaveOrders(true);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(function () {
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    let statusFromApi = JSON.parse(localStorage.getItem("status"));
    const subStatus = localStorage.getItem("status")
      ? JSON.parse(localStorage.getItem("status"))
      : false;
    if (user_details._id) {
      ApiRequest(
        { _id: user_details._id },
        "/subscribe/toggle/status/get",
        "POST",
        token
      )
        .then((res) => {
          statusFromApi = res.data.data.subscribeToggle
            ? res.data.data.subscribeToggle
            : false;
          if (subStatus != statusFromApi) {
            changeHeaderStatus(statusFromApi);
            setStatus(statusFromApi);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    let requestData = {
      regionID: JSON.parse(localStorage.getItem("selectedRegionId")),
      subscribe: statusFromApi,
    };
    ApiRequest(requestData, "/GetCategorySubCat", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let categoryWithoutFeaturedProducts = [];
          res.data.data.forEach((itm) => {
            let name = itm.category_name;
            name = name.toLowerCase();
            if (name !== "featured products") {
              categoryWithoutFeaturedProducts.push(itm);
            }
          });
          setting_menu(categoryWithoutFeaturedProducts);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (Array.isArray(user_details) === false) {
      orderdetails();
    }
    RenderFilterOnLoad();
  }, []);

  useEffect(() => {
    let requestData = {
      regionID: JSON.parse(localStorage.getItem("selectedRegionId")),
      subscribe: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
    };
    ApiRequest(requestData, "/GetCategorySubCat", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let categoryWithoutFeaturedProducts = [];
          res.data.data.forEach((itm) => {
            let name = itm.category_name;
            name = name.toLowerCase();
            if (name !== "featured products") {
              categoryWithoutFeaturedProducts.push(itm);
            }
          });
          setting_menu(categoryWithoutFeaturedProducts);
          if (subscribe_status) {
            // changeHeaderStatus(localStorage.getItem("status"));
            setStatus(localStorage.getItem("status"));
          }
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    if (Array.isArray(user_details) === false) {
      orderdetails();
    }
    RenderFilterOnLoad();
  }, [
    localStorage.getItem("status"),
    localStorage.getItem("selectedRegionId"),
    subscribe_status,
  ]);

  const fitlerProducts = (e, category, val, subcat) => {
    if (!subcat || window.innerWidth > 768) {
      startProgressBar();
    }
    sessionStorage.setItem("catId", e);
    const prevSelected = document.querySelector(".activeSubCategory");
    if (prevSelected !== null) {
      prevSelected.classList.remove("activeSubCategory");
    }
    let requestData = {
      product_categories: e,
      RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
      subscribe: localStorage.getItem("status"),
      skip: 0,
      //limit: 3,
    };
    category === "mainCategory"
      ? ApiRequest(requestData, "/searchProduct", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              productCount(res.data.count);
              setAllFilterProducts(res.data.data);
              topTenListOpen(false);
              selectedCategory(val.target.innerText);
            } else {
              swal({
                title: "Network Issue",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .then(() => {
            if (!subcat) {
              setMobileMainDropdown(false);
            }
            sessionStorage.setItem("catId", e);
          })
          .catch((error) => {
            console.log(error);
          })
      : ApiRequest(requestData, "/searchProduct", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              productCount(res.data.count);
              setAllFilterProducts(res.data.data);
              topTenListOpen(false);
              selectedCategory(val.target.innerText);
            } else {
              swal({
                title: "Network Issue",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .then(() => {
            if (!subcat) {
              setMobileMainDropdown(false);
            }
            sessionStorage.setItem("catId", e);
          })
          .catch((error) => {
            console.log(error);
          });
  };

  const RenderFilterOnLoad = () => {
    if (
      sessionStorage.getItem("catId") &&
      JSON.parse(localStorage.getItem("selectedRegionId"))
    ) {
      let requestData = {
        product_categories: sessionStorage.getItem("catId"),
        RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
        subscribe: localStorage.getItem("status"),
        skip: 0,
        //limit: 3,
      };
      ApiRequest(requestData, "/searchProduct", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            productCount(res.data.count);
            setAllFilterProducts(res.data.data);
            topTenListOpen(false);
          } else {
            swal({
              title: "Network Issue",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .then(() => {
          setMobileMainDropdown(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    localStorage.setItem("filteredProducts", JSON.stringify(allFilterProducts));
    filterPass(allFilterProducts);
  }, [allFilterProducts]);

  useEffect(() => {
    const opensidebarLink = document.querySelectorAll(".opensidebarLink");
    if (opensidebarLink !== null) {
      for (let i = 0; i < opensidebarLink.length; i++) {
        opensidebarLink[i].addEventListener("click", () => toggleOpenClass(i));
      }
    }
    return () => {
      if (opensidebarLink !== null) {
        for (let i = 0; i < opensidebarLink.length; i++) {
          opensidebarLink[i].removeEventListener("click", () =>
            toggleOpenClass(i)
          );
        }
      }
    };
  }, [navChange]);

  const toggleOpenClass = (i) => {
    const sidebarLinks = document.querySelectorAll(".side-bar-header");
    const opensidebarLink = document.querySelectorAll(".opensidebarLink");
    const selectedLink1 = opensidebarLink[i].parentElement;
    sidebarLinks.forEach((li, iz) => {
      console.log(iz, selectedLink);
      if (iz !== selectedLink + 1) {
        li.classList.remove("open");
      } else {
        if (selectedLink !== null) {
          li.classList.add("open");
        }
      }
    });
    if (selectedLink === i) {
      selectedLink1.classList.toggle("open");
      setSelectedLink(undefined);
      sessionStorage.setItem("catIndex", undefined);
    } else {
      selectedLink1.classList.add("open");
      setSelectedLink(i !== null ? i : undefined);
      sessionStorage.setItem("catIndex", i !== null ? i : undefined);
    }
  };

  const showTopTenList = () => {
    let requestData = {
      user_id: user_details._id,
      RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
    };
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/TopTenProductsOfUser", "POST", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setAllFilterProducts(res.data.data);
          topTenListOpen(true);
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const opensubscription = () => {
    setSubscription_pop_up(true);
  };
  const closeSubscriptionPopup = () => {
    setSubscription_pop_up(false);
  };
  const addSubCategoryActive = (e) => {
    const prevSelected = document.querySelector(".activeSubCategory");
    if (prevSelected !== null) {
      prevSelected.classList.remove("activeSubCategory");
    }
    e.target.classList.add("activeSubCategory");
  };

  const changeStatus = async (e) => {
    setDropdown(false);
    if (dataInCart.length > 0) {
      await swal({
        title: e ? "Building a subscription? " : "Abandoning subscription? ",
        text: e
          ? "Please note your current cart will get empty and only subscribe-able products will be visible."
          : "Please note your current cart will get empty.",
        icon: "warning",
        dangerMode: true,
        buttons: {
          confirm: {
            text: "Go ahead",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
          cancel: {
            text: "Go back",
            value: false,
            visible: true,
            className: "back-swal-btn",
            closeModal: true,
          },
        },
      }).then((willDelete) => {
        if (willDelete) {
          changeHeaderStatus(e);
          setStatus(!status);
          changeSubscriptionToggle(!status);
        }
      });
    } else {
      changeHeaderStatus(e);
      setStatus(!status);
      changeSubscriptionToggle(!status);
    }
  };
  const changeSubscriptionToggle = (status) => {
    let requestData = {
      _id: user_details._id,
      subscribeToggle: status,
    };
    // const token = localStorage.getItem("_jw_token")
    //   ? "Bearer " + localStorage.getItem("_jw_token")
    //   : "";
    ApiRequest(requestData, "/subscribe/toggle/status", "POST")
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {subscription_pop_up ? (
        <div className="subscription_overlay">
          <div className="Subscription_popup">
            <p
              style={{
                position: "absolute",
                right: "10px",
                cursor: "pointer",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "#fbbc14",
                marginBottom: "0px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => closeSubscriptionPopup()}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </p>
            <img
              src={process.env.PUBLIC_URL + "/img/subscription_pop_up.jpg"}
              alt="Subscription Popup"
            />
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        className={
          mobileMainDropdown ? "main_accordion open-main-nav" : "main_accordion"
        }
      >
        <p
          className="category-toggle_mobile"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
          onClick={() => {
            setMobileMainDropdown(!mobileMainDropdown);
          }}
        >
          Categories{" "}
          <span>
            {" "}
            {mobileMainDropdown ? (
              <i className="fa fa-times"></i>
            ) : (
              <i className="fa fa-caret-down"></i>
            )}
          </span>{" "}
        </p>

        <div className="inner-wrap-content">
          <ul onClick={() => setDropdown(false)}>
            <li
              className="side-bar-header"
              key={"subscription-sidebar-toggler"}
              style={{ backgroundColor: "#e8e8e8" }}
            >
              <a
                href="javascript:void(0)"
                style={{ width: "100%", padding: "20px 30px" }}
              >
                <span className="nav-icon">
                  <img
                    src={process.env.PUBLIC_URL + "/img/icons/Subscription.jpg"}
                    alt=""
                  />
                </span>
                <span className="header-nav-text">Make my subscription</span>

                <Switch
                  onChange={(e) => changeStatus(e)}
                  checked={status}
                  onColor="#ffde8a"
                  onHandleColor="#febc15"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={38}
                  className="react-switch main-switch-sidebar"
                  id="material-switch"
                />
                <span className="informat">
                  <i
                    class="fa fa-info-circle"
                    aria-hidden="true"
                    onClick={() => opensubscription()}
                  ></i>
                </span>
              </a>
            </li>
            {user_details.name
              ? haveOrders && (
                  <li
                    className="side-bar-header"
                    style={{ display: "flex", alignItem: "center" }}
                    key={"frequently-bought-items-sidebar"}
                  >
                    <a
                      href="javascript:void(0)"
                      className="opensidebarLink"
                      onClick={() => {
                        showTopTenList();
                        setTimeout(() => {
                          setMobileMainDropdown(false);
                        }, 1000);
                      }}
                      style={{ width: "100%", padding: "20px 30px" }}
                    >
                      <span className="nav-icon">
                        <img
                          src={
                            process.env.PUBLIC_URL +
                            "/img/icons/Frequently Bought.jpg"
                          }
                          alt=""
                        />
                      </span>
                      <span className="header-nav-text">
                        Your frequently bought items
                      </span>
                    </a>
                  </li>
                )
              : ""}
            {sidebar_menu.map((item, index) => {
              return item.status === true ? (
                <div key={index}>
                  <li
                    className={
                      item._id === sessionStorage.getItem("catId")
                        ? "side-bar-header open"
                        : "side-bar-header"
                    }
                    key={index}
                  >
                    <a
                      onClick={(e) => {
                        setNavChange((prv) => !prv);
                        setDropdown(!dropdown);
                        fitlerProducts(
                          item._id,
                          "mainCategory",
                          e,
                          item.SubCatData
                        );
                        return false;
                      }}
                      style={{ cursor: "pointer" }}
                      className="opensidebarLink"
                    >
                      <span className="nav-icon">
                        <img src={imageUrl + item.icon} alt="" />
                      </span>
                      <span className="header-nav-text">
                        {item.category_name}
                      </span>

                      {item.SubCatData &&
                        item.SubCatData.filter((cat) => cat.status).length >
                          0 && <div className="arrow-sidebar"></div>}
                    </a>

                    <div className="sidebar-sub-header">
                      <ul>
                        {item.SubCatData &&
                          item.SubCatData.map((data, idx) => {
                            return data.status ? (
                              <li
                                key={idx}
                                onClick={(val) => {
                                  fitlerProducts(data._id, "subCategory", val);
                                  addSubCategoryActive(val);
                                }}
                                style={{ display: "flex", alignItem: "center" }}
                              >
                                <a className="new-sub-head">
                                  <span className="nav-icon">
                                    <img
                                      src={imageUrl + data.icon}
                                      alt=""
                                      style={{ height: 30 }}
                                    />
                                  </span>
                                  <span>{data.category_name}</span>
                                </a>
                              </li>
                            ) : (
                              ""
                            );
                          })}
                      </ul>
                    </div>
                  </li>
                </div>
              ) : (
                <></>
              );
            })}
          </ul>
          {/* <p className="scroll-sidebar-more">
            Scroll to view more <i className="fas fa-caret-down"></i>{" "}
          </p> */}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = (state) => ({
  dataInCart: state.dataInCart,
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
