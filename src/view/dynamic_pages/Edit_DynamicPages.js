import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Loader from "../../components/loader";
import { imageUrl } from "../../imageUrl";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";

export default class Edit_DynamicPages extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    var path = this.props.location.pathname;
    var q_id = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (dt) {
      var admin = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_id: admin._id,
      _id: q_id,
      name: "",
      FooterVisibility: false,
      HeaderVisibility: false,
      detail: "",
      icon: "",
      image: "",
      meta_desc: "",
      meta_title: "",
      priority: "",
      status: false,
      title: "",
    };
    this.formHandler = this.formHandler.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeFooterStatus = this.handleChangeFooterStatus.bind(this);
    this.handleChangeHeaderStatus = this.handleChangeHeaderStatus.bind(this);
  }
  formHandler(ev) {
    console.log([ev.target.name]);
    console.log(ev.target.value);
    this.setState({ [ev.target.name]: ev.target.value });
  }
  onEditorChange(evt) {
    this.setState({
      detail: evt.editor.getData(),
    });
  }
  GetPaymentKeys() {
    let data = { _id: this.state._id };
    AdminApiRequest(data, "/admin/page/GetOne", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            name: res.data.data.name,
            FooterVisibility: res.data.data.FooterVisibility,
            HeaderVisibility: res.data.data.HeaderVisibility,
            detail: res.data.data.detail,
            icon: res.data.data.icon,
            image: res.data.data.image,
            meta_desc: res.data.data.meta_desc,
            meta_title: res.data.data.meta_title,
            priority: res.data.data.priority,
            status: res.data.data.status,
            title: res.data.data.title,
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
    this.GetPaymentKeys();
  }
  add = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    let errorStatus = false;
    var name = this.state.name;
    var FooterVisibility = this.state.FooterVisibility;
    var HeaderVisibility = this.state.HeaderVisibility;
    var detail = this.state.detail;
    var icon =
      document.querySelector('input[name="icon"]').files[0] || this.state.icon;
    var image =
      document.querySelector('input[name="image"]').files[0] ||
      this.state.image;
    var meta_desc = this.state.meta_desc;
    var meta_title = this.state.meta_title;
    var priority = this.state.priority;
    var status = this.state.status;
    var title = this.state.title;
    var data = new FormData();
    data.append("_id", this.state._id);
    data.append("name", name);
    data.append("FooterVisibility", FooterVisibility);
    data.append("HeaderVisibility", HeaderVisibility);
    data.append("detail", detail);
    data.append("icon", icon);
    data.append("image", image);
    data.append("meta_desc", meta_desc);
    data.append("meta_title", meta_title);
    data.append("priority", priority || "");
    data.append("status", status);
    data.append("title", title);
    if (!name) {
      errorStatus = true;
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!detail) {
      errorStatus = true;
      valueErr = document.getElementsByClassName("err_detail");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!title) {
      errorStatus = true;
      valueErr = document.getElementsByClassName("err_title");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!priority) {
      errorStatus = true;
      valueErr = document.getElementsByClassName("err_priority");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!errorStatus) {
      AdminApiRequest(data, "/admin/page/UpdateOne", "POST", "apiWithImage")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Details Updated",
              // text: "Are you sure that you want to leave this page?",
              icon: "success",
              dangerMode: false,
            });
            this.props.history.push("/dynamic-pages");
          } else {
            console.log(res.data.data[0].name);
            if (res.data.data[0].name) {
              swal({
                title: "Error",
                text: "Name already exist!",
                icon: "warning",
                dangerMode: true,
              });
            } else {
              swal({
                title: "Network error ",
                text: "Please try again after some time !!!",
                icon: "warning",
                dangerMode: true,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  handleChangeStatus(checked) {
    this.setState({ status: checked });
  }
  handleChangeFooterStatus(checked) {
    this.setState({ FooterVisibility: checked });
  }
  handleChangeHeaderStatus(checked) {
    this.setState({ HeaderVisibility: checked });
  }
  render() {
    return (
      <div className="wrapper ">
        <Adminsiderbar />
        <div className="main-panel">
          <Adminheader />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-header card-header-primary card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">inventory_2</i>
                      </div>
                    </div>
                    <div className="card-body final_add_prod_admin">
                      <h4 className="card-title">Edit Page</h4>
                      <Link to="/dynamic-pages">
                        <button className="btn btn-primary m-r-5 float-right">
                          <i
                            style={{ color: "white" }}
                            className="material-icons"
                          >
                            arrow_back_ios
                          </i>{" "}
                          View Pages
                        </button>
                      </Link>

                      <form className="add_product_new">
                        <div className="prod_detail_new_admin">
                          <h3>Page Details</h3>
                          <div className="inner_details_admin">
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
                                  className="form-control"
                                  placeholder="Enter Name"
                                  onChange={this.formHandler}
                                  value={this.state.name}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Title <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="title"
                                  className="form-control"
                                  placeholder="Enter Title"
                                  onChange={this.formHandler}
                                  value={this.state.title}
                                />
                                <span className="err err_title"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Icon</label>
                              </div>
                              <div className="modal-right-bx">
                                {this.state.icon ? (
                                  <a
                                    target="_blank"
                                    href={imageUrl + this.state.icon}
                                    title="View Image"
                                  >
                                    <img
                                      src={imageUrl + this.state.icon}
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
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_banner"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Image</label>
                              </div>
                              <div className="modal-right-bx">
                                {this.state.image ? (
                                  <a
                                    target="_blank"
                                    href={imageUrl + this.state.image}
                                    title="View Image"
                                  >
                                    <img
                                      src={imageUrl + this.state.image}
                                      alt=""
                                      style={{ maxHeight: 40 }}
                                    />
                                  </a>
                                ) : (
                                  ""
                                )}
                                <input
                                  type="file"
                                  name="image"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_banner"></span>
                              </div>
                            </div>
                            <div className="form-group w-100">
                              <div className="modal-left-bx">
                                <label>Details</label>
                              </div>
                              <div className="modal-right-bx">
                                <CKEditor
                                  onChange={this.onEditorChange}
                                  data={this.state.detail}
                                  type="classic"
                                />
                                <span className="err err_detail"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Meta Title</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="meta_title"
                                  className="form-control"
                                  placeholder="Enter Meta Title"
                                  onChange={this.formHandler}
                                  value={this.state.meta_title}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Meta Description</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="meta_desc"
                                  className="form-control"
                                  placeholder="Enter Meta Description"
                                  onChange={this.formHandler}
                                  value={this.state.meta_desc}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Priority</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="number"
                                  name="priority"
                                  value={this.state.priority}
                                  className="form-control"
                                  placeholder="Enter Priority"
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                <span className={"err err_priority"}></span>
                              </div>
                            </div>
                            <div className="form-group w-100 d-flex justify-content-between">
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Status</label>
                                </div>
                                <div className="modal-right-bx">
                                  <Switch
                                    onChange={this.handleChangeStatus}
                                    checked={this.state.status}
                                    id="normal-switch"
                                  />
                                </div>
                              </div>

                              {/* 
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Header Visibility</label>
                                </div>
                                <div className="modal-right-bx">
                                  <Switch
                                    onChange={this.handleChangeHeaderStatus}
                                    checked={this.state.HeaderVisibility}
                                    id="normal-switch"
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Footer Visibility</label>
                                </div>
                                <div className="modal-right-bx">
                                  <Switch
                                    onChange={this.handleChangeFooterStatus}
                                    checked={this.state.FooterVisibility}
                                    id="normal-switch"
                                  />
                                </div>
                              </div>
                             */}
                            </div>
                          </div>
                        </div>

                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="btn btn-primary feel-btn"
                            onClick={this.add}
                          >
                            Save
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
        {this.state.loading === true ? <Loader></Loader> : ""}
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
