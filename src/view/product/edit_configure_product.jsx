import React, { useEffect, useState } from "react";
import "react-pro-sidebar/dist/css/styles.css";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";

function Edit_Configured(props) {
  const [configure_data, setConfiguredata] = useState(props.data);
  const [activegroupattribute, setActiveGroupAttribute] = useState([]);
  const [activevariant, setActiveVariant] = useState([]);
  const [sub_region_data, setSub_region_data] = useState(props.regionData || []);

  const addmore = () => {
    var addmoredata = [];
    addmoredata = [...configure_data];
    addmoredata.push({
      attributes: [],
      region: "",
      selling_price: "",
      B2B_price: "",
      Retail_price: "",
      mrp: "",
      variantSKUcode: "",
      image: "",
      availableQuantity: 0,
      bookingQuantity: 0,
      inhouseQuantity: 0,
      lostQuantity: 0,
      variant_name: "",
      ExpirationDate: "",
      quantity: 0,
      returnQuantity: 0,
    });
    setTimeout(() => {
      setConfiguredata(addmoredata);
    }, 0);
  };

  const config_Form_Handler = (e, index, type, variant_name, checked) => {
    var Configured_Product = [];
    Configured_Product = [...configure_data];
    console.log(index);
    console.log(type);
    console.log(variant_name);
    console.log(Configured_Product);
    if (type === "selling_price") {
      Configured_Product[index].selling_price = +e.target.value;
    }
    if (type === "B2B_price") {
      Configured_Product[index].B2B_price = +e.target.value;
    }
    if (type === "Retail_price") {
      Configured_Product[index].Retail_price = +e.target.value;
    }
    if (type === "mrp") {
      Configured_Product[index].mrp = +e.target.value;
    }
    if (type === "variantSKUcode") {
      Configured_Product[index].variantSKUcode = e.target.value;
    }
    if (type === "image") {
      Configured_Product[index].image = e.target.value;
    }
    if (type === "region") {
      Configured_Product[index].region = e;
    }
    if (type === "status") {
      console.log(e);
      if (e) {
        Configured_Product[index].status = true;
      } else {
        Configured_Product[index].status = false;
      }
    }
    setConfiguredata([]);
    setConfiguredata(Configured_Product);
    console.log(Configured_Product);
  };

  useEffect(() => {
    console.log("configure_dataconfigure_data", configure_data);
  }, [configure_data]);

  useEffect(() => {
    var requestData = [];
    AdminApiRequest(requestData, "/admin/attributeGroups/getAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var data = [];
          res.data.data.forEach((item, index) => {
            data.push({ label: item.name, value: item._id });
          });
          setActiveGroupAttribute(data);
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    AdminApiRequest(requestData, "/admin/attributes/getAllActive", "POST") 
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var variant_data = [];
          res.data.data.forEach((item, index) => {
            variant_data.push({ label: item.name, value: item._id });
          });
          setActiveVariant(variant_data);
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("configure_dataconfigure_data", configure_data);
  }, []);

  return (
    <>{
      console.log(props.regionData)}
      <h3>Configured Product</h3>
      <div className="inner_details_admin">
        <div className="main-form" style={{ width: "100%" }}>
          <div className="modal-left-bx">
            <label>Select Attribute Group</label>
          </div>
          <div className="modal-right-bx"></div>
        </div>

        <div className="main-form" style={{ width: "100%" }}>
          <div className="modal-left-bx">
            <label>Select Variant's</label>
          </div>
          <div className="modal-right-bx"></div>
        </div>

        {/* activegroupattribute */}
        <>
          {configure_data.map((item, index) => {
            return (
              <>
                <div key={index}>
                  <div className="configured_product">
                    {item.attributes
                      ? item.attributes.map((item1, index1) => {
                          return (
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>{item1.attributeName}</label>
                              </div>
                              <div className="modal-right-bx">
                                <label>{item1.attributeValue}</label>
                              </div>
                            </div>
                          );
                        })
                      : ""}
                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Select Region </label> 
                      </div>
                      <div className="modal-right-bx">
                       {item.region._id && <label>{item.region.name}</label>}
                        { !item.region._id && <SelectSearch
                          placeholder="Choose Region"
                          options={sub_region_data.map(a => {
                            return {...a,name:a.label}
                          })}
                          name="region"
                          value={
                            item.region
                              ? item.region.value
                              : ""
                          }
                          onChange={(e) => config_Form_Handler(e, index, "region")
                          }
                          className="select-search"
                        />}

                        <span
                          className={
                            "err err_config_region" +
                            index
                          }
                        ></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Selling Price (incl. gst)</label>
                      </div>
                      <div className="modal-right-bx">
                        <input    
                          type="number"
                          value={item.selling_price ? item.selling_price : ""}
                          name="selling_price"
                          className="form-control"
                          placeholder="Enter Selling Price"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "selling_price")
                          }
                        />
                        <span className={"err err_config_sp" + index}></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>B2B price (incl. gst)</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="number"
                          value={item.B2B_price ? item.B2B_price : ""}
                          name="B2B_price"
                          className="form-control"
                          placeholder="Enter B2B price"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "B2B_price")
                          }
                        />
                        <span className="err err_B2B_price"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Retail Price (incl. gst)</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="number"
                          value={item.Retail_price ? item.Retail_price : ""}
                          name="Retail_price"
                          className="form-control"
                          placeholder="Enter Retail Price"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "Retail_price")
                          }
                        />
                        <span className="err err_Retail_price"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>MRP (incl. gst)</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="number"
                          value={item.mrp ? item.mrp : ""}
                          name="mrp"
                          className="form-control"
                          placeholder="Enter MRP"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "mrp")
                          }
                        />
                        <span className="err err_mrp"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>SKU Code</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="number"
                          value={item.variantSKUcode ? item.variantSKUcode : ""}
                          name="variantSKUcode"
                          className="form-control"
                          placeholder="Enter SKU Code"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "variantSKUcode")
                          }
                        />
                        <span className="err err_mrp"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Image</label>
                      </div>
                      <div className="modal-right-bx">
                        <input
                          type="file"
                          // value={
                          //     item.image ? item.image : ""
                          // }
                          name="image"
                          className="form-control"
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "image")
                          }
                        />
                        <span className="err err_image"></span>
                      </div>
                    </div>

                    <div className="form-group">
                      <div className="modal-left-bx">
                        <label>Variant Status</label>
                      </div>
                      <div className="modal-right-bx">
                        <Switch
                          onChange={(ev) =>
                            config_Form_Handler(ev, index, "status")
                          }
                          checked={item.status}
                          id="normal-switch"
                        />
                      </div>
                    </div>

                    {/*<i
                        onClick={() =>
                            this.deletevariant(index)
                        }
                        className="fa fa-trash"
                        aria-hidden="true"
                        ></i>*/}
                  </div>
                </div>
              </>
            );
          })}
          <div className="form-group">
            <button
              type="button"
              className="btn btn-primary feel-btnv2"
              onClick={() => addmore()}
            >
              {" "}
              <i className="fa fa-plus" aria-hidden="true"></i>
              Add Variant
            </button>
            <span className="err err_config_region"></span>
          </div>
        </>
      </div>
    </>
  );
}

export default Edit_Configured;
