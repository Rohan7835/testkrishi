import React from "react";
import Geocode from "react-geocode";
import ReactLoading from "react-loading";
import Modal from "react-modal";
import { connect } from "react-redux";
import swal from "sweetalert";
import { ApiRequest } from "../../apiServices/ApiRequest";
import Add_address from "../../components/Address/Add_address";
import Edit_address from "../../components/Address/Edit_address";
import Sidebar from "../main_sidebar/sidebar";
const google = window.google;
const GOOGLE_API_KEY = "AIzaSyCazDplf1HtSAyvjhY40uqUaTBuSYoVyGE";
Geocode.setApiKey(GOOGLE_API_KEY);
Geocode.setRegion("in");
class Address extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.user_details._id) {
    } else {
      this.props.history.push("/");
      localStorage.clear();
      window.location.reload();
    }
    this.state = {
      user_id: "",
      location_tag: "",
      editlocattion_tag: "",
      address: "",
      street_address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      all_address: [],
      editcity: "",
      editcountry: "",
      editcreated_at: "",
      edithouseNo: "",
      editpincode: "",
      loading: true,
      buttonLoading: false,
      editlocality: "",
      editstate: "",
      editstreet: "",
      locality: "",
      edituser_id: "",
      place: null,
      position: {
        lat: 0,
        lng: 0,
      },
      showPincodeInput: true,
    };
    this.changePlaces = this.changePlaces.bind();
    this.changePlaces_edit = this.changePlaces_edit.bind();
  }

  formHandler(val) {
    var name = val.target.name;
    var value = val.target.value;
    this.setState({ [name]: value });
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.usersdetails();
    this.setState({
      modalIsOpen: false,
      modalIsOpenedit: false,
      street_address: "",
      latitude: "",
      longitude: "",
      country: "",
      state: "",
      instructions: "",
      city: "",
      pincode: "",
      showPincodeInput: true,
    });
  };

  openeditModal(ev) {
    this.setState({
      selectedEditAddress: ev,
      editcity: ev.city,
      editcountry: ev.country,
      editcreated_at: ev.created_at,
      edithouseNo: ev.houseNo,
      editlocattion_tag: ev.locationTag,
      editpincode: ev.pincode,
      editstate: ev.state,
      editstreet: ev.street,
      edituser_id: ev._id,
      editlocality: ev.locality,
      latitude: ev.latitude,
      longitude: ev.longitude,
      delivery_instructions: ev.instructions ? ev.instructinos : "",
    });
    this.setState({ modalIsOpenedit: true, showPincodeInput: true });
  }

  update = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.editlocattion_tag === "") {
      valueErr = document.getElementsByClassName("err_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.edithouseNo === "") {
      valueErr = document.getElementsByClassName("err_edithouseNo");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.editpincode) {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.editpincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_editpincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }

    if (!this.state.editstreet && !this.state.street_address) {
      valueErr = document.getElementsByClassName("err_editstreet");
      valueErr[0].innerText = "Field is Required";
    }
    if (
      this.state.edithouseNo &&
      this.state.editpincode &&
      this.state.editpincode.length === 6 &&
      this.state.editlocattion_tag &&
      (this.state.editstreet || this.state.street_address)
    ) {
      this.setState({ buttonLoading: true });
      const requestData = {
        _id: this.state.edituser_id ? this.state.edituser_id : "",
        locationTag: this.state.editlocattion_tag
          ? this.state.editlocattion_tag
          : "",
        houseNo: this.state.edithouseNo ? this.state.edithouseNo : "",
        street: this.state.street_address
          ? this.state.street_address
          : this.state.editstreet,
        city: this.state.editcity ? this.state.editcity : "",
        state: this.state.editstate ? this.state.editstate : "",
        country: this.state.editcountry ? this.state.editcountry : "",
        pincode: this.state.editpincode ? this.state.editpincode : "",
        locality: this.state.editlocality ? this.state.editlocality : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      if (
        localStorage.getItem("contact") &&
        localStorage.getItem("contact") !== "undefined"
      ) {
        ApiRequest(requestData, "/updateUserAddress", "POST", token)
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.setState({
                verifymobilestatus: "fullytrue",
                buttonstatus: false,
                modalIsOpenedit: false,
              });
              swal({
                title: "Address Updated",
                // text: "Are you sure that you want to leave this page?",
                icon: "success",
                dangerMode: false,
              });
              this.usersdetails();
            } else if (res.status !== 503) {
              swal({
                title: "Error",
                text: "Network error",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .then(() => {
            this.setState({ buttonLoading: false });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.props.history.push("/");
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  save = () => {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    if (this.state.location_tag === "") {
      valueErr = document.getElementsByClassName("err_add_location_tag");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.address === "") {
      valueErr = document.getElementsByClassName("err_address");
      valueErr[0].innerText = "Field is Required";
    }
    if (!this.state.street_address) {
      valueErr = document.getElementsByClassName("err_street_address");
      valueErr[0].innerText = "Field is Required";
    }
    if (this.state.pincode === "") {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Field is Required";
    } else if (this.state.pincode.length !== 6) {
      valueErr = document.getElementsByClassName("err_pincode");
      valueErr[0].innerText = "Incorrect Pincode";
    }

    if (
      this.state.address &&
      this.state.street_address &&
      this.state.location_tag &&
      this.state.pincode &&
      this.state.pincode.length === 6
    ) {
      this.setState({ buttonLoading: true });
      const requestData = {
        locationTag: this.state.location_tag ? this.state.location_tag : "",
        houseNo: this.state.address ? this.state.address : "",
        street: this.state.street_address ? this.state.street_address : "",
        locality: this.state.locality ? this.state.locality : "",
        city: this.state.city ? this.state.city : "",
        state: this.state.state ? this.state.state : "",
        country: this.state.country ? this.state.country : "",
        pincode: this.state.pincode ? this.state.pincode : "",
        latitude: this.state.latitude ? this.state.latitude : "",
        longitude: this.state.longitude ? this.state.longitude : "",
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      if (
        localStorage.getItem("contact") &&
        localStorage.getItem("contact") !== "undefined"
      ) {
        ApiRequest(requestData, "/addUserAddress", "POST", token)
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              this.setState({
                verifymobilestatus: "fullytrue",
                buttonstatus: false,
                modalIsOpen: false,
              });
              swal({
                title: "Address Saved",
                icon: "success",
                dangerMode: false,
              });
              this.usersdetails();
            } else if (res.status !== 503) {
              swal({
                title: "Error",
                text: "Network error",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .then(() => {
            this.setState({ buttonLoading: false });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        // this.props.history.push("/");
        // localStorage.clear();
        // window.location.reload();
      }
    }
  };

  delete = async (item) => {
    var itemId = item._id;

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Your address will be deleted",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: false,
          visible: true,
          className: "back-swal-btn",
          closeModal: true,
        },
      },
    });
    if (willDelete) {
      const requestData = {
        _id: itemId,
      };
      const token = localStorage.getItem("_jw_token")
        ? "Bearer " + localStorage.getItem("_jw_token")
        : "";
      if (
        localStorage.getItem("contact") &&
        localStorage.getItem("contact") !== "undefined"
      ) {
        ApiRequest(requestData, "/deleteUserAddress", "POST", token)
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              swal({
                title: "Address Deleted Successfully",
                icon: "success",
                dangerMode: true,
              });
              this.usersdetails();
            } else {
              swal({
                title: "Address Not Deleted",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.props.history.push("/");
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  usersdetails() {
    const requestData = {};
    const token = localStorage.getItem("_jw_token")
      ? "Bearer " + localStorage.getItem("_jw_token")
      : "";
    ApiRequest(requestData, "/getUserAddress", "GET", token)
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_address: res.data.data,
          });
        } else if (res.status !== 503) {
          swal({
            title: "Error",
            text: "Network error",
            icon: "warning",
            dangerMode: true,
          });
        } else if (res.status === 503) {
          // alert("Please Login Again");
          // window.location = "/";
          // localStorage.setItem("contact", "");
          // let a = [];
          // this.props.userdetails(a);
          // this.props.addToCart(a);
          // localStorage.clear();
        } else {
        }
      })
      .then(() => this.setState({ loading: false }))
      .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.setState({
      user_id: this.props.user_details._id,
    });
    this.usersdetails();
  }
  getLocation = (e) => {
    const selectedData = e.value;
    this.setState({
      showGoggleAddress: false,
      showInputAddres: true,
      street_address: selectedData.description,
      // latitude: e.coordinates.lat,
      // longitude: e.coordinates.lng,
      country: selectedData.terms[selectedData.terms.length - 1],
      state: "",
      city: "",
      pincode: "",
    });
  };
  // changePlaces = (e) => {
  //   this.setState({
  //     loading: false,
  //   });
  //   const selectedData = e.value;
  //   var geocoder = new google.maps.Geocoder();
  //   var address = e.label;

  //   geocoder.geocode({ address: address }, (results, status) => {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       var postal = "";
  //       results[0].address_components.forEach((add) => {
  //         add.types.forEach((type) => {
  //           if (type.includes("postal_code")) {
  //             postal = add.short_name;
  //           }
  //         });
  //       });
  //       this.setState({
  //         street_address: results[0].formatted_address,
  //         latitude: results[0].geometry.location.lat(),
  //         longitude: results[0].geometry.location.lng(),
  //         country: selectedData.terms[selectedData.terms.length - 1].value,
  //         state: selectedData.terms[selectedData.terms.length - 2].value,
  //         city: selectedData.terms[selectedData.terms.length - 3].value,
  //         pincode: postal,
  //       });
  //       if (!postal) {
  //         this.setState({
  //           showPincodeInput: true,
  //         });
  //       } else {
  //         this.setState({
  //           showPincodeInput: false,
  //         });
  //       }
  //     }
  //   });
  // };
  // changePlaces_edit = (e) => {
  //   this.setState({
  //     loading: false,
  //   });
  //   const selectedData = e.value;
  //   var geocoder = new google.maps.Geocoder();
  //   var address = e.label;

  //   geocoder.geocode({ address: address }, (results, status) => {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       var postal = "";
  //       results[0].address_components.forEach((add) => {
  //         add.types.forEach((type) => {
  //           if (type.includes("postal_code")) {
  //             postal = add.short_name;
  //           }
  //         });
  //       });
  //       this.setState({
  //         street_address: results[0].formatted_address,
  //         latitude: results[0].geometry.location.lat(),
  //         longitude: results[0].geometry.location.lng(),
  //         country: selectedData.terms[selectedData.terms.length - 1].value,
  //         state: selectedData.terms[selectedData.terms.length - 2].value,
  //         city: selectedData.terms[selectedData.terms.length - 3].value,
  //         pincode: postal,
  //       });
  //       if (!postal) {
  //         this.setState({
  //           showPincodeInput: true,
  //         });
  //       } else {
  //         this.setState({
  //           showPincodeInput: false,
  //         });
  //       }
  //     }
  //   });
  // };

  changePlaces = (e) => {
    this.setState({
      loading: false,
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      pincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      this.setState({ showPincodeInput: false });
    }
  };
  changePlaces_edit = (e) => {
    this.setState({
      loading: false,
      searchKey: "",
    });
    let block, area, city, state, country, pincode;
    if (e && e.address_components && Array.isArray(e.address_components)) {
      e.address_components.map((item) => {
        let val = item.types.join();
        if (val.includes("sublocality_level_3")) {
          block = item.long_name;
        } else if (val.includes("sublocality_level_2")) {
          area = item.long_name;
        } else if (val.includes("locality")) {
          city = item.long_name;
        } else if (val.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (val.includes("country")) {
          country = item.long_name;
        } else if (val.includes("postal_code")) {
          pincode = item.long_name;
        }
      });
    }
    this.setState({
      street_address: e.formatted_address,
      latitude: e.geometry.location.lat(),
      longitude: e.geometry.location.lng(),
      editpincode: pincode ? pincode : "",
      country: country ? country : "",
      state: state ? state : "",
      city: city ? city : "",
    });
    if (!pincode) {
      this.setState({ showPincodeInput: true });
    } else {
      this.setState({ showPincodeInput: false });
    }
  };

  getCurrentPosition = async (e) => {
    e.preventDefault();
    await navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        this.getPositionFromLatLon(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (err) => console.log(err)
    );
  };

  getPositionFromLatLon = (latitude, longitude) => {
    Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;
        const pincode =
          response.results[0].address_components[
            response.results[0].address_components.length - 1
          ].short_name;
        let city, state, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        this.setState({
          city: city,
          state: state,
          country: country,
          street_address: address,
          pincode: pincode,
          editpincode: pincode,
        });
        if (!pincode) {
          this.setState({ showPincodeInput: true });
        } else {
          this.setState({ showPincodeInput: false });
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  clearAddress = () => {
    this.setState({
      street_address: null,
      editstreet: null,
      pincode: "",
      editpincode: "",
      searchKey: null,
    });
  };
  render() {
    const street = this.state.street_address;
    return (
      <>
        <div className="container">
          <div className="my-order-wrap">
            <div className="main_content">
              <Sidebar active="address"></Sidebar>
              <div className="right_m_content">
                <div className="managing_adding_new">
                  <h2>Address</h2>
                  <div className="managing_adding_inner_new">
                    <button
                      type="button"
                      className="add_addres"
                      onClick={() => this.openModal()}
                    >
                      Add Address
                    </button>
                  </div>
                </div>
                {this.state.all_address &&
                this.state.all_address.length === 0 ? (
                  this.state.loading === true ? (
                    <ReactLoading type={"cylon"} color={"#febc12"} />
                  ) : (
                    <p>No Address Available</p>
                  )
                ) : (
                  <div
                    className="address_card"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    {this.state.all_address.map((item, index) => (
                      <div
                        className="main_card"
                        style={{
                          justifyContent: "flex-start",
                          minWidth: "380px",
                          width: "auto",
                          borderRadius: "5px",
                        }}
                      >
                        <div className="Card_des">
                          <div className="modal-form-bx">
                            <div className="heading">
                              <h2>{item.locationTag}</h2>
                            </div>

                            <span>{item.houseNo}</span>
                            <span>{item.locality}</span>
                            <span>{item.street}</span>
                            {/* <span>{item.city}</span>

                            <span>{item.state}</span>
                            <span>{item.country}</span>
                            <span>{item.pincode}</span> */}

                            <div className="modal-bottom">
                              <button
                                type="button"
                                className="submit fill-btn"
                                onClick={this.openeditModal.bind(this, item)}
                              >
                                <span className="button-text">Edit</span>
                                <span className="button-overlay"></span>
                              </button>

                              <span className="delete_address_del">
                                <i
                                  onClick={() => this.delete(item)}
                                  className="fa fa-trash delete_address"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Modal
                  isOpen={this.state.modalIsOpen}
                  onRequestClose={this.closeModal}
                  className="adding-address"
                  contentLabel="Add Address"
                >
                  <Add_address
                    addressSaved={() => this.closeModal()}
                    adminPanel={false}
                    gifting={false}
                  />
                </Modal>
                {/* edit modal start */}
                <Modal
                  isOpen={this.state.modalIsOpenedit}
                  onRequestClose={this.closeModal}
                  className="adding-address"
                  contentLabel="Edit Address"
                >
                  <Edit_address
                    addressSaved={() => this.closeModal()}
                    selectedEditAddress={this.state.selectedEditAddress}
                    adminPanel={false}
                  />
                </Modal>
                {/* edit modal end */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Address);
