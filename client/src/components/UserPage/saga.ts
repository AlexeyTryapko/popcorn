import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
	FINISH_UPLOAD_AVATAR,
	GET_SELECTED_USER_INFO,
	SEND_POST,
	SET_AVATAR,
	SET_SELECTED_USER,
	SET_TEMP_AVATAR,
	SET_USER_POSTS,
	START_UPLOAD_AVATAR,
	UPDATE_PROFILE,
	USER_POSTS
} from './actionTypes';
import { uploadFile } from '../../services/file.service';
import callWebApi from './../../services/webApi.service';
import axios from 'axios';
import {
	FETCH_LOGIN,
	FETCH_REGISTRATION,
	FETCH_RESET_PASSWORD,
	FETCH_RESTORE_PASSWORD,
	FETCH_USER_BY_TOKEN,
	LOGIN,
	LOGOUT,
	RESET_ERROR,
	RESET_OK,
	RESTORE_ERROR,
	RESTORE_OK,
	SET_LOGIN_ERROR,
	SET_REGISTER_ERROR,
	AUTH_WITH_SOCIAL
} from '../authorization/actionTypes';
import { CONFIRM_CHANGES, CHANGES_SUCCESS } from '../ConfirmChange/actionTypes';
import webApi from '../../services/webApi.service';

export function* getSelectedUser(action) {
	try {
		const data = yield call(webApi, {
			method: 'GET',
			endpoint: '/api/user/' + action.payload.id
		});

		yield put({
			type: SET_SELECTED_USER,
			payload: { user: data.data }
		});
	} catch (e) {
		console.log(e.message);
	}
}

export function* updateProfile(action) {
	try {
		const data = yield call(webApi, {
			method: 'PUT',
			endpoint: '/api/user/' + action.payload.id,
			body: {
				...action.payload.data
			}
		});

		yield put({
			type: GET_SELECTED_USER_INFO,
			payload: { id: action.payload.id }
		});
	} catch (e) {
		console.log('user saga update user:', e.message);
	}
}

export function* uploadAvatar(action) {
	try {
		const data = yield call(uploadFile, action.payload.file);

		yield put({
			type: SET_TEMP_AVATAR,
			payload: { uploadUrl: data.imageUrl }
		});
	} catch (e) {
		console.log('user page saga catch: uploadAvatar', e.message);
	}
}

export function* setAvatar(action) {
	try {
		const res = yield call(webApi, {
			method: 'PUT',
			endpoint: '/api/user/' + action.payload.id,
			body: {
				avatar: action.payload.url
			}
		});
		console.log(res.data.user);
		yield put({
			type: FINISH_UPLOAD_AVATAR,
			payload: { user: res.data.user }
		});
	} catch (e) {
		console.log('user page saga catch: setAvatar', e.message);
	}
}

export function* fetchLogin(action) {
	try {
		const { data: data } = yield call(axios.post, '/api/auth/login', {
			...action.payload
		});

		localStorage.setItem('token', data.token);

		yield put({
			type: LOGIN,
			payload: { user: data.user[0] }
		});
	} catch (e) {
		console.log('user saga login', e);
		yield put({
			type: SET_LOGIN_ERROR,
			payload: {
				loginError: e.response.data.message
			}
		});
	}
}

export function* confirmChanges(action) {
	try {
		yield call(webApi, {
			method: 'PUT',
			endpoint: `/api/confirm/${action.payload.token}`
		});
		localStorage.removeItem('token');
		yield put({
			type: LOGOUT
		});
		yield put({
			type: CHANGES_SUCCESS
		});
	} catch (e) {
		console.log('user saga confirm', e);
	}
}

export function* fetchUser(action) {
	const init: RequestInit = {
		headers: { Authorization: `Bearer ${action.payload.token}` }
	};

	try {
		let user = yield call(fetch, '/api/auth/user', init);

		if (!user.ok) {
			localStorage.setItem('token', '');

			yield put({
				type: SET_LOGIN_ERROR,
				payload: {
					loginError: 'You have been absent for a long time'
				}
			});
		} else {
			user = yield call(user.json.bind(user));

			yield put({
				type: LOGIN,
				payload: { user: user.data.user }
			});
		}
	} catch (e) {
		console.log('user saga fetchUser:', e.message);
	}
}

export function* unathorizeUser(action) {
	try {
		localStorage.removeItem('token');
	} catch (e) {
		console.log('Something went wrong with logout');
	}
}

export function* fetchRegistration(action) {
	try {
		const data = yield call(axios.post, '/api/auth/register', {
			...action.payload
		});
		localStorage.setItem('token', data.data.token);

		yield put({
			type: LOGIN,
			payload: { user: data.data.user[0] }
		});
	} catch (e) {
		console.log('user saga fetch registration:', e.message);
		yield put({
			type: SET_REGISTER_ERROR,
			payload: {
				registerError: e.response.data.message
			}
		});
	}
}
export function* fetchSocialAuth(action) {
	try {
		const { data } = action.payload;
		localStorage.setItem('token', data.token);

		yield put({
			type: LOGIN,
			payload: { user: data.user[0] }
		});
	} catch (e) {
		console.log('Something went wrong with logout');
	}
}

