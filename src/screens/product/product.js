import React from "react";
import { connect } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Slider from "react-slick";
import { ApiRequest } from "../../apiServices/ApiRequest";
import footerLogo from "../../assets/img/footer-logo.jpg";
import Hint from "../../assets/img/Hint.jpg";
import Shipping from "../../assets/img/Shipping.jpg";
import Size from "../../assets/img/Size.jpg";
import { findObjectByKey } from "../../components/common";
import { imageUrl } from "../../components/imgUrl";
import { addToCart } from "../../redux/actions/actions";

const noImage = require("../../assets/img/noImage.jpg");

var settings1 = {
  dots: true,
  centerMode: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerPadding: "0px",
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 992,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        slidesToShow: 1,
      },
    },
  ],
};
var productData = [];

class Product extends React.PureComponent {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("data");
    if (dt) {
      productData = [JSON.parse(localStorage.getItem("data")).data];
      window.scrollTo(0, 0);
    } else {
      window.location = "/";
    }
    this.state = {
      data: localStorage.getItem("data")
        ? [JSON.parse(localStorage.getItem("data"))]
        : [],
      all_Variants: localStorage.getItem("data")
        ? JSON.parse(localStorage.getItem("data")).data.product_variant
        : [],

      // selected_Variants: [JSON.parse(localStorage.getItem('data')).data.product_variant[0]],
      selected_Variants: JSON.parse(localStorage.getItem("data"))
        .dataByVariations
        ? [JSON.parse(localStorage.getItem("data")).dataByVariations]
        : [],
      dropdownColor: [],
      dropdownSize: [],
      our_product_code: "",
      catData: [],
      productData: [JSON.parse(localStorage.getItem("data")).data]
        ? [JSON.parse(localStorage.getItem("data")).data]
        : [],
      pData: [],
      size: JSON.parse(localStorage.getItem("data")).dataByVariations
        ? JSON.parse(localStorage.getItem("data")).dataByVariations.size
        : [],
      color: JSON.parse(localStorage.getItem("data")).dataByVariations
        ? JSON.parse(localStorage.getItem("data")).dataByVariations.color
        : [],
      variantStatus: false,
      imagerender: true,
    };
  }

  async componentDidMount() {
    // this.props.getCategories()
    // this.props.getProducts()etl foundation
    this.getCategories();
    this.getProducts();

    this.setState({
      // color: this.state.data[0].data.product_variant[0] ? this.state.data[0].data.product_variant[0].color : '',
      // size: this.state.data[0].data.product_variant[0] ? this.state.data[0].data.product_variant[0].size : '',
      // size: '',
      // color: '',
      our_product_code: await this.state.data[0].data.our_product_code,
    });
    this._handleQuantity();
    this.getProductColor();
    this.getProductSizes();

    if (this.state.selected_Variants) {
      this.setState({ variantStatus: true });
    }
  }

  _handleQuantity = async () => {
    this.state.data.map((item, index) => {
      return this.setState({ [item.data._id]: item.quantity });
    });
  };

  getCategories() {
    this.setState({ catData: this.props.categories.data });
  }

  getProducts() {
    if (this.state.data[0]) {
      this.setState({
        pData: this.props.products.data.filter(
          (i) =>
            i.product_cat_id._id === this.state.data[0].data.product_cat_id._id
        ),
      });
    }
  }

  minus = (quantity, ide) => {
    if (quantity <= 1) {
    } else {
      this.setState({ [ide]: quantity - 1 });
    }
  };

  plus = (quantity, ide) => {
    this.setState({ [ide]: quantity + 1 });
  };

  // our_product_code
  getProductSizes = (data) => {
    const requestData = {
      our_product_code: this.state.our_product_code,
      size: this.state.size,
    };
    ApiRequest(requestData, "/color_master/active", "GET", "", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({ dropdownColor: res.data.data });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async _handleProduct(item) {
    var productSelected = {
      data: item,
      quantity: this.state[item._id] ? this.state[item._id] : 1,
    };

    this.setState({
      data: await [productSelected],
      productData: [productSelected.data],
    });
    this.setState({
      imagerender: true,
    });
    localStorage.setItem("data", JSON.stringify(productSelected));

    this.forceUpdate();
  }

  getProductColor = (data) => {
    const requestData = {
      our_product_code: this.state.our_product_code,
      color: this.state.color,
    };
    // ApiRequest(requestData, '/get_product_size_by_code', 'POST', '', '')
    ApiRequest(requestData, "/size_master/active", "GET", "", "")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            dropdownSize: res.data.data,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async _handleCartClick(productItem) {
    if (this.state.size && this.state.color) {
      var data = await JSON.parse(localStorage.getItem("cartData"));
      var cartData = [];
      var quantity =
        this.state[productItem._id] && this.state[productItem._id] !== undefined
          ? this.state[productItem._id]
          : 1;
      var productSelected = {
        product_id: productItem._id,
        quantity: quantity,
        variant: this.state.selected_Variants[0],
      };
      cartData = data ? data : [];

      var res1 = null;
      var res2 = null;
      res1 = findObjectByKey(
        cartData,
        "product_id",
        this.state.selected_Variants[0]._id
      );
      res2 = findObjectByKey(cartData, "quantity", quantity._id);

      if (res1 != null) {
        if (res1 === res2) {
        } else {
          cartData[res1] = productSelected;
        }
      } else {
        await cartData.push(productSelected);
        // await cartData.push(this.state.selected_Variants)
      }
      this.props.addToCart(cartData);
      localStorage.setItem("cartData", await JSON.stringify(cartData));

      if (this.state.selected_Variants) {
        this.props.history.push({ pathname: "cart" });
      }
    } else {
      this.handlecolor();
    }
  }
  handlecolor() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!this.state.color) {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "Please Select Color";
    } else {
      valueErr = document.getElementsByClassName("err_color");
      valueErr[0].innerText = "";
    }
    if (!this.state.size) {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "Please Select Size";
    } else {
      valueErr = document.getElementsByClassName("err_size");
      valueErr[0].innerText = "";
    }
  }
  componentWillUnmount() {
    localStorage.removeItem("data");
  }

  render() {
    return (
      <>
        <main>
          <div className="mj-product-wrap">
            <div className="container">
              <div className="pro-product-bx">
                <div className="product-gallery">
                  <div className="product-figure">
                    {/* <img
                      src={
                        this.state.selected_Variants &&
                        this.state.selected_Variants[0]
                          ? imageUrl + this.state.selected_Variants[0].image
                          : this.state.data[0].data.images[0] ? imageUrl + this.state.data[0].data.images[0] :''
                      }
                    /> */}
                  </div>
                  <div className="product-mini-slid">
                    <div className="mini-slider">
                      {this.state.imagerender === true ? (
                        <Carousel>
                          <div>
                            <img
                              alt="variant img"
                              src={
                                this.state.selected_Variants &&
                                this.state.selected_Variants[0]
                                  ? imageUrl +
                                    this.state.selected_Variants[0].image
                                  : this.state.data[0].data.images[0]
                                  ? imageUrl + this.state.data[0].data.images[0]
                                  : ""
                              }
                            />
                          </div>
                          {this.state.data[0].data.images &&
                          this.state.data[0].data.images[0]
                            ? this.state.data[0].data.images.map((item, ix) => {
                                return (
                                  <div key={ix}>
                                    <img alt="data img" src={imageUrl + item} />
                                  </div>
                                );
                              })
                            : ""}

                          {this.state.all_Variants && this.state.all_Variants[0]
                            ? this.state.all_Variants.map((item, ix) => {
                                return (
                                  <div key={ix}>
                                    <img
                                      alt="data variant"
                                      src={
                                        item ? imageUrl + item.image : noImage
                                      }
                                    />
                                  </div>
                                );
                              })
                            : ""}
                        </Carousel>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="product-info-main">
                  <h3>
                    {this.state.productData && this.state.productData[0]
                      ? this.state.productData[0].product_name
                      : ""}
                  </h3>
                  <strong>
                    {this.state.selected_Variants &&
                    this.state.selected_Variants[0]
                      ? "$" + this.state.selected_Variants[0].price
                      : ""}
                  </strong>
                  <div className="metal-select">
                    <label>Color</label>
                    <div className="cselect">
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        value={this.state.color}
                        onChange={(val) => this._handleVariant(val, "color")}
                      >
                        <option value="">Select Color</option>
                        {this.state.dropdownColor &&
                        this.state.dropdownColor[0] ? (
                          this.state.dropdownColor.map((i) => {
                            return <option>{i.name}</option>;
                          })
                        ) : (
                          <option>N/A</option>
                        )}
                      </select>
                      <span
                        style={{ color: "red" }}
                        className="err_color"
                      ></span>
                    </div>
                  </div>
                  <div className="metal-select">
                    <label>Size</label>
                    <div className="cselect">
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        value={this.state.size}
                        onChange={(val) => this._handleVariant(val, "size")}
                      >
                        <option value="">Select Size</option>
                        {this.state.dropdownSize &&
                        this.state.dropdownSize[0] ? (
                          this.state.dropdownSize.map((i) => {
                            return <option>{i.name}</option>;
                          })
                        ) : (
                          <option>N/A</option>
                        )}
                      </select>
                      <span
                        style={{ color: "red" }}
                        className="err_size"
                      ></span>
                    </div>
                  </div>
                  <div className="pro-qty">
                    <label>QTY</label>
                    <div className="qty-click">
                      <span
                        onClick={this.minus.bind(
                          this,
                          this.state[productData[0]._id]
                            ? this.state[productData[0]._id]
                            : 1,
                          productData[0]._id
                        )}
                      >
                        <button type="button" className="sub">
                          -
                        </button>
                      </span>
                      <input
                        className="count"
                        type="text"
                        value={
                          this.state[productData[0]._id]
                            ? this.state[productData[0]._id]
                            : 1
                        }
                      />
                      <span
                        onClick={this.plus.bind(
                          this,
                          this.state[productData[0]._id]
                            ? this.state[productData[0]._id]
                            : 1,
                          productData[0]._id
                        )}
                      >
                        <button type="button" className="add">
                          +
                        </button>
                      </span>
                    </div>
                  </div>
                  <div className="pro-buy-btn">
                    <button
                      className={
                        !this.state.variantStatus
                          ? "Not_Available"
                          : "Buy_Now pro-buy"
                      }
                      onClick={() => this._handleCartClick(productData[0])}
                      disabled={!this.state.variantStatus ? true : false}
                    >
                      {!this.state.variantStatus ? "Not Available" : "Buy Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="product-like">
            <div className="container">
              <h3>You may also like</h3>

              <div>
                <div className="category-product">
                  <div className="view-btn"></div>
                  <div className="category-slid-bx">
                    <div className="category-slider">
                      <Slider {...settings1}>
                        {this.state.pData && this.state.pData[0]
                          ? this.state.pData.map((productItem, index) => {
                              return productItem &&
                                this.state.data[0].data._id !==
                                  productItem._id ? (
                                <div key={index}>
                                  <div className="product-bx">
                                    <div
                                      className="product-figure"
                                      onClick={() =>
                                        this._handleProduct(productItem)
                                      }
                                    >
                                      <a
                                        href={
                                          productItem.images &&
                                          productItem.images[0]
                                            ? imageUrl + productItem.images[0]
                                            : noImage
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <picture>
                                          <img
                                            alt="pictre"
                                            src={
                                              productItem.images &&
                                              productItem.images[0]
                                                ? imageUrl +
                                                  productItem.images[0]
                                                : noImage
                                            }
                                          />
                                        </picture>
                                      </a>
                                      <div className="buy-now">
                                        <span>Buy Now</span>
                                      </div>
                                    </div>

                                    <div className="product-figcaption">
                                      <h4 className="pro-title">
                                        {productItem.product_name}
                                      </h4>
                                      <div className="price-bx">
                                        <div className="pro-price">
                                          ${productItem.selling_price}
                                        </div>
                                        <div className="qty">
                                          <div className="qty-click">
                                            {
                                              <td>
                                                <span
                                                  onClick={this.minus.bind(
                                                    this,
                                                    this.state[productItem._id]
                                                      ? this.state[
                                                          productItem._id
                                                        ]
                                                      : 1,
                                                    productItem._id
                                                  )}
                                                >
                                                  <button
                                                    type="button"
                                                    className="sub"
                                                  >
                                                    -
                                                  </button>
                                                </span>
                                                <input
                                                  className="count"
                                                  type="text"
                                                  value={
                                                    this.state[productItem._id]
                                                      ? this.state[
                                                          productItem._id
                                                        ]
                                                      : 1
                                                  }
                                                />
                                                <span
                                                  onClick={this.plus.bind(
                                                    this,
                                                    this.state[productItem._id]
                                                      ? this.state[
                                                          productItem._id
                                                        ]
                                                      : 1,
                                                    productItem._id
                                                  )}
                                                >
                                                  <button
                                                    type="button"
                                                    className="add"
                                                  >
                                                    +
                                                  </button>
                                                </span>
                                              </td>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                      <a
                                        onClick={() =>
                                          this._handleProduct(productItem)
                                        }
                                        className="add-cart"
                                      >
                                        ADD TO CART
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                ""
                              );
                            })
                          : ""}
                      </Slider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="product-shippi">
            <div className="container">
              <div className="inner-pro-row">
                <div className="inner-pro-col">
                  <img src={Shipping} />
                  <h5>Complimentary Shipping & Returns</h5>
                  <p>
                    Purchases made online can be returned or exchanged within 60
                    days, plus shipping in on us.
                  </p>
                  <p>Learn More {">"}</p>
                </div>
                <div className="inner-pro-col">
                  <img src={Hint} />
                  <h5>Drop a Hint</h5>
                  <p>Let us tell sameone special what you're wishing for.</p>
                  <p>Drop a Hint {">"}</p>
                </div>
                <div className="inner-pro-col">
                  <img src={Size} />
                  <h5>Size Guide</h5>
                  <p>Determine your brocelet, necklace or ring size.</p>
                  <p>Find Your Fit {">"}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="newsletters-wrap">
            <div className="container">
              <div className="newsletters">
                <div className="newsletters-logo">
                  <a href="#">
                    <img src={footerLogo} />
                  </a>
                </div>
                <div className="newsletters-form">
                  <form>
                    <div className="form-group">
                      <input type="Email" placeholder="Email Address" />
                      <button className="bubscribe-btn">Subscribe</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const dispatchStateToProps = (dispatch) => ({
  addToCart: () => dispatch(addToCart()),
  // getCategories: () => dispatch(getCategories()),
  // getProducts: () => dispatch(getProducts()),
});

export default connect(mapStateToProps, dispatchStateToProps)(Product);
