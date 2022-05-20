import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import sendCartDataToAPI from "../../components/sendCartDataToAPI";
import { addToCart, userdetails } from "../../redux/actions/actions";

class Login extends React.Component {
  constructor(props) {
    super(props);
    var path = this.props.location.pathname;
    var q_id = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (
      this.props.user_details.contactNumber &&
      this.props.user_details.email &&
      this.props.user_details.name
    ) {
      this.setState({
        verifymobilestatus: "fullytrue",
        buttonstatus: false,
      });
      this.props.history.push("my-profile");
    }
    this.state = {
      referal_code: q_id === "account" ? "" : q_id,
      email: "",
      password: "",
      verifymobilestatus: "false",
      buttonstatus: true,
      compopupstatus: false,
      genotp: "",
      address: "",
      serverotp: "",
      readonlytrue: false,
      redirectToHome: false,
      emailOnSignup: false,
      signupCompleted: false,
      showOtpForSignup: false,
      incompleteLogin: false,
      discount_amount: "",
    };
  }

  _handleForm(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  forward() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      this.state.contact &&
      this.state.name &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        contactNumber: this.state.contact,
        refferalCodeFrom: this.state.referal_code,
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/userUpdate", "POST", token)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.invalidRefferal) {
              swal({
                title: "Error",
                text: "Invalid referral code.",
                icon: "warning",
                dangerMode: true,
              });
            } else {
              this.props.userdetails(res.data.data);
              if (this.props.dataInCart.length === 0) {
                this.props.history.push("/");
                // localStorage.setItem("status", "false");
                window.location.reload();
              } else {
                this.props.history.push("/cart");
              }
            }
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // this.setState({
      //   compopupstatus: true,
      // });
    } else {
      var valueErr = document.getElementsByClassName("err");
      for (var i = 0; i < valueErr.length; i++) {
        valueErr[i].innerText = "";
      }
      if (!this.state.contact) {
        valueErr = document.getElementsByClassName("err_contact");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.name) {
        valueErr = document.getElementsByClassName("err_name");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.email) {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "This Field is Required";
      } else if (this.state.email.match(mailformat)) {
      } else {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "Enter Valid Email Address";
      }
    }
  }

  _handleFormmobile(val) {
    var name = val.target.name;
    var value = val.target.value;

    this.setState({
      [name]: value,
    });
  }

  verify() {
    this.setState({
      signupCompleted: false,
      showOtpForSignup: false,
      incompleteLogin: false,
    });
    if (isNaN(this.state.contact)) {
      swal({
        title: "Please enter number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact.length < 10 ||
      this.state.contact.length > 10
    ) {
      swal({
        title: "Please enter 10 Digit Number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (this.state.contact) {
      const requestData = {
        contactNumber: this.state.contact,
      };
      ApiRequest(requestData, "/mobileSignUp", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.data.userExists) {
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });
              if (res.data.data.name && res.data.data.email) {
                this.setState({ incompleteLogin: false });
              } else {
                this.setState({ incompleteLogin: true });
              }
            }
            this.setState({ user_id: res.data.data._id });
            if (res.data.data.userExists) {
              this.setState({
                verifymobilestatus: "semitrue",
                buttonstatus: false,
                readonlytrue: true,
                otttpp: res.data.data.otp,
              });
            } else {
              this.setState({
                verifymobilestatus: "fullytrue",
                compopupstatus: false,
                buttonstatus: false,
                readonlytrue: true,
              });
            }

            // localStorage.setItem("status", "false");
            // local cart data
            if (this.props.dataInCart.length > 0) {
              await sendCartDataToAPI(
                this.props.dataInCart,
                res.data.data,
                this.props.addToCart
              )
                .then((res) => {
                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else if (res.status === 400 && res.data.message === "error") {
            if (res.data.data) {
              swal({
                title: res.data.data,
                icon: "warning",
                dangerMode: true,
              });
            } else {
              alert("Account Deactivated. Please Contact Us For More Details");
            }
          }
        })
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Please enter your number",
        icon: "warning",
        dangerMode: true,
      });
    }
  }

  verifyWithEmail() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!this.state.email && isNaN(this.state.contact)) {
      swal({
        title: "Please enter number and email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (isNaN(this.state.contact)) {
      swal({
        title: "Please enter number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact.length < 10 ||
      this.state.contact.length > 10
    ) {
      swal({
        title: "Please enter 10 Digit Number",
        icon: "warning",
        dangerMode: true,
      });
    } else if (!this.state.email) {
      swal({
        title: "Please enter Email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (!this.state.email.match(mailformat)) {
      swal({
        title: "Please enter correct Email",
        icon: "warning",
        dangerMode: true,
      });
    } else if (
      this.state.contact &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      const requestData = {
        contactNumber: this.state.contact,
        email: this.state.email,
      };
      ApiRequest(requestData, "/mobileSignUp", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.data.name && res.data.data.email) {
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });
            }
            this.setState({ user_id: res.data.data._id });
            this.setState({
              verifymobilestatus: "semitrue",
              buttonstatus: false,
              readonlytrue: true,
              otttpp: res.data.data.otp,
            });
            // localStorage.setItem("status", "false");
            // local cart data
            if (this.props.dataInCart.length > 0) {
              await sendCartDataToAPI(
                this.props.dataInCart,
                res.data.data,
                this.props.addToCart
              )
                .then((res) => {
                  localStorage.setItem(
                    "discount_amount",
                    this.state.discount_amount
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          } else if (res.status === 400 && res.data.message === "error") {
            if (res.data.data) {
              swal({
                title: res.data.data,
                icon: "warning",
                dangerMode: true,
              });
            } else {
              alert("Account Deactivated. Please Contact Us For More Details");
            }
          }
        })
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      swal({
        title: "Please enter your number",
        icon: "warning",
        dangerMode: true,
      });
    }
  }

  verifyagain() {
    const requestData = {
      contactNumber: this.state.contact,
    };
    ApiRequest(requestData, "/resendOtp", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "OTP sent on email and SMS.",
            icon: "success",
            dangerMode: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendCartDataToApi = async () => {
    await sendCartDataToAPI(
      this.props.dataInCart,
      this.props.user_details,
      this.props.addToCart
    )
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
          setTimeout(() => {
            this.setState({
              redirectToHome: true,
            });
            this.props.history.push("/");
          });
        } else if (res.status === 200 || res.status === 201) {
          this.props.history.push("/cart");
        }
        this.forceUpdate();
      })
      .then(() => {
        // this.setState({
        //   redirectToHome: true,
        // });
        // this.props.history.push("/");
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

  onotpchange(val) {
    var cartDatabyAPI = [];
    var newpackage = [];
    localStorage.setItem("contact", this.state.contact);
    var name = val.target.name;
    var value = val.target.value;
    this.setState({
      [name]: value,
    });

    if (value.length == 6) {
      const requestData = {
        user_id: this.state.user_id,
        otp: value,
        getToken: true,
      };
      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.props.userdetails(res.data.data);
            localStorage.setItem("_jw_token", res.data.token);
            localStorage.setItem("contact", res.data.data.contactNumber);
            // localStorage.setItem("status", "false");
            if (this.props.dataInCart.length > 0) {
              this.sendCartDataToApi();
            }
            if (
              this.props.user_details.contactNumber &&
              this.props.user_details.name &&
              this.props.user_details.email
            ) {
              if (this.props.dataInCart.length === 0) {
                let dtaa = {};
                ApiRequest(
                  dtaa,
                  "/get/addtocart/" + this.props.user_details._id,
                  "GET"
                )
                  .then((res) => {
                    if (res.status === 201 || res.status === 200) {
                      if (
                        res.data.message === "error" ||
                        res.data.data.cartDetail.length === 0
                      ) {
                        this.props.history.push("/");
                        this.setState({
                          redirectToHome: true,
                        });
                      } else {
                        localStorage.setItem(
                          "status",
                          Boolean(res.data.data.subscribe)
                        );
                        res.data.data.cartDetail.map((item) => {
                          cartDatabyAPI.push({
                            _id: item.product_id._id,
                            product_name: item.product_id.product_name,
                            longDesc: item.product_id.longDesc,
                            shortDesc: item.product_id.shortDesc,
                            attachment: item.product_id.attachment,
                            banner: item.product_id.banner,
                            productThreshold: item.product_id.productThreshold,
                            productSubscription:
                              item.product_id.productSubscription,
                            salesTaxOutSide: item.product_id.salesTaxOutSide,
                            salesTaxWithIn: item.product_id.salesTaxWithIn,
                            purchaseTax: item.product_id.purchaseTax,
                            hsnCode: item.product_id.hsnCode,
                            unitMeasurement: item.unitMeasurement,
                            TypeOfProduct: item.product_id.TypeOfProduct,
                            SKUCode: item.product_id.SKUCode,
                            __v: item.product_id.__v,
                            created_at: item.product_id.created_at,
                            status: item.product_id.status,
                            bookingQuantity: +item.product_id.bookingQuantity,
                            productQuantity: +item.product_id.productQuantity,
                            availableQuantity:
                              +item.product_id.availableQuantity,
                            ProductRegion: item.product_id.ProductRegion,
                            relatedProduct: item.product_id.relatedProduct,
                            configurableData: [],
                            images: item.product_id.images,
                            qty: item.qty,
                            price: item.price,
                            unitQuantity: item.unitQuantity,
                            simpleData: item.simpleItem
                              ? item.simpleItem.packet_size
                                ? [
                                    {
                                      package: [
                                        {
                                          packet_size:
                                            item.simpleItem.packet_size,
                                          packetLabel:
                                            item.simpleItem.packetLabel,
                                          selling_price:
                                            item.simpleItem.selling_price,
                                          packetmrp: item.simpleItem.packetmrp,
                                          _id: item.simpleItem._id,
                                          quantity: item.qty,
                                          selected: true,
                                          B2B_price: item.simpleItem.B2B_price,
                                          Retail_price:
                                            item.simpleItem.Retail_price,
                                        },
                                      ],
                                      availableQuantity:
                                        item.product_id.simpleData[0]
                                          .availableQuantity,
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
                                        item.product_id.simpleData?.[0]
                                          .RegionB2BPrice,
                                      RegionRetailPrice:
                                        item.product_id.simpleData?.[0]
                                          .RegionRetailPrice,
                                      availableQuantity:
                                        item.product_id.simpleData?.[0]
                                          .availableQuantity,
                                    },
                                  ]
                              : [],
                          });
                        });
                        cartDatabyAPI = cartDatabyAPI.filter(
                          (itm) => itm.productSubscription === "yes"
                        );
                        this.props.addToCart(cartDatabyAPI);
                        this.setState({
                          loading: false,
                          redirectToHome: true,
                        });
                        setTimeout(() => {
                          this.props.history.push("/cart");
                        }, 0);
                      }
                    }
                  })
                  .then(() => {
                    this.forceUpdate();
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              } else {
                // this.setState({
                //   redirectToHome: true,
                // });
                // this.props.history.push("/");
              }
            } else {
              this.setState({
                verifymobilestatus: "fullytrue",
                compopupstatus: false,
              });
            }
            localStorage.setItem("contact", this.state.contact);
            let tokenExpireTime = new Date();
            tokenExpireTime.setDate(tokenExpireTime.getDate() + 1);
            localStorage.setItem("session", JSON.stringify(tokenExpireTime));
          } else {
            swal({
              title: "Enter correct OTP",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (value.length > 6) {
        swal({
          title: "Enter correct OTP",
          // text: "Are you sure that you want to leave this page?",
          icon: "warning",
          dangerMode: true,
        });
      }
    }
  }

  onsignupotpchange(val) {
    localStorage.setItem("contact", this.state.contact);
    var name = val.target.name;
    var value = val.target.value;
    this.setState({
      [name]: value,
    });

    if (value.length == 6) {
      const requestData = {
        user_id: this.state.user_id,
        otp: value,
        getToken: true,
      };
      ApiRequest(requestData, "/userMobileVerification", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            this.setState({ signupCompleted: true });
            localStorage.setItem("_jw_token", res.data.token);
            localStorage.setItem("contact", res.data.data.contactNumber);
            let tokenExpireTime = new Date();
            tokenExpireTime.setDate(tokenExpireTime.getDate() + 1);
            localStorage.setItem("session", JSON.stringify(tokenExpireTime));
          } else {
            swal({
              title: "Enter correct OTP",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (value.length > 6) {
        swal({
          title: "Enter correct OTP",
          // text: "Are you sure that you want to leave this page?",
          icon: "warning",
          dangerMode: true,
        });
      }
    }
  }
  verifySignup() {
    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      this.state.contact &&
      this.state.name &&
      this.state.email &&
      this.state.email.match(mailformat)
    ) {
      // this.setState({ showOtpForSignup: true });
      const requestData = {
        name: this.state.name,
        email: this.state.email,
        contactNumber: this.state.contact,
        refferalCodeFrom: this.state.referal_code,
      };
      ApiRequest(requestData, "/createUserWhileSignup", "POST")
        .then(async (res) => {
          if (res.status === 201 || res.status === 200) {
            if (res.data.invalidRefferal) {
              swal({
                title: "Error",
                text: "Invalid referral code.",
                icon: "warning",
                dangerMode: true,
              });
            } else if (res.data.result) {
              if (res.data.result[0].contactNumber) {
                swal({
                  title: "Error",
                  text: res.data.result[0].contactNumber,
                  icon: "warning",
                  dangerMode: true,
                });
              }
            } else {
              swal({
                title: "OTP sent on email and SMS.",
                icon: "success",
                dangerMode: false,
              });
              this.setState({
                showOtpForSignup: true,
                user_id: res.data.data._id,
                otttpp: res.data.data.otp,
              });
              if (this.props.dataInCart.length > 0) {
                await sendCartDataToAPI(
                  this.props.dataInCart,
                  res.data.data,
                  this.props.addToCart
                )
                  .then((res) => {
                    localStorage.setItem(
                      "discount_amount",
                      this.state.discount_amount
                    );
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            }
          } else {
            swal({
              title: "Error",
              text: "Network Error",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // this.setState({
      //   compopupstatus: true,
      // });
    } else {
      var valueErr = document.getElementsByClassName("err");
      for (var i = 0; i < valueErr.length; i++) {
        valueErr[i].innerText = "";
      }
      if (!this.state.contact) {
        valueErr = document.getElementsByClassName("err_contact");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.name) {
        valueErr = document.getElementsByClassName("err_name");
        valueErr[0].innerText = "This Field is Required";
      }
      if (!this.state.email) {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "This Field is Required";
      } else if (this.state.email.match(mailformat)) {
      } else {
        valueErr = document.getElementsByClassName("err_email");
        valueErr[0].innerText = "Enter Valid Email Address";
      }
    }
  }

  editmobile = () => {
    this.setState({
      verifymobilestatus: "false",
      buttonstatus: true,
      compopupstatus: false,
      readonlytrue: false,
    });
  };

  componentDidMount() {
    let requestData = {};
    ApiRequest(requestData, "/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            emailOnSignup: res.data.data[0].emailOnSignup,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    if (this.state.redirectToHome) {
      this.props.history.push("/");
    }
    return (
      <>
        <div className="page-wrapper">
          {this.state.compopupstatus === true ? (
            ""
          ) : (
            <main className="page-content latest_page_degs">
              <div className="banner_bk_imag login-bk-image">
                <section className="center-form-single-col">
                  <div className="responsive_lgin">
                    <h3>Login/Sign up</h3>
                    <form>
                      <>
                        <div className="form-group">
                          <label>Mobile Number</label>

                          <input
                            type="text"
                            name="contact"
                            onChange={(val) => this._handleFormmobile(val)}
                            className="count"
                            placeholder="Contact Number"
                            readOnly={
                              this.state.readonlytrue == true ? true : false
                            }
                          />
                        </div>
                        {/* {this.state.emailOnSignup ? (
                          <div className="form-group">
                            <label>Email</label>

                            <input
                              type="text"
                              name="email"
                              onChange={(val) => this._handleForm(val)}
                              className="count"
                              placeholder="Email"
                            />
                          </div>
                        ) : (
                          ""
                        )} */}

                        {this.state.buttonstatus == true ? (
                          <>
                            <div className="form-bottom">
                              <button
                                type="button"
                                className="button-design"
                                onClick={(ev) => this.verify(ev)}
                              >
                                <span className="button-text">Proceed</span>
                                <span className="button-overlay"></span>
                              </button>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                        {/* {this.state.verifymobilestatus == "fullytrue" ? (
                          <span className="check-edit">
                            <i className="fa fa-check-square-o" aria-hidden="true"></i>
                          </span>
                        ) : (
                          ""
                        )} */}
                      </>

                      {this.state.verifymobilestatus == "semitrue" ? (
                        <>
                          <span className="check-name">
                            Enter OTP - {this.state.otttpp}
                          </span>
                          <span className="check-mail modal-right-bx otp_design">
                            <input
                              type="text"
                              placeholder="Enter OTP"
                              maxLength="6"
                              className="count"
                              onChange={(event) => this.onotpchange(event)}
                            ></input>
                          </span>
                          <span
                            className="resend_otp"
                            onClick={(ev) => this.verifyagain(ev)}
                          >
                            Resend OTP
                            <i className="fa fa-undo" aria-hidden="true"></i>
                          </span>
                        </>
                      ) : (
                        ""
                      )}

                      {this.state.verifymobilestatus == "fullytrue" ? (
                        <>
                          <span className="check-name">Name</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="text"
                              name="name"
                              onChange={(val) => this._handleForm(val)}
                              className="count"
                              placeholder="Name"
                              readOnly={
                                this.state.showOtpForSignup == true
                                  ? true
                                  : false
                              }
                            />
                          </span>
                          <span
                            style={{ color: "red" }}
                            className="err_name"
                          ></span>
                        </>
                      ) : (
                        ""
                      )}
                      {this.state.verifymobilestatus == "fullytrue" ? (
                        <>
                          <span className="check-name">Email</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="text"
                              name="email"
                              onChange={(val) => this._handleForm(val)}
                              className="count"
                              placeholder="Email"
                              readOnly={
                                this.state.showOtpForSignup == true
                                  ? true
                                  : false
                              }
                            />
                          </span>
                          <span
                            style={{ color: "red" }}
                            className="err_email"
                          ></span>
                        </>
                      ) : (
                        ""
                      )}

                      {this.state.verifymobilestatus == "fullytrue" ? (
                        <>
                          <span className="check-name">Referral Code</span>
                          <span className="check-mail modal-right-bx">
                            <input
                              type="text"
                              value={this.state.referal_code}
                              name="referal_code"
                              onChange={(val) => this._handleForm(val)}
                              className="count"
                              placeholder="Referral Code"
                              readOnly={
                                this.state.showOtpForSignup == true
                                  ? true
                                  : false
                              }
                            />
                          </span>
                          <span
                            style={{ color: "red" }}
                            className="err_referal"
                          ></span>
                        </>
                      ) : (
                        ""
                      )}
                      {!this.state.incompleteLogin &&
                      this.state.verifymobilestatus == "fullytrue" ? (
                        this.state.showOtpForSignup ? (
                          !this.state.signupCompleted && (
                            <>
                              <span className="check-name">
                                Enter OTP - {this.state.otttpp}
                              </span>
                              <span className="check-mail modal-right-bx otp_design">
                                <input
                                  type="text"
                                  placeholder="Enter OTP"
                                  maxLength="6"
                                  className="count"
                                  onChange={(event) =>
                                    this.onsignupotpchange(event)
                                  }
                                ></input>
                              </span>
                              <span
                                className="resend_otp"
                                onClick={(ev) => this.verifyagain(ev)}
                              >
                                Resend OTP
                                <i
                                  className="fa fa-undo"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </>
                          )
                        ) : (
                          <button
                            type="button"
                            className="button-design"
                            onClick={(ev) => this.verifySignup(ev)}
                          >
                            Send OTP
                          </button>
                        )
                      ) : (
                        ""
                      )}
                      {this.state.verifymobilestatus == "fullytrue" ? (
                        this.state.signupCompleted ? (
                          <button
                            type="button"
                            className="button-design"
                            onClick={(ev) => this.forward(ev)}
                          >
                            Save and Continue
                          </button>
                        ) : this.state.incompleteLogin ? (
                          <button
                            type="button"
                            className="button-design"
                            onClick={(ev) => this.forward(ev)}
                          >
                            Save and Continue
                          </button>
                        ) : (
                          ""
                        )
                      ) : (
                        ""
                      )}
                    </form>
                    <div className="form-group">
                      {/* <p>A OTP will be sent to your number.</p> */}
                      <p>
                        {" "}
                        Your personal data will be used to support your
                        experience throughout this website to manage access to
                        your account, and for other purposes described in our{" "}
                        <Link to="/Privacy-Policy" style={{ display: "block" }}>
                          Privacy Policy.
                        </Link>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

const dispatchStateToProps = (dispatch) => ({
  userdetails: (data) => dispatch(userdetails(data)),
  addToCart: (data) => dispatch(addToCart(data)),
});

export default connect(mapStateToProps, dispatchStateToProps)(Login);
