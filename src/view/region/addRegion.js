import React, { Component } from "react";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import "../../assets/css/cart.css";
import RegionData from "../../components/region.json";
import Footer from "../admin/elements/footer.js";

var data = [];
export default class AddRegion extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");
    if (dt) {
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      regionData: RegionData.states,
      expanded: [],
      checked: [],
      selectedRegion: [],
      status: true,
      name: "",
      addRegionStatus: true,
      modifiedRegionData: [],
    };
  }
  formHandler(ev) {
    this.setState({
      [ev.target.name]: ev.target.value,
    });
  }

  // handle checkboxes clicks
  async _handleRegion(val, type) {
    const id = await val.target.id.split(",");
    const checked = await val.target.checked;
    var tag = document.getElementsByName(id[0]);

    // if user checked any checkbox
    if (checked) {
      var checkState = data.filter((i) => i.state === id[0]);
      if (!checkState[0]) {
        //initial click or any checkbox
        await data.push({ state: id[0], dist: [] });
      }
      const dataLength = data.length;
      for (var i = 0; i < dataLength; i++) {
        if (data[i].state === id[0]) {
          const distLength = data[i].dist.length;
          var status = false;
          for (var j = 0; j < distLength; j++) {
            if (data[i].dist[j] === id[1]) {
              status = true;
              break;
            }
          }
          if (!status && id[1]) {
            data[i].dist.push(id[1]);
          }
        }
      }
      // }
      if (id.length === 1) {
        for (var k = 0; k < tag.length; k++) {
          tag[k].checked = true;
          var p = tag[k].id.split(",")[1];
          for (i = 0; i < dataLength; i++) {
            if (data[i].state === id[0] && p) {
              data[i].dist.push(p);
            }
          }
        }
      } else {
        let a = [];
        for (i = 0; i < tag.length; i++) {
          if (!tag[i].checked) {
            document.getElementById(id[0]).checked = false;
          }
          a.push(tag[i].checked);
        }
        var ck = a.filter((i) => i === false);
        if (ck.length < 2) {
          document.getElementById(id[0]).checked = true;
        }
      }
    } else {
      //if user uncheck any checkbox
      const dataLength = data.length;
      for (i = 0; i < dataLength; i++) {
        if (data[i].state === id[0]) {
          const distLength = data[i].dist.length;
          status = false;
          for (j = 0; j < distLength; j++) {
            if (data[i].dist[j] === id[1]) {
              data[i].dist.splice(j, 1);
              break;
            }
          }
        }
      }
      if (id.length === 1) {
        for (k = 0; k < tag.length; k++) {
          tag[k].checked = false;
          var index;
          for (i = 0; i < dataLength; i++) {
            if (data[i] && data[i].state === id[0]) {
              index = i;
              break;
            }
          }
          data.splice(index, 1);
        }
      } else {
        let a = [];
        for (i = 0; i < tag.length; i++) {
          document.getElementById(id[0]).checked = false;
          a.push(tag[i].checked);
        }
      }
    }
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({ status: true });
    } else {
      this.setState({ status: false });
    }
  }

  add() {
    var name = this.state.name;
    var regionDataToBeSend = [];
    this.state.modifiedRegionData.map((reg) => {
      if (reg.status) {
        regionDataToBeSend.push(reg);
      } else {
        reg.regionData.map((subRegion) => {
          if (subRegion.status) {
            if (
              regionDataToBeSend.filter((i) => {
                return i.name === reg.name;
              }).length > 0
            ) {
              regionDataToBeSend.map((it, ind) => {
                if (it.name === reg.name) {
                  regionDataToBeSend[ind].regionData.push(subRegion);
                }
                return null;
              });
            } else {
              regionDataToBeSend.push({
                stateName: reg.stateName,
                status: reg.status,
                regionData: [subRegion],
              });
            }
          }
          return null;
        });
      }
      return null;
    });
    // var status = this.state.status;

    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (!name) {
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!regionDataToBeSend || regionDataToBeSend.length === 0) {
      document.querySelector(".err_region").innerHTML = "No Region Selected";
    }
    if (name && regionDataToBeSend.length > 0) {
      const requestData = {
        name: this.state.name,
        stateData: regionDataToBeSend,
        status: this.state.status,
      };
      AdminApiRequest(requestData, "/admin/addRegion", "POST")
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            swal({
              title: "Success",
              text: "Region Added Successfully !",
              icon: "success",
              successMode: true,
            });
          } else {
          }
        })
        .then(() => this.props.back())
        .catch((error) => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    const ModifiedRegions = this.state.regionData.map((mainReg, index) => {
      return {
        _id: index,
        stateName: mainReg.label,
        status: false,
        regionData: mainReg.children.map((subReg, indexes) => {
          return {
            _id: indexes,
            district: subReg.label,
            deliveryCharges: 0,
            codAvailable: false,
            codCharges: 0,
            status: false,
            minimumOrderValue: 0,
          };
        }),
      };
    });
    this.setState({
      modifiedRegionData: ModifiedRegions,
    });
  }

  handleCodStatus = (item, sItem) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        mainReg.regionData.map((reg) => {
          if (reg._id === sItem._id) {
            reg.codAvailable = !reg.codAvailable;
          }
          return null;
        });
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };

  handleDeliveryChargeChange = (e, item, sItem, isMinOrderValue) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        mainReg.regionData.map((reg) => {
          if (reg._id === sItem._id) {
            reg.deliveryCharges = e.target.value;
          }
          return null;
        });
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };

  handleCodChargeChange = (e, item, sItem) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        mainReg.regionData.map((reg) => {
          if (reg._id === sItem._id) {
            reg.codCharges = e.target.value;
          }
          return null;
        });
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };

  toggleDropdown = (e, index) => {
    const sibling = e.target.nextElementSibling;
    if (sibling !== null) {
      sibling.classList.toggle("hide");
    }
  };
  handleDistrictStatus = (item, sItem) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        mainReg.regionData.map((reg) => {
          if (reg._id === sItem._id) {
            reg.status = !reg.status;
          }
          return null;
        });
        //making main Region false if any of children region is false
        if (
          mainReg.regionData.filter((i) => {
            return i.status === false;
          }).length > 0
        ) {
          mainReg.status = false;
        }
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };

  handleStateStatus = (item, e) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        if (!mainReg.status) {
          //opening dropdown when status is about to be true
          e.target.parentElement.nextElementSibling.classList.remove("hide");
        }
        mainReg.status = !mainReg.status;
        mainReg.regionData !== undefined &&
          mainReg.regionData.map((reg) => (reg.status = mainReg.status));
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };
  handleMinOrderValue = (e, item, sItem) => {
    var localRegionData = this.state.modifiedRegionData;
    localRegionData.map((mainReg) => {
      if (mainReg._id === item._id) {
        mainReg.regionData.map((reg) => {
          if (reg._id === sItem._id) {
            reg.minimumOrderValue = e.target.value;
          }
          return null;
        });
      }
      return null;
    });

    this.setState({
      modifiedRegionData: localRegionData,
    });
  };

  render() {
    return (
      <div className="wrapper width100">
        <div role="dialog">
          <div className="col-md-12 ml-auto mr-auto">
            <div className="card">
              <div className="card-header card-header-primary card-header-icon">
                <div className="card-icon">
                  <i className="material-icons">map</i>
                </div>
              </div>
              <div className="card-body">
                <h4 className="card-title">Add Region</h4>
                <button
                  type="button"
                  className="btn btn-primary m-r-5 float-right pointer"
                  onClick={this.props.back}
                >
                  <i
                    className="fa fa-arrow-left"
                    style={{ color: "white" }}
                  ></i>{" "}
                  Back
                </button>
              </div>

              <div className="modal-form-bx m-50">
                <form>
                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label className="region-headig-block">
                        <b>Region Name</b>
                        <span className="asterisk">*</span>
                      </label>
                    </div>
                    <div className="modal-right-bx">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Enter Region Name"
                        onChange={(e) => this.formHandler(e)}
                      />
                      <span className="err err_name"></span>
                    </div>
                  </div>

                  <div className="form-group region-block-list">
                    {/* <div className="modal-left-bx"><label>District<span className="asterisk">*</span></label></div> */}
                    <div className="modal-right-bx">
                      {this.state.modifiedRegionData &&
                      this.state.modifiedRegionData[0]
                        ? this.state.modifiedRegionData.map((item, index) => {
                            return (
                              <>
                                <div
                                  className=""
                                  key={index}
                                  id={"regionState" + index}
                                  style={{
                                    padding: "16px",
                                    borderRadius: "5px",
                                    background: "#ececec",
                                    margin: "10px",
                                  }}
                                >
                                  <div
                                    className="regions-form-header"
                                    onClick={(e) =>
                                      this.toggleDropdown(e, index)
                                    }
                                  >
                                    <label for={item.stateName}>
                                      <strong>{item.stateName}</strong>
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="m-r-10"
                                      id={`${item.stateName}`}
                                      name={item.stateName}
                                      checked={item.status}
                                      onChange={(e) =>
                                        this.handleStateStatus(item, e)
                                      }
                                      //   onChange={(ev) => this._handleRegion(ev)}
                                    />
                                  </div>
                                  <div className="region-subcategory hide">
                                    <thead>
                                      <tr>
                                        <th>Status</th>
                                        <th>Name</th>
                                        {/* <th>Delivery Charges</th>
                                        <th>COD Available</th>
                                        <th>COD Charges</th>
                                        <th>Min Order Value</th> */}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.regionData.map((sItem) => (
                                        <tr className="child">
                                          <td>
                                            <div className="round">
                                              <input
                                                type="checkbox"
                                                className="m-r-10"
                                                id={`${item.stateName},${sItem.district}`}
                                                name={sItem.district}
                                                onChange={() =>
                                                  this.handleDistrictStatus(
                                                    item,
                                                    sItem
                                                  )
                                                }
                                                checked={sItem.status}
                                                style={{
                                                  height: "30px",
                                                  width: "30px",
                                                }}
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            <label for={sItem.district}>
                                              {sItem.district}
                                            </label>
                                          </td>
                                          {/* <td>
                                            <input
                                              type="number"
                                              placeholder="Enter Delivery Charges"
                                              name="deliveryCharges"
                                              onChange={(e) =>
                                                this.handleDeliveryChargeChange(
                                                  e,
                                                  item,
                                                  sItem
                                                )
                                              }
                                            />
                                          </td>
                                          <td>
                                            <Switch
                                              name="status"
                                              checked={sItem.codAvailable}
                                              onChange={() =>
                                                this.handleCodStatus(
                                                  item,
                                                  sItem
                                                )
                                              }
                                              id="normal-switch"
                                            />
                                          </td>
                                          <td>
                                            {sItem.codAvailable ? (
                                              <input
                                                type="number"
                                                placeholder="Enter COD Charges"
                                                name="codCharges"
                                                onChange={(e) =>
                                                  this.handleCodChargeChange(
                                                    e,
                                                    item,
                                                    sItem
                                                  )
                                                }
                                              />
                                            ) : (
                                              <input
                                                type="number"
                                                placeholder="Enter COD Charges"
                                                disabled
                                              />
                                            )}
                                          </td>
                                          <td>
                                            <input
                                              type="number"
                                              placeholder="Enter Min Order Value"
                                              name="minimumOrderValue"
                                              value={sItem.minimumOrderValue}
                                              onChange={(e) =>
                                                this.handleMinOrderValue(
                                                  e,
                                                  item,
                                                  sItem
                                                )
                                              }
                                            />
                                          </td>
                                        */}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </div>
                                </div>
                              </>
                            );
                          })
                        : ""}
                      <span className="err err_region"></span>
                    </div>
                  </div>

                  {/* <CheckboxTree
                                nodes={this.state.regionData}
                                checked={this.state.checked}
                                expanded={this.state.expanded}
                                checkModel='all'
                                nativeCheckboxes={true}
                                onCheck={checked => this.setState({ checked })}
                                onExpand={expanded => this.setState({ expanded })}
                                onCheck={(ev) => this._handleChange(ev)}
                            /> */}

                  <div className="form-group">
                    <div className="modal-left-bx">
                      <label>Status</label>
                    </div>
                    <div className="modal-right-bx">
                      <Switch
                        name="status"
                        onChange={(e) => this.handleChangeStatus(e)}
                        checked={this.state.status}
                        id="normal-switch"
                      />
                    </div>
                  </div>
                  <div className="modal-bottom">
                    {/* <button
                      type="button"
                      className="btn btn-primary feel-btn"
                      onClick={this.props.back}
                    >
                      Cancel
                    </button> */}
                    <button
                      type="button"
                      className="btn btn-primary feel-btn"
                      onClick={() => this.add()}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}
