import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { ApiRequest } from "../apiServices/ApiRequest";

function SidebarItem({ item, index, reRender, filterPass, dropdownParent }) {
  const [dropdown, setDropdown] = useState(false);
  const [allFilterProducts, setAllFilterProducts] = useState([]);

  useEffect(function () {
    let requestData = {
      regionID: JSON.parse(localStorage.getItem("selectedRegionId")),
    };
    ApiRequest(requestData, "/GetCategorySubCat", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setting_menu(res.data.data);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fitlerProducts = (e, category, val) => {
    startProgressBar();
    const prevSelected = document.querySelector(".activeSubCategory");
    if (prevSelected !== null) {
      prevSelected.classList.remove("activeSubCategory");
    }
    let requestData =
      category === "mainCategory"
        ? {
            product_cat_id: e,
            RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
            subscribe: localStorage.getItem("status"),
          }
        : {
            product_subCat1_id: e,
            RegionId: JSON.parse(localStorage.getItem("selectedRegionId")),
            subscribe: localStorage.getItem("status"),
          };
    category === "mainCategory"
      ? ApiRequest(requestData, "/searchProduct", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              setAllFilterProducts(res.data.data);
              topTenListOpen(false);
            } else {
              swal({
                title: "Network Issue",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .catch((error) => {
            console.log(error);
          })
      : ApiRequest(requestData, "/searchProduct", "POST")
          .then((res) => {
            if (res.status === 201 || res.status === 200) {
              setAllFilterProducts(res.data.data);
              topTenListOpen(false);
            } else {
              swal({
                title: "Network Issue",
                icon: "warning",
                dangerMode: true,
              });
            }
          })
          .then(() => {
            setMobileMainDropdown(false);
          })
          .catch((error) => {
            console.log(error);
          });
  };

  useEffect(() => {
    localStorage.setItem("filteredProducts", JSON.stringify(allFilterProducts));
    filterPass(allFilterProducts);
  }, [allFilterProducts]);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll(".side-bar-header");
    const opensidebarLink = document.querySelectorAll(".opensidebarLink");
    for (let i = 0; i < opensidebarLink.length; i++) {
      opensidebarLink[i].addEventListener("click", () => {
        const selectedLink = opensidebarLink[i].parentElement;
        sidebarLinks.forEach((li) => li.classList.remove("open"));
        selectedLink.classList.add("open");
        setSelectedLink(i);
      });
    }
  });
  const showTopTenList = () => {
    let requestData = {
      user_id: user_details._id,
    };
    ApiRequest(requestData, "/TopTenProductsOfUser", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setAllFilterProducts(res.data.data);
          topTenListOpen(true);
        } else {
          swal({
            title: "Network Issue",
            icon: "warning",
            dangerMode: true,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addSubCategoryActive = (e) => {
    const prevSelected = document.querySelector(".activeSubCategory");
    if (prevSelected !== null) {
      prevSelected.classList.remove("activeSubCategory");
    }
    e.target.classList.add("activeSubCategory");
  };
  useEffect(() => {
    localStorage.setItem("filteredProducts", JSON.stringify(allFilterProducts));
    filterPass(allFilterProducts);
  }, [allFilterProducts]);

  useEffect(() => {
    reRender();
  }, [dropdown]);
  return (
    <>
      <li
        className={dropdown ? "side-bar-header open" : "side-bar-header"}
        key={index}
      >
        <a
          href="#"
          onClick={() => {
            setDropdown(!dropdown);
            fitlerProducts(item._id, "mainCategory");
            return false;
          }}
        >
          <span className="nav-icon">
            <img src={item.icon} alt="" />
          </span>
          <span className="header-nav-text">{item.category_name}</span>
        </a>

        <div className="sidebar-sub-header">
          <ul>
            {item.SubCatData.map((data) => (
              <li onClick={() => fitlerProducts(data._id, "subCategory")}>
                <a>{data.category_name}</a>
              </li>
            ))}
          </ul>
        </div>
      </li>
      <li className="side-bar-header" key={index}>
        <a
          href="#"
          onClick={() => {
            setDropdown(!dropdown);
            fitlerProducts(item._id, "mainCategory");
            return false;
          }}
          className="opensidebarLink"
        >
          <span className="nav-icon">
            <img src={imageUrl + item.icon} alt="" />
          </span>
          <span className="header-nav-text">{item.category_name}</span>
          {item.SubCatData.length > 0 && <div className="arrow-sidebar"></div>}
        </a>

        <div className="sidebar-sub-header">
          <ul>
            {item.SubCatData.map((data) => (
              <li
                onClick={(val) => {
                  fitlerProducts(data._id, "subCategory", val);
                  addSubCategoryActive(val);
                }}
                style={{ display: "flex", alignItem: "center" }}
              >
                <a>
                  <span className="nav-icon">
                    <img
                      src={imageUrl + data.icon}
                      alt=""
                      style={{ height: 30 }}
                    />
                  </span>
                  <span>{data.category_name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    </>
  );
}

export default SidebarItem;
