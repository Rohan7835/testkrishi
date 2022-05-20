import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import "../../assets/css/blog.css";
import { imageUrl } from "../../components/imgUrl";
import sendCartDataToAPI from "../../components/sendCartDataToAPI";
import { addToCart } from "../../redux/actions/actions";

var singleSlider = {
  dots: false,
  arrows: true,
  infinite: false,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
};
var feat_slider1 = {
  dots: true,
  arrows: true,
  infinite: false,
  speed: 300,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
  ],
};

function BlogDetails(props) {
  const [singleBlog, setSingleBlog] = useState({});
  const [youmayalsolike, setyoumayalsolike] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showFirstPriceOnLoad, setShowFirstPriceOnLoad] = useState(true);
  const [openCart, setOpenCart] = useState(true);
  const [pathName, setPathName] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);

  var path = props.location.pathname;
  var blogId = path.split("/")[2];

  useEffect(async () => {
    let requestData = {
      blog_id: blogId,
      RegionId: localStorage.getItem("selectedRegionId")
        ? JSON.parse(localStorage.getItem("selectedRegionId"))
        : "",
    };
    await ApiRequest(requestData, "/getOneBlog", "POST")
      .then((res) => {
        let localProducts;
        if (res.status === 201 || res.status === 200) {
          setyoumayalsolike(res.data.data.youmayalsolike);
          setSingleBlog(res.data.data);
          localProducts = res.data.data.relatedProduct;
          localProducts.map((product) => {
            let price = 0;
            let priceIndex;
            if (product.product_id.TypeOfProduct === "simple") {
              product.product_id.simpleData[0].package[0] &&
                product.product_id.simpleData[0].package.forEach(
                  (pck, inde) => {
                    if (!price) {
                      if (props.user_details.length !== 0) {
                        if (props.user_details.user_type === "b2b") {
                          price = pck.B2B_price || 0;
                        } else if (props.user_details.user_type === "retail") {
                          price = pck.Retail_price || 0;
                        } else if (props.user_details.user_type === "user") {
                          price = pck.selling_price || 0;
                        }
                      }
                      if (price) {
                        priceIndex = inde;
                      }
                    }
                  }
                );
            }
            product.product_id.simpleData[0].package[0]
              ? product.product_id.simpleData[0].package.map((pck, index) => {
                  let userPrice = 0;
                  if (props.user_details.length !== 0) {
                    if (props.user_details.user_type === "b2b") {
                      userPrice = pck.B2B_price || 0;
                    } else if (props.user_details.user_type === "retail") {
                      userPrice = pck.Retail_price || 0;
                    } else {
                      userPrice = pck.selling_price || 0;
                    }
                  } else {
                    userPrice = pck.selling_price || 0;
                  }
                  if (!pck.quantity) {
                    pck.quantity = 1;
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
                  return pck;
                })
              : (product.product_id.simpleData[0].userQuantity = 1);
          });
          setRelatedProducts(localProducts);
        } else {
        }
        setTimeout(() => {
          calculateQuantityInCart(localProducts);
        }, 0);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => console.log(err));
    window.scrollTo(0, 0);
  }, [blogId]);

  const calculateQuantityInCart = (local) => {
    let cartData = [];
    const dataInCart1 = [...props.dataInCart];
    var related = local ? [...local] : [...relatedProducts];
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
              quantity = pck.quantity;
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
    Array.isArray(related) &&
      related.map((iteem) => {
        let itm = iteem.product_id;
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
                    pck.quantity = 0;
                  } else {
                    pck.quantity = 0;
                  }
                  // if (index === 0) {
                  //   pck.selected = true;
                  // } else {
                  //   pck.selected = false;
                  // }
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
                  pck.quantity = 0;
                } else {
                  pck.quantity = 0;
                }
                // if (index === 0) {
                //   pck.selected = true;
                // } else {
                //   pck.selected = false;
                // }
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
      setRelatedProducts(related);
    }, 0);
  };

  useEffect(() => {
    calculateQuantityInCart();
  }, [props.cartItemQuantity]);

  const relatedHandleChange = (e) => {
    const selectedPrice = e.target.value;
    const id = e.target.id;
    setShowFirstPriceOnLoad(false);
    const rel = [...relatedProducts];
    rel.map((rel) => {
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
    setRelatedProducts(rel);
    setTimeout(() => {
      // calculateQuantityInCart();
    }, 0);
  };

  // useEffect(() => {
  //   setReRender(!reRender);
  // }, [relatedHandleChange]);
  const relatedProductAddToCart = async (selectedItem) => {
    var already_cart = false;
    var realTimeCart = localStorage.getItem("cartItem")
      ? JSON.parse(localStorage.getItem("cartItem"))
      : [];
    var cartSelectedPck = [];
    var quantityInCart = 0;

    let selectedItmPck =
      selectedItem.simpleData[0].package.length > 0
        ? selectedItem.simpleData[0].package.filter((pck) => pck.selected)
        : "";

    let availableLocalQuantity = selectedItem.simpleData[0].availableQuantity;

    let name = selectedItem.product_name;

    if (selectedItem.TypeOfProduct === "simple") {
      selectedItem.simpleData[0].package[0]
        ? selectedItem.simpleData[0].package.map((pck) => {
            if (pck.selected) {
              pck.quantity = pck.quantity || 1;
            }
          })
        : (selectedItem.simpleData[0].userQuantity =
            selectedItem.simpleData[0].userQuantity || 1);
    } else {
      // selectedItem.configurableData[0].variant_id.map((variant) => {
      //   if (variant.selected) {
      //     variant.quantity = this.state.quantity;
      //   }
      // });
    }
    if (realTimeCart.length > 0) {
      realTimeCart.map((itm) => {
        if (itm._id === selectedItem._id) {
          if (itm.simpleData[0].package[0]) {
            itm.simpleData[0].package.map((i) => {
              if (i.selected) {
                cartSelectedPck.push(i._id);
                quantityInCart = i.quantity || 1;
              }
            });
          } else {
            quantityInCart = itm.simpleData[0].userQuantity || 1;
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
                    availableLocalQuantity >=
                    selectedItem.simpleData[0].package[indind].quantity + 1
                  ) {
                    selectedItem.simpleData[0].package[indind].quantity =
                      itmitm.quantity + 1;
                  } else {
                    quantityError = true;
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
              props.addToCart([]);
              // realTimeCart.push(selectedItem);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              props.addToCart(realTimeCart);
              // let name = selectedItem.product_name;
              // swal({
              //   // title: ,
              //   text: name + "  is already in your cart",
              //   icon: "warning",
              //   dangerMode: true,
              // });
            } else {
              realTimeCart.push(selectedItem);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              props.addToCart(realTimeCart);
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
            availableLocalQuantity >=
            selectedItem.simpleData[0].userQuantity + 1
          ) {
            selectedItem.simpleData[0].userQuantity = quantityInCart + 1;
          } else {
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
          props.addToCart([]);
          // realTimeCart.push(selectedItem);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          props.addToCart(realTimeCart);
          // let name = selectedItem.product_name;
          // swal({
          //   // title: ,
          //   text: name + "  is already in your cart",
          //   icon: "warning",
          //   dangerMode: true,
          // });
        } else {
          realTimeCart.push(selectedItem);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          props.addToCart(realTimeCart);
        }
      }
    } else {
      realTimeCart.push(selectedItem);
      localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
      props.addToCart(realTimeCart);
    }

    await sendCartDataToAPI([selectedItem], props.user_details, props.addToCart)
      .then((res) => {
        if (res.status === 400 || res.status === 401) {
          if (res.data.message === "error") {
            let newCartModifying = realTimeCart;
            const newItemsArray = newCartModifying.filter((itm) => {
              if (itm !== selectedItem) {
                return itm;
              }
            });
            if (newItemsArray !== undefined) {
              props.addToCart(newItemsArray);
              localStorage.setItem("cartItem", JSON.stringify(newItemsArray));
            } else {
              props.addToCart([]);
              localStorage.setItem("cartItem", []);
            }
            swal({
              // title: ,
              text: "This Item is currently out of stock",
              icon: "warning",
              dangerMode: true,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setTimeout(() => {
      //opening cart when user add a product to cart
      setOpenCart(true);
    }, 50);
  };

  const showOutofstockAlert = (item) => {
    swal({
      // title: ,
      text: item.product_name + " is currently out of stock",
      icon: "warning",
      dangerMode: true,
    });
  };

  const subtractFromCart = async (selectedItem) => {
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

                // this.setState({ quantity: 0 });
              } else {
                //subtracting 1 quantity from selected item in cart.
                realTimeCart.map((itm) => {
                  if (itm._id === selectedItem._id) {
                    itm.simpleData[0].package.map((pck) => {
                      if (pck.selected) {
                        if (pck._id === selectedItmPck[0]._id) {
                          // this.setState({ quantity: pck.quantity - 1 });
                          return (pck.quantity = pck.quantity - 1);
                        }
                      }
                    });
                  }
                });
              }
              props.addToCart([]);
              localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
              props.addToCart(realTimeCart);
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
            // this.setState({ quantity: 0 });
          } else {
            realTimeCart.map((itm) => {
              if (itm._id === selectedItem._id) {
                // this.setState({ quantity: quantityInCart - 1 });
                return (itm.simpleData[0].userQuantity = quantityInCart - 1);
              }
            });
          }
          props.addToCart([]);
          localStorage.setItem("cartItem", JSON.stringify(realTimeCart));
          props.addToCart(realTimeCart);
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

    await sendCartDataToAPI([selectedItem], props.user_details, props.addToCart)
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return (
    <main className="page-content">
      <section className="page-banner" style={{ minHeight: "390px" }}>
        <div className="banner-figure">
          {!loading ? (
            singleBlog.banner ? (
              <img src={imageUrl + singleBlog.banner} alt="single blog" />
            ) : localStorage.getItem("banner") ? (
              <Skeleton count={5} />
            ) : (
              <Skeleton count={5} />
            )
          ) : (
            ""
          )}
        </div>
        {/* <div className="banner-top-text">
          <h1 style={{ color: "white", textTransform: "capitalize" }}>
            {singleBlog.title}
          </h1>
        </div> */}
      </section>
      <div className="container">
        <div className="detail-ingredient-wrp">
          <div className="ing-de-top" style={{ maxHeight: "100%" }}>
            <div
              className="ing-figpro-slider"
              style={{ maxHeight: "100%", height: "auto" }}
            >
              <Slider {...singleSlider} style={{ maxHeight: "100%" }}>
                {singleBlog.images && singleBlog.images[0] ? (
                  singleBlog.images.map((img) => {
                    return <img src={imageUrl + img.image} alt="" />;
                  })
                ) : (
                  <Skeleton count={5} />
                )}
              </Slider>
              {/* <Slider {...feat_slider1}>	
                    <img src={imageUrl + singleBlog.image} />
                </Slider> */}
            </div>
          </div>
          <div className="ing-heading">
            <h4>{singleBlog.title}</h4>
            <div className="b-detail-intro">
              <div
                dangerouslySetInnerHTML={{ __html: singleBlog.description1 }}
              />
              {singleBlog.videoUrl?.includes("instagram") ? (
                ""
              ) : (
                <div className="detail-fig-b">
                  <div
                    dangerouslySetInnerHTML={{ __html: singleBlog.videoUrl }}
                  />
                </div>
              )}
              <p>
                <div
                  dangerouslySetInnerHTML={{ __html: singleBlog.description4 }}
                />
              </p>
            </div>
            <ul>
              {singleBlog.prepTime && <li>Prep Time: {singleBlog.prepTime}</li>}
              {singleBlog.noOfServe && <li>Serves: {singleBlog.noOfServe}</li>}
            </ul>
            {singleBlog.mediaLink ? (
              <a
                target="_blank"
                href={singleBlog.mediaLink}
                className="hide_button_blog"
                style={{ minWidth: 160, padding: 8 }}
              >
                <i className="far fa-play-circle"></i>
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="ingredient-detail-text">
          <div className="ing-detail-heading">
            <div
              dangerouslySetInnerHTML={{ __html: singleBlog.description2 }}
            />
          </div>
          <div className="in-bottom-wprer">
            <div
              dangerouslySetInnerHTML={{ __html: singleBlog.description3 }}
            />
          </div>
        </div>
      </div>
      <section className="detail-ingredient">
        <div className="container">
          {relatedProducts && relatedProducts.length > 0 && (
            <h5 className="inner-sub-heading">Ingredients available with us</h5>
          )}
          {/* <div className="product-list"> */}
          <Slider {...feat_slider1} className="res_slide">
            {relatedProducts && relatedProducts.length > 0
              ? relatedProducts.map((item) => {
                  var price = null;

                  var quantityshow = 0;
                  if (item.product_id.simpleData[0].package[0]) {
                    item.product_id.simpleData[0].package.map((pck, index) => {
                      if (pck.selected) {
                        quantityshow = pck.quantity;
                        if (props.user_details.length !== 0) {
                          if (props.user_details.user_type === "b2b") {
                            price = pck.B2B_price;
                          } else if (
                            props.user_details.user_type === "retail"
                          ) {
                            price = pck.Retail_price;
                          } else if (
                            props.user_details.user_type === "user" ||
                            props.user_details.user_type === null
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
                        if (props.user_details.length !== 0) {
                          if (props.user_details.user_type === "b2b") {
                            price = pck.B2B_price;
                          } else if (
                            props.user_details.user_type === "retail"
                          ) {
                            price = pck.Retail_price;
                          } else if (
                            props.user_details.user_type === "user" ||
                            props.user_details.user_type === null
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
                    quantityshow = item.product_id.simpleData[0].userQuantity;
                    if (props.user_details.length !== 0) {
                      if (props.user_details.user_type === "b2b") {
                        price = item.product_id.simpleData[0].RegionB2BPrice;
                      } else if (props.user_details.user_type === "retail") {
                        price = item.product_id.simpleData[0].RegionRetailPrice;
                      } else if (props.user_details.user_type === "user") {
                        price =
                          item.product_id.simpleData[0].RegionSellingPrice;
                      } else if (props.user_details.user_type === null) {
                        price =
                          item.product_id.simpleData[0].RegionSellingPrice;
                      } else {
                      }
                    } else {
                      if (item.product_id.simpleData[0].RegionSellingPrice) {
                        price =
                          item.product_id.simpleData[0].RegionSellingPrice;
                      } else {
                        price = item.product_id.simpleData[0].mrp;
                      }
                    }
                  }
                  let selPck =
                    item.product_id.simpleData[0] &&
                    item.product_id.simpleData[0].package.length > 0
                      ? item.product_id.simpleData[0].package.filter(
                          (a) => a.selected
                        )
                      : [];
                  console.log(selPck);
                  return price !== null
                    ? price !== 0 && item.product_id.status && (
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
                          <div className="product-thumb">
                            <Link to={"/product/" + item.product_id.slug}>
                              {item.product_id.images.length > 0 ? (
                                <img
                                  src={
                                    imageUrl + item.product_id.images[0].image
                                  }
                                />
                              ) : (
                                <img
                                  src={
                                    imageUrl + localStorage.getItem("prdImg")
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
                                    item.product_id.TypeOfProduct === "simple"
                                      ? item.product_id.simpleData[0] ===
                                          undefined ||
                                        (item.product_id.simpleData[0]
                                          .package[0] &&
                                          item.product_id.simpleData[0].package.map(
                                            (pck, index) => {
                                              if (pck.selected) {
                                                if (pck.selling_price) {
                                                  return pck.packetmrp;
                                                }
                                              } else if (
                                                showFirstPriceOnLoad &&
                                                index === 0
                                              ) {
                                                if (pck.selling_price) {
                                                  return pck.packetmrp;
                                                }
                                              }
                                            }
                                          ))
                                      : ""
                                    // item.configurableData[0].sellingPrice
                                  }
                                </span>
                              </span>
                              {item.product_id.sameDayDelivery === false ? (
                                <span className="next_day_delivery">
                                  Next day delivery only
                                </span>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="product-list-name">
                              <Link to={"/product/" + item.product_id.slug}>
                                {item.product_id.product_name}
                              </Link>
                            </div>
                            <div className="product-card-add">
                              {item.product_id.TypeOfProduct === "simple" ? (
                                item.product_id.simpleData[0].package[0] ? (
                                  <div className="detail-sub-arrow new-switcher new-switcher-related-product new_sw_new">
                                    {+quantityshow < 1 ? (
                                      ""
                                    ) : (
                                      <div
                                        className="qty-switcher minus"
                                        onClick={() =>
                                          subtractFromCart(item.product_id)
                                        }
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
                                      </div>
                                    )}
                                    <span className="text-add select-edit-tag">
                                      <div
                                        className="custom-select"
                                        style={{
                                          background: "#f3f3f3",
                                          lineHeight: "36px",
                                        }}
                                      >
                                        <select
                                          className="custom-select-form"
                                          onChange={(e) =>
                                            relatedHandleChange(e)
                                          }
                                          id={item.product_id._id}
                                          value={selPck[0]?._id}
                                        >
                                          {item.product_id.simpleData[0].package.map(
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
                                      </div>
                                    </span>
                                    {item.product_id.outOfStock ? (
                                      ""
                                    ) : (
                                      <div
                                        className="qty-switcher plus"
                                        onClick={() =>
                                          relatedProductAddToCart(
                                            item.product_id
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-plus"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="new-switcher new-switcher-related-product new_sw_new">
                                    {+quantityshow === 0 ? (
                                      ""
                                    ) : (
                                      <div
                                        className="qty-switcher minus"
                                        onClick={() =>
                                          subtractFromCart(item.product_id)
                                        }
                                      >
                                        {++quantityshow <= 1 ? (
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
                                      </div>
                                    )}
                                    <p className="without-package-fron">
                                      {item.product_id.unitQuantity}{" "}
                                      {item.product_id.unitMeasurement &&
                                        item.product_id.unitMeasurement
                                          .name}{" "}
                                      {+quantityshow > 0
                                        ? " - " + +quantityshow + " Qty"
                                        : ""}
                                    </p>
                                    {item.product_id.outOfStock ? (
                                      ""
                                    ) : (
                                      <div
                                        className="qty-switcher plus"
                                        onClick={() =>
                                          relatedProductAddToCart(
                                            item.product_id
                                          )
                                        }
                                      >
                                        <i
                                          className="fa fa-plus"
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                    )}
                                  </div>
                                )
                              ) : (
                                ""
                              )}
                            </div>
                            {/* Old add to cart functionalities*/}
                            {/* <div className="product-card-add">
                              <a>
                                <span className="card-button">
                                  <span className="label-add">
                                    <span className="text-add">
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
                                              onChange={(e) =>
                                                relatedHandleChange(e)
                                              }
                                              id={item.product_id._id}
                                            >
                                              {item.product_id.simpleData[0].package.map(
                                                (pck) => {
                                                  return (
                                                    <option value={pck._id}>
                                                      {pck.packetLabel}
                                                    </option>
                                                  );
                                                }
                                              )}
                                            </select>
                                          ) : (
                                            <p
                                              style={{
                                                textTransform: "capitalize",
                                              }}
                                            >
                                              {item.product_id.unitQuantity +
                                                " " +
                                                (item.product_id.unitMeasurement
                                                  .name
                                                  ? item.product_id
                                                      .unitMeasurement.name
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
                                  {item.product_id.outOfStock === false ? (
                                    <span
                                      className="label-icon"
                                      onClick={() =>
                                        relatedProductAddToCart(item.product_id)
                                      }
                                    >
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
                                        showOutofstockAlert(item.product_id)
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
                              */}
                            {/* Old add to cart functionalities*/}
                          </div>
                        </div>
                      )
                    : "";
                })
              : ""}
          </Slider>
          {/* </div> */}
        </div>
      </section>
      {youmayalsolike && youmayalsolike.length > 0 ? (
        <section className="b-featured">
          <div className="container">
            <div className="b--heading-box">
              <div className="b-text-left">
                <h5 className="b-heading">You may also like</h5>
              </div>
              <div className="b-text-right">
                <Link
                  to={
                    singleBlog && singleBlog.parentCat_id
                      ? "/recipe-category/" + singleBlog.parentCat_id[0].slug
                      : ""
                  }
                  // +
                  // ?
                  // : "featured%20recipes"
                >
                  view all
                </Link>
              </div>
            </div>

            <Slider {...feat_slider1}>
              {youmayalsolike &&
                youmayalsolike.map((blog) => {
                  return (
                    <div className="b-feat-col">
                      <div className="b-feat-fig">
                        <Link to={"/recipe/" + blog.slug}>
                          <img
                            style={{ maxWidth: "100%" }}
                            src={imageUrl + blog.images[0].image}
                            alt="image_you"
                          />
                        </Link>
                      </div>
                      <div className="b-feat-ctxt">
                        <h6 style={{ textTransform: "capitalize" }}>
                          <Link to={"/recipe/" + blog.slug}>{blog.title}</Link>
                        </h6>
                        <div className="tim-feat-b">
                          {blog.prepTime ? (
                            <div className="feat-top-b">
                              <span>Time</span>
                              <p>{blog.prepTime}</p>
                            </div>
                          ) : (
                            ""
                          )}
                          {blog.noOfServe ? (
                            <div className="feat-top-b-righ">
                              <span>Portion</span>
                              <p>{blog.noOfServe} Persons</p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
          <div></div>
        </section>
      ) : (
        ""
      )}
    </main>
  );
}
const mapStateToProps = (state) => ({
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BlogDetails)
);
