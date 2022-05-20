import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Loader from "../../components/loader";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import CategoriesListing from "./CategoriesListing";

var maincategory = [];
var subcategory = [];
var activeproduct = [{ label: "", value: "" }];
var activerecipe = [{ label: "", value: "" }];
var activemeasurenment = [];
var MultipleArray = [];
var Configured_Product = [];
var grouparray = [{ name: "", minqty: "", maxqty: "", sets: [] }];
var activevariant = [];
var addarraymultiple = [{ image: "" }];
var activegroupattribute = [];
var data_to_send = [];

export default class addproduct extends Component {
  constructor() {
    super();
    var dt = localStorage.getItem("adminInfo");

    if (dt) {
      var admin = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      admin_id: admin._id,
      status: true,
      showstatus: true,
      barcode: [],
      long_description: "",
      simple_product: false,
      config_product: false,
      group_product: false,
      short_description: "",
      options: [],
      related_product: [],
      related_recipes: [],
      region: [],
      sub_region: [],
      unit: [],
      addpackage: [],
      package_length: 1,
      regionlength: 0,
      addregion: [],
      checkvariant: [],
      addlast: [],
      selectednewregion: [],
      config_length: 0,
      loading: true,
      skip: [],
      TypeOfProduct: "",
      type_product: "",
      all_product: [],
      selectedCatData: [],
      showCategories: true,
      samedaydelivery: true,
      farmpickup: true,
      preOrderStartDate: new Date(),
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.handleChangeStatus1 = this.handleChangeStatus1.bind(this);
    this.handlesamedaydelivery = this.handlesamedaydelivery.bind(this);
    this.handlefarmpickup = this.handlefarmpickup.bind(this);
    this.handleChangepreorderstatus =
      this.handleChangepreorderstatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.onchangingdata = this.onchangingdata.bind(this);
    this.add = this.add.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorChange1 = this.onEditorChange1.bind(this);
    this.addmorepackaging = this.addmorepackaging.bind(this);
    this.addmoremultipleimage = this.addmoremultipleimage.bind(this);
    this.onChange3 = this.onChange3.bind(this);
    this.onChange4 = this.onChange4.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.removeimagemultiple = this.removeimagemultiple.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.addprodt = this.addprodt.bind(this);
    this.addnewset = this.addnewset.bind(this);
    this.attributegroupchange = this.attributegroupchange.bind(this);
    this.clickingcheck = this.clickingcheck.bind(this);
  }

  preOrderStartDate = (date) => {
    this.setState({
      preOrderStartDate: date,
    });
  };

  preOrderEndDate = (date) => {
    this.setState({
      preOrderEndDate: date,
    });
  };

  onChange112(valu, index, ind) {
    const requestData = {};
    this.setState({ loading: true });
    AdminApiRequest(requestData, "/admin/product/" + valu.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          grouparray[index].sets[ind].product = res.data.data._id;
          AdminApiRequest(
            requestData,
            "/admin/product/allActiveProducts",
            "GET"
          )
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                console.log("my_latest_data", res.data.data, valu.value);
                var abc = res.data.data.filter(
                  (item) => item._id === valu.value
                );
                grouparray[index].sets[ind].package_items = abc[0].allPackages;
                console.log(
                  "my_latest_data",
                  grouparray[index].sets[ind].package_items
                );
                this.forceUpdate();
                this.setState({
                  loading: false,
                });
              } else {
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.setState({ loading: false });
        this.forceUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  removeset = (type = "remove", index, ind) => {
    this.setState({
      loading: true,
    });
    grouparray[index].sets.splice(ind, 1);
    this.setState({
      loading: false,
    });
  };

  removemainset = (type = "remove", index, ind) => {
    this.setState({
      loading: true,
    });
    grouparray.splice(index, 1);
    this.setState({
      loading: false,
    });
  };

  setformhandler(e, index, indexxx, type) {
    console.log("group array", grouparray);

    if (type === "name") {
      grouparray[index].name = e.target.value;
    }
    if (type === "minqty") {
      grouparray[index].minqty = e.target.value;
    }
    if (type === "maxqty") {
      grouparray[index].maxqty = e.target.value;
    }
    if (type === "product") {
      grouparray[index].sets[indexxx].product = e.target.value;
    }
    if (type === "preset") {
      grouparray[index].sets[indexxx].preset = e.target.value;
    }
    if (type === "priority") {
      grouparray[index].sets[indexxx].priority = +e.target.value || "Infinity";
    }
    if (type === "package") {
      console.log(grouparray[index].sets[indexxx].package_items);
      console.log(e.target.value);
      var finaldata = grouparray[index].sets[indexxx].package_items.filter(
        (item) => item.packet_size.toString() == e.target.value
      );
      console.log("finaldata", finaldata);
      grouparray[index].sets[indexxx].package = finaldata[0];
    }
    if (type === "setminqty") {
      grouparray[index].sets[indexxx].setminqty = e.target.value;
    }
    if (type === "setmaxqty") {
      grouparray[index].sets[indexxx].setmaxqty = e.target.value;
    }
    this.setState({});
  }

  config_Form_Handler(e, index, type, variant_name) {
    if (type === "selling_price") {
      Configured_Product[index].selling_price = e.target.value;
    }
    if (type === "B2B_price") {
      Configured_Product[index].B2B_price = e.target.value;
    }
    if (type === "Retail_price") {
      Configured_Product[index].Retail_price = e.target.value;
    }
    if (type === "mrp") {
      Configured_Product[index].mrp = e.target.value;
    }
    if (type === "variantSKUcode") {
      Configured_Product[index].variantSKUcode = e.target.value;
    }
    if (type === "image") {
      Configured_Product[index].image = e.target.value;
    }
    if (type === "attributes") {
      data_to_send = [];
      this.state.checkvariant.map((item, index1) => {
        if (item.name === variant_name) {
          data_to_send = Configured_Product[index].attributes;
          console.log("initial_data", data_to_send);
          data_to_send.push({
            attributeId: item._id,
            attributeName: item.name,
            attributeValue: e.target.value,
          });
          console.log("final_data", data_to_send);
        }
        console.log("final_data2", data_to_send);
      });
      console.log("final_data3", data_to_send);
      Configured_Product[index].attributes = data_to_send;
    }

    console.log("Configured_Product", Configured_Product);
    this.setState({
      loading: false,
    });
  }

  formHandler12(e, index, indexxx, type) {
    if (type === "regselling_price") {
      MultipleArray[index].selling_price = e.target.value;
    }
    if (type === "simplemrp") {
      MultipleArray[index].mrp = e.target.value;
    }
    if (type === "RegionB2BPrice") {
      MultipleArray[index].RegionB2BPrice = e.target.value;
    }
    if (type === "RegionRetailPrice") {
      MultipleArray[index].RegionRetailPrice = e.target.value;
    }
    if (type === "label") {
      MultipleArray[index].package[indexxx].packetLabel = e.target.value;
    }
    if (type === "status") {
      MultipleArray[index].package[indexxx].status = e;
    }
    if (type === "B2B_price") {
      MultipleArray[index].package[indexxx].B2B_price = e.target.value;
    }
    if (type === "Retail_price") {
      MultipleArray[index].package[indexxx].Retail_price = e.target.value;
    }
    if (type === "packet_size") {
      MultipleArray[index].package[indexxx].packet_size = e.target.value;
    }
    if (type === "selling_price") {
      MultipleArray[index].package[indexxx].selling_price = e.target.value;
    }
    if (type === "packetmrp") {
      MultipleArray[index].package[indexxx].packetmrp = e.target.value;
    }
    this.setState({
      loading: false,
    });
  }

  formHandler1(e, index, type) {
    if (type === "image") {
      addarraymultiple[index].image = e.target.value;
    }
  }

  removeImage(type, index) {
    var a = "configmrp" + index;
    var b = "sku_code" + index;
    var c = "dregion" + index;
    var d = "selling_price" + index;
    var e = "image_config" + index;
    this.setState({
      [a]: "",
      [b]: "",
      [c]: "",
      [d]: "",
      [e]: "",
    });
    this.state.skip.push({ skip: index });
  }

  addmoremultipleimage() {
    this.setState({ loading: true });
    addarraymultiple.push({ image: "" });
    this.setState({ loading: false });
  }

  removeimagemultiple(type = "remove", index) {
    this.setState({
      loading: true,
    });
    addarraymultiple.splice(index, 1);
    this.setState({
      loading: false,
    });
  }

  addnewset = () => {
    grouparray.push({ name: "", minqty: "", maxqty: "", sets: [] });
    this.setState({ loading: false });
  };

  clickingcheck(ev) {
    var new_data = [];
    var requestData1 = {};
    AdminApiRequest(requestData1, "/admin/attributes/getAllActive", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          ev.forEach((data, indexing) => {
            var arra = res.data.data.filter((item) => item._id === data.value);
            new_data.push(arra[0]);
          });
          this.setState({
            checkvariant: new_data,
          });
        } else {
          swal({
            title: "Network Issue",
            // text: "Are you sure that you want to leave this page?",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {});
  }

  addprodt = (index) => {
    grouparray[index].sets.push({
      product: "",
      preset: 0,
      package: "",
      priority: "Infinity",
      package_items: "",
      setminqty: "",
      setmaxqty: "",
    });
    this.setState({ loading: false });
  };

  addmorepackaging = (index) => {
    MultipleArray[index].package.push({
      packet_size: "",
      packetLabel: "",
      selling_price: "",
      B2B_price: "",
      status: true,
      Retail_price: "",
      packetmrp: "",
      _id: "",
    });
    this.setState({ loading: false });
  };

  deletepackage = (index, indexx) => {
    MultipleArray[index].package.splice(indexx, 1);
    this.setState({ loading: false });
  };

  deleteregion = (index) => {
    MultipleArray.splice(index, 1);
    this.setState({ loading: false });
  };

  addmoregion = () => {
    if (MultipleArray.length < this.state.sub_region.length) {
      MultipleArray.push({
        region: "",
        selling_price: "",
        package: [],
        RegionB2BPrice: "",
        RegionRetailPrice: "",
        mrp: "",
      });
    } else {
      alert("All regions are already added.");
    }
    this.setState({ loading: false });
  };

  addmore = () => {
    Configured_Product.push({
      attributes: [],
      region: "",
      selling_price: "",
      B2B_price: "",
      Retail_price: "",
      mrp: "",
      variantSKUcode: "",
      image: "",
    });
    this.setState({ loading: false });
  };

  deletevariant = (index) => {
    Configured_Product.splice(index, 1);
    this.setState({ loading: false });
  };

  formHandler(ev) {
    console.log([ev.target.name]);
    console.log(ev.target.value);
    this.setState({ [ev.target.name]: ev.target.value });

    if (ev.target.value === "simple") {
      this.setState({
        addlast: [],
        checkvariant: [],
        config_length: 0,
      });
      if (this.state.config_length > 0) {
        for (let i = 0; i < this.state.config_length; i++) {
          var dr = "dregion" + i;
          var sp = "selling_price" + i;
          var sku = "sku_code" + i;
          var mrpc = "configmrp" + i;
          this.setState({
            [dr]: "",
            [sp]: "",
            [sku]: "",
            [mrpc]: "",
          });
          this.state.checkvariant.map((item, index) => {
            var avar = item.name + i;
            this.setState({
              [avar]: "",
            });
          });
        }
      }
    }
    if (ev.target.value === "configurable") {
      if (this.state.regionlength > 0) {
        for (let i = 0; i < this.state.regionlength; i++) {
          var a = "sku_code" + i;
          var sp = "regselling_price" + i;
          var sr = "selectedregion" + i;
          var simpolmrp = "simplemrp" + i;
          this.setState({
            [a]: "",
            [sp]: "",
            [sr]: "",
            [simpolmrp]: "",
          });
          this.state.addpackage.map((item, indexing) => {
            if (item.index == i) {
              var p = "packet_size" + i + indexing;
              var l = "label" + i + indexing;
              var s = "selling_price" + i + indexing;
              var packetmrp = "packetmrp" + i + indexing;
              this.setState({
                [p]: "",
                [l]: "",
                [s]: "",
                [packetmrp]: "",
              });
            }
          });
        }
      }
      this.setState({
        addregion: [],
        regionlength: 0,
        package_length: 0,
        addpackage: [],
      });
    }
  }

  rerenderParentCallback() {
    this.forceUpdate();
  }

  onChange1(valu) {
    this.setState({
      subCat_id: "",
    });
    subcategory = [];
    let subcat = this.state.allactivedata[1].filter(
      (item) => item.parent === valu.name
    );
    subcat.forEach((item, index) => {
      subcategory.push({ value: item._id, name: item.category_name });
    });
    this.setState({ parentCat_id: valu.value });
  }

  onChange11(valu) {
    this.setState({
      subCat_id: valu.value,
    });
  }

  onChange2(valu) {
    this.setState({ related_products: valu.value });
  }

  onChange44(valu) {
    this.setState({ selected_unit: valu.value });
  }

  onChange5(valu, length) {
    var ab = false;
    for (let i = 0; i < MultipleArray.length; i++) {
      if (MultipleArray[i].region !== valu.value) {
        ab = false;
      } else if (MultipleArray[i].region === valu.value) {
        alert(
          "please select different region as this region is already selected"
        );
        ab = true;
        break;
      }
    }
    if (ab === false) {
      MultipleArray[length].region = valu.value;
    } else if (ab === true) {
      MultipleArray[length].region = "";
    }
    this.setState({ loading: true });
  }

  onChange55(valu, length) {
    var ab = false;
    // for (let i = 0; i < Configured_Product.length; i++) {
    //   if (Configured_Product[i].region !== valu.value) {
    //     ab = false;
    //   } else if (Configured_Product[i].region === valu.value) {
    //     alert(
    //       "please select different region as this region is already selected"
    //     );
    //     ab = true;
    //     break;
    //   }
    // }
    if (ab === false) {
      Configured_Product[length].region = valu.value;
    } else if (ab === true) {
      Configured_Product[length].region = "";
    }
    this.setState({ loading: true });
  }

  onChange555(valu) {
    var a = "dregion";
    this.setState({ [a]: valu.value });
  }

  onchangingdata(ev) {
    var arra = [];
    ev.forEach((item, index) => {
      arra.push({ _id: item.value });
    });
    this.setState({
      selectednewproducts: arra,
    });
  }

  attributegroupchange(ev) {
    console.log("qwertyuioppqwertyuiop", ev);
    // var arra = [];
    // ev.forEach((item, index) => {
    //   arra.push({ _id: item.value });
    // });
    this.setState({
      attribute_group: ev.value,
    });
  }

  onChange3(ev) {
    let arraa = [];
    ev.forEach((item, index) => {
      arraa.push({ _id: item.value });
    });
    this.setState({
      selectednewregion: arraa,
    });
  }

  onChange4(ev) {
    let arraa = [];
    var new_data12 = [];
    var new_data1212 = [];
    ev.forEach((item, index) => {
      arraa.push({ _id: item.value });
      new_data12.push({ value: item.value, label: item.label });
      new_data1212.push({ value: item.value, name: item.label });
    });
    this.setState({
      main_region: new_data12,
      sub_region: new_data1212,
    });
  }

  onEditorChange(evt) {
    this.setState({
      long_description: evt.editor.getData(),
    });
  }

  onEditorChange1(evt) {
    this.setState({
      short_description: evt.editor.getData(),
    });
  }

  handleChangeStatus(checked) {
    if (checked) {
      this.setState({
        showstatus: true,
        status: true,
        edit_status: true,
      });
    } else {
      this.setState({
        showstatus: false,
        status: false,
        edit_status: false,
      });
    }
  }

  handleChangeStatus1(checked) {
    if (checked) {
      this.setState({
        showstatus: true,
      });
    } else {
      this.setState({
        showstatus: false,
      });
    }
  }
  //

  handlesamedaydelivery(checked) {
    if (checked) {
      this.setState({
        samedaydelivery: true,
      });
    } else {
      this.setState({
        samedaydelivery: false,
      });
    }
  }

  handlefarmpickup(checked) {
    if (checked) {
      this.setState({
        farmpickup: true,
      });
    } else {
      this.setState({
        farmpickup: false,
      });
    }
  }

  //
  //
  handleChangepreorderstatus(checked) {
    if (checked) {
      this.setState({
        preorderstatus: true,
      });
    } else {
      this.setState({
        preorderstatus: false,
      });
    }
  }

  async add() {
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }
    var simple_status = true;
    // addarraymultiple.forEach((item, index) => {
    //   if (!item.image) {
    //     simple_status = false;
    //     valueErr = document.getElementsByClassName("err_multi_img" + index);
    //     valueErr[0].innerText = "Image Required";
    //   }
    // });

    // if (!this.state.parentCat_id) {
    //   simple_status = false;
    //   valueErr = document.getElementsByClassName("err_parentCat_id");
    //   valueErr[0].innerText = "This Field is Required";
    // }
    // if (!this.state.selectedCatData) {
    //   simple_status = false;
    //   valueErr = document.getElementsByClassName("err_parentCat_id");
    //   valueErr[0].innerText = "This Field is Required";
    // }

    if (!this.state.selected_unit) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_selectedunit");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.name) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    // if (!this.state.quantity_unit) {
    //   simple_status = false;
    //   valueErr = document.getElementsByClassName("err_quantity_unit");
    //   valueErr[0].innerText = "This Field is required";
    // }
    if (!this.state.main_region) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_main_region");
      valueErr[0].innerText = "This Field is Required";
    }
    if (this.state.selectedCatData.length === 0) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_categories_add");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.type_product) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_type_product");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.sales_withinstate) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_sales_withinstate");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.sales_outsidestate) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_sales_outsidestate");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.purchase_tax) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_purchase_tax");
      valueErr[0].innerText = "This Field is Required";
    }

