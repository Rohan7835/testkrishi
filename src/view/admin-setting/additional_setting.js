import React from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";

class setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      seedValueinRupee: 0,
      whatChatLink: "",
      productImage: "",
      exemptDelivery: false,
      preOrder: false,
      loggedIn: false,
      password: "",
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeloyality = this.handleChangeloyality.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }
  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }
  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  handleChangeloyality(checked) {
    if (checked) {
      this.setState({ loyalitystatus: true });
    } else {
      this.setState({ loyalitystatus: false });
    }
  }
  update = () => {
    var data = new FormData();
    var images = [];
    images = document.querySelector('input[name="banner"]').files[0]
      ? document.querySelector('input[name="banner"]').files[0]
      : this.state.banner;
    data.append("banner", images);

    var iconimages = [];
    iconimages = document.querySelector('input[name="icon"]').files[0]
      ? document.querySelector('input[name="icon"]').files[0]
      : this.state.icon;
    data.append("icon", iconimages);

    var productImage = [];
    productImage = document.querySelector('input[name="productImage"]').files[0]
      ? document.querySelector('input[name="productImage"]').files[0]
      : this.state.icon;
    data.append("image", productImage);

    var logo = [];
    productImage = document.querySelector('input[name="logo"]').files[0]
      ? document.querySelector('input[name="logo"]').files[0]
      : this.state.logo;
    data.append("logo", logo);

    var mailBanner = [];
    mailBanner = document.querySelector('input[name="mailBanner"]').files[0]
      ? document.querySelector('input[name="mailBanner"]').files[0]
      : this.state.icon;
    data.append("mailBanner", mailBanner);

    data.append(
      "refferalPointsOnOff",
      this.state.status === true ? "on" : "off"
    );
    data.append(
      "loyalityProgramOnOff",
      this.state.loyalitystatus === true ? "on" : "off"
    );
    data.append(
      "corporateOffice",
      this.state.corporateOffice ? this.state.corporateOffice : ""
    );
    data.append("email1", this.state.email1 ? this.state.email1 : "");
    data.append("email2", this.state.email2 ? this.state.email2 : "");
    data.append(
      "seedValue",
      this.state.seedValueinRupee ? this.state.seedValueinRupee : ""
    );
    data.append("facebook", this.state.facebook ? this.state.facebook : "");
    data.append("google", this.state.google ? this.state.google : "");
    data.append("googleMap", this.state.googleMap ? this.state.googleMap : "");
    data.append("instagram", this.state.instagram ? this.state.instagram : "");
    // data.append("logo", this.state.logo ? this.state.logo : "");
    data.append("slogan", this.state.slogan ? this.state.slogan : "");
    data.append("linkedin", this.state.linkedin ? this.state.linkedin : "");
    data.append("phone1", this.state.phone1 ? this.state.phone1 : 0);
    data.append("phone2", this.state.phone2 ? this.state.phone2 : "");
    data.append(
      "registeredOffice",
      this.state.registeredOffice ? this.state.registeredOffice : ""
    );
    data.append("twitter", this.state.twitter ? this.state.twitter : "");
    data.append("mail_host", this.state.mail_host ? this.state.mail_host : "");
    data.append("mail_port", this.state.mail_port ? this.state.mail_port : "");
    data.append(
      "mail_username",
      this.state.mail_username ? this.state.mail_username : ""
    );
    data.append(
      "mail_password",
      this.state.mail_password ? this.state.mail_password : ""
    );
    data.append(
      "sms_senderID",
      this.state.sms_senderID ? this.state.sms_senderID : ""
    );
    data.append(
      "sms_username",
      this.state.sms_username ? this.state.sms_username : ""
    );
    data.append(
      "sms_password",
      this.state.sms_password ? this.state.sms_password : ""
    );
    data.append("user_id", this.state.user_id ? this.state.user_id : "");
    data.append("weblink", this.state.weblink ? this.state.weblink : "");
    data.append("apilink", this.state.apilink ? this.state.apilink : "");
    data.append("whatAppNo", this.state.whatAppNo ? this.state.whatAppNo : "");

    data.append(
      "ProductAllowedWithPre",
      this.state.ProductAllowedWithPre ? this.state.ProductAllowedWithPre : ""
    );
    data.append(
      "partialPaymentPercentage",
      this.state.prePrderPaymentPercentage
        ? this.state.prePrderPaymentPercentage
        : ""
    );
    data.append(
      "prePrderPaymentPercentage",
      this.state.prePrderPaymentPercentage
        ? this.state.prePrderPaymentPercentage
        : ""
    );
    data.append(
      "preOrderPaymentType",
      this.state.preOrderPaymentType ? this.state.preOrderPaymentType : ""
    );
    data.append("preOrder", this.state.preOrder ? this.state.preOrder : "");
    data.append("youtube", this.state.youtube ? this.state.youtube : "");
    data.append(
      "whatChatLink",
      this.state.whatChatLink ? this.state.whatChatLink : ""
    );
    data.append("_id", this.state._id ? this.state._id : "");

    AdminApiRequest(data, "/admin/Setting/UpdateOne", "POST", "apiWithImage")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "Details Updated",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          this.GetAdminSetting();
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/admin/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            banner: res.data.data[0].banner,
            status:
              res.data.data[0].refferalPointsOnOff === "on" ? true : false,
            loyalitystatus:
              res.data.data[0].loyalityProgramOnOff === "on" ? true : false,
            corporateOffice: res.data.data[0].corporateOffice,
            email1: res.data.data[0].email1,
            email2: res.data.data[0].email2,
            facebook: res.data.data[0].facebook,
            google: res.data.data[0].google,
            googleMap: res.data.data[0].googleMap,
            icon: res.data.data[0].icon,
            productImage: res.data.data[0].image,
            instagram: res.data.data[0].instagram,
            whatChatLink: res.data.data[0].whatChatLink,
            apilink: res.data.data[0].apilink,
            mail_host: res.data.data[0].mail_host,
            mail_password: res.data.data[0].mail_password,
            mail_port: res.data.data[0].mail_port,
            mail_username: res.data.data[0].mail_username,
            sms_password: res.data.data[0].sms_password,
            sms_senderID: res.data.data[0].sms_senderID,
            sms_username: res.data.data[0].sms_username,

            linkedin: res.data.data[0].linkedin,
            seedValueinRupee: res.data.data[0].seedValue,
            phone1: res.data.data[0].phone1,
            phone2: res.data.data[0].phone2,
            registeredOffice: res.data.data[0].registeredOffice,
            twitter: res.data.data[0].twitter,
            updateDate: res.data.data[0].updateDate,
            weblink: res.data.data[0].weblink,
            whatAppNo: res.data.data[0].whatAppNo,
            youtube: res.data.data[0].youtube,
            _id: res.data.data[0]._id,
            mailBanner: res.data.data[0].mailBanner,
          });
        } else {
          swal({
            title: "Network error ",
            text: "Please try again after some time !!!",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    if (JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.setState({ loggedIn: true });
    } else {
      this.setState({ loggedIn: false });
    }
    // this.GetAdminSetting();
  }
  submitLogin() {
    if (this.state.username === "tech9" && +this.state.password === 54321) {
      localStorage.setItem("storeheyLoggedIn", true);
      this.setState({ loggedIn: true });
    } else {
      localStorage.setItem("storeheyLoggedIn", false);
      this.setState({ loggedIn: false });
      alert("Wrong credentials");
    }
  }
  render() {
    return (
      <>
        {this.state.loggedIn ? (
          <div className="wrapper ">
            <button
              className="btn btn-primary  mt-2 logout-storehey"
              style={{ background: "#febc12", border: "none" }}
              onClick={() => {
                localStorage.setItem("storeheyLoggedIn", false);
                this.setState({ loggedIn: false });
              }}
            >
              Logout
            </button>
            <button>
              <Link to="/notification-settings">
                <li className="dropdown-item">Notifications</li>
              </Link>
            </button>
            <button>
              <Link to="/delivery-setting">
                <li className="dropdown-item">Delivery</li>
              </Link>
            </button>
            <button>
              <Link to="/Payment-keys">
                <li className="dropdown-item">Payment Gateway</li>
              </Link>
            </button>
            <button>
              <Link to="/sms-gateway">
                <li className="dropdown-item">SMS alert Gateway</li>
              </Link>
            </button>
            <button>
              <Link to="/email-template">
                <li className="dropdown-item">Email Template</li>
              </Link>
            </button>
            <button>
              <Link to="/analytics-dashboard">
                <li className="dropdown-item">Analytic Dashboard</li>
              </Link>
            </button>
            <button>
              <Link to="/admin-measurenment">
                <li className="dropdown-item">Measurement</li>
              </Link>
            </button>
            <button>
              <Link to="/admin-logs">
                <li className="dropdown-item">Logs</li>
              </Link>
            </button>
            <button>
              <Link to="/product-sheet">
                <li className="dropdown-item">Product Import/Export</li>
              </Link>
            </button>
            <button>
              <Link to="/dynamic-pages">
                <li className="dropdown-item">Dynamic Pages</li>
              </Link>
            </button>
            <button>
              <Link to="/variant-category">
                <li className="dropdown-item">Variant Category</li>
              </Link>{" "}
            </button>
            <button>
              <Link to="/variant-master">
                <li className="dropdown-item">Variant</li>
              </Link>{" "}
            </button>
            <button>
              <Link to="/storehey-setting">
                <li className="dropdown-item">Storehey Settings</li>
              </Link>{" "}
            </button>
          </div>
        ) : (
          <div
            className="wrapper d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <div className="storehey-login" style={{ minWidth: 400 }}>
              <input
                type="text"
                placeholder="Enter Username"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
                className="form-control"
              />
              <input
                type="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                className="form-control mt-2"
              />
              <button
                className="btn btn-primary w-100 mt-2"
                style={{ background: "#febc12", border: "none" }}
                onClick={() => this.submitLogin()}
              >
                Continue
              </button>
            </div>
          </div>
        )}{" "}
      </>
    );
  }
}

export default setting;
