import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { imageUrl } from "../../imageUrl";
import { addGroupData, userdetails } from "../../redux/actions/actions";

function GroupItem({
  item,
  user_details,
  groupDataCart,
  addGroupData,
  errorMsg,
  categoryName,
  orderType,
}) {
  const [quantity, setQuantity] = useState(0);
  const [firstTimeLoad, setFirstTimeLoad] = useState(true);
  const [price, setPrice] = useState(0);
  const [actualOneprice, setActualOneprice] = useState(0);
  const [label, setLabel] = useState("");
  const [withPackage, setWithPackage] = useState(false);
  const [showProduct, setShowProduct] = useState(true);

  useEffect(() => {
    //setting quantity to min quantity by default
    if (+item.preset > 0 && firstTimeLoad && !item.product.outOfStock) {
      setQuantity(+item.preset);
    }

    //calculacting price according to user type
    var localprice = 0;
    if (item.product.TypeOfProduct === "simple") {
      if (item.product.simpleData[0]) {
        if (item.package === "" || item.package === null) {
          if (user_details.length !== 0) {
            if (user_details.user_type === "b2b") {
              localprice = item.product.simpleData[0].RegionB2BPrice;
            } else if (user_details.user_type === "retail") {
              localprice = item.product.simpleData[0].RegionRetailPrice;
            } else if (user_details.user_type === "user") {
              localprice = item.product.simpleData[0].RegionSellingPrice;
            } else if (user_details.user_type === null) {
              localprice = item.product.simpleData[0].RegionSellingPrice;
            } else {
            }
          } else {
            if (item.product.simpleData[0].RegionSellingPrice) {
              localprice = item.product.simpleData[0].RegionSellingPrice;
            } else {
              localprice = item.product.simpleData[0].mrp;
            }
          }
        } else {
          var packageFound = false;
          if (
            item.product.simpleData &&
            item.product.simpleData[0].region === item.package.region
          ) {
            packageFound = true;
          }
          setWithPackage(true);
          if (packageFound && item.package._id) {
            setLabel(item.package.packetLabel);
            if (user_details.length !== 0) {
              if (user_details.user_type === "b2b") {
                localprice = item.package.B2B_price;
              } else if (user_details.user_type === "retail") {
                localprice = item.package.Retail_price;
              } else if (user_details.user_type === "user") {
                localprice = item.package.selling_price;
              } else if (user_details.user_type === null) {
                localprice = item.package.selling_price;
              } else {
              }
            } else {
              if (item.package.selling_price) {
                localprice = item.package.selling_price;
              } else {
                localprice = item.package.mrp;
              }
            }
          } else {
            setShowProduct(false);
          }
        }
      }
    }
    setPrice(
      localprice ? (+item.preset ? +localprice * +item.preset : +localprice) : 0
    );
    setActualOneprice(localprice || 0);

    //setting label
    if (item.product.TypeOfProduct === "simple") {
      item.product.userQuantity = quantity;
      item.product.totalLocalPrice = actualOneprice;
      if (item.product.simpleData[0]) {
        if (item.product.simpleData[0].package.length === 0) {
          setLabel(item.product.unitMeasurement.name);
        }
      }
    }
    setTimeout(() => {
      if (+item.preset > 0 && firstTimeLoad) {
        setFirstTimeLoad(false);
      }
    }, 0);
  }, [item]);

  //decrease quantity
  const decreaseQuantity = () => {
    let localQuantity;
    if (+quantity !== 0) {
      localQuantity = quantity - 1;
      setQuantity(localQuantity);
      item.product.userQuantity = localQuantity;
      if (localQuantity !== 0) {
        setPrice(actualOneprice * localQuantity);
        // let itemAlreadyInCart = groupDataCart.find(
        //   (itm) => itm._id === item.product._id
        // );
        let itemAlreadyInCart = groupDataCart.find(
          (itm) => itm.groupSlug === item.product.groupSlug
        );

        //adding Item to groupCart
        if (itemAlreadyInCart === undefined) {
          addGroupData([...groupDataCart, item.product]);
          localStorage.setItem(
            "groupCart",
            JSON.stringify([...groupDataCart, item.product])
          );
        } else {
          const modifiedQuantity = groupDataCart.map((data) => {
            if (data.groupSlug === item.product.groupSlug) {
              data.userQuantity = localQuantity;
              data.totalLocalPrice = actualOneprice * localQuantity;
            }
            return data;
          });
          addGroupData([]);
          addGroupData(modifiedQuantity);
          localStorage.setItem("groupCart", JSON.stringify(modifiedQuantity));
        }
      } else {
        //removing item if quantity is 0
        let itemInCart = groupDataCart.filter(
          (itm) => itm._id !== item.product._id
        );
        addGroupData([]);
        if (itemInCart && itemInCart.length > 0) {
          addGroupData(itemInCart);
        }
      }
    }
  };

  //increase quantity
  const increaseQuantity = () => {
    let localQuantity;
    if (quantity !== item.setmaxqty) {
      localQuantity = quantity + 1;
      setQuantity(localQuantity);
      setPrice(actualOneprice * localQuantity);
      item.product.userQuantity = localQuantity;
      item.product.totalLocalPrice = actualOneprice * localQuantity;
      item.product.package = item.package;
      item.product.groupSlug =
        item.product._id + categoryName.replaceAll(" ", "");

      // let itemAlreadyInCart = groupDataCart.find(
      //   (itm) => itm._id === item.product._id
      // );
      let itemAlreadyInCart = groupDataCart.find(
        (itm) =>
          itm.groupSlug === item.product._id + categoryName.replaceAll(" ", "")
      );

      //adding Item to groupCart
      if (itemAlreadyInCart === undefined) {
        addGroupData([...groupDataCart, item.product]);
        localStorage.setItem(
          "groupCart",
          JSON.stringify([...groupDataCart, item.product])
        );
      } else {
        const modifiedQuantity = groupDataCart.map((data) => {
          if (
            data.groupSlug ===
            item.product._id + categoryName.replaceAll(" ", "")
          ) {
            data.userQuantity = localQuantity;
            data.totalLocalPrice = actualOneprice * localQuantity;
          }
          return data;
        });
        addGroupData([]);
        addGroupData(modifiedQuantity);

        localStorage.setItem("groupCart", JSON.stringify(modifiedQuantity));
      }
    } else {
      errorMsg(
        `Maximum quantity allowed for <span>${item.product.product_name}</span> is <span>${item.setmaxqty}</span>.`
      );
    }
  };

  return price !== null
    ? showProduct && (
        <div className="group-product">
          <div className="flex">
            <div className="group-item-image" style={{ flex: "1" }}>
              {item.product.images.length > 0 ? (
                <img src={imageUrl + item.product.images[0].image} alt="" />
              ) : (
                <img src={imageUrl + localStorage.getItem("prdImg")} alt="" />
              )}
            </div>
            <div
              className="group-item-right"
              style={{ flex: "4", marginLeft: 10 }}
            >
              <div className="grp-head-na">
                <p className="pr-group-name">
                  {item.product.product_name}{" "}
                  {item.product.soldInRegion ? (
                    withPackage ? (
                      <span>{`${item.package.packetLabel}`}</span>
                    ) : (
                      <span>{`${item.product.unitQuantity} ${label}`}</span>
                    )
                  ) : (
                    <span>{`${item.package.packetLabel}`}</span>
                  )}
                </p>
              </div>
              {+item.preset > 0 ? "" : <p className="price">₹{price}</p>}
              {item.product.soldInRegion ? (
                !+item.preset ? (
                  <div className="group-product-quantity">
                    <p
                      className="change-quantity-product"
                      onClick={() => {
                        if (item.product.outOfStock === false) {
                          decreaseQuantity();
                        }
                      }}
                    >
                      -
                    </p>
                    <p>{quantity}</p>
                    <p
                      className="change-quantity-product"
                      onClick={() => {
                        if (item.product.outOfStock === false) {
                          increaseQuantity();
                        }
                      }}
                    >
                      +
                    </p>
                  </div>
                ) : (
                  ""
                )
              ) : (
                <p className="err">Currently not available in your area</p>
              )}
            </div>
          </div>
          {item.product.soldInRegion && item.product.outOfStock ? (
            <p style={{ color: "red", fontWeight: 400, marginTop: 4 }}>
              Out of stock
            </p>
          ) : (
            ""
          )}
        </div>
      )
    : "";
}
const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addGroupData: (data) => dispatch(addGroupData(data)),
  userdetails: (data) => dispatch(userdetails(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GroupItem)
);
