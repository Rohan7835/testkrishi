import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import swal from "sweetalert";
import { ApiRequest } from "../apiServices/ApiRequest";
import "../assets/css/cart.css";
import logo from "../assets/img/krish-cress-logo.png";
import {
  addToCart,
  changeDelivery,
  userdetails,
} from "../redux/actions/actions";

const RegionPopup = ({
  selectedRegionValue,
  closePopup,
  addToCart,
  dataInCart,
  user_details,
  changeDelivery,
  deliveryInfo,
  parentName,
}) => {
  const [allRegionDetails, setAllRegionDetails] = useState([]);
  const [allregion, setallregion] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(
    localStorage.getItem("regionDetails")
      ? localStorage.getItem("regionDetails")._id
      : ""
  );
  const [selectedRegionName, setSelectedRegionName] = useState(
    localStorage.getItem("selectedRegionName")
      ? localStorage.getItem("selectedRegionName")
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [reRender, setreRender] = useState(false);
  const [warning, setWarning] = useState(false);
  const [warningContent, setWarningContent] = useState("");
  const [showCloseMenuOption, setShowCloseMenuOption] = useState(false);
  const [pincode, setPincode] = useState("");

  useEffect(function () {
    let requestData = {};
    ApiRequest(requestData, "/GetAllCity", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setAllRegionDetails(res.data.data);
          var activ_supplier = [];
          res.data.data.map((item, index) => {
            activ_supplier.push({
              value: item.districId,
              label: item.districtName,
            });
            setallregion(activ_supplier);
          });
        } else {
        }
      })
      .then(() => setreRender(!reRender))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("regionDetails")) {
      setShowCloseMenuOption(true);
    }
  }, []);

  const submitForm = () => {
    setWarningContent("");
    setWarning(false);
    if (pincode && pincode.length === 6) {
      const freshrequestdata = { pincode: pincode };
      ApiRequest(freshrequestdata, "/pincode/one", "POST")
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            changeDelivery(res.data.data || {});
            setSelectedRegion(res.data.data.Region_ID._id);
            setSelectedRegionName(res.data.data.Region_ID.name);

            setTimeout(() => {
              submitRegion(
                res.data.data.Region_ID._id,
                res.data.data.Region_ID.name
              );
            }, 0);
          } else if (res.status === 404) {
            swal({
              title: "Error",
              text: res.data.data,
              icon: "warning",
              dangerMode: true,
            });
          } else {
            swal({
              title: "Error",
              text: "Network error",
              icon: "warning",
              dangerMode: true,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (
      (pincode.length < 6 && pincode.length > 0) ||
      pincode.length > 6
    ) {
      setWarningContent("Please Enter correct pincode.");
      setWarning(true);
    } else {
      setWarningContent("Please Enter a pincode to proceed");
      setWarning(true);
    }
  };

  const submitRegion = async (selectedRegion, selectedRegionName) => {
    if (showCloseMenuOption && dataInCart.length > 0) {
      await swal({
        title: "",
        text: "Your cart will get empty. Do you still want to proceed?",
        icon: "warning",
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          const freshrequestdata = {
            user_id: user_details._id,
            CartDetail: [],
            totalCartPrice: 0,
            subscribe: localStorage.getItem("status")
              ? JSON.parse(localStorage.getItem("status"))
              : false,
          };
          ApiRequest(freshrequestdata, "/addtocart", "POST")
            .then((res) => {})
            .catch((error) => {
              console.log(error);
            });
          var regionIdSelected = "";
          if (selectedRegion !== undefined && selectedRegion.length > 0) {
            // allRegionDetails.map((reg) => {
            //   if (reg.districId === selectedRegion) {
            //     regionIdSelected = reg._id;
            //     if (!reg.districMinimumOrderValue) {
            //       reg = { ...reg, districMinimumOrderValue: 0 };
            //     }
            //   }
            //   localStorage.setItem("regionDetails", JSON.stringify(reg));
            // });
            localStorage.setItem(
              "regionDetails",
              JSON.stringify({
                districtName: selectedRegionName,
                regionName: selectedRegionName,
                stateId: selectedRegion,
                stateName: selectedRegionName,
                pincode: pincode,
                _id: selectedRegion,
              })
            );
            sessionStorage.setItem("catId", "");
            setLoading(true);
            selectedRegionValue(selectedRegion, selectedRegionName);
          } else {
            setWarningContent("Please select your location");
            setWarning(true);
          }
          setTimeout(() => {
            setWarning(false);
          }, 3000);
          localStorage.setItem("cartItem", []);
          addToCart([]);
        }
      });
    } else {
      const freshrequestdata = {
        user_id: user_details._id,
        CartDetail: [],
        totalCartPrice: 0,
        subscribe: localStorage.getItem("status")
          ? JSON.parse(localStorage.getItem("status"))
          : false,
      };
      ApiRequest(freshrequestdata, "/addtocart", "POST")
        .then((res) => {})
        .catch((error) => {
          console.log(error);
        });
      var regionIdSelected = "";
      if (selectedRegion !== undefined && selectedRegion.length > 0) {
        // allRegionDetails.map((reg) => {
        //   if (reg.districId === selectedRegion) {
        //     regionIdSelected = reg._id;
        //     if (!reg.districMinimumOrderValue) {
        //       reg = { ...reg, districMinimumOrderValue: 0 };
        //     }
        //   }
        //   localStorage.setItem("regionDetails", JSON.stringify(reg));
        // });
        localStorage.setItem(
          "regionDetails",
          JSON.stringify({
            districtName: selectedRegionName,
            regionName: selectedRegionName,
            stateId: selectedRegion,
            pincode: pincode,
            stateName: selectedRegionName,
            _id: selectedRegion,
          })
        );
        sessionStorage.setItem("catId", "");
        setLoading(true);
        selectedRegionValue(selectedRegion, selectedRegionName);
      } else {
        setWarningContent("Please select your location");
        setWarning(true);
      }
      setTimeout(() => {
        setWarning(false);
      }, 3000);
      localStorage.setItem("cartItem", []);
      addToCart([]);
    }
  };
  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused ? "#febc1549" : null,
        color: "#333333",
      };
    },
  };
  return (
    <div className="region-popup-container bg-re-fill">
      <div className="region-popup" style={{ position: "relative" }}>
        <div className="logo">
          <img src={logo} />
        </div>
        {showCloseMenuOption ? (
          <p
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
              cursor: "pointer",
            }}
            onClick={() => closePopup()}
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </p>
        ) : (
          ""
        )}
        <h2 style={{ display: "block", width: "100%", marginBottom: "20px" }}>
          Enter your pincode
        </h2>
        {warning ? (
          <p
            className="popu-reasion-wrning"
            style={{ color: "red", position: "relative", bottom: "0px" }}
          >
            {warningContent}
          </p>
        ) : (
          ""
        )}
        <div className="re-row-popup">
          <div className="d-flex" style={{ flex: 1 }}>
            <input
              type="number"
              onChange={(e) =>
                setPincode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              value={pincode}
              placeholder="Enter Pincode"
              style={{ height: "59px", padding: "5px", fontWeight: 600 }}
            />
            {/* <Select
              options={allregion}
              onChange={(e) => {
                setSelectedRegion(e.value);
                setSelectedRegionName(e.label);
              }}
              placeholder="E.g: South Delhi, Faridabad, Gurugram..."
              noOptionsMessage={() => "No more options"}
              matchFrom="start"
              className="select-search"
              name="supplier"
              styles={colourStyles}
            /> */}
          </div>

          <button className="region-submit-btn" onClick={() => submitForm()}>
            {loading ? (
              <i className="fa fa-spinner searchLoading" aria-hidden="true"></i>
            ) : (
              "Done"
            )}
          </button>
        </div>
        {showCloseMenuOption ? (
          <span>
            {" "}
            Current Location:{" "}
            <strong>
              {localStorage.getItem("regionDetails")
                ? JSON.parse(localStorage.getItem("regionDetails")).districtName
                : ""}
            </strong>
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  dataInCart: state.dataInCart,
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (data) => dispatch(addToCart(data)),
  userdetails: (data) => dispatch(userdetails(data)),
  changeDelivery: (data) => dispatch(changeDelivery(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegionPopup)
);