export function* fetchPosts(action) {
	try {
		const data = yield call(webApi, {
			method: 'GET',
			endpoint: '/api/post/user/' + action.payload.id
		});

		yield put({
			type: SET_USER_POSTS,
			payload: {
				userPosts: data,
				loading: false
			}
		});
	} catch (e) {
		console.log('profile saga fetch posts:', e.message);
	}
}

export function* sendPost(action) {
	const {
		id,
		image_url,
		description,
		title,
		userId,
		extraLink,
		extraTitle,
		extraType,
		extraData
	} = action.payload.data;
	const post = id
		? {
				id,
				image_url,
				description,
				title,
				userId,
				extraLink,
				extraTitle,
				survey: extraType === 'survey' ? { id: extraData.id } : {},
				top: extraType === 'top' ? { id: extraData.id } : {},
				event: extraType === 'event' ? { id: extraData.id } : {}
		  }
		: action.payload.data;
	try {
		yield call(webApi, {
			method: id ? 'PUT' : 'POST',
			endpoint: '/api/post',
			body: { ...post }
		});

		yield put({
			type: SET_USER_POSTS,
			payload: {
				loading: true
			}
		});
	} catch (e) {
		console.log('profile saga fetch posts:', e.message);
	}
}

export function* resetPassword(action) {
	try {
		const data = yield call(webApi, {
			endpoint: '/api/auth/reset',
			method: 'POST',
			parse: false,
			body: {
				email: action.payload.email
			}
		});
		if (data.ok) yield put({ type: RESET_OK });
		else
			yield put({
				type: RESET_ERROR,
				payload: { message: data.statusMessage || 'Unknown error' }
			});
	} catch (e) {
		console.log('profile saga reset password: ', e.message);
		yield put({ type: RESET_ERROR, payload: { message: e.message } });
	}
}

export function* fetchRestorePassword(action) {
	try {
		const data = yield call(webApi, {
			endpoint: '/api/auth/restore',
			method: 'POST',
			parse: false,
			body: {
				password: action.payload.password,
				token: action.payload.token
			}
		});
		if (data.ok) yield put({ type: RESTORE_OK });
		else
			yield put({
				type: RESTORE_ERROR,
				payload: { message: data.statusMessage || 'Unknown error' }
			});
	} catch (e) {
		console.log('profile saga fetch restore password: ', e.message);
		yield put({ type: RESTORE_ERROR, payload: { message: e.message } });
	}
}

function* watchSendPost() {
	yield takeEvery(SEND_POST, sendPost);
}

function* watchGetSelectedUser() {
	yield takeEvery(GET_SELECTED_USER_INFO, getSelectedUser);
}

function* watchUpdateProfile() {
	yield takeEvery(UPDATE_PROFILE, updateProfile);
}

function* watchFetchFilms() {
	yield takeEvery(START_UPLOAD_AVATAR, uploadAvatar);
}

function* watchSetAvatar() {
	yield takeEvery(SET_AVATAR, setAvatar);
}

function* watchFetchLogin() {
	yield takeEvery(FETCH_LOGIN, fetchLogin);
}

function* watchFetchLogout() {
	yield takeEvery(LOGOUT, unathorizeUser);
}

function* watchFetchUser() {
	yield takeEvery(FETCH_USER_BY_TOKEN, fetchUser);
}

function* watchFetchPosts() {
	yield takeEvery(USER_POSTS, fetchPosts);
}

function* watchFetchRegistration() {
	yield takeEvery(FETCH_REGISTRATION, fetchRegistration);
}

function* watchFetchResetPassword() {
	yield takeEvery(FETCH_RESET_PASSWORD, resetPassword);
}

function* watchFetchRestorePassword() {
	yield takeEvery(FETCH_RESTORE_PASSWORD, fetchRestorePassword);
}

function* watchConfirm() {
	yield takeEvery(CONFIRM_CHANGES, confirmChanges);
}

function* watchFetchSocialAuth() {
	yield takeEvery(AUTH_WITH_SOCIAL, fetchSocialAuth);
}

export default function* profile() {
	yield all([
		watchGetSelectedUser(),
		watchFetchFilms(),
		watchSetAvatar(),
		watchFetchLogin(),
		watchFetchUser(),
		watchFetchRegistration(),
		watchFetchPosts(),
		watchFetchResetPassword(),
		watchFetchRestorePassword(),
		watchFetchLogout(),
		watchUpdateProfile(),
		watchSendPost(),
		watchConfirm(),
		watchFetchLogout(),
		watchFetchSocialAuth()
	]);
}
