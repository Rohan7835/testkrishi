import CKEditor from "ckeditor4-react";
import React from "react";
import Modal from "react-modal";
import Select from "react-select";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
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
    transform: "translate(-50%,-50%)",
  },
};
export default class email_templates extends React.Component {
  constructor(props) {
    super(props);
    let defaultObj = {
      admin_roles: [],
      admin_email: 0,
      user_email: 0,
      sms: 0,
    };
    this.admin_roles = [];
    this.state = {
      status: false,
      modalIsOpen: false,
      DropdownData: [],
      selectedTemplate: [],
    };
  }

  componentDidMount() {
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
    // 1. load admin roles
    let data = {};
    AdminApiRequest(data, "/emailTemp/all", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          const dropdown = res.data.data.map((dt) => {
            return { label: dt.template_name, value: dt._id };
          });
          this.setState({ DropdownData: dropdown });
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

  update(dt) {
    let data = { ...dt };
    AdminApiRequest(data, "/emailTemp/update", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          swal({
            title: "Success",
            text: "Updated Successfully !",
            icon: "success",
            successMode: true,
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
  changeEditor(evt, index) {
    const data = this.state.selectedTemplate;
    const newData = { ...data, email_text: evt.editor.getData() };
    console.log(newData);
    this.setState({ selectedTemplate: newData });
  }
  handleChange(e) {
    const data = this.state.selectedTemplate;
    const newData = { ...data, [e.target.name]: e.target.value };
    this.setState({ selectedTemplate: newData });
  }

  changeStatus(e) {
    console.log(e);
    const data = this.state.selectedTemplate;
    const newData = { ...data, status: e };
    console.log(newData);
    this.setState({ selectedTemplate: newData });
  }
  changeTemplate(name) {
    let data = { template_name: name };
    AdminApiRequest(data, "/emailTemp/one", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({ selectedTemplate: res.data.data });
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
  render() {
    const selectedTemplate = this.state.selectedTemplate;
    return (
      <>
        <div className="wrapper ">
          <Adminsiderbar />
          <div className="main-panel">
            <Adminheader />
            <div className="content">
              <div className="container-fluid">
                <div className="col-md-12 ml-auto mr-auto">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <h4
                          className="card-title mb-2"
                          style={{ color: "#FEBC15" }}
                        >
                          Email Templates
                        </h4>
                        <p
                          onClick={() => this.setState({ modalIsOpen: true })}
                          className="btn btn-primary"
                        >
                          View Details
                        </p>
                      </div>
                      <div className="email-dropdown p-4">
                        <p
                          style={{
                            fontSize: 18,
                            fontWeight: 500,
                            letterSpacing: 0,
                            textTransform: "uppercase",
                          }}
                        >
                          Select Template
                        </p>
                        <Select
                          options={this.state.DropdownData}
                          onChange={(e) => this.changeTemplate(e.label)}
                          placeholder="Select Template Name.."
                          noOptionsMessage={() => "No more options"}
                          matchFrom="start"
                          className="select-search"
                          name="supplier"
                        />
                      </div>

                      <div className="row p-4">
                        {this.state.selectedTemplate._id ? (
                          <div className="col-md-12">
                            {/* <p
                              className="mb-3 p-1"
                              style={{
                                fontSize: 18,
                                fontWeight: 500,
                                letterSpacing: 0,
                                textTransform: "uppercase",
                              }}
                            >
                              {selectedTemplate.template_name}
                            </p> */}
                            <div
                              className="email-template-wrapper  p-4 m-2 mb-4"
                              style={{
                                border: "1px solid lightgray",
                                borderRadius: 7,
                              }}
                            >
                              <div className="row">
                                <div className="col-12 mb-3">
                                  <label htmlFor="" className="m-0 p-0">
                                    Email Name
                                  </label>
                                  <input
                                    type="text"
                                    name="template_name"
                                    placeholder="Enter Template Name.."
                                    className="form-control"
                                    value={selectedTemplate.template_name}
                                    onChange={(ev) => this.handleChange(ev)}
                                  />
                                </div>
                                <div className="col-12 mb-3">
                                  <label htmlFor="" className="m-0 p-0">
                                    Subject
                                  </label>
                                  <input
                                    type="text"
                                    name="email_subject"
                                    className="form-control"
                                    placeholder="Enter Email Subject"
                                    onChange={(ev) => this.handleChange(ev)}
                                    value={selectedTemplate.email_subject}
                                  />
                                </div>
                                <div className="col-12 mb-3 ck-email-editor">
                                  <label htmlFor="">Template</label>
                                  <CKEditor
                                    onChange={(ev) => this.changeEditor(ev)}
                                    data={selectedTemplate.email_text}
                                    type="classic"
                                  />
                                </div>
                                <div className="col-12 mb-3 d-flex align-items-center">
                                  <label htmlFor="" className="mr-2 my-0 p-0">
                                    Status
                                  </label>
                                  <Switch
                                    onChange={(e) => this.changeStatus(e)}
                                    checked={selectedTemplate.status}
                                    id="normal-switch"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                className="fill-btn"
                                style={{ maxWidth: 200 }}
                                onClick={() => this.update(selectedTemplate)}
                              >
                                <span className="button-text">Update</span>
                                <span className="button-overlay"></span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
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
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={() => this.setState({ modalIsOpen: false })}
              style={customStyles}
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={() => this.setState({ modalIsOpen: false })}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Details</h4>
                    <div className="modal-form-bx">
                      <div className="row custom-table">
                        <div className="col-md-12">
                          <div className="p-3">
                            <p className=" text-uppercase custom-table-head">
                              Customer
                            </p>
                            <table className="table  table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">Variable Name</th>
                                  <th scope="col">Example</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>##Customer_Name##</td>
                                  <td>Tech9logy</td>
                                </tr>
                                <tr>
                                  <td>##Customer_Mobile##</td>
                                  <td>9876543210</td>
                                </tr>
                                <tr>
                                  <td>##Customer_Email##</td>
                                  <td>Useremail@gmail.com</td>
                                </tr>
                                <tr>
                                  <td>##Customer_City##</td>
                                  <td>Faridabad</td>
                                </tr>
                                <tr>
                                  <td>##Customer_Feedback##</td>
                                  <td>
                                    First I would like to thank you for fastest
                                    delivery and the delivery guy is so
                                    cooperative{" "}
                                  </td>
                                </tr>
                                <tr>
                                  <td>##Customer_Attachment##</td>
                                  <td>File</td>
                                </tr>
                                <tr>
                                  <td>##Wallet_Amount##</td>
                                  <td>100</td>
                                </tr>
                                <tr>
                                  <td>##Reason_To_Give_Loyalty_Points##</td>
                                  <td>Welcome bonus</td>
                                </tr>
                                <tr>
                                  <td>##Loyalty_Points_Expiry_Date##</td>
                                  <td>01/01/2021</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="p-3">
                            <p className=" text-uppercase custom-table-head">
                              Admin
                            </p>
                            <table className="table  table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">Variable Name</th>
                                  <th scope="col">Example</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>##Admin_Name##</td>
                                  <td>Admin</td>
                                </tr>
                                <tr>
                                  <td>##Website_Link##</td>
                                  <td>www.tech9logy.com</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="p-3">
                            <p className=" text-uppercase custom-table-head">
                              Order
                            </p>
                            <table className="table  table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">Variable Name</th>
                                  <th scope="col">Example</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>##Order_Id##</td>
                                  <td>ORDERID01</td>
                                </tr>
                                <tr>
                                  <td>##Order_Delivery_Date##</td>
                                  <td>01/01/2021</td>
                                </tr>
                                <tr>
                                  <td>##Order_Detail##</td>
                                  <td>
                                    Includes shipping, payment & other order
                                    details
                                  </td>
                                </tr>
                                <tr>
                                  <td>##Subscription_Dates##</td>
                                  <td>01/01/2021 , 05/01/2021</td>
                                </tr>
                                <tr>
                                  <td>##Driver_Name##</td>
                                  <td>Raju kumar</td>
                                </tr>
                                <tr>
                                  <td>##Driver_Mobile##</td>
                                  <td>9876543210</td>
                                </tr>
                                <tr>
                                  <td>##Loyalty_Points##</td>
                                  <td>50</td>
                                </tr>
                                <tr>
                                  <td>##Referral_Benefit_Points##</td>
                                  <td>50</td>
                                </tr>

                                <tr>
                                  <td>##Referral_By##</td>
                                  <td>Tech9logy</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="p-3">
                            <p className=" text-uppercase custom-table-head">
                              Inventory
                            </p>
                            <table className="table  table-striped">
                              <thead>
                                <tr>
                                  <th scope="col">Variable Name</th>
                                  <th scope="col">Example</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>##Bill_Date##</td>
                                  <td>10/10/2021</td>
                                </tr>
                                <tr>
                                  <td>##Bill_Time##</td>
                                  <td>10:00 am</td>
                                </tr>
                                <tr>
                                  <td>##Bill_No##</td>
                                  <td>123</td>
                                </tr>
                                <tr>
                                  <td>##Supplier_Name##</td>
                                  <td>Supplier name</td>
                                </tr>
                                <tr>
                                  <td>##Product_Detail##</td>
                                  <td>Includes Product name, qty</td>
                                </tr>
                                <tr>
                                  <td>##Total_Quantity##</td>
                                  <td>10</td>
                                </tr>
                                <tr>
                                  <td>##Total_Cost##</td>
                                  <td>5000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          <Footer />
        </div>
      </>
    );
  }
}
