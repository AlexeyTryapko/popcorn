import { all, call, put, takeEvery } from '@redux-saga/core/effects';
import { FETCH_TOPS, SET_TOP_LIST } from './actionTypes';

import webApi from '../../../services/webApi.service';

export function* fetchTops(action) {
	try {
		const data = yield call(webApi, {
			method: 'GET',
			endpoint: '/api/top/extended'
		});

		yield put({
			type: SET_TOP_LIST,
			payload: {
				tops: data
			}
		});
	} catch (e) {
		console.log('top list saga fetch tops: ', e.message);
	}
}

function* watchFetchTops() {
	yield takeEvery(FETCH_TOPS, fetchTops);
}

export default function* topList() {
	yield all([watchFetchTops()]);
}
