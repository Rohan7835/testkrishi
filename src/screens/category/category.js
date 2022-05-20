import React from "react";
import { connect } from "react-redux";
import footerLogo from "../../assets/img/footer-logo.jpg";
import { findObjectByKey } from "../../components/common";
import { imageUrl } from "../../components/imgUrl";

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: [],
      catData: [],
      // category_id: (this.props.history.location.search).replace(/\?/g, ""),
      category_id: localStorage.getItem("search"),
      carts: localStorage.getItem("cartData")
        ? JSON.parse(localStorage.getItem("cartData"))
        : [],
    };
    window.scrollTo(0, 0);
  }

  async filterProducts() {
    var category_id = localStorage.getItem("search");
    this.setState({
      productData: await this.props.products.data.filter(
        (i) => i.product_cat_id._id == category_id
      ),
      catData: await this.props.categories.data.filter(
        (i) => i._id === category_id
      )[0],
    });
  }
  _handleQuantity = () => {
    this.state.carts.map((item, index) => {
      return this.setState({ [item.product_id]: item.quantity });
    });
  };

  async componentDidMount() {
    this.filterProducts();
    this._handleQuantity();
  }

  _handleProduct(item) {
    var productSelected = {
      data: item,
      quantity: this.state[item._id] ? this.state[item._id] : 1,
    };

    localStorage.setItem("data", JSON.stringify(productSelected));
    window.location = "/product";
  }

  async _handleCartClick(productItem, quantity) {
    var data = await JSON.parse(localStorage.getItem("cartData"));
    var cartData = [];
    var quantity =
      this.state[productItem._id] && this.state[productItem._id] != undefined
        ? this.state[productItem._id]
        : 1;
    var productSelected = {
      product_id: productItem._id,
      quantity: quantity,
      variant: productItem.product_variant[0],
    };
    cartData = data ? data : [];

    var res1 = null;
    var res2 = null;

    res1 = findObjectByKey(cartData, "product_id", productItem._id);
    res2 = findObjectByKey(cartData, "quantity", quantity._id);

    if (res1 != null) {
      if (res1 === res2) {
      } else {
        cartData[res1] = productSelected;
      }
    } else {
      await cartData.push(productSelected);
    }
    localStorage.setItem("cartData", await JSON.stringify(cartData));
    this.props.history.push({ pathname: "cart" });
  }

  shouldComponentUpdate(nextProps, nextState) {
    var category_id = localStorage.getItem("search");

    if (category_id != nextState.catData._id) {
      this.setState({
        productData: this.props.products.data.filter(
          (i) => i.product_cat_id._id == category_id
        ),
        catData: this.props.categories.data.filter(
          (i) => i._id === category_id
        )[0],
      });
    }
    return true;
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

  render() {
    return (
      <>
        <main>
          <div className="category-wrap">
            <div className="container">
              <h2>{this.state.catData.category_name}</h2>
              <p>Home/{this.state.catData.category_name}</p>
              <div className="category-result">
                <div className="all-cat-result">
                  Showing all {this.state.productData.length} Results
                </div>
              </div>
              <div className="product-category">
                <ul>
                  {this.state.productData.map((item, index) => {
                    return (
                      <li>
                        <div className="product-bx">
                          <div
                            className="product-figure"
                            onClick={() => this._handleProduct(item)}
                          >
                            <picture>
                              <source
                                srcset="main-banner.jpg"
                                media="(max-width: 767px)"
                              />
                              <img
                                src={imageUrl + item.product_variant[0].image}
                                alt=""
                              />
                            </picture>
                            <div className="buy-now">
                              <a>Buy Now</a>
                            </div>
                          </div>
                          <div className="product-figcaption">
                            <h4 className="pro-title">{item.product_name}</h4>
                            <div className="price-bx">
                              <div className="pro-price">
                                ${item.selling_price}
                              </div>
                              <div className="qty">
                                <div className="qty-click">
                                  <td>
                                    <span
                                      onClick={this.minus.bind(
                                        this,
                                        this.state[item._id]
                                          ? this.state[item._id]
                                          : 1,
                                        item._id
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
                                        this.state[item._id]
                                          ? this.state[item._id]
                                          : 1
                                      }
                                    />
                                    <span
                                      onClick={this.plus.bind(
                                        this,
                                        this.state[item._id]
                                          ? this.state[item._id]
                                          : 1,
                                        item._id
                                      )}
                                    >
                                      <button type="button" className="add">
                                        +
                                      </button>
                                    </span>
                                  </td>
                                </div>
                              </div>
                            </div>
                            <a
                              onClick={() => this._handleProduct(item)}
                              className="add-cart"
                            >
                              ADD TO CART
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
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

export default connect(mapStateToProps)(Category);