    if (!this.state.hsn_code) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_hsn_code");
      valueErr[0].innerText = "This Field is Required";
    }
    if (this.state.product_threshold) {
      if (isNaN(this.state.product_threshold)) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_product_threshold");
        valueErr[0].innerText = "Enter numeric number";
      }
    }
    if (this.state.type_product === "simple") {
      if (!MultipleArray || MultipleArray.length === 0) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_simple_region");
        valueErr[0].innerText = "Please add a region.";
      }
    } else if (this.state.type_product === "group") {
      if (!grouparray || grouparray[0].sets.length === 0) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_group_region");
        valueErr[0].innerText = "Please select a product.";
      }
    }
    MultipleArray.forEach((item, index) => {
      if (!item.region) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_simplereg" + index);
        valueErr[0].innerText = "Search / Select Product";
      }

      if (item.package.length === 0) {
        simple_status = false;

        // swal({
        //   title: "Error",
        //   text: "Please select atlease one package to continue.",
        // });
        valueErr = document.getElementsByClassName("no-packageerror" + index);
        valueErr[0].innerText = "Please add atleast one packaging.";
        // if (!item.selling_price) {
        //   simple_status = false;
        //   valueErr = document.getElementsByClassName(
        //     "err_sellingsimple" + index
        //   );
        //   valueErr[0].innerText = "Field Required";
        // } else if (item.selling_price) {
        //   // simple_status = true;
        //   valueErr = document.getElementsByClassName(
        //     "err_sellingsimple" + index
        //   );
        //   valueErr[0].innerText = "";
        // }
      } else {
        const containsPackageWithStatus = item.package.filter(
          (dt) => dt.status
        );
        if (containsPackageWithStatus.length <= 0) {
          simple_status = false;
          swal({
            title: "Error",
            text: "Please turn on atleast one package status on.",
          });
        }
      }
      item.package.forEach((daat, indes) => {
        if (!daat.packetLabel) {
          simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_packetLabel" + index + indes
          );
          valueErr[0].innerText = "Field Required";
        }
        if (!daat.packet_size) {
          simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_packet_size" + index + indes
          );
          valueErr[0].innerText = "Field Required";
        }

        if (!daat.selling_price) {
          simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_selling_price" + index + indes
          );
          valueErr[0].innerText = "Field Required";
        } else if (isNaN(daat.selling_price)) {
          simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_selling_price" + index + indes
          );
          valueErr[0].innerText = "Enter Numeric Digit";
        } else if (daat.selling_price <= 0) {
          simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_selling_price" + index + indes
          );
          valueErr[0].innerText = "Number Should be greater than 0";
        }

        if (!daat.packetmrp) {
          // simple_status = false;
          // valueErr = document.getElementsByClassName(
          //   "err_packetmrp" + index + indes
          // );
          // valueErr[0].innerText = "Field Required";
        } else if (isNaN(daat.packetmrp)) {
          // simple_status = false;
          // valueErr = document.getElementsByClassName(
          //   "err_packetmrp" + index + indes
          // );
          // valueErr[0].innerText = "Enter Numeric Digit";
        } else if (daat.packetmrp <= 0) {
          // simple_status = false;
          valueErr = document.getElementsByClassName(
            "err_packetmrp" + index + indes
          );
          valueErr[0].innerText = "Number Should be greater than 0";
        }
      });
    });
    if (this.state.type_product == "configurable") {
      var product_data = Configured_Product;
      if (!this.state.attribute_group) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_config_attribute");
        valueErr[0].innerText = "This Field is Required.";
      }
      if (!this.state.checkvariant || this.state.checkvariant?.length === 0) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_config_variant");
        valueErr[0].innerText = "This Field is Required.";
      }

      if (Configured_Product.length === 0) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_config_region");
        valueErr[0].innerText = "Please add atlease one variant.";
      } else {
        Configured_Product.forEach((li, ind) => {
          let allVariantsLength = this.state.checkvariant
            ? this.state.checkvariant.length
            : 0;
          if (li.attributes.length !== allVariantsLength) {
            this.state.checkvariant.forEach((vari) => {
              const includeVariant = li.attributes.filter(
                (a) => a.attributeId === vari._id
              );
              if (includeVariant.length === 0) {
                simple_status = false;
                valueErr = document.getElementsByClassName(
                  "err_config_variant_diff" + ind + vari._id
                );
                valueErr[0].innerText = "This Field is Required.";
              }
            });
          }
          if (!li.region) {
            simple_status = false;
            valueErr = document.getElementsByClassName(
              "err_config_region" + ind
            );
            valueErr[0].innerText = "This Field is Required";
          }
          if (!li.selling_price) {
            simple_status = false;
            valueErr = document.getElementsByClassName("err_config_sp" + ind);
            valueErr[0].innerText = "This Field is Required";
          }
          if (li.attributes.length === 0) {
            simple_status = false;
          } else {
            li.attributes.forEach((at) => {});
          }
        });
      }
    } else {
      if (this.state.type_product === "group") {
        grouparray.forEach((grp, index) => {
          grp.sets.forEach((grpset, ind) => {
            if (!grpset.product) {
              simple_status = false;
              valueErr = document.getElementsByClassName(
                "err_product_group" + index + ind
              );
              valueErr[0].innerText = "This Field is Required.";
            }
            if (!grpset.package) {
              simple_status = false;
              valueErr = document.getElementsByClassName(
                "err_package_group" + index + ind
              );
              valueErr[0].innerText = "This Field is Required.";
            }
            if (+grpset.setminqty > +grpset.setmaxqty) {
              simple_status = false;
              valueErr = document.getElementsByClassName(
                "err_qty_group" + index + ind
              );
              valueErr[0].innerText =
                "Minimum quantity should not be greater than maximum quantity.";
            }
          });
        });
        console.log(grouparray);
      }
      var product_data =
        this.state.type_product === "group" ? grouparray : MultipleArray;
    }
    if (
      simple_status &&
      // this.state.selectedCatData.length !== 0 &&
      product_data.length > 0
    ) {
      console.log(this.state.selected_unit);
      this.setState({ loading: true });
      var data = new FormData();

      var admin_id = this.state.admin_id ? this.state.admin_id : "";
      var product_cat_id = this.state.parentCat_id
        ? this.state.parentCat_id
        : "";
      var barcode = this.state.barcode || "";
      var product_categories = this.state.selectedCatData
        ? this.state.selectedCatData
        : "";
      var subCat_id = this.state.subCat_id ? this.state.subCat_id : "";
      var product_name = this.state.name ? this.state.name : "";
      var productExpiryDay = this.state.productExpiryDay
        ? this.state.productExpiryDay
        : "";
      var longDesc = this.state.long_description
        ? this.state.long_description
        : "";
      var shortDesc = this.state.short_description
        ? this.state.short_description
        : "";
      var attachnment = document.querySelector('input[name="attachnment"]')
        .files[0];
      var banner = document.querySelector('input[name="banner"]').files[0];

      var related_products = this.state.selectednewproducts
        ? this.state.selectednewproducts
        : [];
      var related_recipe = this.state.selectednewregion
        ? this.state.selectednewregion
        : [];
      var productThreshold = this.state.product_threshold
        ? this.state.product_threshold
        : "";
      var productSubscription = this.state.product_subscription
        ? this.state.product_subscription
        : "";
      var RegionTax = this.state.main_region ? this.state.main_region : "";
      var salesTaxOutSide = this.state.sales_outsidestate
        ? this.state.sales_outsidestate
        : "";
      var salesTaxWithIn = this.state.sales_withinstate
        ? this.state.sales_withinstate
        : "";
      var purchaseTax = this.state.purchase_tax ? this.state.purchase_tax : "";
      var hsnCode = this.state.hsn_code ? this.state.hsn_code : "";
      var unitMeasurement = this.state.selected_unit
        ? this.state.selected_unit
        : "";
      var priority = this.state.priority;
      var product_quantity = this.state.quantity_unit
        ? this.state.quantity_unit
        : "";
      var TypeOfProduct = this.state.type_product
        ? this.state.type_product
        : "";
      var SKUCode = this.state.SKUCode ? this.state.SKUCode : "";
      if (this.state.type_product == "configurable") {
        var product_data = Configured_Product;
      } else {
        var product_data =
          this.state.type_product === "group" ? grouparray : MultipleArray;
      }
      //

      addarraymultiple.forEach((it, ind) => {
        var images = [];
        if (document.querySelector('input[name="image' + ind + '"]')) {
          images = document.querySelector('input[name="image' + ind + '"]')
            .files[0];
          data.append("image", images);
        }
      });
      var con_img = [];
      Configured_Product.forEach((conf_data, conf_ind) => {
        // var configured_images = [];
        if (
          document.querySelector(
            'input[name="configured_image' + conf_ind + '"]'
          )
        ) {
          con_img = document.querySelector(
            'input[name="configured_image' + conf_ind + '"]'
          ).files[0];
          data.append("variant" + conf_ind, con_img);
        }
      });

      var grp_arry = [];
      this.state.main_region.map((item) => grp_arry.push(item.value));
      data.append("admin_id", admin_id);
      data.append("product_categories", JSON.stringify(product_categories));
      data.append("attachment", attachnment ? attachnment : "");
      data.append("banner", banner ? banner : "");
      data.append("barcode", JSON.stringify(barcode));
      data.append("product_cat_id", product_cat_id);
      data.append("subCat_id", subCat_id ? subCat_id : "");
      data.append("product_name", product_name);
      data.append("productExpiryDay", productExpiryDay);
      data.append("longDesc", longDesc ? longDesc : "");
      data.append("shortDesc", shortDesc ? shortDesc : "");
      data.append(
        "relatedProduct",
        related_products ? JSON.stringify(related_products) : ""
      );
      data.append(
        "relatedRecipes",
        related_recipe ? JSON.stringify(related_recipe) : ""
      );
      data.append("productThreshold", productThreshold ? productThreshold : "");
      data.append(
        "productSubscription",
        productSubscription
          ? this.state.preorderstatus
            ? "yes"
            : productSubscription
          : ""
      );
      data.append("RegionTax", RegionTax ? JSON.stringify(RegionTax) : "");
      data.append("groupRegions", grp_arry ? JSON.stringify(grp_arry) : "");
      data.append("salesTaxOutSide", salesTaxOutSide ? salesTaxOutSide : "");
      data.append("salesTaxWithIn", salesTaxWithIn ? salesTaxWithIn : "");
      data.append("purchaseTax", purchaseTax ? purchaseTax : "");
      data.append("hsnCode", hsnCode ? hsnCode : "");
      data.append("SKUCode", SKUCode ? SKUCode : "");
      data.append("unitMeasurement", unitMeasurement ? unitMeasurement : "");
      data.append("product_quantity", 1);
      // data.append("product_quantity", product_quantity ? product_quantity : "");
      data.append("TypeOfProduct", TypeOfProduct);
      data.append("product_data", JSON.stringify(product_data));
      data.append("status", this.state.status);
      data.append("showstatus", this.state.showstatus);
      data.append("farmPickup", this.state.farmpickup);
      data.append("sameDayDelivery", this.state.samedaydelivery);
      data.append("preOrder", this.state.preorderstatus || false);
      data.append("preOrderStartDate", this.state.preOrderStartDate || "");
      data.append("preOrderEndDate", this.state.preOrderEndDate || "");
      data.append("base_price", this.state.base_price || "");
      data.append("priority", priority ? priority : "");
      data.append(
        "attribute_group",
        this.state.attribute_group ? this.state.attribute_group : ""
      );
      // data.append("preOrderQty", this.state.preOrderQty || "");

      await AdminApiRequest(data, "/admin/product", "POST", "apiWithImage")
        .then((res) => {
          if (res.data.status === "error") {
            this.setState({ loading: false });
            valueErr = document.getElementsByClassName("err_name");
            valueErr[0].innerText = res.data.result[0].product_name;
          } else if (res.status === 400) {
            swal({
              title: "Please select Different region/Variant",
              // text: "Are you sure that you want to leave this page?",
              icon: "warning",
              dangerMode: true,
            });
          } else {
            this.setState({ loading: false });
            swal({
              title: "Success",
              text: "Product Added Successfully !",
              icon: "success",
              successMode: true,
            });
            this.props.history.push("admin-view-product");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({ loading: false });
  }

  async componentDidMount() {
    activemeasurenment = [];
    await this.GetAdminSetting();
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product/allActiveProducts", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item) => {
            this.state.all_product.push({
              value: item._id,
              name: item.product_name,
            });
          });
          this.setState({
            loading: false,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
    await AdminApiRequest(requestData, "/admin/getAllBlog", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var activeblog = res.data.data.filter((item) => item.status === true);
          console.log("activeblogactiveblog", activeblog);
          activeblog.forEach((item, index) => {
            activerecipe.push({ value: item._id, label: item.title });
          });
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

    // await AdminApiRequest(requestData, "/admin/getTax", "POST")
    await AdminApiRequest(requestData, "/admin/getTax/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            all_taxes: res.data.data,
          });
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

    await AdminApiRequest(
      requestData,
      "/admin/GetAllActiveUnitMeasurement",
      "GET"
    )
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activemeasurenment.push({ value: item._id, name: item.name });
          });
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

    // await AdminApiRequest(requestData, "/admin/allproductCategory", "GET")
    //   .then((res) => {
    //     if (res.status === 201 || res.status === 200) {
    //       maincategory = [];
    //       this.setState({ allactivedata: res.data.data });
    //       let actdata = res.data.data[0].filter((item) => item.status === true);
    //       actdata.forEach((item, index) => {
    //         maincategory.push({ value: item._id, name: item.category_name });
    //       });
    //     } else {
    //       swal({
    //         title: "Network Issue",
    //         // text: "Are you sure that you want to leave this page?",
    //         icon: "warning",
    //         dangerMode: true,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    activeproduct = [];
    await AdminApiRequest(requestData, "/admin/product/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activeproduct.push({ label: item.product_name, value: item._id });
          });
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

    await AdminApiRequest(requestData, "/admin/GetAllActiveRegion", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            this.state.region.push({ label: item.name, value: item._id });
          });
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

    await AdminApiRequest(requestData, "/admin/attributeGroups/getAll", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activegroupattribute.push({ label: item.name, value: item._id });
          });
          this.setState({
            loading: false,
          });
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

    await AdminApiRequest(requestData, "/admin/attributes/getAllActive", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activevariant.push({ label: item.name, value: item._id });
          });
          this.setState({
            loading: false,
          });
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
  }
  GetAdminSetting() {
    let data = {};
    AdminApiRequest(data, "/storehey/getSetting", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          this.setState({
            simple_product: res.data.data[0].simple_product,
            config_product: res.data.data[0].config_product,
            group_product: res.data.data[0].group_product,
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
                      <h4 className="card-title">Add product</h4>
                      <Link to="/admin-view-product">
                        <button className="btn btn-primary m-r-5 float-right">
                          <i
                            style={{ color: "white" }}
                            className="material-icons"
                          >
                            arrow_back_ios
                          </i>{" "}
                          View Product
                        </button>
                      </Link>

                      <form className="add_product_new">
                        <div className="prod_detail_new_admin">
                          <h3>Product Details</h3>
                          <div className="inner_details_admin">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Select Category
                                  <span className="asterisk">*</span>
                                  <span
                                    style={{
                                      marginLeft: "10px",
                                      userSelect: "none",
                                      cursor: "pointer",
                                      color: "#febc15",
                                    }}
                                    onClick={() =>
                                      this.setState({
                                        showCategories:
                                          !this.state.showCategories,
                                      })
                                    }
                                  >
                                    {this.state.showCategories
                                      ? "Hide Dropdown"
                                      : " Open Dropdown"}
                                    <i
                                      className="fa fa-caret-down"
                                      style={{ color: "#febc15" }}
                                    ></i>
                                  </span>
                                </label>
                              </div>
                              <div
                                className="modal-right-bx view_desgi"
                                style={{ height: "unset" }}
                              >
                                <div
                                  style={
                                    this.state.showCategories
                                      ? { display: "block" }
                                      : { display: "none" }
                                  }
                                >
                                  <CategoriesListing
                                    className="view_des_new"
                                    passSelectedCatData={(e) => {
                                      this.setState({ selectedCatData: e });
                                    }}
                                    parentName="addProduct"
                                  />
                                </div>

                                {/* <SelectSearch
                                  options={maincategory}
                                  name="parentCat_id"
                                  closeOnSelect={false}
                                  value={this.state.parentCat_id}
                                  placeholder={
                                    maincategory &&
                                    maincategory.length > 0 &&
                                    maincategory[0]
                                      ? "Search Category"
                                      : "Loading..."
                                  }
                                  onChange={(e) => this.onChange1(e)}
                                  className="select-search"
                                />*/}
                                <span className="err err_categories_add"></span>
                              </div>
                            </div>
                            {/* {subcategory.length === 0 ? (
                              <> </>
                            ) : (
                              <>
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Sub Category
                                      {subcategory ? "" : "Loading"}
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <SelectSearch
                                      placeholder="Search Sub Category"
                                      options={subcategory}
                                      onChange={(e) => this.onChange11(e)}
                                      className="select-search"
                                      value={this.state.subCat_id}
                                      disabled={
                                        this.state.parentCat_id ? false : true
                                      }
                                      name="subCat_id"
                                    />
                                    <span className="err err_parentCat_id"></span>
                                  </div>
                                </div>
                              </>
                            )} */}
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>
                                  Product Name{" "}
                                  <span className="asterisk">*</span>
                                </label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="name"
                                  className="form-control"
                                  placeholder="Enter Product Name"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="modal-left-bx">
                                <label>Long Description</label>
                              </div>
                              <div className="modal-right-bx">
                                <CKEditor
                                  onChange={this.onEditorChange}
                                  data={this.state.long_description}
                                  type="classic"
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group mt-4">
                              <div className="modal-left-bx">
                                <label>Short Description</label>
                              </div>
                              <div className="modal-right-bx">
                                <CKEditor
                                  onChange={this.onEditorChange1}
                                  data={this.state.short_description}
                                  type="classic"
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Product Threshold</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="product_threshold"
                                  className="form-control"
                                  placeholder="Enter Product Threshold"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_product_threshold"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Product Subscription</label>
                              </div>
                              <div className="modal-right-bx">
                                <label htmlFor="male">
                                  {" "}
                                  <input
                                    type="radio"
                                    name="product_subscription"
                                    value="yes"
                                    onChange={this.formHandler}
                                  />
                                  Yes
                                </label>
                                <br />

                                <label htmlFor="female">
                                  {" "}
                                  <input
                                    type="radio"
                                    name="product_subscription"
                                    value="no"
                                    onChange={this.formHandler}
                                  />
                                  No
                                </label>
                                <br />
                                <span className="err err_product_subscription"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Pre order</label>
                              </div>
                              <div className="modal-right-bx">
                                <Switch
                                  onChange={this.handleChangepreorderstatus}
                                  checked={this.state.preorderstatus}
                                  id="normal-switch"
                                />
                                <span className="err err_product_threshold"></span>
                              </div>
                            </div>
                            {this.state.preorderstatus === true ? (
                              <>
                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Pre Order Start Date
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      selected={this.state.preOrderStartDate}
                                      dateFormat="dd/MM/yyyy"
                                      onChange={(date) =>
                                        this.preOrderStartDate(date)
                                      }
                                    />
                                    <span className="err err_preOrderStartDate"></span>
                                  </div>
                                </div> */}

                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Pre Order End Date
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <DatePicker
                                      selected={this.state.preOrderEndDate}
                                      dateFormat="dd/MM/yyyy"
                                      onChange={(date) =>
                                        this.preOrderEndDate(date)
                                      }
                                      minDate={new Date().setDate(
                                        new Date().getDate() + 1
                                      )}
                                    />
                                    <span className="err err_preOrderEndDate"></span>
                                  </div>
                                </div>

                                {/* <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>Pre Order Quantity</label>
                                    <span className="asterisk">*</span>
                                  </div>
                                  <div className="modal-right-bx">
                                    <input
                                      type="text"
                                      name="preOrderQty"
                                      className="form-control"
                                      placeholder="Enter Pre-Order Quantity"
                                      onChange={this.formHandler}
                                    />
                                    <span className="err err_preOrderQty"></span>
                                  </div>
                                </div> */}
                              </>
                            ) : (
                              <></>
                            )}
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Unit of Measurement</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <SelectSearch
                                  placeholder="Select Unit of Measurement"
                                  options={activemeasurenment}
                                  onChange={(e) => this.onChange44(e)}
                                  value={this.state.selected_unit}
                                  className="select-search"
                                  name="unit"
                                />
                                <span className="err err_selectedunit"></span>
                              </div>
                            </div>

                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Quantity / Unit Measurement</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="quantity_unit"
                                  className="form-control"
                                  placeholder="Enter Quantity / Unit Measurement"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_quantity_unit"></span>
                              </div>
                            </div> */}

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Buffer of Expiration Days</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="productExpiryDay"
                                  className="form-control"
                                  placeholder="Enter Buffer of Expiration Days"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_productExpiryDay"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Barcode</label>
                              </div>
                              <div className="modal-right-bx">
                                <TagsInput
                                  value={this.state.barcode}
                                  onChange={(e) =>
                                    this.setState({ barcode: e })
                                  }
                                  placeHolder="Add a barcode and press enter"
                                />
                                {/* <input
                                  type="text"
                                  name="barcode"
                                  className="form-control"
                                  placeholder="Enter Barcode"
                                  onChange={this.formHandler}
                                /> */}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="images_bann_admin">
                          <h3> Product Image & Banner</h3>
                          <div className="inner_details_admin">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Add Attachnment (if any )</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="attachnment"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_name"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Banner - 1920px * 400px</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="banner"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_banner"></span>
                              </div>
                            </div>

                            {addarraymultiple.map((item, index) => {
                              return (
                                <div key={index}>
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>Image - 800px * 800px</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <input
                                        type="file"
                                        name={"image" + index}
                                        className="form-control"
                                        onChange={(e) =>
                                          this.formHandler1(e, index, "image")
                                        }
                                      />
                                      <span
                                        className={"err err_multi_img" + index}
                                      ></span>
                                      <i
                                        className="fa fa-trash"
                                        onClick={() =>
                                          this.removeimagemultiple(
                                            "Remove",
                                            index
                                          )
                                        }
                                        aria-hidden="true"
                                      ></i>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                            <div className="form-group add_multli">
                              <button
                                className="btn btn-primary feel-btnv2"
                                type="button"
                                onClick={() => this.addmoremultipleimage()}
                              >
                                Add Multiple Images
                              </button>

                              <span className="err err_mainaddimage"></span>
                            </div>
                          </div>
                        </div>

                        <div className="prod_widget_admin">
                          <h3>Product Widgets</h3>
                          <div className="inner_details_admin">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Related Product</label>
                              </div>
                              <div className="modal-right-bx">
                                <Select
                                  defaultValue={[]}
                                  isMulti
                                  name="related_product"
                                  onChange={this.onchangingdata}
                                  options={activeproduct}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                />
                                <span className="err err_parentCat_id"></span>
                              </div>
                            </div>

                            {/* <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Related recipes</label>
                              </div>
                              <div className="modal-right-bx">
                                <Select
                                  defaultValue={[]}
                                  isMulti
                                  name="related_recipe"
                                  onChange={this.onChange3}
                                  options={activerecipe}
                                  className="basic-multi-select"s
                                  classNamePrefix="select"
                                />
                                <span className="err err_parentCat_id"></span>
                              </div>
                            </div> */}
                          </div>
                        </div>

                        <div className="tax_n_admin">
                          <h3>Tax</h3>
                          <div className="inner_details_admin">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>HSN Code</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="hsn_code"
                                  className="form-control"
                                  placeholder="Enter HSN Code "
                                  onChange={this.formHandler}
                                />
                                <span className="err err_hsn_code"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>SKU Code</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="SKUCode"
                                  className="form-control"
                                  placeholder="Enter SKU Code"
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                <span className="err err_sku"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label> Sales Tax Outside Delhi</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="sales_outsidestate"
                                  className="form-control"
                                  onChange={this.formHandler}
                                >
                                  <option value="">Select Tax</option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item._id}
                                              key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                <span className="err err_sales_outsidestate"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label> Sales Tax Within Delhi</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="sales_withinstate"
                                  className="form-control"
                                  onChange={this.formHandler}
                                >
                                  <option value="">Select Tax</option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item._id}
                                              key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                <span className="err err_sales_withinstate"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Purchase Tax</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="purchase_tax"
                                  className="form-control"
                                  onChange={this.formHandler}
                                >
                                  <option value="">Select Tax</option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option
                                              value={item._id}
                                              key={index}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                {/* <input
                              type="text"
                              name="purchase_tax"
                              className="form-control"
                              placeholder="Enter  Purchase Tax"
                              onChange={this.formHandler}
                            /> */}
                                <span className="err err_purchase_tax"></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="form-group">
                          <div className="modal-left-bx">
                            <label>Type of Product</label>
                            <span className="asterisk">*</span>
                          </div>
                          <div className="modal-right-bx">
                            {this.state.simple_product ? (
                              <label htmlFor="simple" className="d-block">
                                <input
                                  type="radio"
                                  name="type_product"
                                  value="simple"
                                  onChange={this.formHandler}
                                />
                                Simple
                              </label>
                            ) : (
                              ""
                            )}
                            {this.state.config_product ? (
                              <label htmlFor="configurable" className="d-block">
                                <input
                                  type="radio"
                                  name="type_product"
                                  value="configurable"
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                Configure
                              </label>
                            ) : (
                              ""
                            )}
                            {this.state.group_product ? (
                              <label htmlFor="group" className="d-block">
                                <input
                                  type="radio"
                                  name="type_product"
                                  value="group"
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                Group
                              </label>
                            ) : (
                              ""
                            )}
                            <span className="err err_type_product"></span>
                          </div>
                        </div>
                        <div className="pakaging_pricing">
                          <h3>Pricing & Packaging</h3>

                          <div className="region_singllle">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Select Region</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <Select
                                  defaultValue={[]}
                                  isMulti
                                  name="region"
                                  onChange={this.onChange4}
                                  options={this.state.region}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                />

                                <span className="err err_main_region"></span>
                              </div>
                            </div>
                          </div>

                          {this.state.type_product === "simple" ? (
                            <>
                              <h3>Simple Product</h3>
                              <div className="inner_details_admin">
                                <>
                                  {MultipleArray.map((item, index) => {
                                    return (
                                      <div key={index}>
                                        <div className="simple_package">
                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>
                                                Select Region{" "}
                                                <span className="asterisk">
                                                  *
                                                </span>
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <SelectSearch
                                                placeholder="Choose Region"
                                                options={this.state.sub_region}
                                                name={"selectedregion" + index}
                                                value={
                                                  item.region ? item.region : ""
                                                }
                                                onChange={(e) =>
                                                  this.onChange5(e, index)
                                                }
                                                className="select-search"
                                              />

                                              <span
                                                className={
                                                  "err err_simplereg" + index
                                                }
                                              ></span>
                                            </div>
                                          </div>

                                          {/* <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>
                                                Selling Price (incl. gst)
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <input
                                                type="number"
                                                value={
                                                  item.selling_price
                                                    ? item.selling_price
                                                    : ""
                                                }
                                                name="regselling_price"
                                                className="form-control"
                                                placeholder="Enter Selling Price"
                                                onChange={(ev) =>
                                                  this.formHandler12(
                                                    ev,
                                                    index,
                                                    0,
                                                    "regselling_price"
                                                  )
                                                }
                                              />
                                              <span
                                                className={
                                                  "err err_sellingsimple" +
                                                  index
                                                }
                                              ></span>
                                            </div>
                                          </div>

                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>
                                                B2B price (incl. gst)
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <input
                                                type="number"
                                                value={
                                                  item.RegionB2BPrice
                                                    ? item.RegionB2BPrice
                                                    : ""
                                                }
                                                name="RegionB2BPrice"
                                                className="form-control"
                                                placeholder="Enter B2B price"
                                                onChange={(ev) =>
                                                  this.formHandler12(
                                                    ev,
                                                    index,
                                                    0,
                                                    "RegionB2BPrice"
                                                  )
                                                }
                                              />
                                              <span className="err err_RegionB2BPrice"></span>
                                            </div>
                                          </div>

                                          <div className="form-group">
                                            <div className="modal-left-bx">
                                              <label>
                                                Retail Price (incl. gst)
                                              </label>
                                            </div>
                                            <div className="modal-right-bx">
                                              <input
                                                type="number"
                                                value={
                                                  item.RegionRetailPrice
                                                    ? item.RegionRetailPrice
                                                    : ""
                                                }
                                                name="RegionRetailPrice"
                                                className="form-control"
                                                placeholder="Enter Retail Price"
                                                onChange={(ev) =>
                                                  this.formHandler12(
                                                    ev,
                                                    index,
                                                    0,
                                                    "RegionRetailPrice"
                                                  )
                                                }
                                              />
                                              <span className="err err_RegionRetailPrice"></span>
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
                                                name="simplemrp"
                                                className="form-control"
                                                placeholder="Enter MRP"
                                                onChange={(ev) =>
                                                  this.formHandler12(
                                                    ev,
                                                    index,
                                                    0,
                                                    "simplemrp"
                                                  )
                                                }
                                              />
                                              <span className="err err_simplemrp"></span>
                                            </div>
                                          </div> */}
                                          <i
                                            onClick={() =>
                                              this.deleteregion(index)
                                            }
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                          ></i>
                                        </div>
                                        <div
                                          className={
                                            "err no-packageerror" + index
                                          }
                                        ></div>
                                        {item.package.length > 0 ? (
                                          item.package.map((itm, indexx) => {
                                            return (
                                              <div
                                                className="simple_sub_package"
                                                key={indexx}
                                              >
                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>Packet Label</label>
                                                    <span className="asterisk">
                                                      *
                                                    </span>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="text"
                                                      name="label"
                                                      value={itm.packetLabel}
                                                      className="form-control"
                                                      placeholder="Enter Label"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "label"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_packetLabel" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>Packet Size</label>
                                                    <span className="asterisk">
                                                      *
                                                    </span>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="number"
                                                      name="packet_size"
                                                      value={itm.packet_size}
                                                      className="form-control"
                                                      placeholder="Enter Packet Size"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "packet_size"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_packet_size" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      Selling Price (incl. gst)
                                                    </label>
                                                    <span className="asterisk">
                                                      *
                                                    </span>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="number"
                                                      name="selling_price"
                                                      value={itm.selling_price}
                                                      className="form-control"
                                                      placeholder="Enter Selling Price"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "selling_price"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_selling_price" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      B2B Price (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="number"
                                                      name="B2B_price"
                                                      value={itm.B2B_price}
                                                      className="form-control"
                                                      placeholder="Enter B2B Price"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "B2B_price"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_B2B_price" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      Retail Price (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="number"
                                                      name="Retail_price"
                                                      value={itm.Retail_price}
                                                      className="form-control"
                                                      placeholder="Enter Retail Price"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "Retail_price"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_Retail_price" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>

                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>
                                                      MRP (incl. gst)
                                                    </label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <input
                                                      type="number"
                                                      name="packetmrp"
                                                      value={itm.packetmrp}
                                                      className="form-control"
                                                      placeholder="Enter MRP"
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "packetmrp"
                                                        )
                                                      }
                                                    />
                                                    <span
                                                      className={
                                                        "err err_packetmrp" +
                                                        index +
                                                        indexx
                                                      }
                                                    ></span>
                                                  </div>
                                                </div>
                                                <div className="form-group">
                                                  <div className="modal-left-bx">
                                                    <label>Status</label>
                                                  </div>
                                                  <div className="modal-right-bx">
                                                    <Switch
                                                      onChange={(ev) =>
                                                        this.formHandler12(
                                                          ev,
                                                          index,
                                                          indexx,
                                                          "status"
                                                        )
                                                      }
                                                      checked={itm.status}
                                                      id="normal-switch-package"
                                                    />
                                                  </div>
                                                </div>
                                                <i
                                                  onClick={() =>
                                                    this.deletepackage(
                                                      index,
                                                      indexx
                                                    )
                                                  }
                                                  className="fa fa-trash"
                                                  aria-hidden="true"
                                                ></i>
                                              </div>
                                            );
                                          })
                                        ) : (
                                          <></>
                                        )}

                                        <div className="form-group">
                                          <div className="add_packaging">
                                            <button
                                              type="button"
                                              className="btn btn-primary feel-btnv2"
                                              onClick={() =>
                                                this.addmorepackaging(index)
                                              }
                                            >
                                              <i
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                              ></i>
                                              Add More Packaging
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}

                                  {this.state.sub_region.length ===
                                  this.state.addregion.length ? (
                                    <div>
                                      All Region Added
                                      <span className="err err_simple_region"></span>
                                    </div>
                                  ) : (
                                    <div>
                                      <button
                                        type="button"
                                        className="btn btn-primary feel-btnv2"
                                        onClick={() => this.addmoregion()}
                                      >
                                        <i
                                          className="fa fa-plus"
                                          aria-hidden="true"
                                        ></i>
                                        Add Region
                                      </button>
                                      <span className="err err_simple_region"></span>
                                    </div>
                                  )}
                                </>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {this.state.type_product === "configurable" ? (
                            <>
                              <h3>Configured Product</h3>
                              <div className="inner_details_admin">
                                <div
                                  className="main-form"
                                  style={{ width: "100%" }}
                                >
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Attribute Group
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Select
                                      // defaultValue={}
                                      // isMulti
                                      name="activegroupattribute"
                                      onChange={this.attributegroupchange}
                                      options={activegroupattribute}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                    />
                                    <span className="err err_config_attribute"></span>
                                  </div>
                                </div>

                                <div
                                  className="main-form"
                                  style={{ width: "100%" }}
                                >
                                  <div className="modal-left-bx">
                                    <label>
                                      Select Variant's
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    <Select
                                      defaultValue={[]}
                                      isMulti
                                      name="related_product"
                                      onChange={this.clickingcheck}
                                      options={activevariant}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                    />
                                    <span className="err err_config_variant"></span>
                                  </div>
                                </div>

                                {/* activegroupattribute */}
                                <>
                                  {Configured_Product.map((item, index) => {
                                    return (
                                      <>
                                        <div key={index}>
                                          <div className="configured_product">
                                            {this.state.checkvariant
                                              ? this.state.checkvariant.map(
                                                  (item, index1) => {
                                                    return (
                                                      <div className="form-group">
                                                        <div className="modal-left-bx">
                                                          <label>
                                                            {item.name}
                                                          </label>
                                                          <span className="asterisk">
                                                            *
                                                          </span>
                                                        </div>
                                                        <div className="modal-right-bx">
                                                          <select
                                                            name="attributes"
                                                            onChange={
                                                              (ev) =>
                                                                this.config_Form_Handler(
                                                                  ev,
                                                                  index,
                                                                  "attributes",
                                                                  item.name
                                                                )
                                                              // this.formHandler(
                                                              //   ev
                                                              // )
                                                            }
                                                          >
                                                            <option value="">
                                                              Select {item.name}
                                                            </option>
                                                            {item.item.map(
                                                              (data, index) => {
                                                                return (
                                                                  <option
                                                                    value={
                                                                      data.item_name
                                                                    }
                                                                  >
                                                                    {
                                                                      data.item_name
                                                                    }
                                                                  </option>
                                                                );
                                                              }
                                                            )}
                                                          </select>
                                                          <span
                                                            className={
                                                              "err err_config_variant_diff" +
                                                              index +
                                                              item._id
                                                            }
                                                            style={{
                                                              display: "block",
                                                            }}
                                                          ></span>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )
                                              : ""}
                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>
                                                  Select Region{" "}
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </label>
                                              </div>
                                              <div className="modal-right-bx">
                                                <SelectSearch
                                                  placeholder="Choose Region"
                                                  options={
                                                    this.state.sub_region
                                                  }
                                                  name="region"
                                                  value={
                                                    item.region
                                                      ? item.region
                                                      : ""
                                                  }
                                                  onChange={(e) =>
                                                    this.onChange55(e, index)
                                                  }
                                                  className="select-search"
                                                />

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
                                                <label>
                                                  Selling Price (incl. gst)
                                                </label>
                                              </div>
                                              <div className="modal-right-bx">
                                                <input
                                                  type="number"
                                                  value={
                                                    item.selling_price
                                                      ? item.selling_price
                                                      : ""
                                                  }
                                                  name="selling_price"
                                                  className="form-control"
                                                  placeholder="Enter Selling Price"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "selling_price"
                                                    )
                                                  }
                                                />
                                                <span
                                                  className={
                                                    "err err_config_sp" + index
                                                  }
                                                ></span>
                                              </div>
                                            </div>

                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>
                                                  B2B price (incl. gst)
                                                </label>
                                              </div>
                                              <div className="modal-right-bx">
                                                <input
                                                  type="number"
                                                  value={
                                                    item.B2B_price
                                                      ? item.B2B_price
                                                      : ""
                                                  }
                                                  name="B2B_price"
                                                  className="form-control"
                                                  placeholder="Enter B2B price"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "B2B_price"
                                                    )
                                                  }
                                                />
                                                <span className="err err_B2B_price"></span>
                                              </div>
                                            </div>

                                            <div className="form-group">
                                              <div className="modal-left-bx">
                                                <label>
                                                  Retail Price (incl. gst)
                                                </label>
                                              </div>
                                              <div className="modal-right-bx">
                                                <input
                                                  type="number"
                                                  value={
                                                    item.Retail_price
                                                      ? item.Retail_price
                                                      : ""
                                                  }
                                                  name="Retail_price"
                                                  className="form-control"
                                                  placeholder="Enter Retail Price"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "Retail_price"
                                                    )
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
                                                  value={
                                                    item.mrp ? item.mrp : ""
                                                  }
                                                  name="mrp"
                                                  className="form-control"
                                                  placeholder="Enter MRP"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "mrp"
                                                    )
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
                                                  value={
                                                    item.variantSKUcode
                                                      ? item.variantSKUcode
                                                      : ""
                                                  }
                                                  name="variantSKUcode"
                                                  className="form-control"
                                                  placeholder="Enter SKU Code"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "variantSKUcode"
                                                    )
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
                                                  value={
                                                    item.image ? item.image : ""
                                                  }
                                                  name={
                                                    "configured_image" + index
                                                  }
                                                  className="form-control"
                                                  onChange={(ev) =>
                                                    this.config_Form_Handler(
                                                      ev,
                                                      index,
                                                      "image"
                                                    )
                                                  }
                                                />
                                                <span className="err err_image"></span>
                                              </div>
                                            </div>

                                            <i
                                              onClick={() =>
                                                this.deletevariant(index)
                                              }
                                              className="fa fa-trash"
                                              aria-hidden="true"
                                            ></i>
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })}
                                  <div className="form-group">
                                    <button
                                      type="button"
                                      className="btn btn-primary feel-btnv2"
                                      onClick={() => this.addmore()}
                                    >
                                      {" "}
                                      <i
                                        className="fa fa-plus"
                                        aria-hidden="true"
                                      ></i>
                                      Add Variant
                                    </button>
                                    <span className="err err_config_region"></span>
                                  </div>
                                </>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          {this.state.type_product == "group" ? (
                            <>
                              <h3>Group Product</h3>
                              <div className="form-group">
                                <div className="modal-left-bx">
                                  <label>Group Base Price</label>
                                  {/* <span className="asterisk">*</span> */}
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="number"
                                    name="base_price"
                                    className="form-control"
                                    placeholder="Enter Base Price"
                                    onChange={this.formHandler}
                                  />

                                  <span className="err err_group_base_price"></span>
                                </div>
                              </div>
                              {grouparray &&
                                grouparray.map((item2, index2) => (
                                  <>
                                    {" "}
                                    <div className="group_sets ">
                                      <div className="sets_part">
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Name</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="text"
                                              value={item2.name}
                                              className="form-control"
                                              placeholder="Enter Name"
                                              onChange={(ev) =>
                                                this.setformhandler(
                                                  ev,
                                                  index2,
                                                  0,
                                                  "name"
                                                )
                                              }
                                            />
                                            <span
                                              className={
                                                "err err_name" + index2
                                              }
                                            ></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Min QTY Limit</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              value={item2.minqty}
                                              className="form-control"
                                              placeholder="Set Min QTY Limit"
                                              onChange={(ev) =>
                                                this.setformhandler(
                                                  ev,
                                                  index2,
                                                  0,
                                                  "minqty"
                                                )
                                              }
                                            />
                                            <span
                                              className={
                                                "err err_minqty" + index2
                                              }
                                            ></span>
                                          </div>
                                        </div>
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Max QTY Limit</label>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              value={item2.maxqty}
                                              className="form-control"
                                              placeholder="Set Max QTY Limit"
                                              onChange={(ev) =>
                                                this.setformhandler(
                                                  ev,
                                                  index2,
                                                  0,
                                                  "maxqty"
                                                )
                                              }
                                            />
                                            <span
                                              className={
                                                "err err_maxqty" + index2
                                              }
                                            ></span>
                                          </div>
                                        </div>
                                        <i
                                          className="fa fa-times"
                                          onClick={() =>
                                            this.removemainset(
                                              "Remove",
                                              index2,
                                              0
                                            )
                                          }
                                          aria-hidden="true"
                                        ></i>
                                      </div>
                                      {item2.sets &&
                                        item2.sets.map((itm21, ind21) => (
                                          <>
                                            <div className="group_product product-package-block-wrap">
                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Product Name</label>
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <SelectSearch
                                                    placeholder="Search Product"
                                                    options={
                                                      this.state.all_product
                                                    }
                                                    onChange={(e) =>
                                                      this.onChange112(
                                                        e,
                                                        index2,
                                                        ind21
                                                      )
                                                    }
                                                    className="select-search"
                                                    value={itm21.product}
                                                  />
                                                  <span
                                                    className={
                                                      "err err_product_group" +
                                                      index2 +
                                                      ind21
                                                    }
                                                  ></span>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Package</label>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <select
                                                    onChange={(ev) =>
                                                      this.setformhandler(
                                                        ev,
                                                        index2,
                                                        ind21,
                                                        "package"
                                                      )
                                                    }
                                                  >
                                                    <option value="">
                                                      Select Package
                                                    </option>
                                                    {itm21.package_items &&
                                                      itm21.package_items.map(
                                                        (item1212) => (
                                                          <option
                                                            value={
                                                              item1212.packet_size
                                                            }
                                                          >
                                                            {
                                                              item1212.packetLabel
                                                            }
                                                          </option>
                                                        )
                                                      )}
                                                  </select>
                                                  <span
                                                    className={
                                                      "err err_package_group" +
                                                      index2 +
                                                      ind21
                                                    }
                                                  ></span>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Min Qty</label>
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <input
                                                    type="number"
                                                    value={itm21.setminqty}
                                                    className="form-control"
                                                    placeholder="Enter Min Qty"
                                                    onChange={(ev) =>
                                                      this.setformhandler(
                                                        ev,
                                                        index2,
                                                        ind21,
                                                        "setminqty"
                                                      )
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      "err err_setminqty" +
                                                      index2 +
                                                      ind21
                                                    }
                                                  ></span>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Max Qty</label>
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <input
                                                    type="number"
                                                    value={itm21.setmaxqty}
                                                    className="form-control"
                                                    placeholder="Enter Max Qty"
                                                    onChange={(ev) =>
                                                      this.setformhandler(
                                                        ev,
                                                        index2,
                                                        ind21,
                                                        "setmaxqty"
                                                      )
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      "err err_setmaxqty" +
                                                      index2 +
                                                      ind21
                                                    }
                                                  ></span>
                                                </div>
                                              </div>

                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Pre-Set Qty</label>
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <input
                                                    type="number"
                                                    value={itm21.preset}
                                                    className="form-control"
                                                    placeholder="Enter Pre-Set Qty"
                                                    onChange={(ev) =>
                                                      this.setformhandler(
                                                        ev,
                                                        index2,
                                                        ind21,
                                                        "preset"
                                                      )
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      "err err_preset" +
                                                      index2 +
                                                      ind21
                                                    }
                                                  ></span>
                                                </div>
                                              </div>
                                              <div className="form-group">
                                                <div className="modal-left-bx">
                                                  <label>Priority</label>
                                                  <span className="asterisk">
                                                    *
                                                  </span>
                                                </div>
                                                <div className="modal-right-bx">
                                                  <input
                                                    type="number"
                                                    value={itm21.priority}
                                                    className="form-control"
                                                    placeholder="Enter priority"
                                                    onChange={(ev) =>
                                                      this.setformhandler(
                                                        ev,
                                                        index2,
                                                        ind21,
                                                        "priority"
                                                      )
                                                    }
                                                  />
                                                </div>
                                              </div>

                                              <i
                                                className="fa fa-times"
                                                onClick={() =>
                                                  this.removeset(
                                                    "Remove",
                                                    index2,
                                                    ind21
                                                  )
                                                }
                                                aria-hidden="true"
                                              ></i>
                                            </div>
                                            <div
                                              className={
                                                "err err_qty_group" +
                                                index2 +
                                                ind21
                                              }
                                            ></div>
                                          </>
                                        ))}
                                    </div>
                                    <div className="form-group">
                                      <div className="add_packaging">
                                        <button
                                          type="button"
                                          className="btn btn-primary feel-btnv2"
                                          onClick={() => this.addprodt(index2)}
                                        >
                                          <i
                                            className="fa fa-plus"
                                            aria-hidden="true"
                                          ></i>
                                          Add Product
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                ))}
                              <div className="err err_group_region"></div>
                              <div className="form-group">
                                <div className="add_packaging">
                                  <button
                                    type="button"
                                    className="btn btn-primary feel-btnv2"
                                    onClick={() => this.addnewset()}
                                  >
                                    <i
                                      className="fa fa-plus"
                                      aria-hidden="true"
                                    ></i>
                                    Add New Set
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="d-flex justify-content-between w-100">
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
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Catalogue List Status</label>
                            </div>
                            <div className="modal-right-bx">
                              <Switch
                                onChange={this.handleChangeStatus1}
                                checked={this.state.showstatus}
                                id="normal-switch"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Same Day Delivery</label>
                            </div>
                            <div className="modal-right-bx">
                              <Switch
                                onChange={this.handlesamedaydelivery}
                                checked={this.state.samedaydelivery}
                                id="normal-switch"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="modal-left-bx">
                              <label>Farm Pickup</label>
                            </div>
                            <div className="modal-right-bx">
                              <Switch
                                onChange={this.handlefarmpickup}
                                checked={this.state.farmpickup}
                                id="normal-switch"
                              />
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
