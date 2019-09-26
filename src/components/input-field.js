import React, { Component, createRef } from "react";
import AutosizeInput from "react-input-autosize";
import { IconButton } from "@wordpress/components";

import Tag from "./tag";

class InputField extends Component {
  constructor() {
    super();

    this.searchRef = createRef();
  }

  deleteSelectedItem(value) {
    this.props.deleteSelectedItem(value);
  }

  filterOptions(value) {
    this.props.filterOptions(value);
  }

  toggleDropdown() {
    this.props.toggleDropdown();
  }

  focusSearchField() {
    this.searchRef.current.input.focus();
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between"
        }}
        onClick={() => this.focusSearchField()}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            flexWrap: "wrap"
          }}
        >
          {this.props.selectedItems.length > 0 &&
            this.props.selectedItems.map(ele => (
              <Tag
                deleteSelectedItem={value => this.deleteSelectedItem(value)}
                element={ele}
              />
            ))}
          <AutosizeInput
            type="text"
            onChange={e => this.props.onChangeSearchValue(e.target.value)}
            value={this.props.searchValue}
            ref={this.searchRef}
          />
        </div>
        <IconButton
          icon={this.props.dropdownHide ? "arrow-down" : "arrow-up"}
          onClick={() => this.toggleDropdown()}
        />
      </div>
    );
  }
}

export default InputField;
