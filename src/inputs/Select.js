import React from 'react';
import ValidationError from '../ValidationError';
import { findDOMNode } from 'react-dom';

class Select extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: props.value || undefined
    }
  }

  getValue() {
    return Promise.resolve(this.state.value);
  }

  validate(value) {
    const { name, multiple,
      required, requiredMsg,
      minSelection, minSelectionMsg,
      maxSelection, maxSelectionMsg
    } = this.props;

    // Normalize value
    if (value === "" || value === undefined || value === null) {
      value = null;
      if (required) {
        return Promise.reject(new ValidationError(this, name, requiredMsg || "Value is required"));
      } else {
        return Promise.resolve(null);
      }
    }

    if (multiple) {
      value = value.split(",");
      if (minSelection !== undefined && value.length < minSelection) {
        return Promise.reject(new ValidationError(this, name, minSelectionMsg || ("At least " + minSelection + " values must be selected.")));
      }
      if (maxSelection !== undefined && value.length > maxSelection) {
        return Promise.reject(new ValidationError(this, name, maxSelectionMsg || ("Only " + maxSelection + " values must be selected.")));
      }
    }

    return Promise.resolve(value);
  }

  _onChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  componentDidMount() {
    $(findDOMNode(this)).dropdown({
      onChange: (value) => {
        this.setState({ value });
      }
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { name, options, placeholder, searchable, multiple, ...other } = this.props;

    const className = "ui dropdown selection" + (searchable ? " search":"") + (multiple ? " multiple":"");
    return (
      <div className={className}>
        <input type="hidden" name={name} />
        <i className="dropdown icon" />
        <div className="default text">{placeholder}</div>
        <div className="menu">
          {Object.keys(options).map(v => <div key={v} className="item" data-value={v}>{options[v]}</div>)}
        </div>
      </div>
    );
  }
}

export default Select;
