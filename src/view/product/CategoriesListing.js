import React, { useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import swal from "sweetalert";
import "../../assets/css/cart.css";
import { AdminApiRequest } from "../../apiServices/AdminApiRequest";

function CategoriesListing({
  passSelectedCatData,
  parentName,
  product_categories,
}) {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    AdminApiRequest({ id: null }, "/getAllDescendantCategories", "POST")
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          let allCategory = [];

          res.data.data.forEach((cat) => {
            let subCat = [];
            cat.SubCatData &&
              cat.SubCatData.forEach((c) => {
                let subCat1 = [];
                c.SubCatData &&
                  c.SubCatData.forEach((i) => {
                    subCat1.push({
                      _id: i._id,
                      category_name: i.category_name,
                      SubCatData: i.SubCatData ? i.SubCatData : [],
                      selectStatus: false,
                    });
                  });
                subCat.push({
                  _id: c._id,
                  category_name: c.category_name,
                  SubCatData: subCat1,
                  selectStatus: false,
                });
              });
            allCategory.push({
              _id: cat._id,
              category_name: cat.category_name,
              SubCatData: subCat,
              selectStatus: false,
            });
          });
          setAllCategories(allCategory);
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
        if (parentName === "editProduct") {
          console.log(product_categories);
          console.log(selectedCategories);
          setSelectedCategories(product_categories);
          passSelectedCatData(product_categories);
          product_categories &&
            product_categories.forEach((cat) => {
              if (document.getElementById(cat)) {
                document.getElementById(cat).checked = true;
              }
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    passSelectedCatData(selectedCategories);
    selectedCategories &&
      selectedCategories.forEach((cat) => {
        if (document.getElementById(cat)) {
          document.getElementById(cat).checked = true;
        }
      });
  }, [selectedCategories]);

  const selectCategory = (e, type) => {
    console.log(e);
    console.log(selectedCategories);
    if (
      selectedCategories.filter((i) => {
        return i === e.target.id;
      }).length > 0
    ) {
      const local = selectedCategories.filter((i) => i !== e.target.id);
      setSelectedCategories(local);
    } else {
      setSelectedCategories([...selectedCategories, e.target.id]);
    }
  };

  return (
    <div className="category-select-listing">
      <Accordion defaultActiveKey="1">
        {allCategories && allCategories.length !== 0
          ? allCategories.map((category, index) => {
              return (
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey={index + 1}>
                    <div className="cateogry-listing-pick">
                      <input
                        type="checkbox"
                        className="m-r-10 gift-checkbox"
                        id={category._id}
                        name={category.category_name}
                        onChange={(e) => selectCategory(e, "main")}
                      />
                      <label for={category.category_name}>
                        <strong>{category.category_name}</strong>
                      </label>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={index + 1}>
                    <Card.Body>
                      <div className="cateogry-listing-pick">
                        {category.SubCatData && category.SubCatData.length !== 0
                          ? category.SubCatData.map((cat) => {
                              return (
                                <>
                                  <div>
                                    <input
                                      type="checkbox"
                                      className="m-r-10 gift-checkbox"
                                      id={cat._id}
                                      name={cat.category_name}
                                      onChange={(e) => selectCategory(e, "sub")}
                                    />
                                    <label for={cat.category_name}>
                                      <strong>{cat.category_name}</strong>
                                    </label>
                                  </div>
                                  {cat.SubCatData && cat.SubCatData.length !== 0
                                    ? cat.SubCatData.map((i) => {
                                        return (
                                          <>
                                            <div>
                                              <input
                                                type="checkbox"
                                                className="m-r-10 gift-checkbox"
                                                id={i._id}
                                                name={i.category_name}
                                                onChange={(e) =>
                                                  selectCategory(e, "sub")
                                                }
                                              />
                                              <label for={i.category_name}>
                                                <strong>
                                                  {i.category_name}
                                                </strong>
                                              </label>
                                            </div>
                                          </>
                                        );
                                      })
                                    : ""}
                                </>
                              );
                            })
                          : ""}
                      </div>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              );
            })
          : ""}
      </Accordion>
    </div>
  );
}

export default CategoriesListing;
