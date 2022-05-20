import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { imageUrl } from "../../imageUrl";
import {
  addGroupData,
  addToCart,
  changeAddToCartPopup,
} from "../../redux/actions/actions";
import GroupCategory from "./GroupCategory";

function Group_Product({
  closeGroup,
  groupProductData,
  groupDataCart,
  addGroupData,
  user_details,
  addToCartPopup,
  orderType,
  addToCart,
  changeAddToCartPopup,
  addGroupOffline,
}) {
  const [item, setGroupData] = useState(groupProductData);
  const [totalPriceCart, setTotalPriceCart] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [errorStatus, setErrorStatus] = useState(false);
  const [addToCartButtonShow, setAddToCartButtonShow] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [minQtyErrors, setMinQtyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullPageLoading, setFullPageLoading] = useState(true);

  useEffect(() => {
    addGroupData([]);
  }, []);

  useEffect(() => {
    let cartProducts = [];
    let cartStatus = true;

    const newObject = {
      ...groupProductData,
      groupData: groupProductData.groupData.map((group) => {
        return {
          ...group,
          sets: group.sets.map((set) => {
            if (+set.preset > 0) {
              if (!set.product.outOfStock) {
                cartProducts.push({ ...set, catName: group.name });
              } else {
                setAddToCartButtonShow(false);
                cartStatus = false;
              }
            }
            return {
              ...set,
              product: {
                ...set.product,
                groupSlug: set.product._id + group.name.replaceAll(" ", ""),
              },
            };
          }),
        };
      }),
    };
    setGroupData(groupProductData);
    setTimeout(() => {
      let cartToBeSent = [];
      cartProducts.forEach((prd) => {
        var localprice = 0;
        if (prd.product.TypeOfProduct === "simple") {
          if (prd.product.simpleData[0]) {
            if (prd.package === "" || prd.package === null) {
              if (user_details.length !== 0) {
                if (user_details.user_type === "b2b") {
                  localprice = prd.product.simpleData[0].RegionB2BPrice;
                } else if (user_details.user_type === "retail") {
                  localprice = prd.product.simpleData[0].RegionRetailPrice;
                } else if (user_details.user_type === "user") {
                  localprice = prd.product.simpleData[0].RegionSellingPrice;
                } else if (user_details.user_type === null) {
                  localprice = prd.product.simpleData[0].RegionSellingPrice;
                } else {
                }
              } else {
                if (prd.product.simpleData[0].RegionSellingPrice) {
                  localprice = prd.product.simpleData[0].RegionSellingPrice;
                } else {
                  localprice = prd.product.simpleData[0].mrp;
                }
              }
            } else {
              var packageFound = false;
              if (
                prd.product.simpleData &&
                prd.product.simpleData[0].region === prd.package.region
              ) {
                packageFound = true;
              }
              if (packageFound && prd.package._id) {
                if (user_details.length !== 0) {
                  if (user_details.user_type === "b2b") {
                    localprice = prd.package.B2B_price;
                  } else if (user_details.user_type === "retail") {
                    localprice = prd.package.Retail_price;
                  } else if (user_details.user_type === "user") {
                    localprice = prd.package.selling_price;
                  } else if (user_details.user_type === null) {
                    localprice = prd.package.selling_price;
                  } else {
                  }
                } else {
                  if (prd.package.selling_price) {
                    localprice = prd.package.selling_price;
                  } else {
                    localprice = prd.package.mrp;
                  }
                }
              } else {
              }
            }
          }
        }
        cartToBeSent.push({
          ...prd.product,
          userQuantity: +prd.preset,
          totalLocalPrice: localprice * +prd.preset,
          package: prd.package,
          groupSlug: prd.product._id + prd.catName.replaceAll(" ", ""),
        });
      });
      setTimeout(() => {
        addGroupData(cartToBeSent);
        localStorage.setItem("groupCart", JSON.stringify(cartToBeSent));
        setTimeout(() => {
          if (cartStatus && item.base_price && cartToBeSent.length > 0) {
            if (orderType === "offline") {
              setFullPageLoading(false);
            } else {
              addGroupToCart(cartToBeSent);
            }
          } else {
            setFullPageLoading(false);
          }
        }, 0);
        if (document.querySelector(".left-group-product").innerHTML === "") {
          document.querySelector(".left-group-product").innerHTML =
            "<p class='no-product-title'>No products Found</p>";
        }
      }, 0);
    }, 0);
  }, [groupProductData]);

  useEffect(() => {
    var localPrice = 0;
    var localQty = 0;
    if (groupDataCart.length > 0) {
      groupDataCart.forEach((data) => {
        localPrice += data.totalLocalPrice;
        localQty += data.userQuantity;
      });
    }
    setTotalQuantity(localQty);
    setTotalPriceCart(groupProductData.base_price || localPrice);
  }, [groupDataCart]);

  const addToCart1 = (passData) => {
    // var cart_data_dt = [];
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    var cart_data_dt = [];
    let localPrice = 0;

    const existInCart = realTimeCart.filter((itm) => itm._id === passData._id);
    var noOfThisItemInCart = 0;
    if (!existInCart || existInCart.length === 0) {
      noOfThisItemInCart = 0;
    } else {
      let newNo = existInCart.map(function (a) {
        return a.noOfThisItemInCart;
      }, 0);
      noOfThisItemInCart = Math.max(newNo);

      // setErrorStatus(true);
      // setMinQtyError(true);
      // setErrorMsg(`ALREADY IN CART`);
      // setTimeout(() => {
      //   setErrorStatus(false);
      // }, 5000);
    }

    setTimeout(() => {
      let unique_id = +new Date()
      realTimeCart.push({...passData,
        unique_id: unique_id});
      //manipulating data to send in API
      realTimeCart.map((item, index) =>
        item.simpleData &&
        item.simpleData.length > 0 &&
        item.TypeOfProduct === "simple"
          ? item.simpleData[0].package
              .filter((dta) => dta.selected == true)
              .map((data, ind) => {
                if (user_details.length !== 0) {
                  if (user_details.user_type === "b2b") {
                    localPrice = data.B2B_price;
                  } else if (user_details.user_type === "retail") {
                    localPrice = data.Retail_price;
                  } else if (
                    user_details.user_type === "user" ||
                    user_details.user_type === null
                  ) {
                    localPrice = data.selling_price;
                  }
                } else {
                  if (data.selling_price) {
                    localPrice = data.selling_price;
                  } else {
                    localPrice = data.packetmrp;
                  }
                }
                cart_data_dt.push({
                  product_categories: item.product_categories || [],
                  product_cat_id: item.product_cat_id
                    ? item.product_cat_id._id
                    : null,
                  product_subCat1_id: item.product_subCat1_id
                    ? item.product_subCat1_id._id
                    : null,
                  preOrder: item.preOrder,
                  preOrderRemainQty: item.preOrderRemainQty,
                  product_id: item._id,
                  product_name: item.product_name,
                  productItemId: data._id,
                  TypeOfProduct: item.TypeOfProduct,
                  packet_size: data.packet_size,
                  packetLabel: data.packetLabel,
                  qty: data.quantity,
                  price: localPrice,
                  totalprice: data.quantity * localPrice,
                  without_package: false,
                });
              })
          : ""
      );

      realTimeCart.map((item, index) => {
        if (item.TypeOfProduct === "simple") {
          if (
            item.simpleData.package === undefined ||
            item.simpleData.package.length === 0
          ) {
            if (user_details.user_type === "b2b") {
              localPrice = item.simpleData[0].RegionB2BPrice;
            } else if (user_details.user_type === "retail") {
              localPrice = item.simpleData[0].RegionRetailPrice;
            } else if (
              user_details.user_type === "user" ||
              user_details.user_type === null
            ) {
              localPrice = item.simpleData[0].RegionSellingPrice;
            }
          } else {
            if (item.selling_price) {
              localPrice = item.simpleData[0].RegionSellingPrice;
            } else {
              localPrice = item.simpleData[0].packetmrp;
            }
          }
          if (item.simpleData) {
            if (item.simpleData.length > 0) {
              if (item.TypeOfProduct === "simple") {
                if (item.simpleData[0].package.length === 0) {
                  cart_data_dt.push({
                    product_categories: item.product_categories || [],
                    product_cat_id: item.product_cat_id
                      ? item.product_cat_id._id
                      : null,
                    product_subCat1_id: item.product_subCat1_id
                      ? item.product_subCat1_id._id
                      : null,
                    product_id: item._id,
                    preOrder: item.preOrder,
                    preOrderRemainQty: item.preOrderRemainQty,
                    product_name: item.product_name,
                    productItemId: item.simpleData[0]._id,
                    TypeOfProduct: item.TypeOfProduct,
                    packet_size: null,
                    packetLabel: null,
                    unitQuantity: item.unitQuantity,
                    unitMeasurement:
                      item.unitMeasurement.name || item.unitMeasurement,
                    qty: item.simpleData[0].userQuantity,
                    price: localPrice,
                    totalprice: item.simpleData[0].userQuantity * localPrice,
                    without_package: true,
                  });
                }
              }
            }
          }
        }
        if (item.TypeOfProduct === "group") {
          noOfThisItemInCart++;
          cart_data_dt.push({
            product_categories: item.product_categories || [],
            ...item,
            product_id: item._id,
            qty: item.qty,
            totalprice: item.qty * item.price,
            without_package: true,
            newlyAdded:true,
            unique_id:item.unique_id,
          });
        }
      });

      if (!minQtyErrors) {
        setLoading(true);
        const requestData1 = {
          user_id: user_details._id,
          CartDetail: [
            {
              product_categories: passData.product_categories || [],
              ...passData,
              product_id: passData._id,
              qty: passData.qty,
              totalprice: passData.qty * passData.price,
              without_package: true,
              newlyAdded:true,
              unique_id:unique_id,
            },
          ],
          // CartDetail: cart_data_dt,
          regionID: localStorage.getItem("selectedRegionId")
            ? JSON.parse(localStorage.getItem("selectedRegionId"))
            : "",
          totalCartPrice: 0,
          subscribe: localStorage.getItem("status")
            ? JSON.parse(localStorage.getItem("status"))
            : false,
        };
        ApiRequest(requestData1, "/addtocart", "POST")
          .then((res) => {
            setFullPageLoading(false);
            if (res.status === 200 || res.status === 201) {
              addToCart([]);
              addToCart(realTimeCart);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              closeGroup();
            } else {
              if (res.data.result === "user_id required") {
                addToCart([]);
                addToCart(realTimeCart);
                localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
                closeGroup();
              } else {
                swal({
                  // title: ,
                  text: res.data.data
                    ? "You can not add " + res.data.data.join("")
                    : "This Item is currently out of stock",
                  icon: "warning",
                  dangerMode: true,
                });
              }
            }
          })
          .then(() => {
            // addToCart([]);
            // addToCart(realTimeCart);
            // localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
            // closeGroup();
          })
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 0);
  };

  const addPriceAndQty = (set, catName, newCart) => {
    let errorsIncluded = false;
    // const cartProduct = groupDataCart.find(
    //   (itm) => itm._id === set.product._id
    // );
    const cartProduct = newCart.find(
      (itm) => itm.groupSlug === set.product._id + catName.replaceAll(" ", "")
    );
    var productObjectToBePassed = {};
    if (cartProduct === undefined) {
      if (set.setminqty > 0) {
        errorsIncluded = true;
        setErrorStatus(true);
        setMinQtyError(true);
        setErrorMsg(
          `Please select atleast ${set.setminqty} qty for ${set.product.product_name}`
        );
        setTimeout(() => {
          setErrorStatus(false);
        }, 5000);
      }
      productObjectToBePassed = {
        ...set,
        price: 0,
        qty: 0,
        without_package: set.package?._id ? false : true,
        unitQuantity: set.package?._id ? null : set.product.unitQuantity,
        unitMeasurement: set.package?._id
          ? null
          : set.product.unitMeasurement.name,
      };
    } else {
      newCart.map((itm) => {
        if (itm.groupSlug === set.product._id + catName.replaceAll(" ", "")) {
          if (set.setminqty > itm.userQuantity) {
            errorsIncluded = true;
            setErrorStatus(true);
            setMinQtyError(true);
            setErrorMsg(
              `Please select atleast ${set.setminqty} qty for ${itm.product_name}`
            );
            setTimeout(() => {
              setErrorStatus(false);
            }, 5000);
          }
          productObjectToBePassed = {
            ...set,
            price: itm.totalLocalPrice,
            qty: itm.userQuantity,
            without_package: set.package?._id ? false : true,
            unitQuantity: set.package?._id ? null : set.product.unitQuantity,
            unitMeasurement: set.package?._id
              ? null
              : set.product.unitMeasurement.name,
          };
        }
      });
    }
    return { productObjectToBePassed, errorsIncluded };
  };

  const addGroupToCart = (cartToBeSent) => {
    var errorsIncluded = false;
    var groupProduct;
    var newCart = cartToBeSent || groupDataCart;
    //replacing old products with cart product and manipulating data
    if (newCart.length > 0) {
      groupProduct = {
        ...groupProductData,
        totalprice: groupProductData.base_price || totalPriceCart,
        price: groupProductData.base_price || totalPriceCart,
        qty: 1,
        base_price: groupProductData.base_price,
        product_id: groupProductData._id,
        groupData: groupProductData.groupData.map((group) => {
          return {
            ...group,
            sets: group.sets.map((set) => {
              const response = addPriceAndQty(set, group.name, newCart);
              if (response.errorsIncluded) {
                errorsIncluded = true;
              }
              return response.productObjectToBePassed;
            }),
          };
        }),
      };
      groupProduct.groupData.forEach((data) => {
        let setMinQty = data.minqty;
        let setMaxQty = data.maxqty;
        var userqty = 0;
        data.sets.forEach((set) => {
          userqty += +set.qty;
        });
        if (setMinQty && userqty < +setMinQty) {
          errorsIncluded = true;
          setErrorStatus(true);
          setErrorMsg(`Minimum quantity for ${data.name} is ${setMinQty}`);
          setTimeout(() => {
            setErrorStatus(false);
          }, 5000);
        } else if (setMaxQty && userqty > +setMaxQty) {
          errorsIncluded = true;
          setErrorStatus(true);
          setErrorMsg(
            `Maximum quantity for ${data.name} available is ${setMaxQty}`
          );
          setTimeout(() => {
            setErrorStatus(false);
          }, 5000);
        }
      });
      setTimeout(() => {
        callAddToCartAPI(errorsIncluded, groupProduct);
      }, 0);
    } else {
      setErrorStatus(true);
      setErrorMsg("<span>Please add Items to proceed</span>");
      setTimeout(() => {
        setErrorStatus(false);
      }, 5000);
    }
  };

  const callAddToCartAPI = (errorsIncluded, groupProduct) => {
    if (!errorsIncluded) {
      if (orderType === "offline") {
        addGroupOffline(groupProduct);
        setTimeout(() => {
          closeGroup();
        }, 0);
      } else {
        addToCart1(groupProduct);
      }
    } else {
      setMinQtyError(false);
      setFullPageLoading(false)
    }
  };

  return (
    <>
      {fullPageLoading ? (
        <div
          className="homepage-loading group-bg-loading"
          style={{ background: "#ffffff63" }}
        >
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
      <div
        className={
          fullPageLoading
            ? "region-popup-container vis-hidden"
            : "region-popup-container"
        }
      >
        <div
          className="group-product-container product-grp-wrap"
          style={{ position: "relative" }}
        >
          {errorStatus ? (
            <div
              className="group-notification"
              dangerouslySetInnerHTML={{ __html: errorMsg }}
            ></div>
          ) : (
            ""
          )}
          <div className="group-heading">
            <h2
              onClick={() => {
                changeAddToCartPopup(!addToCartPopup);
              }}
              style={item.product_name.length > 50 ? { fontSize: 24 } : {}}
            >
              {item.product_name}
            </h2>
            <p
              style={{ cursor: "pointer" }}
              className="group-close-btn"
              onClick={() => {
                addGroupData([]);
                closeGroup();
              }}
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </p>
          </div>
          <div className="group-product-content">
            <div className="left-group-product">
              {item.groupData
                ? item.groupData.map((dta) => {
                    return (
                      <GroupCategory
                        catData={dta}
                        orderType={orderType}
                        errorMsg={(msg) => {
                          setErrorStatus(true);
                          setErrorMsg(msg);
                          setTimeout(() => {
                            setErrorStatus(false);
                          }, 5000);
                        }}
                      />
                    );
                  })
                : ""}
            </div>
            <div className="right-group-product">
              <div
                className="group-title-right"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ color: "white", fontWeight: "700" }}>ITEM CART</p>
                {totalPriceCart > 0 ? <p>₹{totalPriceCart}</p> : ""}
              </div>
              <div
                className="group-right-content"
                style={{ overflowY: "scroll" }}
              >
                {groupDataCart.length > 0
                  ? groupDataCart.map((dta, index) => (
                      <div key={index} style={{ margin: "10px 5px" }}>
                        <div className="group-cart-item">
                          <Link
                            to={"/product/" + dta.slug}
                            style={{ minHeight: 50 }}
                          >
                            <span className="group-cart-img">
                              {dta.images.length > 0 ? (
                                <img
                                  src={imageUrl + dta.images[0].image}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={
                                    imageUrl + localStorage.getItem("prdImg")
                                  }
                                  alt=""
                                />
                              )}
                            </span>
                          </Link>
                          <div
                            className="group-cart-details"
                            style={{ fontSize: 15, marginLeft: 10 }}
                          >
                            <Link to={"/product/" + dta.slug}>
                              <p style={{ margin: 3 }} className="capitalise">
                                {dta.product_name}{" "}
                                {dta.simpleData[0].package.length !== 0 ? (
                                  <span>
                                    {dta.package && dta.package.packetLabel}
                                  </span>
                                ) : (
                                  <span>
                                    {dta.unitQuantity +
                                      " " +
                                      dta.unitMeasurement.name}
                                  </span>
                                )}
                              </p>
                            </Link>

                            <p className="price-bold">
                              Quantity {dta.userQuantity}
                              {groupProductData.base_price ? (
                                <></>
                              ) : (
                                <>
                                  - <span>₹{dta.totalLocalPrice}</span>{" "}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
              <div className="group-button">
                {loading ? (
                  <button>
                    <i
                      className="fa fa-spinner searchLoading"
                      aria-hidden="true"
                    ></i>
                  </button>
                ) : addToCartButtonShow ? (
                  <button onClick={() => addGroupToCart()}>ADD TO CART</button>
                ) : (
                  <p className="text-center">Out of stock currently</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  addGroupData: (data) => dispatch(addGroupData(data)),
  changeAddToCartPopup: (data) => dispatch(changeAddToCartPopup(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Group_Product)
);
