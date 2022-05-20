import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminfooter from "../../view/admin/elements/admin_footer";
import Adminheader from "../../view/admin/elements/admin_header";
import Adminsiderbar from "../../view/admin/elements/admin_sidebar";

export default class Email extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    var dets = JSON.parse(dt);
    if (dt) {
      var user_det = dets.user_type;
    } else {
      window.location = "/login";
    }

    this.state = {
      user: user_det,
      htmldata: "",
    };

    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  onchang = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onEditorChange(evt) {
    this.setState({
      htmldata: evt.editor.getData(),
    });
  }

  handleChange(changeEvent) {
    this.setState({
      htmldata: changeEvent.target.value,
    });
  }

  async update() {
    let data = {
      status: true,
      desc: this.state.htmldata,
    };
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (this.state.htmldata) {
      await AdminApiRequest(data, "/admin/Setting/addPrivacyPolicy", "POST")
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Privacy Policy Updated!",
              // text: "You clicked the button!",
              icon: "success",
            });
            this.getalluser();
            this.setState({
              loading: false,
              view: "table",
            });
          } else if (res.status === 404) {
            // valueErr = document.getElementsByClassName("err_password");
            // valueErr[0].innerText = "Invalid Credentials !";
            swal({
              title: "Email Already Exist !",
              // text: "Please Try Again",
              icon: "warning",
              dangerMode: true,
            });
            this.setState({ loading: false });
          } else {
            swal({
              title: "You are not permited !",
              text: "Try Again with valid User",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async getalluser() {
    this.setState({ loading: true });
    let user = {};
    await AdminApiRequest(user, "/admin/Setting/getPrivacyPolicy", "GET")
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            htmldata: res.data.data.desc,
          });
          this.setState({ loading: false });
        }
      })
      .catch((err) => console.log(err));
  }

  componentDidMount() {
    this.getalluser();
  }

  render() {
    return (
      <div>
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
                          <i className="material-icons">slideshow</i>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="manage_up_add_btn"></div>
                        <div>
                          <div>
                            <div>
                              <div>
                                <div htmlFor="hf-email">Privacy Policy</div>
                              </div>
                              <div>
                                <CKEditor
                                  data={this.state.htmldata}
                                  onChange={this.onEditorChange}
                                />
                              </div>
                            </div>
                            <button
                              className="btn btn-outline-primary general-button"
                              style={{ margin: "0 auto" }}
                              onClick={() => {
                                this.update();
                              }}
                            >
                              <i
                                className="fa fa-pencil"
                                aria-hidden="true"
                              ></i>{" "}
                              Update
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="admin-header">
            <Adminfooter />
          </div>
        </div>
        9
      </div>
    );
  }
}
