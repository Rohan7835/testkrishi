import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/cart.css";
import { imageUrl } from "../../imageUrl";
import {
  addToCart,
  changeDelivery,
  quantityChange,
} from "../../redux/actions/actions";
import sendCartDataToAPI from "../sendCartDataToAPI";

const Cart = ({
  hideCart,
  renderParent,
  updateCart,
  deliveryInfo,
  cartItemQuantity,
  user_details,
  changeDelivery,
  dataInCart,
  addToCart,
  quantityChange,
}) => {
  const [minimumOrderValue, setMinimumOrderValue] = useState(
    deliveryInfo.MOQ === "yes" ? +deliveryInfo.MOQ_Charges || 0 : 0
  );
  const [loading, setLoading] = useState(false);

  var totalPrice = 0;

  useEffect(() => {
    renderParent();
    getPincodeDetails();
  }, []);

  useEffect(() => {
    // setMinimumOrderValue(
    //   localStorage.getItem("regionDetails")
    //     ? JSON.parse(localStorage.getItem("regionDetails"))
    //         .districMinimumOrderValue
    //     : 0
    // );
  }, [localStorage.getItem("regionDetails")]);

  //removing deleted item from items state
  const removeItemFromCart = async (removedItem) => {
    const newItemsArray = dataInCart.filter((itm) => {
      if (itm !== removedItem) {
        return itm;
      }
    });
    addToCart([]);
    addToCart(newItemsArray);
    quantityChange(!cartItemQuantity);
    localStorage.setItem(
      "cartItem",
      Array.isArray(newItemsArray)
        ? JSON.stringify(newItemsArray)
        : JSON.stringify([newItemsArray])
    );
    await sendCartDataToAPI(newItemsArray, user_details, addToCart)
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  //storing new data from items state to local
  // useEffect(() => {
  //   addToCart(items);
  //   updateCart && updateCart();
  // }, [items]);

  const increaseQuantity = async (i) => {
    setLoading(true);
    let err;
    let errorsPresent = false;
    var localDataInCart = [...dataInCart];
    if (i.TypeOfProduct !== "group") {
      if (i.simpleData[0].package) {
        let selLabel = i.simpleData[0].package.filter((a) => a.selected);
        err = document.querySelector(
          "#" +
            i.slug +
            selLabel[0].packetLabel
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "")
        );
      } else {
        err = document.querySelector("#" + i.slug);
      }
    } else {
      err = document.querySelector("#" + i.slug);
    }
    localDataInCart.map((itm) => {
      if (itm === i) {
        var avail = itm.simpleData[0]
          ? typeof itm.simpleData[0].availQuantity === "object"
            ? +itm.simpleData[0].availQuantity.$numberDecimal
            : +itm.simpleData[0].availQuantity
          : 0;
        itm.TypeOfProduct === "simple"
          ? itm.simpleData[0].package[0]
            ? itm.simpleData[0].package.forEach((pck) => {
                if (pck.selected) {
                  avail = avail / +pck.packet_size;
                  if (avail >= +pck.quantity + 1) {
                    pck.quantity = pck.quantity + 1;
                  } else {
                    pck.quantity = pck.quantity;
                    err.innerHTML = `${avail} Units currently in
                    stock`;
                    err.style.display = "block";
                    errorsPresent = true;
                  }
                }
              })
            : avail > itm.simpleData[0].userQuantity
            ? (itm.simpleData[0].userQuantity += 1)
            : (err.style.display = "block")
          : (itm.qty = itm.qty + 1);
      }
    });
    if (!errorsPresent) {
      await sendCartDataToAPI(localDataInCart, user_details, addToCart)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            addToCart([]);
            addToCart(localDataInCart);
            setTimeout(() => {
              quantityChange(!cartItemQuantity);
            }, 50);
            localStorage.setItem("cartItem", JSON.stringify(localDataInCart));
          } else {
            swal({
              title: "Error",
              text: res.data.data,
              icon: "warning",
            });
            if (i.TypeOfProduct === "group") {
              localDataInCart.map((itm) => {
                if (itm === i) {
                  itm.TypeOfProduct !== "simple" && (itm.qty = itm.qty - 1);
                }
              });
            }
          }
        })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setLoading(false);
    }
    setTimeout(() => {
      if (err) {
        err.style.display = "none";
      }
    }, 3500);
  };

  const decreaseQuantity = async (i) => {
    setLoading(true);
    dataInCart.map((itm) => {
      if (itm === i) {
        if (itm.TypeOfProduct === "simple") {
          itm.simpleData[0].package[0]
            ? itm.simpleData[0].package.map((pck) => {
                if (pck.selected) {
                  if (pck.quantity > 1) {
                    pck.quantity = pck.quantity - 1;
                  }
                }
              })
            : itm.simpleData[0].userQuantity !== 1 &&
              (itm.simpleData[0].userQuantity -= 1);
        } else {
          if (itm.qty !== 1) {
            return (itm.qty = itm.qty - 1);
          }
        }
      }
    });
    addToCart([]);
    addToCart(dataInCart);
    quantityChange(!cartItemQuantity);
    localStorage.setItem("cartItem", JSON.stringify(dataInCart));

    await sendCartDataToAPI(dataInCart, user_details, addToCart)
      .then((res) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPincodeDetails = () => {
    const regionDetails = JSON.parse(localStorage.getItem("regionDetails"));
    const freshrequestdata = {
      pincode: regionDetails?.pincode,
    };
    ApiRequest(freshrequestdata, "/pincode/one", "POST")
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          changeDelivery(res.data.data || {});
          setMinimumOrderValue(
            res.data.data.MOQ === "yes" ? +res.data.data.MOQ_Charges || 0 : 0
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const hideCartAll = () => {
    hideCart();
  };

  return (
    <div className="cart-container">
      <div className="cart-overlay" onClick={hideCart}></div>
      <div className="cart">
        <div className="cart-header">
          <h3>
            Shopping Cart{" "}
            {loading ? (
              <i
                className="fa fa-spinner searchLoading ml-2"
                aria-hidden="true"
              ></i>
            ) : (
              ""
            )}
          </h3>
          <div className="cross" onClick={hideCart}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </div>
        </div>
        {loading ? (
          <div className="side-cart-overlay">
            {/* <div className="side-cart-loading">
              <ReactLoading
                type={"bubbles"}
                color={"#febc15"}
                height={"50px"}
                width={"100px"}
              />
            </div> */}
          </div>
        ) : (
          ""
        )}
        <div
          className="cart-items new_cart_itms"
          style={dataInCart.length >= 3 ? { overflowY: "scroll" } : {}}
        >
          {dataInCart.length > 0 ? (
            dataInCart.map((itm, ix) => {
              //storing group data items
              let groupItem = [];
              itm.groupData &&
                itm.groupData.map((group) => {
                  group.sets.map((set) => {
                    if (set.qty && set.qty > 0) {
                      groupItem.push({
                        name: set.product.product_name,
                        package: set.package?._id
                          ? set.package.packetLabel
                          : set.unitQuantity + " " + set.unitMeasurement,
                        qty: set.qty,
                        price: set.price,
                      });
                    }
                  });
                });

              //selectedPck
              let selLabel =
                itm.simpleData[0] &&
                itm.simpleData[0].package.filter((a) => a.selected);

              //storing quantity in variable
              const quantity =
                itm.TypeOfProduct === "simple"
                  ? itm.simpleData[0].package[0]
                    ? itm.simpleData[0].package.map((pck) => {
                        if (pck.selected) {
                          return pck.quantity;
                        }
                      })
                    : itm.simpleData[0].userQuantity
                  : itm.qty;
              const quanChck = Array.isArray(quantity)
                ? quantity.join("")
                : +quantity;
              //storing price
              var price =
                itm.TypeOfProduct === "simple"
                  ? itm.simpleData[0] === undefined ||
                    (itm.simpleData[0].package[0]
                      ? itm.simpleData[0].package.map((pck) => {
                          let localPrice = null;
                          if (pck.selected) {
                            if (user_details.length !== 0) {
                              if (user_details.user_type === "b2b") {
                                localPrice = pck.B2B_price;
                              } else if (user_details.user_type === "retail") {
                                localPrice = pck.Retail_price;
                              } else if (
                                user_details.user_type === "user" ||
                                user_details.user_type === null
                              ) {
                                localPrice = pck.selling_price;
                              }
                            } else {
                              if (pck.selling_price) {
                                localPrice = pck.selling_price;
                              } else {
                                localPrice = pck.packetmrp;
                              }
                            }
                          }
                          return localPrice;
                        })
                      : user_details.length !== 0
                      ? user_details.user_type === "b2b"
                        ? itm.simpleData[0].RegionB2BPrice
                        : user_details.user_type === "retail"
                        ? itm.simpleData[0].RegionRetailPrice
                        : user_details.user_type === "user"
                        ? itm.simpleData[0].RegionSellingPrice
                        : user_details.user_type === null
                        ? itm.simpleData[0].RegionSellingPrice
                        : ""
                      : itm.simpleData[0].RegionSellingPrice
                      ? itm.simpleData[0].RegionSellingPrice
                      : itm.simpleData[0].mrp)
                  : itm.price;
              Array.isArray(price)
                ? (price = price.join(""))
                : (price = +price);

              //calculating total price of all items added
              totalPrice +=
                parseInt(price) *
                (Array.isArray(quantity) ? quantity.join("") : +quantity);
              const image =
                itm.images && itm.images.length > 0 ? (
                  <img src={imageUrl + itm.images[0].image} alt="image7" />
                ) : (
                  <img
                    src={imageUrl + localStorage.getItem("prdImg")}
                    alt="image85"
                  />
                );
              return (
                <div className="cart-item" key={ix}>
                  <Link to={"/product/" + itm.slug}>
                    <span className="cart-side-img">{image}</span>
                  </Link>
                  <div className="cart-details">
                    <Link to={"/product/" + itm.slug}>
                      <p style={{ margin: 3 }} className="capitalise">
                        {itm.product_name}
                      </p>

                      <p className="price-bold">
                        ₹
                        {parseInt(price) *
                          (Array.isArray(quantity)
                            ? quantity.join("")
                            : quantity)}
                      </p>
                      {/* per unit price hidden */}
                      {/* <p style={{ margin: 3 }}>₹{parseInt(price)}</p> */}
                    </Link>

                    <span className="qty_side_cart">
                      {itm.TypeOfProduct !== "simple"
                        ? ""
                        : itm.simpleData[0].package[0]
                        ? itm.simpleData[0].package.map((pck) => {
                            if (pck.selected) {
                              return pck.packetLabel;
                            }
                          })
                        : (itm.unitQuantity ? itm.unitQuantity : 1) +
                          " " +
                          (itm.unitMeasurement && itm.unitMeasurement.name
                            ? itm.unitMeasurement.name
                            : itm.unitMeasurement)}
                    </span>
                    <button className="cart-btn">
                      {quanChck === 1 || quanChck === "1" ? (
                        <p
                          onClick={() => removeItemFromCart(itm)}
                          style={{ lineHeight: "23px" }}
                        >
                          <i
                            className="fa fa-trash"
                            aria-hidden="true"
                            style={{ fontSize: 15, color: "white" }}
                          ></i>
                        </p>
                      ) : (
                        <p onClick={() => decreaseQuantity(itm)}>-</p>
                      )}

                      {/* <p onClick={() => decreaseQuantity(itm)}>-</p> */}
                      <span>{quantity}</span>
                      <p onClick={() => increaseQuantity(itm)}>+</p>
                    </button>
                    {itm.TypeOfProduct === "group" ? (
                      <ul>
                        {groupItem.map((group) => {
                          return (
                            <li
                              style={{
                                textTransform: "capitalize",
                                listStyle: "none",
                                color: "gray",
                                padding: "2px 0px",
                                fontSize: "13px",
                              }}
                            >
                              {group.name}-{group.package}-{" "}
                              {itm.base_price
                                ? " "
                                : "( ₹" + group.price + " )"}{" "}
                              [{group.qty}]
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      ""
                    )}
                    {console.log("dsfsdf", itm.simpleData[0])}
                    <span
                      style={{ color: "#da3131", display: "none" }}
                      id={
                        itm.simpleData[0]
                          ? itm.simpleData[0].package.length > 0
                            ? itm.slug +
                              selLabel[0].packetLabel
                                .toLowerCase()
                                .replace(/ /g, "-")
                                .replace(/[^\w-]+/g, "")
                            : itm.slug
                          : itm.slug
                      }
                    >
                      {itm.AvailableQuantity.$numberDecimal} Units currently in
                      stock
                    </span>
                  </div>
                  <div
                    className="cart-remove"
                    onClick={() => removeItemFromCart(itm)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Your cart is empty</p>
          )}

          {localStorage.getItem("freepackage") &&
          localStorage.getItem("freeproduct") ? (
            <tr>
              <td className="pointer">
                <div className="cart_itm_image">
                  {/* {JSON.parse(localStorage.getItem("freeproduct")).BookingQuantity} */}
                  <img
                    src={
                      imageUrl +
                      JSON.parse(localStorage.getItem("freeproduct")).images[0]
                        .image
                    }
                    alt=""
                  />
                </div>
              </td>
              <td>
                <div className="pro-cart-name" style={{ position: "relative" }}>
                  <h4 className="capitalise">
                    {
                      JSON.parse(localStorage.getItem("freeproduct"))
                        .product_name
                    }
                  </h4>
                  <p style={{ margin: 2 }}>Free</p>
                  <p style={{ margin: 2 }}>
                    {
                      JSON.parse(localStorage.getItem("freepackage"))
                        .packetLabel
                    }{" "}
                    - {"1"}
                  </p>
                </div>
              </td>
            </tr>
          ) : null}
        </div>
        {dataInCart.length > 0 && totalPrice < +minimumOrderValue ? (
          <p style={{ color: "red" }}>
            Min Order Value should be ₹{+minimumOrderValue}
          </p>
        ) : (
          ""
        )}
        {dataInCart.length > 0 ? (
          totalPrice >= +minimumOrderValue ? (
            <Link to="/cart">
              <button
                className="proceed-cart-section"
                onClick={hideCartAll}
                style={{ cursor: "pointer" }}
              >
                <p>Proceed to checkout</p>
                <p>₹{totalPrice}</p>
              </button>
            </Link>
          ) : (
            <button
              className="proceed-cart-section"
              style={{ cursor: "no-drop" }}
            >
              <p>Proceed to checkout</p>
              <p>₹{totalPrice}</p>
            </button>
          )
        ) : (
          <>
            <button
              className="proceed-cart-section"
              onClick={hideCartAll}
              style={{ cursor: "not-allowed" }}
            >
              <p>Cart Empty</p>
              <p>₹{totalPrice}</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  quantityChange: (data) => dispatch(quantityChange(data)),
  changeDelivery: (data) => dispatch(changeDelivery(data)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
