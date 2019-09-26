import React, { Component, createRef } from "react";

import InputField from "./input-field";
import Dropdown from "./dropdown";

let instance = 0;

class SelectControlSearch extends Component {
  constructor() {
    super();

    this.state = {
      searchValue: "",
      dropdownHide: true,
      instance: (instance += 1)
    };

    this.rootElement = createRef();

    this.searchBlur = this.searchBlur.bind(this);
  }

  addSelectedItem(value) {
    this.props.onChange([...this.props.value, value]);
    this.setState({
      dropdownHide: true,
      searchValue: ""
    });
  }

  deleteSelectedItem(value) {
    const selectedItems = this.props.value;
    selectedItems.splice(
      selectedItems.findIndex(element => value === element),
      1
    )[0];

    this.props.onChange(selectedItems);
  }

  onChangeSearchValue(value = "") {
    this.setState({
      searchValue: value,
      dropdownHide: false
    });
  }

  toggleDropdown() {
    this.setState({
      dropdownHide: !this.state.dropdownHide
    });
  }

  filterOptions() {
    return this.props.options.filter(
      ele => this.props.value.findIndex(search => ele.value === search) === -1
    );
  }

  searchBlur(e) {
    if (
      this.rootElement.current &&
      !this.rootElement.current.contains(e.target)
    ) {
      this.setState({
        dropdownHide: true
      });
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.searchBlur);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.searchBlur);
  }

  render() {
    return (
      <div className="components-base-control">
        <label>{this.props.label}</label>
        <div
          className="components-form-token-field__input-container"
          ref={this.rootElement}
        >
          <InputField
            deleteSelectedItem={value => this.deleteSelectedItem(value)}
            onChangeSearchValue={value => this.onChangeSearchValue(value)}
            selectedItems={this.props.value.map(ele =>
              this.props.options.find(el => el.value === ele)
            )}
            toggleDropdown={() => this.toggleDropdown()}
            dropdownHide={this.state.dropdownHide}
            searchValue={this.state.searchValue}
          />
          {!this.state.dropdownHide && (
            <Dropdown
              addSelectedItem={value => this.addSelectedItem(value)}
              searchValue={this.state.searchValue}
              dropdownHide={this.state.dropdownHide}
              options={this.filterOptions()}
              instance={this.state.instance}
            />
          )}
        </div>
        {this.props.value.length > 0 &&
          this.props.value.map(value => (
            <input type="hidden" name={this.props.name} value={value} />
          ))}
      </div>
    );
  }
}

export default SelectControlSearch;
