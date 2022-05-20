import CKEditor from "ckeditor4-react";
import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Select from "react-select";
import SelectSearch from "react-select-search";
import Switch from "react-switch";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import LoadingBar from "react-top-loading-bar";
import swal from "sweetalert";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";
import Loader from "../../components/loader";
import { imageUrl } from "../../imageUrl";
import Adminfooter from "../admin/elements/admin_footer";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import CategoriesListing from "./CategoriesListing";
import Edit_Configurable from "./edit_configure_product";

var maincategory = [];
var subcategory = [];
var activeproduct = [{ value: "", label: "" }];
var activerecipe = [{ label: "", value: "" }];
var activemeasurenment = [];
var activevariant = [];
var MultipleArray = [];
var grouparray = [];
var multipleimages = [];
var newmultipleimages = [];
export default class Editproduct extends Component {
  constructor(props) {
    super(props);
    var dt = localStorage.getItem("adminInfo");
    var path = this.props.location.pathname;
    var q_id = path.substring(path.lastIndexOf("/") + 1, path.length);
    if (dt) {
      var admin = JSON.parse(dt);
    } else {
      window.location = "/admin-login";
    }
    this.state = {
      productid: q_id,
      admin_id: admin._id,
      status: true,
      showstatus: true,
      barcode: [],
      long_description: "",
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
      select_new_rec: [],
      config_length: 0,
      loading: true,
      skip: [],
      progress: 0,
      product_categories: [],
      selectedCatData: [],
      categoryLoaded: false,
      showCategories: true,
      all_product: [],
      preOrderStartDate: new Date(),
      preOrderEndDate: "",
      configurableData: [],
    };

    this.handleChangeStatus = this.handleChangeStatus.bind(this);
    this.formHandler = this.formHandler.bind(this);
    this.handlesamedaydelivery = this.handlesamedaydelivery.bind(this);
    this.handlefarmpickup = this.handlefarmpickup.bind(this);
    this.onchangingdata = this.onchangingdata.bind(this);
    this.add = this.add.bind(this);
    this.handleChangepreorderstatus =
      this.handleChangepreorderstatus.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onEditorChange1 = this.onEditorChange1.bind(this);
    this.addmorepackaging = this.addmorepackaging.bind(this);
    this.addmoremultipleimage = this.addmoremultipleimage.bind(this);
    this.onChange3 = this.onChange3.bind(this);
    this.clickingcheck = this.clickingcheck.bind(this);
    this.onChange4 = this.onChange4.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.removeimagemultiple = this.removeimagemultiple.bind(this);
    this.formHandler1 = this.formHandler1.bind(this);
    this.formHandler12 = this.formHandler12.bind(this);
    this.handleChangeStatus1 = this.handleChangeStatus1.bind(this);
    this.handleWheelEvent = this.handleWheelEvent.bind(this);

    const requestData = {};
    AdminApiRequest(
      requestData,
      "/admin/product/" + this.state.productid,
      "GET"
    )
      .then((res) => {
        this.setState({
          progress: 10,
        });
        if (res.status === 201 || res.status === 200) {
          res.data.data.simpleData &&
            res.data.data.simpleData.forEach((item) => {
              // this.onChange112( {value : item.product_id._id}, index)
              var dtta = [];
              item.package.forEach((itm, ind) => {
                dtta.push({
                  packet_size: itm.packet_size,
                  packetLabel: itm.packetLabel,
                  selling_price: itm.selling_price,
                  B2B_price: itm.B2B_price,
                  Retail_price: itm.Retail_price,
                  packetmrp: itm.packetmrp,
                  status: itm.status,
                  _id: itm._id,
                });
              });
              MultipleArray.push({
                ExpirationDate: item.ExpirationDate,
                RegionSKUcode: item.RegionSKUcode,
                RegionSellingPrice: item.RegionSellingPrice,
                availableQuantity: item.availableQuantity,
                bookingQuantity: item.bookingQuantity,
                costPrice: item.costPrice,
                lostQuantity: item.lostQuantity,
                inhouseQuantity: item.inhouseQuantity,
                returnQuantity: item.returnQuantity,
                quantity: item.quantity,
                region: item.region._id,
                selling_price: item.RegionSellingPrice,
                RegionB2BPrice: item.RegionB2BPrice,
                RegionRetailPrice: item.RegionRetailPrice,
                mrp: item.mrp,
                package: dtta,
                _id: item._id,
              });
            });

          let main_selected_region = [];
          var sub_new_data = [];
          res.data.data.ProductRegion.forEach((item, index) => {
            main_selected_region.push({
              value: item.region_id._id,
              label: item.region_id.name,
            });
            sub_new_data.push({
              value: item.region_id._id,
              name: item.region_id.name,
            });
          });
          this.setState({
            main_region: main_selected_region,
            sub_region: sub_new_data,
          });

          res.data.data.images.forEach((ittm) => {
            multipleimages.push({ image: ittm.image });
          });
          var related__prod = [];

          res.data.data.relatedProduct.forEach((item, index) => {
            if (item.product_id) {
              related__prod.push({
                value: item.product_id._id,
                label: item.product_id.product_name,
              });
            }
          });
          let related__recp = [];
          res.data.data.relatedRecipes.forEach((item, index) => {
            related__recp.push({
              value: item.blog_id ? item.blog_id._id : "",
              label: item.blog_id ? item.blog_id.title : "",
            });
          });
          let productLocalCat = [];
          res.data.data.product_categories &&
            res.data.data.product_categories.forEach((cat) =>
              productLocalCat.push(cat._id)
            );
          grouparray = res.data.data.groupData;
          res.data.data.groupData.length > 0 &&
            res.data.data.groupData.map((grp_item, grp_index) => {
              grp_item.sets.map((inner_grp_item, inner_grp_index) => {
                grouparray[grp_index].sets[inner_grp_index].package_items =
                  inner_grp_item.product.simpleData[0].package;
              });
            });
          this.setState({
            configurableData: res.data.data.configurableData,
          });
          console.log(grouparray);
          this.setState({
            selectednewproducts: related__prod,
            select_new_rec: related__recp,
            product_id: res.data.data._id,
            productExpiryDay: res.data.data.productExpiryDay,
            long_description: res.data.data.longDesc,
            short_description: res.data.data.shortDesc,
            edit_parentCat_id: res.data.data.product_cat_id
              ? res.data.data.product_cat_id._id
              : null,
            preOrderRemainQty: res.data.data.preOrderRemainQty
              ? res.data.data.preOrderRemainQty
              : null,
            barcode: res.data.data.barcode ? res.data.data.barcode : [],
            edit_subCat_id: res.data.data.product_subCat1_id
              ? res.data.data.product_subCat1_id._id
              : null,
            edit_product_threshold: res.data.data.productThreshold,
            edit_TypeOfProduct: res.data.data.TypeOfProduct,
            edit_banner: res.data.data.banner ? res.data.data.banner : null,
            edit_attachment: res.data.data.attachment
              ? res.data.data.attachment
              : null,
            edit_product: res.data.data.product_name,
            edit_salesTaxOutSide: res.data.data.salesTaxOutSide
              ? res.data.data.salesTaxOutSide._id
              : "",
            productQuantity: +res.data.data.productQuantity,
            edit_productSubscription: res.data.data.productSubscription,
            edit_hsn: res.data.data.hsnCode,
            edit_sku: res.data.data.SKUCode,
            edit_unit_quantity: res.data.data.unitQuantity,
            edit_salesTaxWithIn: res.data.data.salesTaxWithIn
              ? res.data.data.salesTaxWithIn._id
              : "",
            edit_purchaseTax: res.data.data.purchaseTax
              ? res.data.data.purchaseTax._id
              : "",
            edit_selected_unit: res.data.data.unitMeasurement
              ? res.data.data.unitMeasurement._id
              : null,
            status: res.data.data.status,
            availableQuantity: +res.data.data.availableQuantity,
            bookingQuantity: +res.data.data.bookingQuantity,
            ProductRegion: res.data.data.ProductRegion,
            batchID: res.data.data.batchID,
            lostQuantity: +res.data.data.lostQuantity,
            inhouseQuantity: +res.data.data.inhouseQuantity,
            returnQuantity: +res.data.data.returnQuantity,
            preOrderBookQty: res.data.data.preOrderBookQty,
            farmpickup: res.data.data.farmPickup || false,
            samedaydelivery: res.data.data.sameDayDelivery,
            preOrderQty: res.data.data.preOrderQty,
            product_cat_id: res.data.data.product_cat_id,
            priority: res.data.data.priority,
            product_subCat1_id: res.data.data.product_subCat1_id,
            unitQuantity: res.data.data.unitQuantity,
            showstatus: res.data.data.showstatus,
            base_price: res.data.data.base_price,
            product_categories: productLocalCat,
            preorderstatus: res.data.data.preOrder,
            // preOrderQty: res.data.data.preOrderQty,
            preOrderStartDate: res.data.data.preOrderStartDate
              ? new Date(res.data.data.preOrderStartDate)
              : "",
            preOrderEndDate: res.data.data.preOrderEndDate
              ? new Date(res.data.data.preOrderEndDate)
              : "",
          });
        } else {
        }
      })
      .then(() => {
        this.setState({
          progress: 25,
          categoryLoaded: true,
        });
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
  handleWheelEvent = (e) => {
    alert(0);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    // those 3 should prevent browser from scrolling but they don't
  };
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

  onChange112(valu, index, ind) {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product/" + valu.value, "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          grouparray[index].sets[ind].product = res.data.data;
          AdminApiRequest(
            requestData,
            "/admin/product/allActiveProducts",
            "GET"
          )
            .then((res) => {
              if (res.status === 201 || res.status === 200) {
                var abc = res.data.data.filter(
                  (item) => item._id === valu.value
                );
                grouparray[index].sets[ind].package_items = abc[0].allPackages;
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
    this.setState({ loading: false });
    this.forceUpdate();
    console.log("group_arraygroup_array", grouparray);
  }

  setformhandler(e, index, indexxx, type) {
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
      var finaldata = grouparray[index].sets[indexxx].package_items.filter(
        (item) => item.packet_size.toString() === e.target.value
      );
      let newPackage = finaldata[0];
      newPackage.regionID = this.state.main_region[0].value;
      setTimeout(() => {
        grouparray[index].sets[indexxx].package = newPackage;

        this.forceUpdate();
      }, 0);
    }
    if (type === "setminqty") {
      grouparray[index].sets[indexxx].setminqty = e.target.value;
    }
    if (type === "setmaxqty") {
      grouparray[index].sets[indexxx].setmaxqty = e.target.value;
    }
    this.setState({});
  }

  addnewset = () => {
    grouparray.push({ name: "", minqty: "", maxqty: "", sets: [] });
    this.setState({ loading: false });
  };

  addprodt = (index) => {
    grouparray[index].sets.push({
      product: "",
      package: "",
      preset: 0,
      priority: "Infinity",
      package_items: "",
      setminqty: "",
      setmaxqty: "",
    });
    this.setState({ loading: false });
  };
  formHandler1(e, index, type) {
    if (type === "image") {
      newmultipleimages[index].image = e.target.value;
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
    newmultipleimages.push({ image: "" });
    this.setState({ loading: false });
  }

  newremoveimagemultiple(type = "remove", index) {
    this.setState({
      loading: true,
    });
    newmultipleimages.splice(index, 1);
    this.setState({
      loading: false,
    });
  }

  removeimagemultiple(type = "remove", index) {
    this.setState({
      loading: true,
    });
    multipleimages.splice(index, 1);
    this.setState({
      loading: false,
    });
  }

  removebanner() {
    this.setState({
      edit_banner: "",
    });
  }
  addmorepackaging = (index) => {
    MultipleArray[index].package.push({
      packet_size: "",
      packetLabel: "",
      selling_price: "",
      B2B_price: "",
      Retail_price: "",
      packetmrp: "",
      status: true,
      _id: "",
    });
    this.setState({ loading: false });
  };

  deletepackage = (index, indexx) => {
    MultipleArray[index].package.splice(indexx, 1);
    this.setState({ loading: false });
  };

  deleteregion = (index, availableQuantity) => {
    if (!availableQuantity || availableQuantity === 0) {
      MultipleArray.splice(index, 1);
    } else {
      swal({
        title: "Error",
        text: "You cannot delete as quantity is available in this region.",
        icon: "warning",
      });
    }
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
      alert("Add Region");
    }
    this.setState({ loading: false });
    // this.state.addregion.push({ item: this.state.regionlength });
    // var regcount = this.state.regionlength;
    // this.setState({
    //   regionlength: regcount + 1,
    // });
  };

  addmore = () => {
    this.setState({
      config_length: this.state.config_length + 1,
    });
    this.state.addlast.push({ data: this.state.config_length + 1 });
    this.setState({ loading: false });
  };

  formHandler(ev) {
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
          this.state.checkvariant.forEach((item, index) => {
            var avar = item.name + i;
            this.setState({
              [avar]: "",
            });
          });
        }
      }
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
    this.setState({ edit_parentCat_id: valu.value });
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
    this.setState({ edit_selected_unit: valu.value });
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
    var a = "dregion" + length;

    this.setState({ [a]: valu.value });
  }

  onChange555(valu) {
    var a = "dregion";
    this.setState({ [a]: valu.value });
  }

  onchangingdata(ev) {
    var arra = [];
    ev.forEach((item, index) => {
      arra.push({ value: item.value, label: item.label });
    });
    this.setState({
      selectednewproducts: arra,
    });
  }

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

  onChange3(ev) {
    let arraa = [];
    ev.forEach((item, index) => {
      arraa.push({ value: item.value, label: item.label });
    });
    this.setState({
      select_new_rec: arraa,
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
        status: true,
        edit_status: true,
      });
    } else {
      this.setState({
        status: false,
        edit_status: false,
      });
    }
  }

  async add() {
    var simple_status = true;
    var valueErr = document.getElementsByClassName("err");
    for (var i = 0; i < valueErr.length; i++) {
      valueErr[i].innerText = "";
    }

    if (!this.state.edit_product) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_name");
      valueErr[0].innerText = "This Field is Required";
    }
    // if (!this.state.edit_sku) {
    //   simple_status = false;
    //   valueErr = document.getElementsByClassName("err_sku");
    //   valueErr[0].innerText = "This Field is Required";
    // }

    if (!this.state.edit_selected_unit) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_edit_selected_unit");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.main_region) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_main_region");
      valueErr[0].innerText = "This Field is Required";
    }
    if (this.state.selectedCatData.length === 0) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_category_add");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.edit_salesTaxWithIn) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_sales_withinstate");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.edit_salesTaxOutSide) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_sales_outsidestate");
      valueErr[0].innerText = "This Field is Required";
    }
    if (!this.state.edit_purchaseTax) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_purchase_tax");
      valueErr[0].innerText = "This Field is Required";
    }
    // if (!this.state.edit_unit_quantity) {
    //   simple_status = false;
    //   valueErr = document.getElementsByClassName("err_quantity_unit");
    //   valueErr[0].innerText = "This Field is required";
    // }
    // if (this.state.edit_unit_quantity) {
    //   if (isNaN(this.state.edit_unit_quantity)) {
    //     simple_status = false;
    //     valueErr = document.getElementsByClassName("err_quantity_unit");
    //     valueErr[0].innerText = "Enter numeric number";
    //   }
    // }

    if (!this.state.edit_hsn) {
      simple_status = false;
      valueErr = document.getElementsByClassName("err_hsn_code");
      valueErr[0].innerText = "This Field is Required";
    }

    if (this.state.edit_product_threshold) {
      if (isNaN(this.state.edit_product_threshold)) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_product_threshold");
        valueErr[0].innerText = "Enter numeric number";
      }
    }
    MultipleArray &&
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
          } else if (isNaN(daat.packetmrp)) {
          } else if (daat.packetmrp <= 0) {
            simple_status = false;
            valueErr = document.getElementsByClassName(
              "err_packetmrp" + index + indes
            );
            valueErr[0].innerText = "Number Should be greater than 0";
          }
        });
      });
    if (this.state.edit_TypeOfProduct === "simple") {
      if (!MultipleArray || MultipleArray.length === 0) {
        simple_status = false;
        valueErr = document.getElementsByClassName("err_simple_region");
        valueErr[0].innerText = "Please add a region.";
      }
    } else if (this.state.edit_TypeOfProduct === "group") {
      console.log(grouparray);
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
    }
    if (
      simple_status === true &&
      this.state.selectedCatData.length !== 0
      // && MultipleArray.length > 0
    ) {
      this.setState({ loading: true });
      var data = new FormData();
      var admin_id = this.state.admin_id;
      var product_id = this.state.product_id;
      var product_categories = this.state.selectedCatData;
      var product_cat_id = this.state.edit_parentCat_id;
      var productExpiryDay = this.state.productExpiryDay;
      var subCat_id = this.state.edit_subCat_id;
      var barcode = this.state.barcode || [];
      var product_name = this.state.edit_product;
      var longDesc = this.state.long_description;
      var shortDesc = this.state.short_description;
      var attachnment = this.state.edit_attachment
        ? this.state.edit_attachment
        : document.querySelector('input[name="attachnment"]').files[0];
      var banner1 = document.querySelector('input[name="edit_banner"]')
        .files[0];
      var banner = banner1
        ? banner1
        : this.state.edit_banner
        ? this.state.edit_banner
        : null;
      var related_products = this.state.selectednewproducts;
      var related_recipe = this.state.select_new_rec;
      var productThreshold = this.state.edit_product_threshold;
      var productSubscription = this.state.edit_productSubscription;
      var RegionTax = this.state.main_region;
      var salesTaxOutSide = this.state.edit_salesTaxOutSide;
      var salesTaxWithIn = this.state.edit_salesTaxWithIn;
      var purchaseTax = this.state.edit_purchaseTax;
      var hsnCode = this.state.edit_hsn;
      var unitMeasurement = this.state.edit_selected_unit;
      var product_quantity = this.state.edit_unit_quantity;
      var TypeOfProduct = this.state.edit_TypeOfProduct;
      var SKUCode = this.state.edit_sku;
      var productQuantity = this.state.productQuantity;
      var priority = this.state.priority;
      var product_data =
        this.state.configurableData && this.state.configurableData.length > 0
          ? JSON.stringify(this.state.configurableData)
          : grouparray && grouparray.length > 0
          ? JSON.stringify(grouparray)
          : JSON.stringify(MultipleArray);
      newmultipleimages.forEach((it, ind) => {
        var images = [];
        if (document.querySelector('input[name="image' + ind + '"]')) {
          images = document.querySelector('input[name="image' + ind + '"]')
            .files[0];
          data.append("image", images);
        }
      });
      var grp_arry = [];
      this.state.main_region.map((item) => grp_arry.push(item.value));
      data.append("images", JSON.stringify(multipleimages));
      data.append("productQuantity", productQuantity);
      data.append("admin_id", admin_id);
      data.append("barcode", JSON.stringify(barcode));
      data.append("product_id", product_id);
      data.append("attachment", attachnment ? attachnment : "");
      data.append("banner", banner ? banner : "");
      data.append("subCat_id", subCat_id ? subCat_id : "");
      data.append("product_name", product_name);
      data.append("longDesc", longDesc ? longDesc : "");
      data.append("shortDesc", shortDesc ? shortDesc : "");
      data.append("priority", priority ? priority : "");

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
      data.append(
        "product_categories",
        product_categories ? JSON.stringify(product_categories) : []
      );
      data.append("salesTaxOutSide", salesTaxOutSide ? salesTaxOutSide : "");
      data.append("salesTaxWithIn", salesTaxWithIn ? salesTaxWithIn : "");
      data.append("purchaseTax", purchaseTax ? purchaseTax : "");
      data.append("hsnCode", hsnCode ? hsnCode : "");
      data.append("SKUCode", SKUCode ? SKUCode : "");

      data.append("unitMeasurement", unitMeasurement ? unitMeasurement : "");
      data.append("product_quantity", 1);
      // data.append("product_quantity", product_quantity ? product_quantity : "");
      data.append("TypeOfProduct", TypeOfProduct);
      data.append("product_data", product_data);
      data.append("productExpiryDay", productExpiryDay ? productExpiryDay : "");
      data.append(
        "preOrderRemainQty",
        this.state.preOrderRemainQty ? this.state.preOrderRemainQty : 0
      );
      data.append("status", this.state.status);
      data.append("showstatus", this.state.showstatus);
      data.append("preOrder", this.state.preorderstatus || false);
      data.append("base_price", this.state.base_price || "");
      data.append("preOrderQty", this.state.preOrderQty || "");
      data.append("preOrderStartDate", this.state.preOrderStartDate || "");
      data.append("preOrderEndDate", this.state.preOrderEndDate || "");
      data.append("AvailableQuqantity", this.state.AvailableQuqantity);
      data.append("bookingQuantity", this.state.bookingQuantity);
      data.append("ProductRegion", this.state.ProductRegion);
      data.append("farmPickup", this.state.farmpickup);
      data.append("sameDayDelivery", this.state.samedaydelivery);
      data.append("batchID", this.state.batchID);
      data.append("lostQuantity", this.state.lostQuantity);
      data.append("preOrderBookQty", this.state.preOrderBookQty);
      data.append("preOrderQty", this.state.preOrderQty);
      data.append("product_cat_id", this.state.product_cat_id);
      data.append("product_subCat1_id", this.state.product_subCat1_id);
      data.append("unitQuantity", this.state.unitQuantity);
      data.append("count_product_data", this.state.qqqq);
      await AdminApiRequest(
        data,
        "/admin/update/product",
        "POST",
        "apiWithImage"
      )
        .then((res) => {
          if (res.status === 200) {
            if (
              res.data.usedInGroup &&
              res.data.usedInGroup.length > 0 &&
              res.data.packageChanged === true
            ) {
              var a = "";
              res.data.usedInGroup.map((item, index) => (a = a + item + ", "));
              swal({
                title: "Package changed !",
                text: "Used in Listed Group Product - " + a,
                icon: "warning",
                dangerMode: true,
              });
            } else {
              this.setState({ loading: false });
              swal({
                title: "Success",
                text: "Product Updated Successfully !",
                icon: "success",
                successMode: true,
              });
            }
            this.props.history.push("/admin-view-product");
          } else {
            if (res.data.status === "error") {
              this.setState({ loading: false });
              valueErr = document.getElementsByclassName("err_name");
              valueErr[0].innerText = res.data.result[0].product_name;
            } else if (res.status === 400) {
              swal({
                title: "Please select Different region/Variant",
                // text: "Are you sure that you want to leave this page?",
                icon: "warning",
                dangerMode: true,
              });
            } else {
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.setState({ loading: false });
  }

  async componentDidMount() {
    const requestData = {};
    AdminApiRequest(requestData, "/admin/product/active", "GET")
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

    await AdminApiRequest(requestData, "/admin/getAllBlog", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          var activeblog = res.data.data.filter((item) => item.status === true);
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
      .then(() => {
        this.setState({
          progress: 40,
        });
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
      .then(() => {
        this.setState({
          progress: 60,
        });
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
      .then(() => {
        this.setState({
          progress: 70,
        });
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

    //       let subData = res.data.data[1].filter(
    //         (item) => item.parentCat_id === this.state.edit_parentCat_id
    //       );
    //       subData.forEach((item, index) => {
    //         subcategory.push({ value: item._id, name: item.category_name });
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
    //   .then(() => {
    //     this.setState({
    //       progress: 80,
    //     });
    //     this.forceUpdate();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    await AdminApiRequest(requestData, "/admin/product/active", "GET")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          res.data.data.forEach((item, index) => {
            activeproduct.push({ value: item._id, label: item.product_name });
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

    // await AdminApiRequest(requestData, "/admin/attributes/getAllActive", "POST")
    //   .then((res) => {
    //     if (res.status === 201 || res.status === 200) {
    //       res.data.data.forEach((item, index) => {
    //         activevariant.push({ label: item.name, value: item._id });
    //       });
    //       this.setState({
    //         loading: false,
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
    //   .then(() => {
    //     this.setState({
    //       progress: 100,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  render() {
    return (
      <div className="wrapper ">
        <LoadingBar
          color="#febc15"
          progress={this.state.progress}
          className="top-progress-bar"
          shadow={false}
          onLoaderFinished={() =>
            this.setState({
              progress: 0,
            })
          }
        />
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
                    <div className="card-body new_add_des">
                      <h4 className="card-title">Edit product</h4>
                      {/* <Link to="/admin-view-product"> */}
                      <button
                        className="btn btn-primary m-r-5 float-right"
                        onClick={() => {
                          this.props.history.push("/admin-view-product");
                          window.location.reload();
                        }}
                      >
                        <i
                          style={{ color: "white" }}
                          className="material-icons"
                        >
                          arrow_back_ios
                        </i>{" "}
                        View Product
                      </button>
                      {/* </Link> */}
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
                                {this.state.categoryLoaded ? (
                                  <div
                                    style={
                                      this.state.showCategories
                                        ? { display: "block" }
                                        : { display: "none" }
                                    }
                                  >
                                    <CategoriesListing
                                      passSelectedCatData={(e) =>
                                        this.setState({ selectedCatData: e })
                                      }
                                      parentName="editProduct"
                                      product_categories={
                                        this.state.product_categories
                                          ? this.state.product_categories
                                          : []
                                      }
                                    />
                                  </div>
                                ) : (
                                  <p>Loading.....</p>
                                )}
                                <span className="err err_category_add"></span>
                              </div>
                            </div>
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
                                  name="edit_product"
                                  value={this.state.edit_product}
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
                                  type="classNameic"
                                />
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
                                  type="classNameic"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Product Threshold</label>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_product_threshold"
                                  value={this.state.edit_product_threshold}
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
                              {this.state.edit_productSubscription === "yes" ? (
                                <div className="modal-right-bx">
                                  <label htmlFor="male">
                                    <input
                                      type="radio"
                                      name="edit_productSubscription"
                                      value="yes"
                                      onChange={this.formHandler}
                                      checked
                                    />
                                    Yes
                                  </label>
                                  <br />

                                  <label htmlFor="female">
                                    {" "}
                                    <input
                                      type="radio"
                                      name="edit_productSubscription"
                                      value="no"
                                      onChange={this.formHandler}
                                    />
                                    No
                                  </label>
                                  <br />
                                  <span className="err err_product_subscription"></span>
                                </div>
                              ) : (
                                <></>
                              )}

                              {this.state.edit_productSubscription === "no" ? (
                                <div className="modal-right-bx">
                                  <input
                                    type="radio"
                                    name="edit_productSubscription"
                                    value="yes"
                                    onChange={this.formHandler}
                                  />
                                  <label htmlFor="male">Yes</label>
                                  <br />
                                  <input
                                    type="radio"
                                    name="edit_productSubscription"
                                    value="no"
                                    onChange={this.formHandler}
                                    checked
                                  />
                                  <label htmlFor="female">No</label>
                                  <br />
                                  <span className="err err_product_subscription"></span>
                                </div>
                              ) : (
                                <></>
                              )}

                              {this.state.edit_productSubscription === "" ? (
                                <div className="modal-right-bx">
                                  <input
                                    type="radio"
                                    name="edit_productSubscription"
                                    value="yes"
                                    onChange={this.formHandler}
                                  />
                                  <label htmlFor="male">Yes</label>
                                  <br />
                                  <input
                                    type="radio"
                                    name="edit_productSubscription"
                                    value="no"
                                    onChange={this.formHandler}
                                  />
                                  <label htmlFor="female">No</label>
                                  <br />
                                  <span className="err err_product_subscription"></span>
                                </div>
                              ) : (
                                <></>
                              )}
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
                                <div className="form-group">
                                  <div className="modal-left-bx">
                                    <label>
                                      Pre Order End Date
                                      <span className="asterisk">*</span>
                                    </label>
                                  </div>
                                  <div className="modal-right-bx">
                                    {this.state.preOrderEndDate ? (
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
                                    ) : (
                                      <DatePicker
                                        dateFormat="dd/MM/yyyy"
                                        onChange={(date) =>
                                          this.preOrderEndDate(date)
                                        }
                                        minDate={new Date().setDate(
                                          new Date().getDate() + 1
                                        )}
                                      />
                                    )}
                                    <span className="err err_preOrderEndDate"></span>
                                  </div>
                                </div>
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
                                  value={this.state.edit_selected_unit}
                                  className="select-search"
                                  name="edit_selected_unit"
                                />
                                <span className="err err_edit_selected_unit"></span>
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
                                  name="edit_unit_quantity"
                                  value={this.state.edit_unit_quantity}
                                  className="form-control"
                                  placeholder="Enter Quantity / unit Measurement"
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
                                  value={this.state.productExpiryDay}
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
                                  value={this.state.barcode}
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
                            <div className="form-group new_choose">
                              <div
                                className="modal-left-bx"
                                style={{ display: "flex" }}
                              >
                                <label>Add Attachnment (if any )</label>
                                <div style={{ marginLeft: "10px" }}>
                                  {this.state.edit_attachment ? (
                                    <a
                                      href={
                                        imageUrl + this.state.edit_attachment
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      View Attachment
                                    </a>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="attachnment"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                              </div>
                            </div>

                            <div className="form-group new_choose">
                              <div className="modal-left-bx">
                                <label>Banner - 1920px * 400px</label>
                              </div>
                              <img
                                style={{ height: "50px" }}
                                src={imageUrl + this.state.edit_banner}
                                alt=""
                              />
                              {this.state.edit_banner ? (
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.removebanner()}
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                <></>
                              )}

                              <div className="modal-right-bx">
                                <input
                                  type="file"
                                  name="edit_banner"
                                  className="form-control"
                                  onChange={this.formHandler}
                                />
                                <span className="err err_banner"></span>
                              </div>
                            </div>

                            {multipleimages.map((item1, index) => {
                              return (
                                <>
                                  <div className="form-group">
                                    <div className="modal-left-bx">
                                      <label>Image - 800px * 800px</label>
                                    </div>
                                    <div className="modal-right-bx">
                                      <img
                                        style={{ height: "50px" }}
                                        src={imageUrl + item1.image}
                                        alt="images"
                                      />
                                      <span
                                        className={"err err_multi_img" + index}
                                      ></span>
                                      <i
                                        className="fa fa-times"
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
                                </>
                              );
                            })}
                            {newmultipleimages.map((ittm, ind) => (
                              <div>
                                <div className="modal-left-bx">
                                  <label>Image - 800px * 800px</label>
                                </div>
                                <div className="modal-right-bx">
                                  <input
                                    type="file"
                                    name={"image" + ind}
                                    className="form-control"
                                    onChange={(e) =>
                                      this.formHandler1(e, ind, "image")
                                    }
                                  />
                                  <i
                                    className="fa fa-times"
                                    onClick={() =>
                                      this.newremoveimagemultiple("Remove", ind)
                                    }
                                    aria-hidden="true"
                                  ></i>
                                </div>
                              </div>
                            ))}

                            <div className="form-group add_multli">
                              <button
                                className="btn btn-primary feel-btnv2"
                                type="button"
                                onClick={() => this.addmoremultipleimage()}
                              >
                                Add Multiple Images{"  "}
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
                                  value={this.state.selectednewproducts}
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
                          </div>
                        </div>

                        <div className="tax_n_admin">
                          <h3>Tax</h3>
                          <div className="inner_details_admin edit-inven-data-wrap">
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label> Sales Tax Outside Delhi</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <select
                                  name="edit_salesTaxOutSide"
                                  value={
                                    this.state.edit_salesTaxOutSide
                                      ? this.state.edit_salesTaxOutSide
                                      : ""
                                  }
                                  className="form-control"
                                  onChange={this.formHandler}
                                >
                                  <option value={""} disabled>
                                    Select
                                  </option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option value={item._id}>
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
                                  name="edit_salesTaxWithIn"
                                  className="form-control"
                                  onChange={this.formHandler}
                                  value={
                                    this.state.edit_salesTaxWithIn
                                      ? this.state.edit_salesTaxWithIn
                                      : ""
                                  }
                                >
                                  <option value={""} disabled>
                                    Select
                                  </option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option value={item._id}>
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
                                  name="edit_purchaseTax"
                                  className="form-control"
                                  onChange={this.formHandler}
                                  value={
                                    this.state.edit_purchaseTax
                                      ? this.state.edit_purchaseTax
                                      : ""
                                  }
                                >
                                  <option value={""} disabled>
                                    Select
                                  </option>
                                  {this.state.all_taxes
                                    ? this.state.all_taxes.map(
                                        (item, index) => {
                                          return (
                                            <option value={item._id}>
                                              {item.name}
                                            </option>
                                          );
                                        }
                                      )
                                    : ""}
                                </select>
                                <span className="err err_purchase_tax"></span>
                              </div>
                            </div>

                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>HSN Code</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="text"
                                  name="edit_hsn"
                                  value={this.state.edit_hsn}
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
                                  name="edit_sku"
                                  value={this.state.edit_sku}
                                  className="form-control"
                                  placeholder="Enter SKU Code"
                                  onChange={(ev) => this.formHandler(ev)}
                                />
                                <span className="err err_sku"></span>
                              </div>
                            </div>
                          </div>
                        </div>
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
                                value={this.state.main_region}
                                className="basic-multi-select"
                                classNamePrefix="select"
                              />
                              <span className="err err_main_region"></span>
                            </div>
                          </div>
                        </div>
                        <div className="pakaging_pricing">
                          <h3>Pricing & Packaging</h3>
                          {this.state.edit_TypeOfProduct === "group" ? (
                            <div className="form-group">
                              <div className="modal-left-bx">
                                <label>Group Base Price</label>
                                <span className="asterisk">*</span>
                              </div>
                              <div className="modal-right-bx">
                                <input
                                  type="number"
                                  value={this.state.base_price}
                                  name="base_price"
                                  className="form-control"
                                  placeholder="Enter Base Price"
                                  onChange={this.formHandler}
                                />

                                <span className="err err_main_region"></span>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                          <>
                            {grouparray &&
                              grouparray.map((item2, index2) => (
                                <div className="group_sets">
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
                                          className={"err err_name" + index2}
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
                                          onWheel={(e) => e.target.blur()}
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
                                          className={"err err_minqty" + index2}
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
                                          onWheel={(e) => e.target.blur()}
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
                                          className={"err err_maxqty" + index2}
                                        ></span>
                                      </div>
                                    </div>
                                    <i
                                      className="fa fa-times"
                                      onClick={() =>
                                        this.removemainset("Remove", index2, 0)
                                      }
                                      aria-hidden="true"
                                    ></i>
                                  </div>
                                  {item2.sets &&
                                    item2.sets.map((itm21, ind21) => (
                                      <div className="group_product product-package-block-wrap">
                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>Product Name</label>
                                            <span className="asterisk">*</span>
                                          </div>
                                          <div className="modal-right-bx">
                                            {this.state.all_product &&
                                            this.state.all_product.length >
                                              0 ? (
                                              <SelectSearch
                                                placeholder="Search Product"
                                                value={
                                                  itm21.product
                                                    ? itm21.product._id ||
                                                      itm21.product
                                                    : ""
                                                }
                                                options={this.state.all_product}
                                                onChange={(e) =>
                                                  this.onChange112(
                                                    e,
                                                    index2,
                                                    ind21
                                                  )
                                                }
                                                className="select-search"
                                              />
                                            ) : (
                                              ""
                                            )}
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
                                              value={
                                                itm21.package !== null
                                                  ? itm21.package?.packet_size
                                                  : ""
                                              }
                                              onChange={(ev) =>
                                                this.setformhandler(
                                                  ev,
                                                  index2,
                                                  ind21,
                                                  "package"
                                                )
                                              }
                                            >
                                              {itm21.package?.packet_size ? (
                                                ""
                                              ) : (
                                                <option value="">
                                                  Select Package
                                                </option>
                                              )}
                                              {itm21.package_items &&
                                                itm21.package_items.map(
                                                  (item1212) => (
                                                    <option
                                                      value={
                                                        item1212.packet_size
                                                      }
                                                    >
                                                      {item1212.packetLabel}
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
                                            <span className="asterisk">*</span>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
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
                                            <span className="asterisk">*</span>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
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
                                            <span className="asterisk">*</span>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
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
                                            <span className="asterisk">*</span>
                                          </div>
                                          <div className="modal-right-bx">
                                            <input
                                              type="number"
                                              onWheel={(e) => e.target.blur()}
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
                                        <div
                                          className={
                                            "err err_qty_group" + index2 + ind21
                                          }
                                        ></div>
                                      </div>
                                    ))}
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
                                </div>
                              ))}
                            {this.state.edit_TypeOfProduct === "group" ? (
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
                            ) : (
                              ""
                            )}
                          </>

                          <div className="inner_details_admin">
                            <>
                              {MultipleArray &&
                                MultipleArray.map((item, index) => {
                                  return (
                                    <>
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
                                            <label>Selling Price</label>
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
                                                "err err_sellingsimple" + index
                                              }
                                            ></span>
                                          </div>
                                        </div>

                                        <div className="form-group">
                                          <div className="modal-left-bx">
                                            <label>B2B price</label>
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
                                            <label>Retail Price</label>
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
                                            <label>MRP</label>
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
                                            this.deleteregion(
                                              index,
                                              item.availableQuantity
                                            )
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
                                            <div className="simple_sub_package">
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
                                                  <label>Selling Price</label>
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
                                                  <label>B2B Price</label>
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
                                                  <label>Retail Price</label>
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
                                                  <label>MRP</label>
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

                                              {/* <i
                                                onClick={() =>
                                                  this.deletepackage(
                                                    index,
                                                    indexx
                                                  )
                                                }
                                                className="fa fa-trash"
                                                aria-hidden="true"
                                              ></i> */}
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
                                  );
                                })}
                              {this.state.edit_TypeOfProduct === "simple"
                                ? MultipleArray.length === 0 && (
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
                                  )
                                : ""}
                            </>
                          </div>
                          {this.state.edit_TypeOfProduct === "configurable" ? (
                            <>
                              <Edit_Configurable
                                finishLoading={(configured_data) =>
                                  this.setState({
                                    configurableData: configured_data,
                                  })
                                }
                                data={this.state.configurableData}
                                Attribute_Group={this.state.configurableData}
                                Variant_Data={this.state.configurableData}
                                regionData={this.state.main_region}
                              />
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
                              <label>Catalogue List Status Status</label>
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
                          {this.state.loading ? (
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              style={{ minWidth: "100px" }}
                            >
                              <i
                                className="fa fa-spinner searchLoading"
                                aria-hidden="true"
                                style={{ position: "unset", fontSize: 20 }}
                              ></i>
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary feel-btn"
                              onClick={this.add}
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="admin-header">
                  <Adminfooter />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.loading === true ? <Loader></Loader> : ""}
      </div>
    );
  }
}
