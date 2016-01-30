'use strict';

import * as c from './constants';

const formDataInitialState = {};

/**
 * FormData reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export function formData(state = formDataInitialState, action) {
	switch (action.type) {
		case c.ADD_FORM:
			return { ...state,
				[action.name]: {}
			};

		case c.UPDATE_FIELD_VALUE:
			return { ...state,
				[action.formName]: { ...state[action.formName],
					[action.fieldName]: action.value
				}
			};

		default:
			return state;
	}
}

const formErrorsInitialState = {};

/**
 * FormErrors reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export function formErrors(state = formErrorsInitialState, action) {
	switch (action.type) {
		case c.ADD_FORM:
			return { ...state,
				[action.name]: {}
			};

		case c.VALIDATE_FIELD_SUCCESS:
			return { ...state,
				[action.formName]: { ...state[action.formName],
					[action.fieldName]: undefined
				}
			};

		case c.VALIDATE_FIELD_FAILURE:
			return { ...state,
				[action.formName]: { ...state[action.formName],
					[action.fieldName]: action.error
				}
			};

		default:
			return state;
	}
}
