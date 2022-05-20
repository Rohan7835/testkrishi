import React, { Component } from "react";
import Modal from "react-modal";
import Moment from "react-moment";
import Switch from "react-switch";
import Adminfooter from "../elements/admin_footer";
import Adminheader from "../elements/admin_header";
import Adminsiderbar from "../elements/admin_sidebar";
import Footer from "../elements/footer";
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

export default class orderdetails extends Component {
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
      status: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.viewopenModal = this.viewopenModal.bind(this);
    this.viewcloseModal = this.viewcloseModal.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
  }

  formHandler(ev) {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: "true" });
    } else {
      this.setState({ status: "false" });
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  viewopenModal(id) {
    // orderlistingdetails(id)
    //   .then((res) => {
    //     this.setState({});
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
    this.setState({ show: true });
    this.setState({ mdl_layout__obfuscator_hide: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  viewcloseModal() {
    this.setState({ show: false });
    this.setState({ mdl_layout__obfuscator_hide: false });
  }

  componentDidMount() {}
  render() {
    return (
      <div className="body-wrapper">
        <div className="admin-header">
          <Adminheader />
        </div>
        <div className="app-body">
          <Adminsiderbar />
          <div id="content-wrapper">
            <div className="listing-section">
              <div className="listing-header">
                <div className="pay-bx">
                  <ul>
                    <li className="active">Order</li>
                  </ul>
                </div>
              </div>
              <div className="form-box"></div>
              <div className="listing-table-bx">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">Order Number</th>
                      <th scope="col">Product</th>
                      <th scope="col">Order Status</th>
                      <th scope="col">Total Amount</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* { this.state.data && this.state.data.length > 0 ?
                                        this.state.data.map((data, Index) => */}
                    <tr>
                      <td>123</td>
                      <td>Ring</td>
                      <td>Pending</td>
                      <td>5500</td>
                      {/* <td className={data.status === "true" ? 'view-status processed' : 'view-section inprocessed'}>{data.status === 'true' ? 'Active' : 'Inactive'}</td> */}
                      <td>
                        <button className="view" title="Order Details">
                          <i
                            className="fa fa-eye"
                            onClick={this.viewopenModal.bind(this)}
                          ></i>
                        </button>
                      </td>
                    </tr>
                    {/* ):<tr>No Order Done</tr>} */}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Add model here */}
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <div role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <button
                      type="button"
                      className="close"
                      onClick={this.closeModal}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title">Add Color</h4>
                    <div className="modal-form-bx">
                      <form>
                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>
                              Color Name <span className="asterisk">*</span>
                            </label>
                          </div>
                          <div className="modal-right-bx">
                            <input
                              type="text"
                              name="name"
                              className="form-control"
                              placeholder="Enter Color Name"
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
                              checked={this.state.status}
                              id="normal-switch"
                            />
                          </div>
                        </div>
                        <div className="modal-bottom">
                          {/* <button className="cancel" onClick={this.closeModal}>Cancel</button> */}
                          <button
                            type="button"
                            className="submit"
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
            {/* View Model */}
            <div
              className={
                this.state.show ? "view-section show" : "view-section hide"
              }
            >
              <button
                type="button"
                className="close"
                onClick={this.viewcloseModal}
              >
                &times;
              </button>
              <h4 className="modal-title">View Details </h4>
              <div className="view-box">
                <ul>
                  <li>
                    <span className="view-title">Customer Name</span>
                    <span className="view-status">
                      {this.state.customer_name}
                    </span>
                  </li>
                  <li>
                    <span className="view-title">Mobile Number</span>
                    <span className="view-status">{this.state.mobile_no}</span>
                  </li>
                  <li>
                    <span className="view-title">Email Id</span>
                    <span className="view-status">{this.state.email}</span>
                  </li>
                  <li>
                    <span className="view-title">Total Amount</span>
                    <span className="view-status">
                      {this.state.payment_amount}
                    </span>
                  </li>
                  <li>
                    <span className="view-title">Date</span>
                    <span className="view-status">
                      <Moment format="DD/MM/YYYY hh:mm:ss A">
                        {this.state.created_at}
                      </Moment>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
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
        <div className="admin-header">
          <Adminfooter />
        </div>
      </div>
    );
  }
}
