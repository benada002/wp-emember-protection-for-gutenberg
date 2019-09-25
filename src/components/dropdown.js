import React, { Component } from "react";

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: 0,
      instance: props.instance
    };

    this.keyDown = this.keyDown.bind(this);
  }

  filterOptions() {
    const pattern = new RegExp(this.props.searchValue, "i");

    return this.props.options.filter(ele => ele.label.match(pattern));
  }

  keyDown(event) {
    const options = this.filterOptions();

    switch (event.key) {
      case "Enter":
        if (options.length > 0) {
          this.props.addSelectedItem(options[this.state.selected].value);
        }
        break;

      case "ArrowUp":
        if (this.state.selected > 0) {
          this.setState({
            selected: this.state.selected - 1
          });
        }
        break;

      case "ArrowDown":
        if (this.state.selected < options.length - 1) {
          this.setState({
            selected: this.state.selected + 1
          });
        }
        break;

      default:
        break;
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyDown);
  }

  render() {
    const filteredOptions = this.filterOptions();
    return (
      <ul
        className="components-form-token-field__suggestions-list"
        role="listbox"
        aria-expanded="true"
        aria-activedescendant={`multi-select-${this.state.instance}-${this.state.selected}`}
      >
        {(filteredOptions.length > 0 &&
          filteredOptions.map((ele, i) => (
            <li
              id={`multi-select-${this.state.instance}-${i}`}
              className="components-form-token-field__suggestion"
              style={{
                backgroundColor: this.state.selected === i ? "blue" : "#fff"
              }}
              onClick={() => this.props.addSelectedItem(ele.value)}
              role="option"
              aria-selected={this.state.selected === i ? "true" : "false"}
            >
              >{ele.label}
            </li>
          ))) || (
          <li className="components-form-token-field__suggestion">
            Nothing Found!
          </li>
        )}
      </ul>
    );
  }
}

export default Dropdown;
