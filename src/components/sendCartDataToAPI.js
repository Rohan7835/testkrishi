import { ApiRequest } from "../apiServices/ApiRequest";

function getCartData(user_details, addToCart) {
  var cartDatabyAPI = [];
  let dtaa = {};
  ApiRequest(dtaa, "/get/addtocart/" + user_details._id, "GET")
    .then((res) => {
      if (res.status === 201 || res.status === 200) {
        res.data.data.cartDetail.map((item) => {
          cartDatabyAPI.push({
            _id: item.product_id._id,
            product_name: item.product_id.product_name,
            preOrderEndDate: item.product_id.preOrderEndDate,
            longDesc: item.product_id.longDesc,
            preOrder: item.preOrder,
            shortDesc: item.product_id.shortDesc,
            preOrderRemainQty: item.preOrderRemainQty,
            attachment: item.product_id.attachment,
            configurableItem: item.configurableItem,
            banner: item.product_id.banner,
            productThreshold: item.product_id.productThreshold,
            productSubscription: item.product_id.productSubscription,
            salesTaxOutSide: item.product_id.salesTaxOutSide,
            salesTaxWithIn: item.product_id.salesTaxWithIn,
            // salesTax: item.product_id.salesTaxWithIn._id,
            purchaseTax: item.product_id.purchaseTax,
            hsnCode: item.product_id.hsnCode,
            priceAfterDiscount: "",
            unitMeasurement:
              item.unitMeasurement || item.product_id.unitMeasurement,
            TypeOfProduct: item.product_id.TypeOfProduct,
            SKUCode: item.product_id.SKUCode,
            __v: item.product_id.__v,
            created_at: item.product_id.created_at,
            status: item.product_id.status,
            hsnCode: item.product_id.hsnCode,
            inhouseQuantity: +item.product_id.inhouseQuantity,
            lostQuantity: +item.product_id.lostQuantity,
            bookingQuantity: +item.product_id.bookingQuantity,
            productQuantity: +item.product_id.productQuantity,
            availableQuantity: +item.product_id.availableQuantity,
            slug: item.slug,
            ProductRegion: item.product_id.ProductRegion,
            relatedProduct: item.product_id.relatedProduct,
            configurableData: item.configurableItem,
            images: item.product_id.images,
            base_price: item.base_price,
            product_categories:
              item.product_categories ||
              item.product_id.product_categories ||
              [],
            qty: item.qty,
            price: item.price ? item.price : 0,
            totalprice: item.totalprice ? item.totalprice : 0,
            unitQuantity: item.unitQuantity,
            groupData: item.product_id.groupData,
            variant_name: item.configurableItem.variant_name,
            simpleData:
              item.TypeOfProduct === "simple"
                ? item.simpleItem.packet_size
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
                    ]
                : [],
          });
        });
        addToCart(cartDatabyAPI);
        localStorage.setItem("cartItem", JSON.stringify(cartDatabyAPI));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendCartDataToAPI(cart, user_details, addToCart) {
  var cart_data_dt = [];
  let localPrice = 0;

  cart.map((item, index) =>
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
              product_categories:
                item.product_categories?.length > 0
                  ? item.product_categories
                  : [],
              product_cat_id: item.product_cat_id
                ? item.product_cat_id._id
                : null,
              product_subCat1_id: item.product_subCat1_id
                ? item.product_subCat1_id._id
                : null,
              product_id: item._id,
              preOrder: item.preOrder,
              subscribe: item.productSubscription,
              preOrderRemainQty: item.preOrderRemainQty,
              product_name: item.product_name,
              productItemId: data._id,
              TypeOfProduct: item.TypeOfProduct,
              packet_size: data.packet_size,
              unitMeasurement: item.unitMeasurement,
              packetLabel: data.packetLabel,
              qty: data.quantity,
              price: localPrice,
              totalprice: data.quantity * localPrice,
              without_package: false,
            });
          })
      : ""
  );

  cart.map((item, index) => {
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
                product_categories:
                  item.product_categories?.length > 0
                    ? item.product_categories
                    : [],
                product_cat_id: item.product_cat_id
                  ? item.product_cat_id._id
                  : null,
                preOrder: item.preOrder,
                preOrderRemainQty: item.preOrderRemainQty,
                subscribe: item.productSubscription,
                // preOrder
                product_subCat1_id: item.product_subCat1_id
                  ? item.product_subCat1_id._id
                  : null,
                product_id: item._id,
                product_name: item.product_name,
                productItemId: item.simpleData[0]._id,
                TypeOfProduct: item.TypeOfProduct,
                packet_size: null,
                packetLabel: null,
                unitQuantity: item.unitQuantity,
                unitMeasurement: item.unitMeasurement,
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
      cart_data_dt.push({
        product_categories: item.product_categories || [],
        ...item,
        product_id: item._id,
        qty: item.qty,
        unique_id: item.unique_id || "",
        totalprice: item.qty * item.price,
        without_package: true,
      });
    }
    if (item.TypeOfProduct === "configurable") {
      cart_data_dt.push({
        ...item,
        product_cat_id: null,
        product_subCat1_id: null,
        product_id: item._id,
        preOrder: false,
        preOrderRemainQty: item.preOrderRemainQty,
        product_name: item.product_name,
        productItemId: null,
        TypeOfProduct: "configurable",
        unitQuantity: item.unitQuantity,
        unitMeasurement: item.unitMeasurement,
        qty: item.qty,
        price: item.price,
        totalprice: item.price * item.qty,
        without_package: null,
        variant_name: item.variant_name,
      });
    }
  });
  const requestData = {
    user_id: user_details._id,
    CartDetail: cart_data_dt,
    regionID: localStorage.getItem("selectedRegionId")
      ? JSON.parse(localStorage.getItem("selectedRegionId"))
      : "",
    subscribe: localStorage.getItem("status")
      ? JSON.parse(localStorage.getItem("status"))
      : false,
    totalCartPrice: 0,
  };
  return ApiRequest(requestData, "/addtocart", "POST")
    .then((res) => {
      if (res.data.message === "error") {
        getCartData(user_details, addToCart);
      }
      return res;
    })
    .catch((err) => console.log(err));
}

export default sendCartDataToAPI;
