import React from "react";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

class DeliverySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Farm_pick_up: false,
      MOQ: false,
      Free_Shipping: false,
      COD: false,
      farm_pick_up_time: "",
      same_day_delivery_time: "",
      Same_day_delivery_till_2pm: false,
      Next_day_delivery_Standard_9am_9pm: false,
      Next_day_delivery_8am_2pm: false,
      Next_day_delivery_2pm_8pm: false,
      allData: {},
      Slot1String: "",
      Slot2String: "",
      Slot3String: "",
      Slot4String: "",
    };
    this.formHandler = this.formHandler.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);
  }
  async formHandler(val, type) {
    this.setState({ [val.target.name]: val.target.value });
  }
  async handleChangeStatus(status, e, id) {
    this.setState({ [id]: status });
  }

  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/admin/pincodeSetting/one", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            Farm_pick_up: res.data.data.Farm_pick_up === "yes" ? true : false,
            MOQ: res.data.data.MOQ === "yes" ? true : false,
            Free_Shipping: res.data.data.Free_Shipping === "yes" ? true : false,
            COD: res.data.data.COD === "yes" ? true : false,
            Same_day_delivery_till_2pm:
              res.data.data.Same_day_delivery_till_2pm === "yes" ? true : false,
            Next_day_delivery_Standard_9am_9pm:
              res.data.data.Next_day_delivery_Standard_9am_9pm === "yes"
                ? true
                : false,
            Next_day_delivery_8am_2pm:
              res.data.data.Next_day_delivery_8am_2pm === "yes" ? true : false,
            Next_day_delivery_2pm_8pm:
              res.data.data.Next_day_delivery_2pm_8pm === "yes" ? true : false,
            Standard_delivery:
              res.data.data.Standard_delivery === "yes" ? true : false,
            allData: res.data.data,
            Slot1String: res.data.data.Slot1String || "",
            Slot2String: res.data.data.Slot2String || "",
            Slot3String: res.data.data.Slot3String || "",
            Slot4String: res.data.data.Slot4String || "",
            Slot5String: res.data.data.Slot5String || "",
            farm_pick_up_time: res.data.data.farm_pick_up_time || "",
            same_day_delivery_time: res.data.data.same_day_delivery_time || "",
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

  updateSetting() {
    if (
      this.state.Slot1String &&
      this.state.Slot2String &&
      this.state.Slot3String &&
      this.state.Slot4String &&
      this.state.Slot5String
    ) {
      let data = {
        ...this.state.allData,
        Farm_pick_up: this.state.Farm_pick_up ? "yes" : "no",
        MOQ: this.state.MOQ ? "yes" : "no",
        Free_Shipping: this.state.Free_Shipping ? "yes" : "no",
        COD: this.state.COD ? "yes" : "no",
        Same_day_delivery_till_2pm: this.state.Same_day_delivery_till_2pm
          ? "yes"
          : "no",
        Next_day_delivery_Standard_9am_9pm: this.state
          .Next_day_delivery_Standard_9am_9pm
          ? "yes"
          : "no",
        Next_day_delivery_8am_2pm: this.state.Next_day_delivery_8am_2pm
          ? "yes"
          : "no",
        Next_day_delivery_2pm_8pm: this.state.Next_day_delivery_2pm_8pm
          ? "yes"
          : "no",
        Standard_delivery: this.state.Standard_delivery ? "yes" : "no",
        Slot1String: this.state.Slot1String || "",
        Slot2String: this.state.Slot2String || "",
        Slot3String: this.state.Slot3String || "",
        Slot4String: this.state.Slot4String || "",
        Slot5String: this.state.Slot5String || "",
        farm_pick_up_time: this.state.farm_pick_up_time || "",
        same_day_delivery_time: this.state.same_day_delivery_time || "",
      };
      AdminApiRequest(data, "/admin/pincodeSetting/update", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Settings updated successfully",
              icon: "success",
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
    } else {
      swal({
        title: "Error ",
        text: "Please enter all slots name",
        icon: "warning",
        dangerMode: true,
      });
    }
  }

  componentDidMount() {
    this.GetAdminSetting();
    if (!JSON.parse(localStorage.getItem("storeheyLoggedIn"))) {
      this.props.history.push("/storehey");
    }
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
                <h3>Delivery</h3>
                <div className="Default_icon setting-first-default">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Farm PickUp</label>
                    </div>
                    <div className="modal-right-bx d-flex align-items-center">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Farm_pick_up}
                        id="Farm_pick_up"
                      />
                      <input
                        type="time"
                        name="farm_pick_up_time"
                        placeholder="time"
                        onChange={(e) =>
                          this.setState({ farm_pick_up_time: e.target.value })
                        }
                        value={this.state.farm_pick_up_time}
                        className="delivery-time-input ml-3"
                        style={{ maxWidth: 200 }}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>MOP(Minimum Order Price)</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.MOQ}
                        id="MOQ"
                      />
                    </div>{" "}
                  </div>
                </div>

                <div className="Default_icon setting-last-default">
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Free Shipping</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Free_Shipping}
                        id="Free_Shipping"
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>COD</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.COD}
                        id="COD"
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group my-3">
                    <div className="modal-left-bx">
                      <label>Slot 1</label>
                    </div>
                    <div className="modal-right-bx">
                      <div className="d-flex align-items-center">
                        <Switch
                          onChange={this.handleChangeStatus}
                          checked={this.state.Same_day_delivery_till_2pm}
                          id="Same_day_delivery_till_2pm"
                        />
                        <input
                          type="time"
                          name="same_day_delivery_time"
                          placeholder="time"
                          onChange={(e) =>
                            this.setState({
                              same_day_delivery_time: e.target.value,
                            })
                          }
                          value={this.state.same_day_delivery_time}
                          className="delivery-time-input ml-3"
                          style={{ maxWidth: 200 }}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="form-control"
                        name="Slot1String"
                        value={this.state.Slot1String}
                        onChange={(e) => this.formHandler(e)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group my-3">
                    <div className="modal-left-bx">
                      {/* <label>Next Day Standard Delivery</label> */}
                      <label>Slot 2</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Next_day_delivery_Standard_9am_9pm}
                        id="Next_day_delivery_Standard_9am_9pm"
                      />
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="form-control"
                        name="Slot2String"
                        value={this.state.Slot2String}
                        onChange={(e) => this.formHandler(e)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group my-3">
                    <div className="modal-left-bx">
                      <label>Slot 3</label>
                      {/* <label>
                        Next day delivery <small>(8am-2pm)</small>
                      </label> */}
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Next_day_delivery_8am_2pm}
                        id="Next_day_delivery_8am_2pm"
                      />
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="form-control"
                        name="Slot3String"
                        value={this.state.Slot3String}
                        onChange={(e) => this.formHandler(e)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group my-3">
                    <div className="modal-left-bx">
                      <label>Slot 4</label>
                      {/* <label>
                        Next day delivery <small>(2pm-8pm)</small>
                      </label> */}
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Next_day_delivery_2pm_8pm}
                        id="Next_day_delivery_2pm_8pm"
                      />
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="form-control"
                        name="Slot4String"
                        value={this.state.Slot4String}
                        onChange={(e) => this.formHandler(e)}
                      />
                    </div>{" "}
                  </div>
                  <div className="form-group my-3">
                    <div className="modal-left-bx">
                      <label>Slot 5</label>
                      {/* <label>
                        Next day delivery <small>(2pm-8pm)</small>
                      </label> */}
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        onChange={this.handleChangeStatus}
                        checked={this.state.Standard_delivery}
                        id="Standard_delivery"
                      />
                      <input
                        type="text"
                        placeholder="Enter name"
                        className="form-control"
                        name="Slot5String"
                        value={this.state.Slot5String}
                        onChange={(e) => this.formHandler(e)}
                      />
                    </div>{" "}
                  </div>
                  <button
                    className="btn btn-primary mt-5 d-block w-100"
                    onClick={() => this.updateSetting()}
                  >
                    Update
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

export default DeliverySetting;
