import React from "react";
import GroupItem from "./GroupItem";

function GroupCategory({ catData, errorMsg, orderType }) {
  return (
    <div className="group">
      <div className="group-title">
        <p style={{ textTransform: "capitalize", color: "#febc15" }}>
          {catData.name}
        </p>
        {/* <p className="clear-group">Clear</p> */}
      </div>
      <div className="group-left-content">
        <div className="group-products-list">
          {catData.sets.map((data) => {
            return (
              <GroupItem
                item={data}
                errorMsg={errorMsg}
                orderType={orderType}
                categoryName={catData.name}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GroupCategory;
