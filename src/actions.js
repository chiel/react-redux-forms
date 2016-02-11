'use strict';

import * as c  from './constants';
import { get } from 'dot-prop';

export function addForm(name, formData) {
	return { type: c.ADD_FORM, name, formData };
}

export function updateField(formName, fieldName, value) {
	return { type: c.UPDATE_FIELD_VALUE, formName, fieldName, value };
}

export function validateFieldSuccess(formName, fieldName) {
	return { type: c.VALIDATE_FIELD_SUCCESS, formName, fieldName };
}

export function validateFieldFailure(formName, fieldName, error) {
	return { type: c.VALIDATE_FIELD_FAILURE, formName, fieldName, error };
}

export function validateField(formName, fieldName, validators, value) {
	value = value || '';

	if (!validators || !validators.length) return Promise.resolve(value);

	let [ fv, ...v ] = validators;

	return dispatch => v.reduce((a, b) => a.then(b), fv(value))
		.then(value => {
			dispatch(validateFieldSuccess(formName, fieldName));
			return Promise.resolve(value);
		})
		.catch(err => {
			dispatch(validateFieldFailure(formName, fieldName, err));
			return Promise.reject(err);
		});
}

export function validateForm(formName, schema, values) {
	return dispatch => {
		const promises = Object.keys(schema).map(key => (
			dispatch(validateField(formName, key, schema[key], get(values, key) || ''))
		));

		return Promise.all(promises);
	};
}
