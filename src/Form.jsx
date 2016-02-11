'use strict';

import * as actions           from './actions';
import React                  from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';

class Form extends React.Component {
	static childContextTypes = {
		blurField: React.PropTypes.func,
		formData: React.PropTypes.object,
		formErrors: React.PropTypes.object,
		updateField: React.PropTypes.func
	};

	getChildContext() {
		return {
			blurField: this.blurField.bind(this),
			formData: this.props.formData,
			formErrors: this.props.formErrors,
			updateField: this.updateField.bind(this)
		};
	}

	blurField(field) {
		const validators = this.props.schema[field];
		if (this.submitted && validators) {
			this.props.validateField(this.props.name, field, validators, this.props.formData[field])
				.catch(err => {});
		}
	}

	updateField(field, value) {
		this.props.updateField(this.props.name, field, value);
	}

	componentWillMount() {
		this.props.addForm(this.props.name, this.props.formData);
		this._onSubmit = this.props.onSubmit;
	}

	onSubmit(e) {
		e.preventDefault();
		this.submitted = true;

		this.props.validateForm(this.props.name, this.props.schema, this.props.formData)
			.then(values => {
				if (this._onSubmit) this._onSubmit();
			})
			.catch(err => {});
	}

	render() {
		const { children, formData, schema, ...props } = this.props;

		return (
			<form {...props} onSubmit={this.onSubmit.bind(this)} noValidate>
				{children}
			</form>
		);
	}
}

export default connect(
	(state, props) => ({
		formData: state.formData[props.name] || props.formData || {},
		formErrors: state.formErrors[props.name] || {}
	}),
	dispatch => bindActionCreators(actions, dispatch)
)(Form);
