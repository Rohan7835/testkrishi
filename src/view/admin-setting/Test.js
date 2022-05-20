import React from "react";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: "",
      seedValueinRupee: 0,
      whatChatLink: "",
      productImage: "",
      exemptDelivery: false,
      preOrder: false,
      modalIsOpen: false,
      allKeys: [],
      status: false,
    };
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeloyality = this.handleChangeloyality.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }

  handleChangeloyality(checked) {
    if (checked) {
      this.setState({ loyalitystatus: true });
    } else {
      this.setState({ loyalitystatus: false });
    }
  }
  openModal() {
    this.setState({ modalIsOpen: true });
  }
  closeModal() {
    this.setState({
      modalIsOpen: false,
      FooterVisibility: false,
      HeaderVisibility: false,
      detail: "",
      icon: "",
      image: "",
      meta_desc: "",
      meta_title: "",
      priority: null,
      status: false,
      title: "",
    });
  }
  update = (dt) => {
    var name = dt.name;
    var icon = document.querySelector('input[name="icon"]').files[0] || dt.icon;
    var image =
      document.querySelector('input[name="image"]').files[0] || dt.image;
    var FooterVisibility = dt.FooterVisibility;
    var HeaderVisibility = dt.HeaderVisibility;
    var detail = dt.detail;
    var meta_desc = dt.meta_desc;
    var meta_title = dt.meta_title;
    var priority = dt.priority;
    var status = dt.status;
    var title = dt.title;
    var data = {
      _id: dt._id,
      name,
      FooterVisibility,
      HeaderVisibility,
      detail,
      icon,
      image,
      meta_desc,
      meta_title,
      priority,
      status,
      title,
    };
    if (!name) {
      swal({
        title: "Error",
        text: "Name is required",
        icon: "warning",
      });
    }
    if (!detail) {
      swal({
        title: "Error",
        text: "detail is required",
        icon: "warning",
      });
    }
    if (!title) {
      swal({
        title: "Error",
        text: "title is required",
        icon: "warning",
      });
    }
    if ((name, detail, title)) {
      AdminApiRequest(data, "/admin/payment/gateway/update", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Details Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.GetPaymentKeys();
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
  };
  delete = (dt) => {
    var data = {
      _id: dt._id,
    };

    AdminApiRequest(data, "/admin/DeleteOne", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "Deleted Successfully",
            // text: "Are you sure that you want to leave this page?",
            icon: "success",
            dangerMode: false,
          });
          this.GetPaymentKeys();
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
  addkey = () => {
    var name = this.state.name;
    var FooterVisibility = this.state.FooterVisibility;
    var HeaderVisibility = this.state.HeaderVisibility;
    var detail = this.state.detail;
    var icon = this.state.icon;
    var image = this.state.image;
    var meta_desc = this.state.meta_desc;
    var meta_title = this.state.meta_title;
    var priority = this.state.priority;
    var status = this.state.status;
    var title = this.state.title;
    var data = {
      name,
      FooterVisibility,
      HeaderVisibility,
      detail,
      icon,
      image,
      meta_desc,
      meta_title,
      priority,
      status,
      title,
    };
    if (!name) {
      swal({
        title: "Error",
        text: "Name is required",
        icon: "warning",
      });
    }
    if (!detail) {
      swal({
        title: "Error",
        text: "detail is required",
        icon: "warning",
      });
    }
    if (!title) {
      swal({
        title: "Error",
        text: "title is required",
        icon: "warning",
      });
    }
    if ((name, detail, title)) {
      AdminApiRequest(data, "/admin/AddOne", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Details Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.GetPaymentKeys();
            this.closeModal();
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
  };

  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/admin/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
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
  GetPaymentKeys() {
    let data = {};
    AdminApiRequest(data, "/admin/GetAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            allKeys: res.data.data,
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
    this.GetPaymentKeys();
  }
  handleChangeStatus(checked, _id) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id ? { ...d, status: checked } : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }
  handleChangeFooterStatus(checked, _id) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id ? { ...d, FooterVisibility: checked } : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }
  handleChangeHeaderStatus(checked, _id) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id ? { ...d, HeaderVisibility: checked } : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }
  handleChange(e, _id) {
    const data = [...this.state.allKeys];
    const newdata = data.map((d) => {
      return d._id === _id
        ? { ...d, [e.target.name]: e.target.value }
        : { ...d };
    });
    setTimeout(() => {
      this.setState({ allKeys: newdata });
    }, 0);
  }
  changeStatus(e) {
    const data = this.state.allKeys;
    const newData = { ...data, status: e };
    this.setState({ allKeys: newData });
  }
  render() {
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 ml-auto mr-auto order_new_det">
                    <div className="card">
                      <div className="card-header card-header-primary card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">shopping_cart</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn">
                          <h4 className="card-title"> Dynamic Pages</h4>
                          <button
                            className="btn btn-primary m-r-5 float-right"
                            onClick={() => this.openModal()}
                          >
                            <i className="fa fa-plus"></i> Add
                          </button>
                        </div>

                        <div className="payment-setting mt-5 d-flex justify-content-start align-items-center">
                          <div className="row">
                            {this.state.allKeys.length > 0
                              ? this.state.allKeys.map((key) => {
                                  return (
                                    <div className="col-md-6">
                                      <div className="payment-card">
                                        <h3 className="mt-4 payment-key-heading">
                                          {key.name}
                                        </h3>
                                        <div className="form-group mt-5">
                                          <div className="modal-left-bx">
                                            <label>Name</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="name"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter name"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.name}
                                            />
                                          </div>{" "}
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>title</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="title"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter title"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.title}
                                            />
                                          </div>{" "}
                                        </div>
                                        <div className="d-flex justify-content-between">
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>Icon</label>
                                            </div>
                                            <div className="modal-right-bx">
                                              {key.icon ? (
                                                <a
                                                  target="_blank"
                                                  href={imageUrl + key.icon}
                                                  title="View Image"
                                                >
                                                  <img
                                                    src={imageUrl + key.icon}
                                                    alt=""
                                                    style={{ maxHeight: 40 }}
                                                  />
                                                </a>
                                              ) : (
                                                ""
                                              )}
                                              <input
                                                type="file"
                                                name="icon"
                                                className="mt-3"
                                                style={{ border: "none" }}
                                              />
                                            </div>{" "}
                                          </div>
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>Image</label>
                                            </div>
                                            <div className="modal-right-bx">
                                              {key.image ? (
                                                <a
                                                  target="_blank"
                                                  href={imageUrl + key.image}
                                                  title="View Image"
                                                >
                                                  <img
                                                    src={imageUrl + key.image}
                                                    alt=""
                                                    style={{ maxHeight: 40 }}
                                                  />
                                                </a>
                                              ) : (
                                                ""
                                              )}
                                              <input
                                                type="file"
                                                className="mt-3"
                                                name="image"
                                                style={{ border: "none" }}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>detail</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="detail"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter detail"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.detail}
                                            />
                                          </div>{" "}
                                        </div>

                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>meta_desc</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="meta_desc"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter meta_desc"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.meta_desc}
                                            />
                                          </div>{" "}
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>meta_title</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              name="meta_title"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter meta_title"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.meta_title}
                                            />
                                          </div>{" "}
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>priority</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              name="priority"
                                              className="form-control border-bottom-gray"
                                              placeholder="Enter priority"
                                              onChange={(ev) =>
                                                this.handleChange(ev, key._id)
                                              }
                                              value={key.priority}
                                            />
                                          </div>{" "}
                                        </div>

                                        <div className="d-flex justify-content-between">
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>Status</label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <Switch
                                                onChange={(e) =>
                                                  this.handleChangeStatus(
                                                    e,
                                                    key._id
                                                  )
                                                }
                                                checked={key.status}
                                              />
                                            </div>{" "}
                                          </div>
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>FooterVisibility</label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <Switch
                                                onChange={(e) =>
                                                  this.handleChangeFooterStatus(
                                                    e,
                                                    key._id
                                                  )
                                                }
                                                checked={key.FooterVisibility}
                                              />
                                            </div>{" "}
                                          </div>
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>HeaderVisibility</label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <Switch
                                                onChange={(e) =>
                                                  this.handleChangeHeaderStatus(
                                                    e,
                                                    key._id
                                                  )
                                                }
                                                checked={key.HeaderVisibility}
                                              />
                                            </div>{" "}
                                          </div>
                                        </div>
                                        <div className="form-group mt-3">
                                          <div className="modal-right-bx d-flex justify-content-between">
                                            <button
                                              type="button"
                                              className="submit fill-btn m-1"
                                              onClick={() => this.update(key)}
                                            >
                                              <span className="button-text">
                                                Update
                                              </span>
                                              <span className="button-overlay"></span>
                                            </button>
                                            <button
                                              type="button"
                                              className="submit fill-btn m-1"
                                              style={{
                                                backgroundColor: "white",
                                              }}
                                              onClick={() => this.delete(key)}
                                            >
                                              <span
                                                className="button-text"
                                                style={{
                                                  color: "#febc15",
                                                }}
                                              >
                                                Delete
                                              </span>
                                              <span className="button-overlay"></span>
                                            </button>
                                          </div>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              : ""}
                          </div>
                        </div>
                        {/* <div className="form-group">
                          <button
                            type="button"
                            className="submit fill-btn"
                            onClick={() => this.update()}
                          >
                            <span className="button-text">Update</span>
                            <span className="button-overlay"></span>
                          </button>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Add model here */}
              <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
              >
                <div role="dialog" className="user-pop-block">
                  <div className="modal-dialog">
                    <div className="modal-content default_form_design">
                      <button
                        type="button"
                        className="close"
                        onClick={this.closeModal}
                      >
                        &times;
                      </button>
                      <h4 className="modal-title">Add Key</h4>
                      <div className="modal-form-bx">
                        <form>
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
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter  Name"
                                onChange={this.formHandler}
                              />
                              <span className="err err_name"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Description <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="description"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter  description"
                                onChange={this.formHandler}
                              />
                              <span className="err err_description"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                URL<span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="url"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter URL"
                                onChange={this.formHandler}
                              />
                              <span className="err err_url"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Stage <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="stage"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter stage"
                                onChange={this.formHandler}
                              />
                              <span className="err err_stage"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                API Key <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="apiKey"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter API Key"
                                onChange={this.formHandler}
                              />
                              <span className="err err_apiKey"></span>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>
                                Secret Key <span className="asterisk">*</span>
                              </label>
                            </div>
                            <div className="modal-right-bx">
                              <input
                                type="text"
                                name="screatKey"
                                autoComplete="off"
                                className="form-control"
                                placeholder="Enter secret Key"
                                onChange={this.formHandler}
                              />
                              <span className="err err_screatKey"></span>
                            </div>
                          </div>

                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Status</label>
                            </div>
                            <div className="modal-right-bx">
                              <Switch
                                name="status"
                                onChange={(ev) => this.handleChangeStatus(ev)}
                                checked={this.state.status}
                                id="normal-switch"
                              />
                            </div>
                          </div>

                          <div className="modal-bottom">
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={this.addkey}
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default DynamicPages;
