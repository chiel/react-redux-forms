'use strict';

import * as actions           from './actions';
import React                  from 'react';
import { connect }            from 'react-redux';
import { bindActionCreators } from 'redux';

class Form extends React.Component {
	componentWillMount() {
		this.props.addForm(this.props.name);
		this._onSubmit = this.props.onSubmit;
	}

	onBlur(e) {
		if (!e.target.name) return;

		const validators = this.props.schema[e.target.name];
		if (this.submitted && validators) {
			this.props.validateField(this.props.name, e.target.name, validators, e.target.value)
				.catch(err => {});
		}
	}

	onChange(e) {
		if (!e.target.name) return;

		this.props.updateField(this.props.name, e.target.name, e.target.value);
	}

	onSubmit(e) {
		e.preventDefault();
		this.submitted = true;

		this.props.validateForm(this.props.name, this.props.schema, this.props.data)
			.then(values => {
				if (this._onSubmit) this._onSubmit();
			})
			.catch(err => {});
	}

	render() {
		const { children, data, schema, ...props } = this.props;

		return (
			<form {...props} onBlur={this.onBlur.bind(this)} onChange={this.onChange.bind(this)} onSubmit={this.onSubmit.bind(this)} noValidate>
				{children}
			</form>
		);
	}
}

export default connect(
	(state, props) => ({
		data: state.formData[props.name] || {}
	}),
	dispatch => bindActionCreators(actions, dispatch)
)(Form);
