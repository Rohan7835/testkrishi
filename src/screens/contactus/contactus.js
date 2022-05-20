import React from "react";
import { connect } from "react-redux";
import SelectSearch from "react-select-search";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import { userdetails } from "../../redux/actions/actions";
const AnyReactComponent = ({ text }) => <div>{text}</div>;
class Contactus extends React.Component {
  constructor(props) {
    super(props);
    console.log("jsdjeavdj", props);
    this.state = {
      center: {
        lat: 59.95,
        lng: 30.33,
      },
      zoom: 11,
      name: "",
      email: "",
      mobile: "",
      city: "",
      qwery: "",
      selectedOrder: "",
      all_order: [],
      map: "",
      companyname: "",
    };
  }
  _handleForm(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  forward = (ev) => {
    let name = this.state.name;
    let email = this.state.email;
    let mobile = this.state.mobile;
    let city = this.state.city;
    let qwery = this.state.qwery;
    let booking_id = this.state.selectedOrder
      ? this.state.selectedOrder.value
      : "";

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    var mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email && email.match(mailformat)) {
    } else {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "Enter Valid E-Mail";
    }
    if (!email) {
      valueErr = document.getElementsByClassName("err_email");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!mobile) {
      valueErr = document.getElementsByClassName("err_mobile");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!city) {
      valueErr = document.getElementsByClassName("err_city");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!qwery) {
      valueErr = document.getElementsByClassName("err_qwery");
      valueErr[0].innerText = "This Field is Required";
    }

    if (name && mobile && email && city && qwery && email.match(mailformat)) {
      this.setState({
        loading: true,
      });
      var requestData = new FormData();
      var attachment = document.querySelector('input[name="attachment"]')
        .files[0];
      requestData.append("attachment", attachment);
      requestData.append("name", name);
      requestData.append("email", email);
      requestData.append("mobile", mobile);
      requestData.append("city", city);
      requestData.append("feedback", qwery);
      requestData.append("booking_id", booking_id);

      ApiRequest(requestData, "/addFeedback", "POST", "", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Query /  Feedback Submitted",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            }).then((status) => {
              if (status) {
                this.props.history.push("/");
              }
            });
            this.setState({
              loading: false,
              city: "",
              feedback: "",
              name: "",
              email: "",
              mobile: "",
              qwery: "",
              selectedOrder: "",
            });
          } else {
            swal({
              title: "Network Issue",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      this.setState({
        loading: false,
      });
    }
  };

  componentDidMount() {
    if (Array.isArray(this.props.user_details) === false) {
      this.orderdetails();
    }

    this.setState({
      name: this.props.user_details.name,
      mobile: this.props.user_details.contactNumber,
      email: this.props.user_details.email,
    });

    let requestData = {};
    ApiRequest(requestData, "/getSetting", "GET")
      .then((res) => {
        if (res.status !== 401 || res.status !== 400) {
          this.setState({
            companyname: res.data.data[0].companyName,
            map: res.data.data[0].map,
            corporateOffice: res.data.data[0].corporateOffice,
            email1: res.data.data[0].email1,
            phone2: res.data.data[0].phone2,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({
      loading: false,
    });
  }
  componentWillUnmount() {}
  orderdetails() {
    if (Array.isArray(this.props.user_details) === false) {
      const requestData = {};
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      ApiRequest(requestData, "/getUserBooking", "POST", token)
        .then((res) => {
          var allBookings = [];
          if (res.status === 201 || res.status === 200) {
            res.data.data.forEach((dta) => {
              allBookings.push({
                name: dta.booking_code,
                value: dta.booking_code,
              });
            });
            this.setState({
              all_order: allBookings,
            });
          } else if (res.status !== 503) {
            swal({
              title: "Error",
              text: "Network error",
              icon: "warning",
              dangerMode: true,
            });
          } else {
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  changeOrder = (e) => {
    this.setState({
      selectedOrder: { name: e.name, value: e.value },
    });
  };
  render() {
    return (
      <>
        <div className="contact-page-fron">
          <div className="my-order-wrap latest_contact_us">
            <div className="contact_new">
              <div className="outside_ap">
                <div
                  className="inside_map"
                  dangerouslySetInnerHTML={{ __html: this.state.map }}
                ></div>

                <div className="address_detail">
                  <span className="common_sapn address_deti">
                    <div className="inner_common_sapn">
                      <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div className="inner_common_detailss">
                      {this.state.corporateOffice}
                    </div>
                  </span>
                  <span className="common_sapn email_deti">
                    <div className="inner_common_sapn">
                      {" "}
                      <i class="fa fa-envelope" aria-hidden="true"></i>
                    </div>
                    <div className="inner_common_detailss">
                      <a href={"mailto :" + this.state.email1}>
                        {this.state.email1}
                      </a>
                    </div>
                  </span>
                  <span className="common_sapn mobil_deti">
                    <div className="inner_common_sapn">
                      <i class="fa fa-mobile" aria-hidden="true"></i>
                    </div>
                    <div className="inner_common_detailss">
                      {" "}
                      <a href={"tel :" + this.state.phone2}>
                        {this.state.phone2}
                      </a>{" "}
                    </div>
                  </span>
                </div>
              </div>
              <div className="main_content">
                <div className="right_m_content">
                  <h2>Contact Us</h2>
                  <div className="my_profile">
                    <div className="modal-form-bx">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="name"
                              value={this.state.name}
                              className="form-control"
                              placeholder="Enter Name"
                              onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                            <span className="err err_name"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Mobile Number <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="mobile"
                              value={this.state.mobile}
                              className="form-control"
                              placeholder="Enter Mobile Number"
                              onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                            <span className="err err_mobile"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Email <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="email"
                              value={this.state.email}
                              className="form-control"
                              placeholder="Enter Email"
                              onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                            <span className="err err_email"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              City <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="city"
                              value={this.state.city}
                              className="form-control"
                              placeholder="Enter City"
                              onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                            <span className="err err_city"></span>
                          </div>
                        </div>
                        {this.props.user_details.name && (
                          <div className="form-group ct-order-block">
                            <div className="modal-left-bx">
                              <label>Order Id</label>
                            </div>
                            <div className="modal-right-bx">
                              <SelectSearch
                                placeholder={"Search order ID"}
                                options={this.state.all_order}
                                onChange={(e) => {
                                  this.changeOrder(e);
                                }}
                                value={this.state.selectedOrder.value}
                                className="select-search"
                                name="orderId"
                              />
                              <span className="focus-border"></span>
                              <span className="err err_city"></span>
                            </div>
                          </div>
                        )}

                        <div className="form-group ct-textarea-block">
                          <div className="modal-left-bx">
                            <label>
                              Query <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <textarea
                              type="textarea"
                              name="qwery"
                              value={this.state.qwery}
                              className="form-control"
                              placeholder="Enter Query / Feedback"
                              onChange={(ev) => this._handleForm(ev)}
                            />
                            <span className="focus-border"></span>
                            <span className="err err_qwery"></span>
                          </div>
                        </div>

                        <div className="form-group attact_cont_file">
                          <div className="modal-left-bx">
                            <label>Attach File</label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="attachment"
                              className="form-control"
                            />
                            <span className="focus-border"></span>
                            <span className="err err_city"></span>
                          </div>
                        </div>

                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="submit"
                            onClick={() => this.forward()}
                          >
                            Send Query
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
});

export default connect(mapStateToProps, dispatchStateToProps)(Contactus);
