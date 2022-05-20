import React from "react";
import { DynamicUrl } from "../../common";
import Adminheader from "../admin/elements/admin_header";
import Adminsiderbar from "../admin/elements/admin_sidebar";
import Footer from "../admin/elements/footer";

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
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
                <h3>Logs</h3>
                <div className="Default_icon setting-first-default p-5">
                  {/* <div className="form-group w-100">
                    <div className="modal-left-bx">
                      <label>Product Logs</label>
                    </div>
                    <div className="modal-right-bx">
                      <iframe
                        src={DynamicUrl + "app_logs/product_quantity.log"}
                        title="Logs"
                        style={{ width: "100%", minHeight: "400px" }}
                      ></iframe>
                    </div>
                  </div> */}
                  <div className="form-group w-100 mt-5">
                    <div className="modal-left-bx">
                      <label>Inventory Logs</label>
                    </div>
                    <div className="modal-right-bx">
                      <iframe
                        src={DynamicUrl + "app_logs/inventory_quantity.log"}
                        title="Logs"
                        style={{ width: "100%", minHeight: "400px" }}
                      ></iframe>
                      {/* <a
                        className="btn btn-primary"
                        target="_blank"
                        href={DynamicUrl + "app_logs/product_quantity.log"}
                      >
                        View
                      </a> */}
                    </div>{" "}
                  </div>
                </div>{" "}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );
  }
}

export default Logs;
