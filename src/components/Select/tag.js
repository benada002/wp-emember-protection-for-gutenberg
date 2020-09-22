import { Component } from "@wordpress/element";
import { Button } from "@wordpress/components";

class Tag extends Component {
  constructor() {
    super();
  }

  deleteSelectedItem() {
    this.props.deleteSelectedItem(this.props.element.value);
  }

  render() {
    return (
      <span
        className="components-form-token-field__token"
        style={{ display: "inline-flex" }}
      >
        <span className="components-form-token-field__token-text">
          <span>{this.props.element.label}</span>
        </span>
        <Button
          className="components-form-token-field__remove-token"
          icon="dismiss"
          label={this.props.element.label}
          onClick={() => this.deleteSelectedItem()}
        />
      </span>
    );
  }
}

export default Tag;
