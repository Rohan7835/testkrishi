import moment from "moment";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactLoading from "react-loading";
import "react-pro-sidebar/dist/css/styles.css";
import Rating from "react-rating";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import {
  addToCart,
  quantityChange,
  userdetails,
} from "../../src/redux/actions/actions";
import { ApiRequest } from "../apiServices/ApiRequest";
import { imageUrl } from "../imageUrl";
import GroupProduct from "./Group/Group_Product";
// import Cart from "./Cart/Cart";
import RegionPopup from "./RegionPopup";
import sendCartDataToAPI from "./sendCartDataToAPI";
// import { propTypes } from "react-bootstrap/esm/Image";
var previousCount = 0;
function Product({
  search,
  openCart,
  allFilterItems,
  cartItemQuantity,
  quantityChange,
  showAll,
  showTopTenList,
  selectedReg,
  popupSelected,
  addToCart,
  dataInCart,
  allRegion,
  openRegionPopup,
  closeRegionPopup,
  user_details,
  subscription,
  finishLoading,
  changeSubscribeTrue,
  productCount,
}) {
  const [product, product_data] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [cartItems, setCartItems] = useState(dataInCart ? dataInCart : []);
  const [, setShowCart] = useState(false);
  const [showFirstPriceOnLoad, setShowFirstPriceOnLoad] = useState(true);
  const [render, setRender] = useState(false);
  const [regionId, setRegionId] = useState(
    localStorage.getItem("selectedRegionId")
      ? JSON.parse(localStorage.getItem("selectedRegionId"))
      : ""
  );
  const [regionName, setRegionName] = useState(
    localStorage.getItem("selectedRegionName")
      ? localStorage.getItem("selectedRegionName")
      : ""
  );
  const [openPopup, setOpenPopup] = useState(openRegionPopup);
  const [renderProducts, setRenderProducts] = useState(false);
  const [openGroupProduct, setOpenGroupProduct] = useState(false);
  const [groupProductData, setGroupProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [storePos, setStorePos] = useState(false);
  const [count, setCount] = useState(0);
  const [featureProductId, setFeatureProductId] = useState("");
  const [reviewRatingShow, setReviewRatingShow] = useState(false);

  useEffect(() => {
    if (search.length === 0) {
      product_data(allProducts);
      if (previousCount !== 0) {
        setCount(previousCount);
        if (allProducts.length >= previousCount) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } else {
      product_data(search);
      previousCount = count;
      setTimeout(() => {
        setHasMore(false);
        setCount(0);
      }, 0);
    }
  }, [search, allFilterItems]);

  //adding selected key to each object of products
  useEffect(() => {
    if (product.length > 0 && Array.isArray(product)) {
      product.forEach((itm) => {
        let price = 0;
        let priceIndex;
        if (itm.TypeOfProduct === "simple") {
          itm.simpleData[0] === undefined ||
            (itm.simpleData[0].package[0] &&
              itm.simpleData[0].package.forEach((pck, inde) => {
                if (!price) {
                  if (user_details.length !== 0) {
                    if (user_details.user_type === "b2b") {
                      console.log(itm.product_name + "  " + pck.B2B_price);
                      price = pck.B2B_price || 0;
                    } else if (user_details.user_type === "retail") {
                      price = pck.Retail_price || 0;
                    } else if (user_details.user_type === "user") {
                      price = pck.selling_price || 0;
                    }
                  }
                  if (price) {
                    priceIndex = inde;
                  }
                }
              }));
        }
        setTimeout(() => {
          console.log(priceIndex);
          if (itm.TypeOfProduct === "simple") {
            itm.simpleData[0] === undefined ||
              (itm.simpleData[0].package[0] &&
                itm.simpleData[0].package.forEach((pck, index) => {
                  // pck.quantity = 1;
                  if (priceIndex) {
                    if (index === priceIndex) {
                      pck.selected = true;
                    } else {
                      pck.selected = false;
                    }
                  } else {
                    if (index === 0) {
                      pck.selected = true;
                    } else {
                      pck.selected = false;
                    }
                  }
                }));
          }
        }, 0);
      });
    }
  }, [itemsLoaded]);

  useEffect(() => {
    setOpenPopup(openRegionPopup);
  }, [openRegionPopup]);

  //storing last scroll position in session
  useEffect(() => {
    const handleScroll = (e) => {
      // set scroll values in state
      if (storePos) {
        sessionStorage.setItem("lScrollPos", window.pageYOffset);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Remove listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  });

  //checking in local storage if region exits and showing products accordingly
  useEffect(() => {
    if (
      localStorage.getItem("selectedRegionId") &&
      localStorage.getItem("selectedRegionName")
    ) {
      const localRegion = localStorage.getItem("selectedRegionId");
      const localRegionName = localStorage.getItem("selectedRegionName");
      if (localRegion !== null && localRegionName != null) {
        setRegionId(JSON.parse(localRegion));
        setOpenPopup(false);
      }
    }
    let requestData = {};
    ApiRequest(requestData, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          setReviewRatingShow(res.data.data[0].reviewRating);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedReg && selectedReg.length > 0) {
      setRegionId(selectedReg);
    }
  }, [selectedReg]);

  //adding selected property and quantity to each product
  useEffect(() => {
    if (showFirstPriceOnLoad) {
      Array.isArray(product) &&
        product.map((itm) => {
          let price = 0;
          let priceIndex;
          if (itm.TypeOfProduct === "simple") {
            itm.simpleData[0] === undefined ||
              (itm.simpleData[0].package[0] &&
                itm.simpleData[0].package.forEach((pck, inde) => {
                  if (!price) {
                    if (user_details.length !== 0) {
                      if (user_details.user_type === "b2b") {
                        console.log(itm.product_name + "  " + pck.B2B_price);
                        price = pck.B2B_price || 0;
                      } else if (user_details.user_type === "retail") {
                        price = pck.Retail_price || 0;
                      } else if (user_details.user_type === "user") {
                        price = pck.selling_price || 0;
                      }
                    }
                    if (price) {
                      priceIndex = inde;
                    }
                  }
                }));
          }
          return itm.simpleData[0] && itm.simpleData[0].package.length > 0
            ? itm.simpleData[0].package.map((pck, index) => {
                let userPrice = 0;
                console.log(user_details);
                if (user_details.length !== 0) {
                  if (user_details.user_type === "b2b") {
                    userPrice = pck.B2B_price || 0;
                  } else if (user_details.user_type === "retail") {
                    userPrice = pck.Retail_price || 0;
                  } else {
                    userPrice = pck.selling_price || 0;
                  }
                } else {
                  userPrice = pck.selling_price || 0;
                }
                if (pck.quantity) {
                } else {
                  pck.quantity = 0;
                }
                pck.userPrice = userPrice;
                if (priceIndex) {
                  if (index === priceIndex) {
                    pck.selected = true;
                  } else {
                    pck.selected = false;
                  }
                } else {
                  if (index === 0) {
                    pck.selected = true;
                  } else {
                    pck.selected = false;
                  }
                }
              })
            : "";
        });
    }
    let cartData = [];
    let dataInCart1 = dataInCart ? [...dataInCart] : [];
    //looping throught cart and pushing them in cartData array with its packages quantity and normal quantity
    dataInCart1.forEach((item) => {
      var quantity = 0;
      var selectedPck = [];
      if (item.TypeOfProduct === "simple") {
        if (
          item.TypeOfProduct === "simple" &&
          item.simpleData[0].package.length > 0
        ) {
          item.simpleData[0].package.forEach((pck) => {
            if (pck.selected) {
              selectedPck.push(pck);
            }
          });
        } else {
          quantity = item.simpleData[0].userQuantity;
        }
      }
      if (cartData.length > 0) {
        if (
          cartData.filter((i) => {
            return i._id === item._id;
          }).length > 0
        ) {
          let modified = cartData.map((cartItem) => {
            if (cartItem._id === item._id) {
              return {
                ...cartItem,
                packages: cartItem.packages.concat(selectedPck),
              };
            } else {
              return cartItem;
            }
          });
          cartData = modified;
        } else {
          cartData.push({
            _id: item._id,
            withoutpackagequantity: quantity,
            // package: item.simpleData[0].package.length > 0 ? true : false,
            packages: selectedPck,
          });
        }
      } else {
        cartData.push({
          _id: item._id,
          withoutpackagequantity: quantity,
          // package: item.simpleData[0].package.length > 0 ? true : false,s
          packages: selectedPck,
        });
      }
    });
    Array.isArray(product) &&
      product.map((itm) => {
        //looping thorught all products and adding quantity to each product from cart
        if (cartData.length > 0) {
          if (
            cartData.filter((i) => {
              return i._id === itm._id;
            }).length > 0
          ) {
            cartData.map((cartItem) => {
              if (cartItem._id === itm._id) {
                if (itm.simpleData && itm.simpleData[0]) {
                  itm.simpleData[0].package[0]
                    ? itm.simpleData[0].package.map((pck, index) => {
                        if (
                          cartItem.packages.filter((c) => c._id === pck._id)
                            .length > 0
                        ) {
                          cartItem.packages.map((cartPck) => {
                            if (
                              pck._id === cartPck._id &&
                              pck.packet_size === cartPck.packet_size
                            ) {
                              return (pck.quantity = cartPck.quantity);
                            }
                          });
                        } else {
                          return (pck.quantity = 0);
                        }
                      })
                    : (itm.simpleData[0].userQuantity =
                        cartItem.withoutpackagequantity);

                  if (
                    itm.simpleData[0].package.filter((a) => a.selected)
                      .length === 0
                  ) {
                    itm.simpleData[0].package.map((a, i) =>
                      i === 0 ? (a.selected = true) : (a.selected = false)
                    );
                  }
                }
              } else {
                if (itm.simpleData && itm.simpleData[0]) {
                  if (itm.simpleData[0].package[0]) {
                    let selectedOne = itm.simpleData[0].package.filter(
                      (a) => a.selected
                    );
                    itm.simpleData[0].package.map((pck, index) => {
                      if (pck.quantity) {
                      } else {
                        pck.quantity = 0;
                      }
                    });
                    if (selectedOne.length === 0 || !selectedOne) {
                      itm.simpleData[0].package.map((pck, index) => {
                        if (index === 0) {
                          pck.selected = true;
                        } else {
                          pck.selected = false;
                        }
                      });
                    }
                  } else {
                    itm.simpleData[0].userQuantity = 0;
                  }
                }
              }
            });
          } else {
            if (itm.simpleData && itm.simpleData[0]) {
              if (itm.simpleData[0].package[0]) {
                let selectedOne = itm.simpleData[0].package.filter(
                  (a) => a.selected
                );
                itm.simpleData[0].package.map((pck, index) => {
                  if (pck.quantity) {
                    pck.quantity = 0; //added for updation
                  } else {
                    pck.quantity = 0;
                  }
                });
                if (selectedOne.length === 0 || !selectedOne) {
                  itm.simpleData[0].package.map((pck, index) => {
                    if (index === 0) {
                      pck.selected = true;
                    } else {
                      pck.selected = false;
                    }
                  });
                }
              } else {
                itm.simpleData[0].userQuantity = 0;
              }
            }
          }
        } else {
          if (itm.simpleData && itm.simpleData[0]) {
            if (itm.simpleData[0].package[0]) {
              let selectedOne = itm.simpleData[0].package.filter(
                (a) => a.selected
              );
              itm.simpleData[0].package.map((pck, index) => {
                if (pck.quantity) {
                  pck.quantity = 0; //added for upadtion
                } else {
                  pck.quantity = 0;
                }
              });
              if (selectedOne.length === 0 || !selectedOne) {
                itm.simpleData[0].package.map((pck, index) => {
                  if (index === 0) {
                    pck.selected = true;
                  } else {
                    pck.selected = false;
                  }
                });
              }
            } else {
              itm.simpleData[0].userQuantity = 0;
            }
          }
        }
      });
    setTimeout(() => {
      setRender((prv) => !prv);
    }, 0);
  }, [product, cartItemQuantity]);

  useEffect(() => {
    product_data(allFilterItems);
    setShowFirstPriceOnLoad(true);
  }, [allFilterItems]);

  useEffect(() => {
    getAllProductsDataByRegion();
  }, [subscription]);
  //showing all products dfdfdf

  useEffect(() => {
    let catId;
    if (imageUrl.includes("kc.storehey.com")) {
      catId = "60bef11cad133434896d22a5";
    } else {
      catId = "60c2e902e00fd55ac258f3f9";
    }
    let requestData = {
      product_categories: sessionStorage.getItem("catId")
        ? sessionStorage.getItem("catId")
        : catId,
      RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
      subscribe: false,
      skip: 0,
      // limit: 3,
    };
    if (localStorage.getItem("selectedRegionId")) {
      ApiRequest(requestData, "/searchProduct", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.count !== 0) {
              product_data(res.data.data);
              setCount(res.data.count);
              finishLoading(100);
              window.scrollTo({
                top: +sessionStorage.getItem("lScrollPos"),
                behavior: "smooth",
              });
              setStorePos(true);
            } else {
              product_data([]);
              finishLoading(100);
            }
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [showAll]);

  function getAllProductsDataByRegion() {
    let catId;
    if (imageUrl.includes("kc.storehey.com")) {
      catId = "60bef11cad133434896d22a5";
    } else {
      catId = "60c2e902e00fd55ac258f3f9";
    }
    const requestData = {
      product_categories: sessionStorage.getItem("catId")
        ? sessionStorage.getItem("catId")
        : catId,
      RegionId: regionId,
      subscribe: subscription,
      skip: 0,
      // limit: 3,
    };
    if (regionId && regionId !== "") {
      ApiRequest(requestData, "/searchProduct", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.count !== 0) {
              product_data(res.data.data);
              setAllProducts(res.data.data);
              setCount(res.data.count);
            } else {
              product_data([]);
              setAllProducts([]);
              setCount(0);
            }
            finishLoading(100);
          }
        })
        .then(() => {
          setItemsLoaded(true);
          closeRegionPopup();
          finishLoading(100);
          window.scrollTo({
            top: +sessionStorage.getItem("lScrollPos"),
            behavior: "smooth",
          });
          setStorePos(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  //getting products according to region ID stored in localstorage
  useEffect(getAllProductsDataByRegion, []);

  const handleChange = (e) => {
    const selectedPackageId = e.target.value;
    const id = e.target.id;
    setShowFirstPriceOnLoad(false);

    //making selected value false of previously selected item
    product.map((itm) => {
      if (itm.simpleData[0]) {
        if (itm.simpleData[0]._id === id) {
          itm.simpleData[0].package.map((pck) => {
            pck.selected = false;
          });
        }
      }
    });

    //adding value true to selected item
    product.map((itm) => {
      if (itm.simpleData[0]) {
        if (itm.simpleData[0]._id === id) {
          itm.simpleData[0].package.map((pck) => {
            if (pck._id === selectedPackageId) {
              pck.selected = true;
            }
          });
        }
      }
    });
    setRenderProducts(!renderProducts);
  };

  const subtractFromCart = async (selectedItem) => {
    // setLoading(true);
    var already_cart = false;
    var quantityInCart = 0;
    let modifiedSelectedItem;
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    let selectedItmPck =
      selectedItem.simpleData[0].package.length > 0
        ? selectedItem.simpleData[0].package.filter((pck) => pck.selected)
        : "";
    var cartSelectedPck = [];
    if (realTimeCart.length > 0) {
      realTimeCart.map((itm) => {
        if (itm._id === selectedItem._id) {
          if (itm.simpleData[0].package[0]) {
            itm.simpleData[0].package.map((i) => {
              if (i.selected) {
                cartSelectedPck.push(i._id);
                quantityInCart = i.quantity;
              }
            });
          } else {
            quantityInCart = itm.simpleData[0].userQuantity;
          }
        }
      });

      if (selectedItem.simpleData[0].package[0]) {
        selectedItem.simpleData[0].package.map((itmitm, indind) => {
          if (itmitm.selected === true) {
            selectedItem.simpleData[0].package[indind].quantity =
              itmitm.quantity - 1;
          }
        });
        selectedItem.simpleData[0].package.map((sId) => {
          if (sId.selected) {
            if (
              cartSelectedPck.filter((i) => {
                return i === sId._id;
              }).length > 0
            ) {
              already_cart = true;
              if (quantityInCart <= 1) {
                // deleting item from cart if quantity is 1.
                realTimeCart = realTimeCart.filter((itm) => {
                  if (itm._id === selectedItem._id) {
                    if (itm.simpleData[0].package.length > 0) {
                      let samePackageProduct = false;
                      itm.simpleData[0].package.map((pck) => {
                        if (pck.selected) {
                          if (pck._id === selectedItmPck[0]._id) {
                            samePackageProduct = true;
                          } else {
                          }
                        }
                      });
                      if (!samePackageProduct) {
                        return itm;
                      } else {
                        return;
                      }
                    } else {
                      return itm;
                    }
                  } else {
                    return itm;
                  }
                });
              } else {
                //subtracting 1 quantity from selected item in cart.
                realTimeCart.map((itm) => {
                  if (itm._id === selectedItem._id) {
                    itm.simpleData[0].package.map((pck) => {
                      if (pck.selected) {
                        if (pck._id === selectedItmPck[0]._id) {
                          return (pck.quantity = pck.quantity - 1);
                        }
                      }
                    });
                  }
                });
              }
              addToCart([]);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              addToCart(realTimeCart);
            } else {
              let name = selectedItem.product_name;
              swal({
                // title: ,
                text: "Please add " + name + "  in your cart",
                icon: "warning",
                dangerMode: true,
              });
            }
          }
        });
      } else {
        if (
          realTimeCart.filter((i) => {
            return i._id === selectedItem._id;
          }).length > 0
        ) {
          already_cart = true;
          if (quantityInCart <= 1) {
            realTimeCart = realTimeCart.filter(
              (itm) => itm._id !== selectedItem._id
            );
          } else {
            realTimeCart.map((itm) => {
              if (itm._id === selectedItem._id) {
                return (itm.simpleData[0].userQuantity = quantityInCart - 1);
              }
            });
          }
          addToCart([]);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          addToCart(realTimeCart);
        } else {
          already_cart = false;

          let name = selectedItem.product_name;
          swal({
            // title: ,
            text: "Please add " + name + "  in your cart",
            icon: "warning",
            dangerMode: true,
          });
        }
      }
    } else {
      already_cart = false;
      let name = selectedItem.product_name;
      swal({
        // title: ,
        text: "Please add " + name + "  in your cart",
        icon: "warning",
        dangerMode: true,
      });
    }

    setRender((prv) => !prv);
    await sendCartDataToAPI([selectedItem], user_details, addToCart)
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const changeSubscribeToggleAPI = (status) => {
    let requestData = {
      _id: user_details._id,
      subscribeToggle: status,
    };
    ApiRequest(requestData, "/subscribe/toggle/status", "POST")
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  //adding cart added products in cartItem State
  const addToCart1 = async (selectedItem) => {
    var already_cart = false;
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    var quantityInCart = 0;
    let errorPresent = false;
    let selectedItmPck =
      selectedItem.simpleData[0].package.length > 0
        ? selectedItem.simpleData[0].package.filter((pck) => pck.selected)
        : "";

    //adding 1 quantity first time in without package products
    if (!selectedItem.simpleData[0].userQuantity) {
      selectedItem.simpleData[0].userQuantity = 1;
    }
    let availableLocalQuantity = selectedItem.simpleData[0].availableQuantity;
    let name = selectedItem.product_name;

    var cartSelectedPck = [];
    if (realTimeCart.length > 0) {
      realTimeCart.map((itm) => {
        if (itm._id === selectedItem._id) {
          if (itm.simpleData[0].package[0]) {
            itm.simpleData[0].package.map((i) => {
              if (i.selected) {
                cartSelectedPck.push(i._id);
                quantityInCart = i.quantity;
              }
            });
          } else {
            quantityInCart = itm.simpleData[0].userQuantity;
          }
        }
      });

      if (selectedItem.simpleData[0].package[0]) {
        selectedItem.simpleData[0].package.map((sId) => {
          if (sId.selected) {
            if (
              cartSelectedPck.filter((i) => {
                return i === sId._id;
              }).length > 0
            ) {
              already_cart = true;
              let quantityError = false;
              selectedItem.simpleData[0].package.map((itmitm, indind) => {
                if (itmitm.selected === true) {
                  availableLocalQuantity =
                    +availableLocalQuantity / +itmitm.packet_size;
                  if (
                    +availableLocalQuantity >=
                    +selectedItem.simpleData[0].package[indind].quantity + 1
                  ) {
                    selectedItem.simpleData[0].package[indind].quantity =
                      itmitm.quantity + 1;
                  } else {
                    quantityError = true;
                    errorPresent = true;
                    swal({
                      title: "Error!",
                      text:
                        "You can not add " +
                        name +
                        " more than " +
                        selectedItem.simpleData[0]?.availableQuantity +
                        " " +
                        selectedItem.unitMeasurement?.name,
                      icon: "warning",
                    });
                  }
                }
              });
              realTimeCart.map((itm) => {
                if (itm._id === selectedItem._id) {
                  itm.simpleData[0].package.map((pck) => {
                    if (pck.selected) {
                      if (pck._id === selectedItmPck[0]._id && !quantityError) {
                        return (pck.quantity = pck.quantity + 1);
                      }
                    }
                  });
                }
              });
              addToCart([]);
              // realTimeCart.push(selectedItem);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              addToCart(realTimeCart);
              // let name = selectedItem.product_name;
              // swal({
              //   // title: ,
              //   text: name + "  is already in your cart",
              //   icon: "warning",
              //   dangerMode: true,
              // });
            } else {
              addToCart([]);
              selectedItem.simpleData[0].package.map((itmitm, indind) => {
                availableLocalQuantity =
                  +availableLocalQuantity / +itmitm.packet_size;
                if (
                  itmitm.selected === true &&
                  +availableLocalQuantity >=
                    +selectedItem.simpleData[0].package[indind].quantity + 1
                ) {
                  selectedItem.simpleData[0].package[indind].quantity =
                    itmitm.quantity + 1;
                }
              });
              realTimeCart.push(selectedItem);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              addToCart(realTimeCart);
            }
          }
        });
      } else {
        if (
          realTimeCart.filter((i) => {
            return i._id === selectedItem._id;
          }).length > 0
        ) {
          already_cart = true;
          realTimeCart.map((itm) => {
            if (itm._id === selectedItem._id) {
              return availableLocalQuantity > itm.simpleData[0].userQuantity
                ? (itm.simpleData[0].userQuantity = quantityInCart + 1)
                : (itm.simpleData[0].userQuantity = quantityInCart);
            }
          });
          if (
            +availableLocalQuantity >=
            +selectedItem.simpleData[0].userQuantity + 1
          ) {
            selectedItem.simpleData[0].userQuantity = quantityInCart + 1;
          } else {
            errorPresent = true;
            swal({
              title: "Error!",
              text:
                "You can not add " +
                name +
                " more than " +
                selectedItem.simpleData[0]?.availableQuantity +
                " " +
                selectedItem.unitMeasurement?.name,
              icon: "warning",
            });
          }
          addToCart([]);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          addToCart(realTimeCart);
          // let name = selectedItem.product_name;
          // swal({
          //   // title: ,
          //   text: name + "  is already in your cart",
          //   icon: "warning",
          //   dangerMode: true,
          // });
        } else {
          already_cart = false;
          addToCart([]);
          realTimeCart.push(selectedItem);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          addToCart(realTimeCart);
        }
      }
    } else {
      already_cart = false;
      selectedItem.simpleData[0].package.map((itmitm, indind) => {
        if (itmitm.selected === true) {
          availableLocalQuantity =
            +availableLocalQuantity / +itmitm.packet_size;
          if (
            +availableLocalQuantity >=
            +selectedItem.simpleData[0].package[indind].quantity + 1
          ) {
            selectedItem.simpleData[0].package[indind].quantity =
              itmitm.quantity + 1;
          } else {
            errorPresent = true;
            swal({
              title: "Error!",
              text:
                "You can not add " +
                name +
                " more than " +
                selectedItem.simpleData[0]?.availableQuantity +
                " " +
                selectedItem.unitMeasurement?.name,
              icon: "warning",
            });
          }
        }
      });
      addToCart([]);
      realTimeCart.push(selectedItem);
      localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
      addToCart(realTimeCart);
    }

    setRender((prv) => !prv);
    if (!errorPresent) {
      await sendCartDataToAPI([selectedItem], user_details, addToCart)
        .then((res) => {
          if (
            selectedItem.preOrder === true &&
            realTimeCart.length === 1 &&
            already_cart === false
          ) {
            localStorage.setItem("status", true);
            changeSubscribeToggleAPI(true);
            swal({
              title: "Pre-ordering produce?",
              text: "You will only be able to see products available for delivery on the same day as the pre-order product.",
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
            }).then((confirm) => {
              if (confirm) {
                changeSubscribeTrue();
                setRenderProducts(!renderProducts);
              } else {
                newarrayofcart = newarrayofcart
                  ? newarrayofcart.filter((itm) => itm._id !== selectedItem._id)
                  : [];
                localStorage.setItem(
                  "cartItem",
                  JSON.stringify(newarrayofcart)
                );
                addToCart([]);
                addToCart(newarrayofcart);
                addToCart([]);
                quantityChange(!cartItemQuantity);
                setRenderProducts(!renderProducts);
              }
            });
          }

          if (res.data.data === "you can not add both item") {
            swal({
              title: "Pre-ordering produce?",
              text: "You will only be able to see products available for delivery on the same day as the pre-order product and your current cart will get empty.",
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
            }).then((confirm) => {
              if (confirm) {
                let emptyarray = [];
                localStorage.setItem("status", true);
                changeSubscribeToggleAPI(true);
                localStorage.setItem("cartItem", JSON.stringify(emptyarray));
                addToCart([]);
                localStorage.setItem(
                  "cartItem",
                  JSON.stringify([selectedItem])
                );
                addToCart([selectedItem]);
                setRenderProducts(!renderProducts);
                changeSubscribeTrue();
                setRenderProducts(!renderProducts);
                quantityChange(!cartItemQuantity);
              } else {
                var newarrayofcart = realTimeCart;
                newarrayofcart = newarrayofcart.filter(
                  (itm) => itm._id !== selectedItem._id
                );
                localStorage.setItem(
                  "cartItem",
                  JSON.stringify(newarrayofcart)
                );
                addToCart([]);
                addToCart(newarrayofcart);
                setRenderProducts(!renderProducts);
                quantityChange(!cartItemQuantity);
              }
            });
          } else if (
            res.data.data === "you can order one preorder product at a time."
          ) {
            const preorderItemsInCart = realTimeCart.filter((a) => a.preOrder);
            if (selectedItem._id === preorderItemsInCart[0]._id) {
            } else {
              swal({
                title: "Pre-ordering produce?",
                text: "You can only order one pre-order product at a time.",
                icon: "warning",
                dangerMode: true,
                buttons: {
                  // confirm: {
                  //   text: "Go ahead",
                  //   value: true,
                  //   visible: true,
                  //   className: "",
                  //   closeModal: true,
                  // },
                  cancel: {
                    text: "Ok",
                    value: false,
                    visible: true,
                    className: "back-swal-btn",
                    closeModal: true,
                  },
                },
              }).then((confirm) => {
                if (confirm) {
                  let emptyarray = [];
                  localStorage.setItem("status", true);
                  changeSubscribeToggleAPI(true);
                  localStorage.setItem("cartItem", JSON.stringify(emptyarray));
                  addToCart([]);
                  addToCart([]);
                  localStorage.setItem(
                    "cartItem",
                    JSON.stringify([selectedItem])
                  );
                  addToCart([selectedItem]);
                  setRenderProducts(!renderProducts);
                  changeSubscribeTrue();
                  setRenderProducts(!renderProducts);
                  quantityChange(!cartItemQuantity);
                } else {
                  var newarrayofcart = realTimeCart;
                  newarrayofcart = newarrayofcart.filter(
                    (itm) => itm._id !== selectedItem._id
                  );
                  localStorage.setItem(
                    "cartItem",
                    JSON.stringify(newarrayofcart)
                  );
                  addToCart([]);
                  addToCart(newarrayofcart);
                  setRenderProducts(!renderProducts);
                  quantityChange(!cartItemQuantity);
                }
              });
            }
          } else if (res.data.result === "user_id Required") {
            var newarrayofcart = realTimeCart;
            var checkingarraypoping = realTimeCart;
            checkingarraypoping = checkingarraypoping.filter(
              (itm) => itm._id !== selectedItem._id
            );
            // checkingarraypoping.splice(checkingarraypoping.length,1);
            var checkingarray = [];
            checkingarray = checkingarraypoping;

            if (JSON.parse(localStorage.getItem("status")) == true) {
              for (var j = 0; j < checkingarray.length; j++) {
                if (
                  checkingarray[j].preOrder === selectedItem.preOrder &&
                  selectedItem.preOrder === true
                ) {
                  newarrayofcart = newarrayofcart.filter(
                    (itm) => itm._id !== selectedItem._id
                  );
                  localStorage.setItem(
                    "cartItem",
                    JSON.stringify(newarrayofcart)
                  );
                  addToCart([]);
                  addToCart(newarrayofcart);
                  setRenderProducts(!renderProducts);
                  swal({
                    title: "Pre-ordering produce?",
                    text: "You can only order one pre-order product at a time.",
                    icon: "warning",
                    dangerMode: true,
                    buttons: {
                      cancel: {
                        text: "Ok",
                        value: false,
                        visible: true,
                        className: "back-swal-btn",
                        closeModal: true,
                      },
                      // cancel: {
                      //   text: "Ok",
                      //   value: false,
                      //   visible: true,
                      //   className: "back-swal-btn",
                      //   closeModal: true,
                      // },
                    },
                  }).then((confirm) => {
                    if (confirm) {
                    }
                  });
                } else if (checkingarray[j] && selectedItem.preOrder === true) {
                  setRenderProducts(!renderProducts);
                  swal({
                    title: "Pre-ordering produce?",
                    text: "You will only be able to see products available for delivery on the same day as the pre-order product.",
                    icon: "warning",
                    dangerMode: true,
                  });
                }
              }
            } else {
              for (var i = 0; i < checkingarray.length; i++) {
                if (
                  checkingarray[i].preOrder === selectedItem.preOrder &&
                  selectedItem.preOrder === true
                ) {
                  newarrayofcart = newarrayofcart.filter(
                    (itm) => itm._id !== selectedItem._id
                  );
                  localStorage.setItem(
                    "cartItem",
                    JSON.stringify(newarrayofcart)
                  );
                  addToCart(newarrayofcart);
                  setRenderProducts(!renderProducts);

                  swal({
                    title: "Pre-ordering produce?",
                    text: "You can only order one pre-order product at a time.",
                    icon: "warning",
                    dangerMode: true,
                    buttons: {
                      cancel: {
                        text: "Ok",
                        value: false,
                        visible: true,
                        className: "back-swal-btn",
                        closeModal: true,
                      },
                      // cancel: {
                      //   text: "Ok",
                      //   value: false,
                      //   visible: true,
                      //   className: "back-swal-btn",
                      //   closeModal: true,
                      // },
                    },
                  }).then((confirm) => {
                    if (confirm) {
                    }
                  });
                } else if (checkingarray[i] && selectedItem.preOrder === true) {
                  setRenderProducts(!renderProducts);
                  swal({
                    title: "Pre-ordering produce?",
                    text: "You will only be able to see products available for delivery on the same day as the pre-order product and your current cart will get empty.",
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
                  }).then((confirm) => {
                    if (confirm) {
                      let emptyarray = [];
                      localStorage.setItem("status", true);
                      changeSubscribeToggleAPI(true);
                      localStorage.setItem(
                        "cartItem",
                        JSON.stringify(emptyarray)
                      );
                      addToCart([]);
                      // window.location = "/product/" + selectedItem.product_name;
                      changeSubscribeTrue();
                      addToCart([]);
                      localStorage.setItem(
                        "cartItem",
                        JSON.stringify([selectedItem])
                      );
                      addToCart([selectedItem]);
                      setRenderProducts(!renderProducts);
                    } else {
                      newarrayofcart = newarrayofcart.filter(
                        (itm) => itm._id !== selectedItem._id
                      );
                      localStorage.setItem(
                        "cartItem",
                        JSON.stringify(newarrayofcart)
                      );
                      addToCart([]);
                      addToCart(newarrayofcart);
                      setRenderProducts(!renderProducts);
                    }
                  });
                }
              }
            }
          } else if (res.data.message === "errror") {
            swal({
              title: "Error!",
              text: "You can not add " + res.data.data.join(""), 
              icon: "warning",
              dangerMode: true,
            });
            var newarrayofcart = realTimeCart;
            let webPck;
            newarrayofcart = newarrayofcart.filter((itm) => {
              let cartP = itm.TypeOfProduct === "simple" ? itm.simpleData[0].package.filter((c) => c.selected) : [];
              webPck = selectedItem.simpleData[0].package.filter(
                (a) => a.selected
              );
              console.log(cartP[0]?._id, webPck[0]._id , cartP[0]?._id !== webPck[0]._id)
              if (itm._id !== selectedItem._id) {
                return itm;
              } else {
                if (cartP[0]?._id !== webPck[0]._id) {
                  return itm;
                }
              }
            });
            localStorage.setItem("cartItem", JSON.stringify(newarrayofcart));
            addToCart([]);
            addToCart(newarrayofcart);
            setRenderProducts(!renderProducts);
            setTimeout(() => {
              product.map((itm) => {
                if (itm._id === selectedItem._id) {
                  //looping thorught all products and adding quantity to each product from cart
                  if (itm.simpleData && itm.simpleData[0]) {
                    itm.simpleData[0].package[0]
                      ? itm.simpleData[0].package.map((pck, index) => {
                          if (pck._id === webPck[0]._id) {
                            pck.quantity =
                              quantityInCart > 0 ? quantityInCart : 0;
                          }
                          if (quantityInCart === 0) {
                            if (pck._id === webPck[0]._id) {
                              pck.selected = true;
                            } else {
                              pck.selected = false;
                            }
                          }
                        })
                      : (itm.simpleData[0].userQuantity = 0);
                  }
                }
              });
            }, 0);
            quantityChange(!cartItemQuantity);
          } else {
            // swal({
            //   // title: ,
            //   text: "This Item is currently out of stock",
            //   icon: "warning",
            //   dangerMode: true,
            // });
          }
          setShowCart(true);
          openCart();
        })
        .catch((error) => {
          console.log(error);
        });

      localStorage.setItem("coupon_code", "");
      localStorage.setItem("freepackage", "");
      localStorage.setItem("freeproduct", "");
      localStorage.setItem("couponStatus", 2);
      localStorage.setItem("discount_amount", "");
    }
    setTimeout(() => {
      setShowCart(true);
      // openCart();
    }, 50);
  };

  useEffect(() => {}, [allFilterItems]);

  useEffect(() => {
    popupSelected(regionId);
  }, [openPopup]);

  //getting products according to selected region id
  const selectedRegionValue = (value, name) => {
    setRegionId(value);
    setRegionName(name);
    let dta = {
      regionID: value,
      subscribe: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
    };
    ApiRequest(dta, "/GetCategorySubCat", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((itm) => {
            let name = itm.category_name;
            name = name.toLowerCase();
            if (name === "featured products") {
              setFeatureProductId(itm._id);
            }
          });
        } else {
        }
      })
      .then(() => {
        const requestData = {
          RegionId: value,
          subscribe: false,
          product_categories: imageUrl.includes("kc.storehey.com")
            ? "60bef11cad133434896d22a5"
            : "60c2e902e00fd55ac258f3f9",
          skip: 0,
          // limit: 3,
        };
        if (value.length > 0) {
          ApiRequest(requestData, "/searchProduct", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                if (res.data.count !== 0) {
                  product_data(res.data.data);
                  setAllProducts(res.data.data);
                  setCount(res.data.count);
                } else {
                  product_data([]);
                  setAllProducts([]);
                }
                finishLoading(100);
                window.scrollTo({
                  top: +sessionStorage.getItem("lScrollPos"),
                  behavior: "smooth",
                });
                setStorePos(true);
              } else {
              }
            })
            .then(() => {
              setItemsLoaded(true);
              closeRegionPopup();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    localStorage.setItem("selectedRegionId", JSON.stringify(value));
    localStorage.setItem("selectedRegionName", JSON.stringify(name));
  };

  //getting more products on scroll
  const fetchMoreProducts = () => {
    if (sessionStorage.getItem("catId")) {
    } else {
      if (product.length >= count && !showTopTenList) {
        setHasMore(false);
      } else {
        let catId = "";
        if (imageUrl.includes("kc.storehey.com")) {
          catId = "60bef11cad133434896d22a5";
        } else {
          catId = "60c2e902e00fd55ac258f3f9";
        }
        const requestData = {
          RegionId: regionId,
          subscribe: subscription,
          product_categories: sessionStorage.getItem("catId")
            ? sessionStorage.getItem("catId")
            : catId,
          skip: product.length,
          // limit: 3,
        };
        if (regionId.length > 0) {
          ApiRequest(requestData, "/searchProduct", "POST")
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                if (res.data.count !== 0) {
                  product_data(product.concat(res.data.data));
                  setCount(res.data.count);
                }
                finishLoading(100);
                window.scrollTo({
                  top: +sessionStorage.getItem("lScrollPos"),
                  behavior: "smooth",
                });
                setStorePos(true);
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  };

  const showOutofstockAlert = (item) => {
    swal({
      // title: ,
      text: item.product_name + " is currently out of stock",
      icon: "warning",
      dangerMode: true,
    });
  };

  return (
    <>
      {loading ? (
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
      {openPopup ? (
        <RegionPopup
          selectedRegionValue={selectedRegionValue}
          closePopup={() => {
            setOpenPopup(false);
            closeRegionPopup();
          }}
          parentName="home"
        />
      ) : (
        ""
      )}
      {openGroupProduct ? (
        <GroupProduct
          closeGroup={() => setOpenGroupProduct(false)}
          groupProductData={groupProductData}
        />
      ) : (
        ""
      )}

      {Array.isArray(product) && product.length > 0 ? (
        <InfiniteScroll
          dataLength={product.length}
          next={fetchMoreProducts}
          hasMore={hasMore}
        >
          <div className="product-list">
            {product &&
              product.map((item) => {
                var price = null;
                var quantityshow = 0;
                if (item.TypeOfProduct === "simple") {
                  if (item.simpleData[0].package[0]) {
                    item.simpleData[0].package.map((pck, index) => {
                      if (pck.selected) {
                        quantityshow = pck.quantity;
                        if (user_details.length !== 0) {
                          if (user_details.user_type === "b2b") {
                            price = pck.B2B_price;
                          } else if (user_details.user_type === "retail") {
                            price = pck.Retail_price;
                          } else if (
                            user_details.user_type === "user" ||
                            user_details.user_type === null
                          ) {
                            price = pck.selling_price;
                          }
                        } else {
                          if (pck.selling_price) {
                            price = pck.selling_price;
                          } else {
                            price = pck.packetmrp;
                          }
                        }
                      } else if (showFirstPriceOnLoad && index === 0) {
                        quantityshow = pck.quantity;
                        if (user_details.length !== 0) {
                          if (user_details.user_type === "b2b") {
                            price = pck.B2B_price;
                          } else if (user_details.user_type === "retail") {
                            price = pck.Retail_price;
                          } else if (
                            user_details.user_type === "user" ||
                            user_details.user_type === null
                          ) {
                            price = pck.selling_price;
                          }
                        } else {
                          if (pck.selling_price) {
                            price = pck.selling_price;
                          } else {
                            price = pck.packetmrp;
                          }
                        }
                      }
                    });
                  } else {
                    quantityshow = item.simpleData[0].userQuantity;
                    if (user_details.length !== 0) {
                      if (user_details.user_type === "b2b") {
                        price = item.simpleData[0].RegionB2BPrice;
                      } else if (user_details.user_type === "retail") {
                        price = item.simpleData[0].RegionRetailPrice;
                      } else if (user_details.user_type === "user") {
                        price = item.simpleData[0].RegionSellingPrice;
                      } else if (user_details.user_type === null) {
                        price = item.simpleData[0].RegionSellingPrice;
                      } else {
                      }
                    } else {
                      if (item.simpleData[0].RegionSellingPrice) {
                        price = item.simpleData[0].RegionSellingPrice;
                      } else {
                        price = item.simpleData[0].mrp;
                      }
                    }
                  }
                }
                let selPck =
                  item.simpleData[0] && item.simpleData[0].package.length > 0
                    ? item.simpleData[0].package.filter((a) => a.selected)
                    : [];
                return price || item.TypeOfProduct === "group" ? (
                  <div
                    className={
                      item.outOfStock || item.preOrder === true
                        ? "product-list-col out-of-stock-product"
                        : "product-list-col"
                    }
                    key={item._id}
                  >
                    {item.preOrder ? (
                      <p className="stocke-text-pre">
                        <span
                          className="pre-order"
                          style={{ display: "inline-block" }}
                        >
                          PRE-ORDER FOR <br />
                          {item.preOrderEndDate
                            ? moment(item.preOrderEndDate).format("DD/MM/YYYY")
                            : ""}
                        </span>
                      </p>
                    ) : (
                      item.outOfStock && (
                        <p className="stocke-text">Out Of Stock</p>
                      )
                    )}
                    <div className="product-thumb">
                      {item.images && item.images.length > 0 ? (
                        <Link to={"product/" + item.slug}>
                          {" "}
                          <img
                            src={imageUrl + item.images[0].image}
                            alt="primary"
                          />
                        </Link>
                      ) : (
                        <img
                          src={imageUrl + localStorage.getItem("prdImg")}
                          alt="dummy"
                        />
                      )}
                    </div>
                    <div className="product-list-description">
                      <div className="product-list-price">
                        <span className="price-product">
                          {item.TypeOfProduct === "simple" ? "₹ " + price : ""}
                          <span className="old-price">
                            {
                              item.TypeOfProduct === "simple"
                                ? item.simpleData[0] === undefined ||
                                  (item.simpleData[0].package[0]
                                    ? item.simpleData[0].package.map(
                                        (pck, index) => {
                                          if (pck.selected) {
                                            if (pck.selling_price) {
                                              if (
                                                +pck.packetmrp >
                                                +pck.selling_price
                                              ) {
                                                return pck.packetmrp;
                                              }
                                            }
                                          } else if (
                                            showFirstPriceOnLoad &&
                                            index === 0
                                          ) {
                                            if (pck.selling_price) {
                                              if (
                                                +pck.packetmrp >
                                                +pck.selling_price
                                              ) {
                                                return pck.packetmrp;
                                              }
                                            }
                                          }
                                        }
                                      )
                                    : item.simpleData[0].RegionSellingPrice &&
                                      +item.simpleData[0].mrp >
                                        +item.simpleData[0]
                                          .RegionSellingPrice &&
                                      item.simpleData[0].mrp)
                                : ""
                              // item.configurableData[0].sellingPrice
                            }
                            {/* {item.TypeOfProduct === "simple" &&
                    item.simpleData[0].mrp < 0 &&
                    item.simpleData[0].mrp} */}
                          </span>
                        </span>
                        {item.sameDayDelivery === false ? (
                          <span
                            className="next_day_delivery"
                            // onClick={async () =>
                            //   console.log(
                            //     await sendCartDataToAPI(dataInCart, user_details)
                            //   )
                            // }
                          >
                            Next day delivery only
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                      <Link to={"product/" + item.slug}>
                        <div className="product-list-name capitalise">
                          {item.product_name}
                        </div>
                        {reviewRatingShow && item.ratings ? (
                          <div className="homepage-rating">
                            <Rating
                              emptySymbol="fa fa-star-o fa-2x"
                              fullSymbol="fa fa-star fa-2x"
                              fractions={2}
                              readonly={true}
                              initialRating={item.ratings || 0}
                            />

                            <p> ({item.reviewsCount || 0})</p>
                          </div>
                        ) : (
                          <div className="homepage-rating"></div>
                        )}
                      </Link>
                      <div
                        className={
                          item.TypeOfProduct === "simple"
                            ? "product-card-add simple"
                            : "product-card-add config"
                        }
                      >
                        {item.TypeOfProduct === "simple" ? (
                          <span className="card-button">
                            {+quantityshow === 0 ? (
                              ""
                            ) : (
                              <span
                                className="label-icon add_to_cart_primary_icon"
                                onClick={() => subtractFromCart(item)}
                              >
                                {+quantityshow === 1 ? (
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  <i
                                    className="fa fa-minus"
                                    aria-hidden="true"
                                  ></i>
                                )}
                              </span>
                            )}
                            <span className="label-add">
                              <span
                                className={
                                  item.simpleData[0].package.length > 0
                                    ? "text-add select-edit-tag"
                                    : "text-add norml-selet"
                                }
                              >
                                <div
                                  className="custom-select"
                                  style={{
                                    background: "#f3f3f3",
                                    lineHeight: "36px",
                                  }}
                                >
                                  {item.simpleData[0] === undefined ||
                                    (item.simpleData[0].package[0] ? (
                                      <select
                                        className="custom-select-form"
                                        id={item.simpleData[0]._id}
                                        onChange={handleChange}
                                        value={selPck[0]?._id}
                                      >
                                        {item.simpleData[0].package.map(
                                          (pck) => {
                                            return (
                                              pck.status &&
                                              pck.userPrice && (
                                                <option value={pck._id}>
                                                  {pck.packetLabel}
                                                  {pck.quantity > 0
                                                    ? " - " +
                                                      pck.quantity +
                                                      " Qty"
                                                    : ""}
                                                </option>
                                              )
                                            );
                                          }
                                        )}
                                      </select>
                                    ) : (
                                      <p
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {item.unitQuantity
                                          ? item.unitQuantity
                                          : 1}{" "}
                                        {item.unitMeasurement &&
                                          item.unitMeasurement.name}
                                        {item.simpleData[0].userQuantity > 0
                                          ? ` - ${item.simpleData[0].userQuantity} Qty`
                                          : ""}
                                      </p>
                                    ))}
                                </div>
                              </span>
                              <span className="product-overlay"></span>
                            </span>
                            {item.outOfStock ? (
                              <span
                                className="label-icon add_to_cart_primary_icon"
                                onClick={() => showOutofstockAlert(item)}
                              >
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                                <span className="icon-overlay"></span>
                              </span>
                            ) : (
                              <span
                                className="label-icon add_to_cart_primary_icon"
                                onClick={() => addToCart1(item)}
                              >
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                                <span className="icon-overlay"></span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <div>
                            <span
                              className="card-button"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setGroupProductData(item);
                                setOpenGroupProduct(true);
                              }}
                            >
                              <span className="label-add">
                                <span className="text-add">View Detail</span>
                                <span className="product-overlay"></span>
                              </span>
                              <span className="label-icon">
                                <i
                                  className="fa fa-plus"
                                  aria-hidden="true"
                                ></i>
                                <span className="icon-overlay"></span>
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : item.TypeOfProduct === "configurable" ? (
                  <div
                    className={
                      item.outOfStock || item.preOrder === true
                        ? "product-list-col out-of-stock-product"
                        : "product-list-col"
                    }
                    key={item._id}
                  >
                    <div className="product-thumb">
                      {/* {!item.images? <Skeleton count={5} />:<></>} */}
                      <Link to={"product-configured/" + item.slug}>
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={imageUrl + item.images[0].image}
                            alt="primary"
                          />
                        ) : (
                          <img
                            src={imageUrl + localStorage.getItem("prdImg")}
                            alt="dummy"
                          />
                        )}
                      </Link>
                    </div>
                    <div className="product-list-description">
                      <Link to={"product-configured/" + item.slug}>
                        <div className="product-list-name capitalise">
                          {item.product_name}
                        </div>
                      </Link>
                      <div
                        className={
                          item.TypeOfProduct === "simple"
                            ? "product-card-add simple"
                            : "product-card-add config"
                        }
                      >
                        {item.TypeOfProduct === "configurable" ? (
                          <div>
                            <Link to={"product-configured/" + item.slug}>
                              <span
                                className="card-button px-2"
                                style={{ cursor: "pointer" }}
                              >
                                <span className="label-add">
                                  <span className="text-add">View Detail</span>
                                  <span className="product-overlay"></span>
                                </span>
                                <span className="label-icon">
                                  <i
                                    className="fa fa-plus"
                                    aria-hidden="true"
                                  ></i>
                                  <span className="icon-overlay"></span>
                                </span>
                              </span>
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                );
              })}
          </div>
        </InfiniteScroll>
      ) : (
        <>
          <img
            src={process.env.PUBLIC_URL + "/img/icons/no-product-found.jpg"}
            alt=""
            style={{ width: "100%" }}
          />
        </>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  quantityChange: (data) => dispatch(quantityChange(data)),
  userdetails: (data) => dispatch(userdetails(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Product)
);
