import React from "react";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

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
      invoiceDeclaration: "",
      invoicePaymentDetail: "",
      maintenanceBanner: "",
      maintenanceLink: "",
      maintenanceStatus: false,
      tokenExpiration: "",
      emailOnSignup: false,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeloyality = this.handleChangeloyality.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.maintenanceStatusstatus = this.maintenanceStatusstatus.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
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
  maintenanceStatusstatus(checked) {
    if (checked) {
      this.setState({ maintenanceStatus: true });
    } else {
      this.setState({ maintenanceStatus: false });
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
    logo = document.querySelector('input[name="logo"]').files[0]
      ? document.querySelector('input[name="logo"]').files[0]
      : this.state.logo;
    data.append("logo", logo);

    var mailBanner = [];
    mailBanner = document.querySelector('input[name="mailBanner"]').files[0]
      ? document.querySelector('input[name="mailBanner"]').files[0]
      : this.state.icon;
    data.append("mailBanner", mailBanner);
    var maintenanceBanner = [];
    maintenanceBanner = document.querySelector(
      'input[name="maintenanceBanner"]'
    )?.files[0]
      ? document.querySelector('input[name="maintenanceBanner"]').files[0]
      : this.state.maintenanceBanner;
    data.append("maintenanceBanner", maintenanceBanner);

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
    data.append(
      "invoiceDeclaration",
      this.state.invoiceDeclaration ? this.state.invoiceDeclaration : ""
    );
    data.append(
      "invoicePaymentDetail",
      this.state.invoicePaymentDetail ? this.state.invoicePaymentDetail : ""
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
    data.append("slogan", this.state.slogan ? this.state.slogan : "");
    data.append(
      "driverNumber",
      this.state.driverNumber ? this.state.driverNumber : ""
    );
    data.append("linkedin", this.state.linkedin ? this.state.linkedin : "");
    data.append("phone1", this.state.phone1 ? this.state.phone1 : 0);
    data.append("phone2", this.state.phone2 ? this.state.phone2 : "");
    data.append(
      "registeredOffice",
      this.state.registeredOffice ? this.state.registeredOffice : ""
    );
    data.append(
      "map",
      this.state.google_iframe ? this.state.google_iframe : ""
    );
    data.append("twitter", this.state.twitter ? this.state.twitter : "");
    data.append("mail_host", this.state.mail_host ? this.state.mail_host : "");
    data.append(
      "companyName",
      this.state.companyName ? this.state.companyName : ""
    );

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
    data.append(
      "maintenanceLink",
      this.state.maintenanceLink ? this.state.maintenanceLink : ""
    );
    data.append(
      "maintenanceStatus",
      this.state.maintenanceStatus ? this.state.maintenanceStatus : ""
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

    data.append(
      "tokenExpiration",
      this.state.tokenExpiration ? this.state.tokenExpiration : ""
    );
    data.append(
      "emailOnSignup",
      this.state.emailOnSignup ? this.state.emailOnSignup : false
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
            companyName: res.data.data[0].companyName,
            google: res.data.data[0].google,
            googleMap: res.data.data[0].googleMap,
            icon: res.data.data[0].icon,
            productImage: res.data.data[0].image,
            instagram: res.data.data[0].instagram,
            whatChatLink: res.data.data[0].whatChatLink,
            apilink: res.data.data[0].apilink,
            logo: res.data.data[0].logo,
            invoiceDeclaration: res.data.data[0].invoiceDeclaration,
            invoicePaymentDetail: res.data.data[0].invoicePaymentDetail,
            mail_host: res.data.data[0].mail_host,
            mail_password: res.data.data[0].mail_password,
            mail_port: res.data.data[0].mail_port,
            mail_username: res.data.data[0].mail_username,
            sms_password: res.data.data[0].sms_password,
            sms_senderID: res.data.data[0].sms_senderID,
            sms_username: res.data.data[0].sms_username,
            driverNumber: res.data.data[0].driverNumber,

            linkedin: res.data.data[0].linkedin,
            seedValueinRupee: res.data.data[0].seedValue,
            phone1: res.data.data[0].phone1,
            phone2: res.data.data[0].phone2,
            registeredOffice: res.data.data[0].registeredOffice,
            google_iframe: res.data.data[0].map,
            twitter: res.data.data[0].twitter,
            updateDate: res.data.data[0].updateDate,
            weblink: res.data.data[0].weblink,
            whatAppNo: res.data.data[0].whatAppNo,
            youtube: res.data.data[0].youtube,
            _id: res.data.data[0]._id,
            mailBanner: res.data.data[0].mailBanner,
            maintenanceStatus: res.data.data[0].maintenanceStatus,
            maintenanceLink: res.data.data[0].maintenanceLink,
            maintenanceBanner: res.data.data[0].maintenanceBanner,
            tokenExpiration: res.data.data[0].tokenExpiration,
            emailOnSignup: res.data.data[0].emailOnSignup,
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
    this.GetAdminSetting();
  }
  onEditorChange(evt) {
    this.setState({
      invoicePaymentDetail: evt.editor.getData(),
    });
  }
  render() {
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="container">
              <div className="setting-page">
                <div className="contact_details setting-col-box">
                  <h3>Contact Details</h3>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Company Name</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="companyName"
                        className="form-control"
                        placeholder="Enter Company Name"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.companyName}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Corporate office</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="corporateOffice"
                        className="form-control"
                        placeholder="Enter Corporate office Address"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.corporateOffice}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Registered Office</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="registeredOffice"
                        className="form-control"
                        placeholder="Enter  Registered Office "
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.registeredOffice}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Google Location Iframe</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="google_iframe"
                        className="form-control"
                        placeholder="Enter Google Location Iframe"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.google_iframe}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Web Link</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="weblink"
                        className="form-control"
                        placeholder="Enter Web Link "
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.weblink}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>API Link</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="apilink"
                        className="form-control"
                        placeholder="Enter API Link "
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.apilink}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Email </label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="email1"
                        className="form-control"
                        placeholder="Enter Email 1"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.email1}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Other Email</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="email2"
                        className="form-control"
                        placeholder="Enter Email 2"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.email2}
                      />
                    </div>{" "}
                  </div>
                  {/* <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Telephone Number</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="phone1"
                        className="form-control"
                        placeholder="Enter Phone 1"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.phone1}
                      />
                    </div>{" "}
                  </div> */}
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Phone Number</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="phone2"
                        className="form-control"
                        placeholder="Enter Phone 2"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.phone2}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Slogan</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="slogan"
                        className="form-control"
                        placeholder="Enter Slogan"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.slogan}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Driver Number</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="number"
                        name="driverNumber"
                        className="form-control"
                        placeholder="Enter Driver Number"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.driverNumber}
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="social_media setting-col-box">
                  <h3>Social Media</h3>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Whatsapp Number</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="whatAppNo"
                        className="form-control"
                        placeholder="Enter Whatsapp Number"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.whatAppNo}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Facebook</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="facebook"
                        className="form-control"
                        placeholder="Enter Facebook"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.facebook}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Twitter</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="twitter"
                        className="form-control"
                        placeholder="Enter Twitter"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.twitter}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Instagram</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="instagram"
                        className="form-control"
                        placeholder="Enter Instagram"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.instagram}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Linkedin</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="linkedin"
                        className="form-control"
                        placeholder="Enter Linkedin"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.linkedin}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>YouTube</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="youtube"
                        className="form-control"
                        placeholder="Enter YouTube link"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.youtube}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Whatapp Chat Link</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="whatChatLink"
                        className="form-control"
                        placeholder="Enter whatsapp Chat link"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.whatChatLink}
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="smsalert-gateway setting-col-box">
                  <h3>SMS Alert Gateway</h3>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Sender ID</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="sms_senderID"
                        className="form-control"
                        placeholder="Enter Sender ID"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.sms_senderID}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>UserName</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="sms_username"
                        className="form-control"
                        placeholder="Enter UserName"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.sms_username}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Password</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="sms_password"
                        className="form-control"
                        placeholder="Enter Password"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.sms_password}
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="emailcredentials setting-col-box">
                  <h3>E-Mail Credentials</h3>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Mail Host</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="mail_host"
                        className="form-control"
                        placeholder="Enter Mail Host"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.mail_host}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Mail Port</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="mail_port"
                        className="form-control"
                        placeholder="Enter Mail Port"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.mail_port}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Mail Username</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="mail_username"
                        className="form-control"
                        placeholder="Enter Mail Username"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.mail_username}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Mail Password</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="mail_password"
                        className="form-control"
                        placeholder="Enter Mail Password"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.mail_password}
                      />
                    </div>{" "}
                  </div>
                </div>

                <h3>Default product Image, Icon & Banner</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Product Image</label>
                    </div>
                    <div className="modal-right-bx">
                      <span className="img_resizz">
                        <img src={imageUrl + this.state.productImage} />
                      </span>
                      <input
                        type="file"
                        name="productImage"
                        className="form-control"
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Logo</label>
                    </div>
                    <div className="modal-right-bx">
                      <span className="img_resizz">
                        <img src={imageUrl + this.state.logo} />
                      </span>
                      <input
                        type="file"
                        name="logo"
                        className="form-control"
                        placeholder="Enter Logo"
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Icon</label>
                    </div>
                    <div className="modal-right-bx">
                      <span className="img_resizz">
                        <img src={imageUrl + this.state.icon} />
                      </span>
                      <input
                        type="file"
                        name="icon"
                        className="form-control"
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Banner</label>
                    </div>
                    <div className="modal-right-bx">
                      <span className="img_resizz">
                        <img src={imageUrl + this.state.banner} />
                      </span>
                      <input
                        type="file"
                        name="banner"
                        className="form-control"
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Email Banner</label>
                    </div>
                    <div className="modal-right-bx">
                      <span className="img_resizz">
                        <img src={imageUrl + this.state.mailBanner} />
                      </span>
                      <input
                        type="file"
                        name="mailBanner"
                        className="form-control"
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>
                </div>

                <h3>Maintenance Status</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Maintenance Status</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.maintenanceStatusstatus}
                        checked={this.state.maintenanceStatus}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                  {this.state.maintenanceStatus ? (
                    <>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Maintenance Banner</label>
                        </div>
                        <div className="modal-right-bx">
                          <span className="img_resizz">
                            <img
                              src={imageUrl + this.state.maintenanceBanner}
                            />
                          </span>
                          <input
                            type="file"
                            name="maintenanceBanner"
                            className="form-control"
                            onChange={(ev) => this.formHandler(ev)}
                          />
                        </div>{" "}
                      </div>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Redirection Link</label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            type="text"
                            name="maintenanceLink"
                            className="form-control"
                            placeholder="Enter Redirection Link"
                            onChange={(ev) => this.formHandler(ev)}
                            value={this.state.maintenanceLink}
                          />
                        </div>{" "}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                {/* <h3>Invoice</h3>
                <div className="Default_icon">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Invoice Declaration</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="invoiceDeclaration"
                        className="form-control"
                        placeholder="Enter Invoice Declaration"
                        onChange={(ev) => this.formHandler(ev)}
                        value={this.state.invoiceDeclaration}
                      />
                    </div>{" "}
                  </div>

                  <div className="form-group w-100 mt-4 ml-0">
                    <div className="modal-left-bx">
                      <label>Invoice Payment Detail</label>
                    </div>
                    <div className="modal-right-bx">
                      <CKEditor
                        onChange={this.onEditorChange}
                        data={this.state.invoicePaymentDetail}
                        type="classic"
                      />
                    </div>{" "}
                  </div>
                </div> */}

                <h3>Switching On Off Module</h3>
                <div className="Default_icon setting-first-default">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Referral Points</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.status}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Loyalty Programme</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeloyality}
                        checked={this.state.loyalitystatus}
                        id="normal-switch"
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="Default_icon setting-last-default">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Seeds Value (according to 1 seed)</label>
                      <input
                        type="number"
                        style={{ padding: 5 }}
                        min="0"
                        name="seedValueinRupee"
                        placeholder="Enter Amount (E.g. 1rs)..."
                        value={this.state.seedValueinRupee}
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Exempt Delivery Charges</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) => this.setState({ exemptDelivery: e })}
                        checked={this.state.exemptDelivery}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group mt-2">
                    <div className="modal-left-bx">
                      <label>Token Expiration (in minutes)</label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="number"
                        min="0"
                        style={{ padding: 5 }}
                        name="tokenExpiration"
                        placeholder="Enter expiry time in minutes..."
                        value={this.state.tokenExpiration}
                        onChange={(ev) => this.formHandler(ev)}
                      />
                    </div>{" "}
                  </div>
                  {/* <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Email on signup</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) => this.setState({ emailOnSignup: e })}
                        checked={this.state.emailOnSignup}
                      />
                    </div>{" "}
                  </div> */}
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Pre Order</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={(e) => this.setState({ preOrder: e })}
                        checked={this.state.preOrder}
                      />
                    </div>{" "}
                  </div>

                  {this.state.preOrder === true ? (
                    <>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Pre Order payment Type</label>
                        </div>
                        <div className="modal-right-bx">
                          {" "}
                          <select
                            value={this.state.preOrderPaymentType}
                            name="preOrderPaymentType"
                            className="form-control"
                            onChange={this.formHandler}
                          >
                            <option value="">Select payment Type</option>
                            <option value="Full">Full</option>
                            <option value="Partial">Partial</option>
                          </select>
                        </div>{" "}
                      </div>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Pre Order payment Percentage</label>
                        </div>
                        <div className="modal-right-bx">
                          <input
                            value={this.state.prePrderPaymentPercentage}
                            name="prePrderPaymentPercentage"
                            className="form-control"
                            onChange={this.formHandler}
                          />
                        </div>{" "}
                      </div>
                      <div className="form-group">
                        <div className="modal-left-bx">
                          <label>Product Allowed With Pre Order</label>
                        </div>
                        <div className="modal-right-bx">
                          <select
                            value={this.state.ProductAllowedWithPre}
                            name="ProductAllowedWithPre"
                            className="form-control"
                            onChange={this.formHandler}
                          >
                            <option value="">
                              Select Product Allowed With Pre Order
                            </option>
                            <option value="group">Group</option>
                            <option value="simple">Simple</option>
                            <option value="both">Both </option>
                            <option value="none">None</option>
                          </select>
                        </div>{" "}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="form-group">
                  <button
                    type="button"
                    className="submit fill-btn"
                    onClick={() => this.update()}
                  >
                    <span className="button-text">Update</span>
                    <span className="button-overlay"></span>
                  </button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default setting;
