import React, { Component } from "react";
import Modal from "react-modal";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import { imageUrl } from "../../imageUrl";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";
const noImage = require("../../images/noImage.png");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)",
  },
};

export default class Banner extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      modalIsOpen: false,
      editmodalIsOpen: false,
      show: false,
      mdl_layout__obfuscator_hide: false,
      admin_id: "",
      name: "",
      status: true,
      data: [],
      data1: [],
      primary_id: "",
      id: "",
      link: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.editopenModal = this.editopenModal.bind(this);
    this.editcloseModal = this.editcloseModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.add = this.add.bind(this);
    // this.edit = this.edit.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  add() {
    var data = new FormData();
    var image = document.querySelector('input[name="image"]').files[0];
    var banner_image = document.querySelector('input[name="banner_image"]')
      .files[0];
    var banner_icon = document.querySelector('input[name="banner_icon"]')
      .files[0];
    var status = this.state.status;
    var link = this.state.link;
    data.append("image", image);
    data.append("banner", banner_image);
    data.append("icon", banner_icon);
    data.append("status", status);
    data.append("link", link);

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!image) {
      valueErr = document.getElementsByClassName("err_image");
      valueErr[0].innerText = "This Field is Required";
    }
    // if(!banner_image) {
    //     valueErr = document.getElementsByClassName("err_banner_image");
    //     valueErr[0].innerText="This Field is Required";
    // }if(!banner_icon) {
    //     valueErr = document.getElementsByClassName("err_banner_icon");
    //     valueErr[0].innerText="This Field is Required";
    // }
    if (!status) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!link) {
      valueErr = document.getElementsByClassName("err_link");
      valueErr[0].innerText = "This Field is Required";
    }

    if (image && link) {
      AdminApiRequest(data, "/createBanner", "POST", "apiWithImage")
        .then((res) => {
          swal({
            title: "Success",
            text: "Record Added Successfully !",
            icon: "success",
            successMode: true,
          });
          // .then(willDelete => {
          // window.location.reload()
          // });
          this.setState({ modalIsOpen: false });
          this.getAllBanner();
        })
        .catch((error) => {
          alert(error);
        });
    }
  }

  // edit() {
  //     var name = this.state.name;
  //     var id = this.state.id;
  //     var status = this.state.status;

  //     var valueErr = document.getElementsByClassName("err");
  //     for(var i = 0; i < valueErr.length; i++){
  //         valueErr[i].innerText="";
  //     }
  //     if(!name) {
  //         valueErr = document.getElementsByClassName("name");
  //         valueErr[0].innerText = "This Field is Required";
  //     }
  //     var requestData = {

  //     }
  //     // if (name) {
  //         AdminApiRequest(requestData, '/updateBanner', 'POST', '', 'apiWithImage')
  //             .then((res) => {
  //                 console.log('Akash malik', res.data);
  //                 swal({
  //                     title: "Success",
  //                     text: "Record updated Successfully !",
  //                     icon: "success",
  //                     successMode: true,
  //                 })
  //             // .then(willDelete => {
  //             // window.location.reload()
  //             // });
  //            this.setState({modalIsOpen: false});
  //         })
  //         .catch((error) => {
  //            alert(error)
  //         })
  //     //  }
  // }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  async deleteRecord(_id) {
    await swal({
      title: "Are you sure",
      text: "Delete this record ?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        var requestData = {
          _id: _id,
        };
        AdminApiRequest(requestData, "/deleteBanner", "POST", "")
          .then((res) => {
            if (res.status === 200) {
              // this.setState({
              //     data: res.data.data
              // })
              swal({
                title: "Success",
                text: "Record Added Successfully !",
                icon: "success",
                successMode: true,
              });
              this.getAllBanner();
            }
            //    console.log(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  editcloseModal() {
    this.setState({ editmodalIsOpen: false });
  }
  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {
    this.getAllBanner();
  }
  getAllBanner() {
    AdminApiRequest("", "/admin/getAllBanner", "GET", "")
      .then((res) => {
        this.setState({
          data: res.data.data,
        });
        //    console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
                        <i className="material-icons">aspect_ratio</i>
                      </div>
                    </div>
                    <div className="card-body">
                      <h4 className="card-title"> Banner</h4>

                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={this.openModal}
                      >
                        {" "}
                        <i className="fa fa-plus"></i> Add Banner{" "}
                      </button>

                      <div className="table-responsive">
                        <table
                          id="datatables"
                          className="table table-striped table-no-bordered table-hover"
                          cellSpacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th scope="col">Banner</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.data && this.state.data[0]
                              ? this.state.data.map((data, Index) => (
                                  <tr>
                                    <td>
                                      {" "}
                                      <a
                                        href={
                                          data.image && data.image[0]
                                            ? imageUrl + data.image
                                            : noImage
                                        }
                                        target="_blank"
                                      >
                                        <img
                                          style={{ height: 70, width: 100 }}
                                          src={
                                            data.image && data.image[0]
                                              ? imageUrl + data.image
                                              : noImage
                                          }
                                        />
                                      </a>
                                    </td>
                                    <td
                                      className={
                                        data.status === "true"
                                          ? "view-status processed"
                                          : "view-section inprocessed"
                                      }
                                    >
                                      {data.status === "true"
                                        ? "Active"
                                        : "Inactive"}
                                    </td>
                                    <td>
                                      {/* <i className="fa fa-eye" onClick={this.viewopenModal.bind(this, data._id)}></i> */}
                                      {/* <i className="fa fa-edit" onClick={this.editopenModal.bind(this, data._id)}></i> */}
                                      <i
                                        className="fa fa-trash hover-with-cursor m-r-5"
                                        onClick={this.deleteRecord.bind(
                                          this,
                                          data._id
                                        )}
                                      ></i>
                                    </td>
                                  </tr>
                                ))
                              : "No Data Found"}
                          </tbody>
                        </table>
                      </div>
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
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Add Banner</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Link <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="link"
                              className="form-control"
                              placeholder="Slide Link"
                              onChange={this.formHandler}
                            />
                            <span className="err err_link"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Image<span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_image"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Banner Image<span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="banner_image"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_banner_image"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Icon<span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="file"
                              name="banner_icon"
                              className=""
                              placeholder=""
                              onChange={this.formHandler}
                            />
                            <span className="err err_banner_icon"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              name="status"
                              onChange={this.handleChangeStatus}
                              checked={this.state.status}
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="btn btn-primary m-r-5 float-right"
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
            </Modal>

            {/* Edit Modal */}
            <Modal
              isOpen={this.state.editmodalIsOpen}
              onRequestClose={this.editcloseModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content default_form_design">
                    <button
                      type="button"
                      className="close"
                      onClick={this.editcloseModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Edit Size</h4>
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
                              value={this.state.name}
                              name="name"
                              className="form-control"
                              placeholder="Enter size name"
                              onChange={this.formHandler}
                            />
                            <span className="err err_name"></span>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Status</label>
                          </div>
                          <div className="modal-right-bx">
                            <Switch
                              onChange={this.handleChangeStatus}
                              checked={
                                this.state.status === "true" ? true : false
                              }
                              name="status"
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          <button
                            type="button"
                            className="submit"
                            onClick={this.edit}
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
            {/* View Model */}
            {/* <div className= {this.state.show ? 'view-section show' : 'view-section hide'}>
                            <button type="button" className="close" onClick={this.viewcloseModal}>&times;</button>
                            <h4 className="modal-title">View Details </h4>
                            <div className="view-box">
                                <ul>
                                    <li>
                                        <span className="view-title">Size Name</span>
                                        <span className="view-status">{this.state.name}</span>
                                    </li>
                                    <li>
                                        <span className="view-title">Status</span>
                                        <span className={this.state.status === 'true' ? 'view-status processed' : 'view-section inprocessed'}>{this.state.status === 'true' ? 'Active':'Inactive'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div> */}
            {/* End View modal */}
            <div
              onClick={this.viewcloseModal}
              className={
                this.state.mdl_layout__obfuscator_hide
                  ? "mdl_layout__obfuscator_show"
                  : "mdl_layout__obfuscator_hide"
              }
            ></div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
