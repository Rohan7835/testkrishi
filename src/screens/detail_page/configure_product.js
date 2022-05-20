import React from "react";
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Link } from "react-router-dom";
import Slider from "react-slick";
import swal from "sweetalert";
// import staticLogo from "../../assets/img/default-banner.jpg";
import { addToCart, userdetails } from "../../../src/redux/actions/actions";
import { ApiRequest } from "../../apiServices/ApiRequest";
import Cart from "../../components/Cart/Cart";
import GroupProduct from "../../components/Group/Group_Product";
import { imageUrl } from "../../components/imgUrl";

var feat_slider1 = {
  dots: false,
  arrows: true,
  infinite: false,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 767,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
      },
    },
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ],
};

class configure_product extends React.Component {
  constructor(props) {
    super(props);
    if (JSON.parse(localStorage.getItem("selectedRegionId"))) {
    } else {
      this.props.history.push("/");
    }
    var path = this.props.location.pathname;
    var product_id = path.split("/")[2];
    this.state = {
      product_data: [],
      showFirstPriceOnLoad: true,
      quantity: 0,
      openCart: false,
      cartItems: this.props.dataInCart ? this.props.dataInCart : [],
      relatedProducts: [],
      outOfStock: false,
      categoriesName: [],
      redirect: "",
      loading: true,
      openGroupProduct: false,
      groupProductData: {},
      variant_data: [],
      variant_price: [],
      selected_variants: [],
    };
    let requestData = {
      RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
      product_id: null,
      product_name: product_id,
    };
    ApiRequest(requestData, "/GetProductByregionAndProductId", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let pricesArr = [];
          res.data.data[0].configurableData.forEach((data) => {
            let localPrice = 0;
            if (this.props.user_detials) {
              if (this.props.user_details.user_type === "b2b") {
                localPrice = data.B2B_price;
              } else if (this.props.user_details.user_type === "retail") {
                localPrice = data.Retail_price;
              } else if (
                this.props.user_details.user_type === "user" ||
                this.props.user_details.user_type === null
              ) {
                localPrice = data.selling_price;
              }
            } else {
              localPrice = data.selling_price;
            }
            if (pricesArr.filter((price) => price === localPrice).length >= 1) {
            } else {
              pricesArr.push(localPrice);
            }
          });
          this.setState({
            product_data: res.data.data[0],
            relatedProducts: res.data.data[0].relatedProduct,
            variant_data: res.data.data[0].attributes,
            // variant_price: [50, 20, 10, 80],
            variant_price: pricesArr,
          });
          let categories = [];
          if (res.data.data[0].product_categories.length !== 0) {
            res.data.data[0].product_categories.forEach((cat) => {
              if (cat.category_name.toLowerCase() !== "featured products") {
                categories.push(cat.category_name);
              }
              if (cat.ancestors.length > 0) {
                cat.ancestors.forEach((an) => {
                  if (an.category_name.toLowerCase() !== "featured products") {
                    categories.push(an.category_name);
                  }
                });
              }
            });
          }
          let unique = [...new Set(categories)]; //removing duplicate categories
          this.setState({ categoriesName: unique });
        } else {
        }
        this.setState({ loading: false });
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }, 0);
      })
      .then(() => {
        var final_ddda = [];
        this.state.product_data.configerableData === undefined ||
          this.state.product_data.configerableData.map((item, index) => {
            var daat = [];
            item.variant_id.map((data, indexing) => {
              if (indexing === 0) {
                data.selected = true;
              } else {
                data.selected = false;
              }
              if (!data.quantity) {
                data.quantity = 1;
              }
              daat.push(
                data.variantId.item.filter(
                  (item1) => item1._id === data.variantItem
                )[0]
              );
            });
            var new_fiu_data = "";
            daat.map((itemqw, indexqw) => {
              new_fiu_data =
                indexqw === 0
                  ? new_fiu_data + itemqw.item_name
                  : new_fiu_data + " " + itemqw.item_name;
            });
            final_ddda.push({ _id: item._id, item: new_fiu_data });
            this.setState({
              product_variants: final_ddda,
            });

            if (index === 0) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          });

        //adding selected property to related product
        this.state.relatedProducts &&
          this.state.relatedProducts.map((product) => {
            
          });
      })
      .then(() => {
        this.calculateQuantityInCart();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
      window.location.reload();
    });
  }
  calculateQuantityInCart = () => {
    let cartData = [];
    var itm = this.state.product_data;
    //looping throught cart and pushing them in cartData array with its packages quantity and normal quantity
    this.props.dataInCart.forEach((item) => {
      var quantity = 0;
      var selectedPck = [];
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
            packages: selectedPck,
          });
        }
      } else {
        cartData.push({
          _id: item._id,
          withoutpackagequantity: quantity,
          packages: selectedPck,
        });
      }
    });
    if (cartData.length > 0) {
      if (
        cartData.filter((i) => {
          return i._id === itm._id;
        }).length > 0
      ) {
        cartData.map((cartItem) => {
          if (cartItem._id === itm._id) {
          
          }
        });
      } else {
      }
    } else {
      if (this.state.product_data.simpleData) {
        if (this.state.product_data.simpleData[0].package[0]) {
          this.state.product_data.simpleData[0].package.map((pck, index) => {
            this.setState({ quantity: 0 });
            return (pck.quantity = 0);
          });
        } else {
          this.state.product_data.simpleData[0].userQuantity = 0;
          this.setState({ quantity: 0 });
        }
      }
    }
    setTimeout(() => {
      this.forceUpdate();
    });
  };
  componentWillUnmount() {
    this.unlisten();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.cartItemQuantity !== this.props.cartItemQuantity) {
      this.calculateQuantityInCart();
    }
  }

  handleChange = (e) => {
    const selectedPrice = e.target.value;
    const id = e.target.id;
    const product = this.state.product_data;
    this.setState({
      showFirstPriceOnLoad: false,
    });

    if (this.state.product_data.TypeOfProduct === "simple") {
      product.simpleData[0].package.map((pck) => (pck.selected = false));
      product.simpleData[0].package.map((pck) => {
        if (pck._id === selectedPrice) {
          pck.selected = true;
        }
      });
    } else {
      //making selected value false of previously selected item
      product.configerableData.map((pck) => {
        pck.selected = false;
      });

      //adding value true to selected item
      product.configerableData.map((pck) => {
        if (pck.sellingPrice === selectedPrice) {
          pck.selected = true;
        }
      });
    }

    this.setState({
      product_data: product,
      quantity: 0,
    });
    setTimeout(() => {
      this.calculateQuantityInCart();
    }, 0);
  };

  hideCart = () => {
    this.setState({
      openCart: false,
    });
  };
  sendCartDataToApi = () => {
    var cart_data_dt = [];
    let localPrice = 0;

    this.props.dataInCart.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package
            .filter((dta) => dta.selected == true)
            .map((data, ind) => {
              if (this.props.user_details.length !== 0) {
                if (this.props.user_details.user_type === "b2b") {
                  localPrice = data.B2B_price;
                } else if (this.props.user_details.user_type === "retail") {
                  localPrice = data.Retail_price;
                } else if (
                  this.props.user_details.user_type === "user" ||
                  this.props.user_details.user_type === null
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
        : (localPrice = item.totalprice)
    );

    this.props.dataInCart.map((item, index) => {
      if (item.TypeOfProduct === "simple") {
        if (this.props.user_details.length !== 0) {
          if (this.props.user_details.user_type === "b2b") {
            localPrice = item.simpleData[0].RegionB2BPrice;
          } else if (this.props.user_details.user_type === "retail") {
            localPrice = item.simpleData[0].RegionRetailPrice;
          } else if (
            this.props.user_details.user_type === "user" ||
            this.props.user_details.user_type === null
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
      } else {
        localPrice = item.totalPrice;
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
      if (item.TypeOfProduct === "group"  || item.TypeOfProduct === "configurable") {
        cart_data_dt.push({
          product_categories: item.product_categories || [],
          ...item,
          product_id: item._id,
          qty: item.qty,
          totalprice: item.qty * item.price,
          without_package: true,
        });
      }
    });
    const requestData = {
      user_id: this.props.user_details._id,
      CartDetail: cart_data_dt,
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
        if (res.status === 400 || res.status === 401) {
          if (res.data.message === "error") {
            let newCartModifying = this.props.dataInCart;
            const newItemsArray = newCartModifying.filter((itm) => {
              if (itm._id !== this.state.product_data._id) {
                return itm;
              }
            });
            // if (
            //   typeof newCartModifying === "object" &&
            //   newCartModifying !== null
            // ) {
            //   newCartModifying = [newCartModifying];
            // }
            if (newItemsArray !== undefined) {
              this.props.addToCart(newItemsArray);
              localStorage.setItem("cartItem", JSON.stringify(newItemsArray));
            } else {
              this.props.addToCart([]);
              localStorage.setItem("cartItem", []);
            }

            this.setState({
              cartItems: this.props.dataInCart ? this.props.dataInCart : [],
            });
            swal({
              // title: ,
              text: "This Item is currently out of stock",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });

    localStorage.setItem("coupon_code", "");
    localStorage.setItem("freepackage", "");
    localStorage.setItem("freeproduct", "");
    localStorage.setItem("couponStatus", 2);
    localStorage.setItem("discount_amount", "");
    this.forceUpdate();
  };
  subtractFromCart = (selectedItem) => {
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
              if (i.selected && i._id === selectedItmPck[0]._id) {
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
                // alert("Please delete package from Cart")
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

                this.setState({ quantity: 0 });
              } else {
                //subtracting 1 quantity from selected item in cart.
                realTimeCart.map((itm) => {
                  if (itm._id === selectedItem._id) {
                    itm.simpleData[0].package.map((pck) => {
                      if (pck.selected) {
                        if (pck._id === selectedItmPck[0]._id) {
                          this.setState({ quantity: pck.quantity - 1 });
                          return (pck.quantity = pck.quantity - 1);
                        }
                      }
                    });
                  }
                });
              }
              this.props.addToCart([]);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              this.props.addToCart(realTimeCart);
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
            this.setState({ quantity: 0 });
          } else {
            realTimeCart.map((itm) => {
              if (itm._id === selectedItem._id) {
                this.setState({ quantity: quantityInCart - 1 });
                return (itm.simpleData[0].userQuantity = quantityInCart - 1);
              }
            });
          }
          this.props.addToCart([]);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          this.props.addToCart(realTimeCart);
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
    var cart_data_dt = [];
    let localPrice = 0;
    realTimeCart.map((item, index) =>
      item.simpleData &&
      item.simpleData.length > 0 &&
      item.TypeOfProduct === "simple"
        ? item.simpleData[0].package
            .filter((dta) => dta.selected == true)
            .map((data, ind) => {
              if (this.props.user_details.length !== 0) {
                if (this.props.user_details.user_type === "b2b") {
                  localPrice = data.B2B_price;
                } else if (this.props.user_details.user_type === "retail") {
                  localPrice = data.Retail_price;
                } else if (
                  this.props.user_details.user_type === "user" ||
                  this.props.user_details.user_type === null
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
        : (localPrice = item.totalprice)
    );

    realTimeCart.map((item, index) => {
      if (item.TypeOfProduct === "simple") {
        if (this.props.user_details.length !== 0) {
          if (this.props.user_details.user_type === "b2b") {
            localPrice = item.simpleData[0].RegionB2BPrice;
          } else if (this.props.user_details.user_type === "retail") {
            localPrice = item.simpleData[0].RegionRetailPrice;
          } else if (
            this.props.user_details.user_type === "user" ||
            this.props.user_details.user_type === null
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
      } else {
        localPrice = item.totalPrice;
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
      if (item.TypeOfProduct === "group"  || item.TypeOfProduct === "configurable") {
        cart_data_dt.push({
          product_categories: item.product_categories || [],
          ...item,
          product_id: item._id,
          qty: item.qty,
          totalprice: item.qty * item.price,
          without_package: true,
        });
      }
    });
    const requestData = {
      user_id: this.props.user_details._id,
      CartDetail: cart_data_dt,
      regionID: localStorage.getItem("selectedRegionId")
        ? JSON.parse(localStorage.getItem("selectedRegionId"))
        : "",
      subscribe: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
      totalCartPrice: 0,
    };
    ApiRequest(requestData, "/addtocart", "POST")
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  //adding cart added products in cartItem State
  addToCart = () => {
    console.log("cart::::::::",this.state.product_data)
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    var newItem;
    var selectedProductId = this.state.product_data._id;
    var selectedItem = this.state.product_data;
    var productSelectedPck = "";
    var quantityInCart = 0;
    var cartSelectedId = [];
console.log("selectedItem",selectedItem)
    var cart_data_dt = [
      {
        product_cat_id: null,
        product_subCat1_id: null,
        product_id: this.state.product_data._id,
        preOrder: false,
        preOrderRemainQty: this.state.product_data.preOrderRemainQty,
        product_name: this.state.product_data.product_name,
        productItemId: null,
        TypeOfProduct: "configurable",
        unitQuantity: this.state.product_data.unitQuantity,
        unitMeasurement: this.state.product_data.unitMeasurement.name,
        qty: 1,
        price: this.state.variant_price[0],
        totalprice: this.state.variant_price[0] * 1,
        without_package: null,
        variant_name: this.state.variant_name,
      },
    ];

    // let localPrice = 0;
    console.log("cart_data_dt:::::::===>>>>",cart_data_dt)
    // localStorage.setItem("cartItem", JSON.stringify(cart_data_dt));
    const requestData = {
      user_id: this.props.user_details._id,
      CartDetail: cart_data_dt,
      regionID: localStorage.getItem("selectedRegionId")
        ? JSON.parse(localStorage.getItem("selectedRegionId"))
        : "",
      totalCartPrice: cart_data_dt[0].totalprice,
      subscribe: localStorage.getItem("status")
        ? JSON.parse(localStorage.getItem("status"))
        : false,
    };

    ApiRequest(requestData, "/addtocart", "POST")
      .then((res) => {
        if (res.status === 400 || res.status === 401) {
          if (res.data.message === "error"||res.data.status === "error") {
            console.log("datat",this.props.dataInCart)
            let newCartModifying = this.props.dataInCart;
            let newItemsArray;
            if(res.data.result === "user_id required"){
              newItemsArray = this.props.dataInCart;
            }else{
                newItemsArray = newCartModifying.filter((itm) => {
              if (itm._id !== this.state.product_data._id) {
                return itm;
              }
            });
            if (newItemsArray !== undefined) {
              this.props.addToCart(newItemsArray);
              localStorage.setItem("cartItem", JSON.stringify(newItemsArray));
            } else {
              this.props.addToCart([]);
              localStorage.setItem("cartItem", []);
            }
            this.setState({
              cartItems: this.props.dataInCart ? this.props.dataInCart : [],
            });
            swal({
              // title: ,
              text: "This Item is currently out of stock",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
        }
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });

    localStorage.setItem("coupon_code", "");
    localStorage.setItem("freepackage", "");
    localStorage.setItem("freeproduct", "");
    localStorage.setItem("couponStatus", 2);
    localStorage.setItem("discount_amount", "");
    this.forceUpdate();

    //checking if user has selected all options and throwing error if not.
    if (
      this.state.selected_variants.length ===
      Object.keys(this.state.variant_data).length
    ) {
      swal({
        title: "",
        text: "Added in cart",
        icon: "success",
        dangerMode: true,
      });
    } else {
      swal({
        title: "",
        text: "Please select variants.",
        icon: "warning",
        dangerMode: true,
      });
    }
    
      //configured product quantity manage here
    


      if (realTimeCart.length > 0) {
        realTimeCart.map((itm) => {
          if (selectedProductId === itm._id) {
            
              quantityInCart = itm.simpleData[0].userQuantity || 1;
           
          }
        });
       
          if (
            realTimeCart.filter((i) => {
              return i._id === newItem._id;
            }).length > 0
          ) {
            realTimeCart.map((itm) => {
              if (itm._id === selectedProductId) {
                this.setState({ quantity: quantityInCart + 1 });
                return (itm.simpleData[0].userQuantity = quantityInCart + 1);
              }
            });
            this.props.addToCart([]);
            localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
            this.props.addToCart(realTimeCart);
            // let name = newItem.product_name;
            // swal({
            //   // title: ,
            //   text: newItem.product_name + "  is already in your cart",
            //   icon: "warning",
            //   dangerMode: true,
            // });
          } else {
            realTimeCart.push(newItem);
            localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
            this.props.addToCart(realTimeCart);
          }
       
      } else {
        realTimeCart.push(this.state.product_data);
        localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
        this.props.addToCart(realTimeCart);
        this.setState({ quantity: 1 });
      }
    
    console.log("realTimeCartrealTimeCart",realTimeCart)
    setTimeout(() => {
      this.setState({
        // openCart: true,
        cartItems: this.props.dataInCart ? this.props.dataInCart : [],
      });
      this.sendCartDataToApi(realTimeCart);
    }, 100);
    this.forceUpdate();
  };

  updateCart = () => {
    this.setState({
      cartItems: this.props.dataInCart ? this.props.dataInCart : [],
    });
  };

  relatedHandleChange = (e) => {
    const selectedPrice = e.target.value;
    const id = e.target.id;
    this.setState({
      showFirstPriceOnLoad: false,
    });

    this.state.relatedProducts.map((rel) => {
      if (rel.product_id._id === id) {
        if (rel.product_id.TypeOfProduct === "simple") {
          rel.product_id.simpleData[0].package.map(
            (pck) => (pck.selected = false)
          );
          rel.product_id.simpleData[0].package.map((pck) => {
            if (pck._id === selectedPrice) {
              pck.selected = true;
            }
          });
        }
      }
    });
  };

  relatedProductAddToCart = (selectedItem) => {
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    var cartSelectedPck = [];

    if (realTimeCart.length > 0) {
      realTimeCart.map((itm) => {
        if (itm._id === selectedItem._id) {
          if (itm.simpleData[0].package[0])
            itm.simpleData[0].package.map((i) => {
              if (i.selected) {
                cartSelectedPck.push(i._id);
              }
            });
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
              let name = selectedItem.product_name;
              swal({
                // title: ,
                text: selectedItem.product_name + "  is already in your cart",
                icon: "warning",
                dangerMode: true,
              });
            } else {
              realTimeCart.push(selectedItem);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              this.props.addToCart(realTimeCart);
            }
          }
        });
      } else {
        if (
          realTimeCart.filter((i) => {
            return i._id === selectedItem._id;
          }).length > 0
        ) {
          let name = selectedItem.product_name;
          swal({
            // title: ,
            text: selectedItem.product_name + "  is already in your cart",
            icon: "warning",
            dangerMode: true,
          });
        } else {
          realTimeCart.push(selectedItem);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          this.props.addToCart(realTimeCart);
        }
      }
    } else {
      realTimeCart.push(selectedItem);
      localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
      this.props.addToCart(realTimeCart);
    }

    setTimeout(() => {
      //opening cart when user add a product to cartthis.setState({
      // openCart: true,
      this.setState({
        cartItems: this.props.dataInCart ? this.props.dataInCart : [],
        // openCart: true,
      });
      this.sendCartDataToApi();
    }, 50);
    this.forceUpdate();
  };
  changeProductPage = (_id) => {
    let requestData = {};
    ApiRequest(requestData, "/product/" + _id, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            product_data: res.data.data,
            relatedProducts: res.data.data.relatedProduct,
          });
        } else {
        }
      })
      .then(() => {
        var final_ddda = [];
        this.state.product_data.configerableData === undefined ||
          this.state.product_data.configerableData.map((item, index) => {
            var daat = [];
            item.variant_id.map((data, indexing) => {
              if (indexing === 0) {
                data.selected = true;
              } else {
                data.selected = false;
              }
              if (!data.quantity) {
                data.quantity = 1;
              }
              daat.push(
                data.variantId.item.filter(
                  (item1) => item1._id == data.variantItem
                )[0]
              );
            });
            var new_fiu_data = "";
            daat.map((itemqw, indexqw) => {
              new_fiu_data =
                indexqw == 0
                  ? new_fiu_data + itemqw.item_name
                  : new_fiu_data + " " + itemqw.item_name;
            });
            final_ddda.push({ _id: item._id, item: new_fiu_data });
            this.setState({
              product_variants: final_ddda,
            });

            if (index === 0) {
              item.selected = true;
            } else {
              item.selected = false;
            }
          });

        //adding selected property to related product
        this.state.relatedProducts &&
          this.state.relatedProducts.map((product) => {
            product.product_id.simpleData[0].package[0]
              ? product.product_id.simpleData[0].package.map((pck, index) => {
                  if (!pck.quantity) {
                    pck.quantity = 1;
                  }
                  if (index === 0) {
                    pck.selected = true;
                  } else {
                    pck.selected = false;
                  }
                })
              : (product.product_id.simpleData[0].userQuantity = 1);
          });
      })
      .then(() => {
        this.state.product_data.TypeOfProduct === "simple" &&
        this.state.product_data.simpleData[0].package[0]
          ? this.state.product_data.simpleData[0].package.map((pck, index) => {
              if (!pck.quantity) {
                pck.quantity = 1;
              }
              if (index === 0) {
                pck.selected = true;
              } else {
                pck.selected = false;
              }
            })
          : (this.state.product_data.simpleData[0].userQuantity = 1);
      })
      .then(() => {
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  relatedProductLink = (name) => {
    this.props.history.push("/product/" + name);
    setTimeout(() => {
      window.location.reload();
    }, 50);
  };

  changeVariant = (attributeValue, attributeName, status) => {
    let variantData = this.state.variant_data;
    let selectedVariants = this.state.selected_variants || [];
    if (status.toLowerCase() !== "yes") {
      selectedVariants = [{ attributeValue, attributeName }];
    } else {
      if (selectedVariants.length > 0) {
        const variantPresent = selectedVariants.filter(
          (variant) => variant.attributeName === attributeName
        );
        if (variantPresent.length > 0) {
          selectedVariants = selectedVariants.map((obj) => {
            return obj.attributeName === attributeName
              ? { attributeValue, attributeName }
              : obj;
          });
        } else {
          selectedVariants.push({ attributeValue, attributeName });
        }
      } else {
        selectedVariants.push({ attributeValue, attributeName });
      }
    }
    Object.keys(variantData).forEach((name) => {
      var selected = false;
      variantData[name] = variantData[name].map((variant) => {
        if (name === attributeName) {
          if (variant.value === attributeValue) {
            selected = true;
          } else {
            selected = false;
          }
          return { ...variant, selected: selected };
        } else {
          return { ...variant };
        }
      });
    });

    let requestData = {
      product_id: this.state.product_data._id,
      region_id: JSON.parse(localStorage.getItem("selectedRegionId")),
      attributesList: selectedVariants,
      initialAttributes: variantData,
    };
    ApiRequest(requestData, "/filterVariantsByAttributes", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let pricesArr = [];
          res.data.data.configurableData.forEach((data) => {
            let localPrice = 0;
            if (this.props.user_detials) {
              if (this.props.user_details.user_type === "b2b") {
                localPrice = data.B2B_price;
              } else if (this.props.user_details.user_type === "retail") {
                localPrice = data.Retail_price;
              } else if (
                this.props.user_details.user_type === "user" ||
                this.props.user_details.user_type === null
              ) {
                localPrice = data.selling_price;
              }
            } else {
              localPrice = data.selling_price;
            }
            if (pricesArr.filter((price) => price === localPrice).length >= 1) {
            } else {
              pricesArr.push(localPrice);
            }
            this.setState({
              variant_name: data.variant_name,
            });
          });
          this.setState({
            selected_variants: selectedVariants,
            variant_data: res.data.data.attributes,

            variant_price: pricesArr,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const product_data = this.state.product_data;
    let priceArr = this.state.variant_price;
    priceArr = priceArr.sort();
    let priceString = "";
    if (priceArr.length > 1) {
      priceString = priceArr[0] + "-" + priceArr[priceArr.length - 1];
    } else {
      priceString = priceArr[0];
    }
    return (
      <div className="page-wrapper">
        {this.state.loading ? (
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
        {this.state.openGroupProduct ? (
          <GroupProduct
            closeGroup={() => this.setState({ openGroupProduct: false })}
            groupProductData={this.state.groupProductData}
          />
        ) : (
          ""
        )}
        {this.state.openCart ? (
          <Cart
            hideCart={this.hideCart}
            renderParent={() => this.forceUpdate()}
            updateCart={this.updateCart}
          />
        ) : (
          ""
        )}
        {this.state.openGroupProduct ? (
          <GroupProduct
            closeGroup={() => this.setState({ openGroupProduct: false })}
            groupProductData={this.state.groupProductData}
          />
        ) : (
          ""
        )}
        <main className="page-content">
          <section className="page-banner" style={{ minHeight: "390px" }}>
            <div className="banner-figure" style={{ textAlign: "center" }}>
              {!this.state.loading ? (
                product_data.banner ? (
                  <img src={imageUrl + product_data.banner} alt="" />
                ) : (
                  <img src={imageUrl + localStorage.getItem("banner")} />
                )
              ) : (
                ""
              )}
            </div>
            <div className="banner-top-text">
              {/* <h6>{product_data.product_name}</h6>
              <h1>
                {product_data && product_data.product_subCat1_id
                  ? product_data.product_subCat1_id.category_name
                  : ""}
              </h1> */}
              {/* <p>
                <div
                  dangerouslySetInnerHTML={{ __html: product_data.longDesc }}
                ></div>
              </p> */}
            </div>
            <div className="banner-overlay"></div>
          </section>
          <div className="container">
            <section className="product-summary-wrapper">
              <div className="product-gallery">
                <Carousel
                  showArrows={false}
                  emulateTouch={true}
                  dynamicHeight={true}
                  useKeyboardArrows={true}
                  infiniteLoop={true}
                  showStatus={false}
                >
                  {!this.state.loading ? (
                    product_data.images && product_data.images.length > 0 ? (
                      product_data.images.map((img) => {
                        return (
                          <div style={{ background: "white" }}>
                            <img src={imageUrl + img.image} alt="image" />
                            {/* <Magnifier src={imageUrl + img.image} /> */}
                          </div>
                        );
                      })
                    ) : (
                      <img
                        src={imageUrl + localStorage.getItem("prdImg")}
                        alt="image"
                      />
                    )
                  ) : (
                    ""
                  )}
                </Carousel>
              </div>
              <div className="entry-summary-product">
                <h1 className="product-title capitalise">
                  {product_data.product_name}
                </h1>
                <p className="product-price-list">
                  ₹{priceString}
                  {/* {product_data.TypeOfProduct !== "group" &&
                    "₹" + this.state.variant_price} */}
                  {/* {product_data.TypeOfProduct === "simple" &&
                    (product_data.simpleData[0] === undefined ||
                    product_data.simpleData[0].package[0]
                      ? product_data.simpleData[0].package.map((pck, index) => {
                          let price = null;
                          if (pck.selected) {
                            if (this.props.user_details.length !== 0) {
                              if (this.props.user_details.user_type === "b2b") {
                                price = pck.B2B_price;
                              } else if (
                                this.props.user_details.user_type === "retail"
                              ) {
                                price = pck.Retail_price;
                              } else if (
                                this.props.user_details.user_type === "user" ||
                                this.props.user_details.user_type === null
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
                          } else if (
                            this.state.showFirstPriceOnLoad &&
                            index === 0
                          ) {
                            if (this.props.user_details.length !== 0) {
                              if (this.props.user_details.user_type === "b2b") {
                                price = pck.B2B_price;
                              } else if (
                                this.props.user_details.user_type === "retail"
                              ) {
                                price = pck.Retail_price;
                              } else if (
                                this.props.user_details.user_type === "user" ||
                                this.props.user_details.user_type === null
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
                          return price;
                        })
                      : this.props.user_details.length !== 0
                      ? this.props.user_details.user_type === "b2b"
                        ? product_data.simpleData[0].RegionB2BPrice
                        : this.props.user_details.user_type === "retail"
                        ? product_data.simpleData[0].RegionRetailPrice
                        : this.props.user_details.user_type === "user"
                        ? product_data.simpleData[0].RegionSellingPrice
                        : this.props.user_details.user_type === null
                        ? product_data.simpleData[0].RegionSellingPrice
                        : ""
                      : product_data.simpleData[0].RegionSellingPrice
                      ? product_data.simpleData[0].RegionSellingPrice
                      : product_data.simpleData[0].mrp)} */}
                  <span
                    className="old-price"
                    style={{
                      fontSize: "13px",
                      color: "#999",
                      textDecoration: "line-through",
                      paddingLeft: "5px",
                    }}
                  >
                    {product_data.TypeOfProduct === "simple"
                      ? product_data.simpleData[0] === undefined ||
                        (product_data.simpleData[0].package[0]
                          ? product_data.simpleData[0].package.map(
                              (pck, index) => {
                                if (pck.selected) {
                                  if (pck.selling_price) {
                                    return pck.packetmrp;
                                  }
                                } else if (
                                  this.state.showFirstPriceOnLoad &&
                                  index === 0
                                ) {
                                  if (pck.selling_price) {
                                    return pck.packetmrp;
                                  }
                                }
                              }
                            )
                          : product_data.simpleData[0].RegionSellingPrice &&
                            product_data.simpleData[0].mrp)
                      : ""}
                  </span>
                </p>
                {this.state.variant_data &&
                  Object.keys(this.state.variant_data).map((attribute) => {
                    return (
                      <div className="variant-container">
                        <p>Select {attribute}</p>
                        <div className="d-flex">
                          {this.state.variant_data[attribute].map((variant) => {
                            return attribute.toLowerCase() === "color" ? (
                              <div
                                // className={
                                //   variant.status === "yes"
                                //     ? variant.selected
                                //       ? "variant-color-image active"
                                //       : "variant-color-image"
                                //     : "variant-color-image disable"
                                // }
                                className={
                                  variant.status === "yes"
                                    ? variant.selected
                                      ? "variant-size active"
                                      : "variant-size"
                                    : "variant-size disable"
                                }
                                onClick={() =>
                                  this.changeVariant(
                                    variant.value,
                                    attribute,
                                    variant.status
                                  )
                                }
                              >
                                <span
                                // className="variant-color"
                                // style={{ backgroundColor: variant.value }}
                                >
                                  {variant.value}
                                </span>
                              </div>
                            ) : (
                              <div
                                className={
                                  variant.status === "yes"
                                    ? variant.selected
                                      ? "variant-size active"
                                      : "variant-size"
                                    : "variant-size disable"
                                }
                                onClick={() =>
                                  this.changeVariant(
                                    variant.value,
                                    attribute,
                                    variant.status
                                  )
                                }
                              >
                                <span>{variant.value}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                <div className="product-short-disc">
                  <p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product_data.shortDesc,
                      }}
                    ></div>
                  </p>
                </div>
                {/* {!product_data.outOfStock ? (
                  <></>
                ) : (
                  <> */}
                <div className="quantity-row">
                  {product_data.TypeOfProduct === "configurable" ? (
                    <button
                      style={{ marginTop: 18, minHeight: "50px" }}
                      onClick={() => this.addToCart()}
                    >
                      Add To Cart
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                {/* </>
                )} */}
                {/* {product_data.outOfStock ? (
                  <p style={{ marginTop: 10, color: "red" }}>Out Of Stock</p>
                ) : (
                  ""
                )} */}

                {this.state.outOfStock ? (
                  <span
                    style={{
                      color: "red",
                      marginTop: 20,
                      display: "block",
                      marginBottom: -20,
                    }}
                  >
                    {product_data.productQuantity}Units currently in Stock.
                  </span>
                ) : (
                  ""
                )}

                <div className="product-meta">
                  <span className="product-category">
                    <strong>Categories:</strong>{" "}
                    <p>
                      {this.state.categoriesName.map((cat, ix) => (
                        <span className="capitalize">
                          {cat}
                          {ix !== this.state.categoriesName.length - 1 && ", "}
                        </span>
                      ))}
                    </p>
                    <a>
                      {product_data.product_cat_id &&
                        product_data.product_cat_id.category_name}
                    </a>
                    {product_data.product_subCat1_id && (
                      <a>- {product_data.product_subCat1_id.category_name}</a>
                    )}
                  </span>
                </div>
              </div>
            </section>
            {product_data.longDesc ? (
              <section className="about-product-desc">
                <h5 className="inner-sub-heading">About</h5>
                <p>
                  <div
                    dangerouslySetInnerHTML={{ __html: product_data.longDesc }}
                  ></div>
                </p>
              </section>
            ) : (
              ""
            )}
            <section>
              {this.state.relatedProducts &&
                this.state.relatedProducts.length > 0 && (
                  <h5 className="inner-sub-heading">Related Products</h5>
                )}
              <div className="product-list-product">
                <Slider {...feat_slider1} className="res_slide">
                  {this.state.relatedProducts &&
                  this.state.relatedProducts.length > 0
                    ? this.state.relatedProducts.map((item, ix) => {
                        let price = null;
                        if (item.product_id.TypeOfProduct === "simple") {
                          if (item.product_id.simpleData[0].package[0]) {
                            item.product_id.simpleData[0].package.map(
                              (pck, index) => {
                                if (pck.selected) {
                                  if (this.props.user_details.length !== 0) {
                                    if (
                                      this.props.user_details.user_type ===
                                      "b2b"
                                    ) {
                                      price = pck.B2B_price;
                                    } else if (
                                      this.props.user_details.user_type ===
                                      "retail"
                                    ) {
                                      price = pck.Retail_price;
                                    } else if (
                                      this.props.user_details.user_type ===
                                        "user" ||
                                      this.props.user_details.user_type === null
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
                                } else if (
                                  this.state.showFirstPriceOnLoad &&
                                  index === 0
                                ) {
                                  if (this.props.user_details.length !== 0) {
                                    if (
                                      this.props.user_details.user_type ===
                                      "b2b"
                                    ) {
                                      price = pck.B2B_price;
                                    } else if (
                                      this.props.user_details.user_type ===
                                      "retail"
                                    ) {
                                      price = pck.Retail_price;
                                    } else if (
                                      this.props.user_details.user_type ===
                                        "user" ||
                                      this.props.user_details.user_type === null
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
                              }
                            );
                          } else {
                            if (this.props.user_details.length !== 0) {
                              if (this.props.user_details.user_type === "b2b") {
                                price =
                                  item.product_id.simpleData[0].RegionB2BPrice;
                              } else if (
                                this.props.user_details.user_type === "retail"
                              ) {
                                price =
                                  item.product_id.simpleData[0]
                                    .RegionRetailPrice;
                              } else if (
                                this.props.user_details.user_type === "user"
                              ) {
                                price =
                                  item.product_id.simpleData[0]
                                    .RegionSellingPrice;
                              } else if (
                                this.props.user_details.user_type === null
                              ) {
                                price =
                                  item.product_id.simpleData[0]
                                    .RegionSellingPrice;
                              } else {
                              }
                            } else {
                              if (
                                item.product_id.simpleData[0].RegionSellingPrice
                              ) {
                                price =
                                  item.product_id.simpleData[0]
                                    .RegionSellingPrice;
                              } else {
                                price = item.product_id.simpleData[0].mrp;
                              }
                            }
                          }
                          return (
                            price !== null &&
                            price !== 0 &&
                            item.product_id.status && (
                              <div
                                className={
                                  item.product_id.outOfStock
                                    ? "product-list-col out-of-stock-product"
                                    : "product-list-col"
                                }
                              >
                                {item.product_id.outOfStock && (
                                  <p className="stocke-text">Out Of Stock</p>
                                )}
                                <div
                                  className="product-thumb"
                                  onClick={() => {
                                    return this.relatedProductLink(
                                      item.product_id.slug
                                    );
                                  }}
                                >
                                  <Link>
                                    {item.product_id.images.length > 0 ? (
                                      <img
                                        src={
                                          imageUrl +
                                          item.product_id.images[0].image
                                        }
                                      />
                                    ) : (
                                      <img
                                        src={
                                          imageUrl +
                                          localStorage.getItem("prdImg")
                                        }
                                        alt="image"
                                      />
                                    )}
                                  </Link>
                                  {/* <span className="tag-sale">
                                    <Link href="">sale</Link>
                                  </span> */}
                                </div>
                                <div className="product-list-description">
                                  <div className="product-list-price">
                                    <span className="price-product">
                                      ₹{price}
                                      <span
                                        className="old-price"
                                        style={{
                                          fontSize: "13px",
                                          color: "#999",
                                          textDecoration: "line-through",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        {
                                          item.product_id.TypeOfProduct ===
                                          "simple"
                                            ? item.product_id.simpleData[0] ===
                                                undefined ||
                                              (item.product_id.simpleData[0]
                                                .package[0] &&
                                                item.product_id.simpleData[0].package.map(
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
                                                      this.state
                                                        .showFirstPriceOnLoad &&
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
                                                ))
                                            : ""
                                          // item.configerableData[0].sellingPrice
                                        }
                                      </span>
                                    </span>
                                  </div>
                                  <div
                                    className="product-list-name"
                                    onClick={() => {
                                      this.relatedProductLink(
                                        item.product_id.slug
                                      );
                                    }}
                                  >
                                    <Link>{item.product_id.product_name}</Link>
                                  </div>
                                  <div className="product-card-add">
                                    <a>
                                      <span className="card-button">
                                        <span className="label-add">
                                          <span
                                            className={
                                              item.product_id.simpleData[0]
                                                .package.length > 0
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
                                              {item.product_id.TypeOfProduct ===
                                              "simple" ? (
                                                item.product_id.simpleData[0]
                                                  .package[0] ? (
                                                  <select
                                                    className="custom-select-form"
                                                    onChange={
                                                      this.relatedHandleChange
                                                    }
                                                    id={item.product_id._id}
                                                  >
                                                    {item.product_id.simpleData[0].package.map(
                                                      (pck) => {
                                                        return (
                                                          <option
                                                            value={pck._id}
                                                          >
                                                            {pck.packetLabel}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                ) : (
                                                  <p
                                                    style={{
                                                      textTransform:
                                                        "capitalize",
                                                    }}
                                                  >
                                                    {item.product_id
                                                      .unitQuantity +
                                                      " " +
                                                      (item.product_id
                                                        .unitMeasurement.name
                                                        ? item.product_id
                                                            .unitMeasurement
                                                            .name
                                                        : "unset")}
                                                  </p>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </div>
                                          </span>
                                          <span className="product-overlay"></span>
                                        </span>
                                        {item.product_id.outOfStock ? (
                                          <span className="label-icon">
                                            <i
                                              className="fa fa-plus"
                                              aria-hidden="true"
                                            ></i>
                                            <span className="icon-overlay"></span>
                                          </span>
                                        ) : (
                                          <span
                                            className="label-icon"
                                            onClick={() =>
                                              this.relatedProductAddToCart(
                                                item.product_id
                                              )
                                            }
                                          >
                                            <i
                                              className="fa fa-plus"
                                              aria-hidden="true"
                                            ></i>
                                            <span className="icon-overlay"></span>
                                          </span>
                                        )}
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )
                          );
                        }
                        if (item.product_id.TypeOfProduct === "group") {
                          if (item.product_id) {
                            return (
                              <div
                                className={
                                  item.product_id.outOfStock
                                    ? "product-list-col out-of-stock-product"
                                    : "product-list-col"
                                }
                              >
                                <div
                                  className="product-thumb"
                                  onClick={() => {
                                    return this.relatedProductLink(
                                      item.product_id.slug
                                    );
                                  }}
                                >
                                  <Link>
                                    {item.product_id.images.length > 0 ? (
                                      <img
                                        src={
                                          imageUrl +
                                          item.product_id.images[0].image
                                        }
                                      />
                                    ) : (
                                      <img
                                        src={
                                          imageUrl +
                                          localStorage.getItem("prdImg")
                                        }
                                        alt="image"
                                      />
                                    )}
                                  </Link>
                                  {/* <span className="tag-sale">
                                      <Link href="">sale</Link>
                                    </span> */}
                                </div>
                                <div className="product-list-description">
                                  <div className="product-list-price"></div>
                                  <div
                                    className="product-list-name"
                                    onClick={() => {
                                      this.relatedProductLink(
                                        item.product_id.slug
                                      );
                                    }}
                                  >
                                    <Link>{item.product_id.product_name}</Link>
                                  </div>
                                  <div className="product-card-add">
                                    <a>
                                      <span
                                        className="card-button"
                                        onClick={() => {
                                          return this.relatedProductLink(
                                            item.product_id.slug
                                          );
                                        }}
                                      >
                                        <span className="label-add">
                                          VIEW DETAIL
                                          {/* <span
                                            className={
                                              item.product_id.simpleData[0]
                                                .package.length > 0
                                                ? "text-add select-edit-tag"
                                                : "text-add norml-selet"
                                            }
                                          > */}
                                          {/* <div
                                              className="custom-select"
                                              style={{
                                                background: "#f3f3f3",
                                                lineHeight: "36px",
                                              }}
                                            >
                                              {item.product_id.TypeOfProduct ===
                                              "simple" ? (
                                                item.product_id.simpleData[0]
                                                  .package[0] ? (
                                                  <select
                                                    className="custom-select-form"
                                                    onChange={
                                                      this.relatedHandleChange
                                                    }
                                                    id={item.product_id._id}
                                                  >
                                                    {item.product_id.simpleData[0].package.map(
                                                      (pck) => {
                                                        return (
                                                          <option
                                                            value={pck._id}
                                                          >
                                                            {pck.packetLabel}
                                                          </option>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                ) : (
                                                  <p
                                                    style={{
                                                      textTransform:
                                                        "capitalize",
                                                    }}
                                                  >
                                                    {item.product_id
                                                      .unitQuantity +
                                                      " " +
                                                      (item.product_id
                                                        .unitMeasurement.name
                                                        ? item.product_id
                                                            .unitMeasurement
                                                            .name
                                                        : "unset")}
                                                  </p>
                                                )
                                              ) : (
                                                ""
                                              )}
                                            </div> */}
                                        </span>
                                        <span className="product-overlay"></span>
                                      </span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        }
                      })
                    : ""}
                </Slider>
              </div>
            </section>
            {product_data &&
            product_data.relatedRecipes &&
            product_data.relatedRecipes.length > 0 ? (
              <section className="recipes-row">
                <div className="recipe-heading">
                  <h5 className="inner-sub-heading">
                    {/* {product_data.product_name}  */}
                    Related recipes
                  </h5>
                </div>
                <div className="receipes-content-row-probotom">
                  <Slider {...feat_slider1} className="res_slide">
                    {product_data.relatedRecipes.map(
                      (item) =>
                        item.blog_id !== null && (
                          <div className="receipe-col">
                            <Link to={"/recipe/" + item.blog_id.slug}>
                              <div className="re-fig">
                                <img
                                  src={
                                    item.blog_id
                                      ? imageUrl + item.blog_id.images[0].image
                                      : ""
                                  }
                                />{" "}
                              </div>
                              <div className="rec-heading">
                                <h6>
                                  {item.blog_id
                                    ? item.blog_id.title
                                    : "NO TITLE"}
                                </h6>
                                {/* <h6>{item.title ? item.title : "veggies"}</h6> */}
                              </div>
                            </Link>
                          </div>
                        )
                    )}
                  </Slider>
                </div>
              </section>
            ) : (
              ""
            )}
          </div>
        </main>
        {/* <Footer></Footer> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const dispatchStateToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  userdetails: (data) => dispatch(userdetails(data)),
});
export default connect(
  mapStateToProps,
  dispatchStateToProps
)(configure_product);
