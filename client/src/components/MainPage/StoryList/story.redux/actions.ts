import {
	ADD_STORY,
	CHANGE_ACTIVITY,
	CHANGE_IMAGE,
	CREATE_STORY,
	CREATE_VOTING,
	FETCH_STORIES,
	SET_CAPTION_NEWSTORY
} from './actionTypes';
import INewStory from '../INewStory';
import IVoting from '../IVoting';

export const fetchStories = () => {
	return {
		type: FETCH_STORIES
	};
};

export const setCaption = (caption, start, end) => {
	return {
		type: SET_CAPTION_NEWSTORY,
		payload: {
			caption,
			start,
			end
		}
	};
};

export const saveImage = url => {
	return {
		type: CHANGE_IMAGE,
		payload: url
	};
};

export const changeActivity = (
	type: string,
	activity: { id: string; name: string }
) => {
	return {
		type: CHANGE_ACTIVITY,
		payload: {
			type,
			activity
		}
	};
};

export const createStory = (newStory: INewStory, userId: string) => {
	return {
		type: CREATE_STORY,
		payload: {
			newStory,
			userId
		}
	};
};

export const createVoting = (voting: IVoting) => {
	return {
		type: CREATE_VOTING,
		payload: {
			voting
		}
	};
};

export const addStory = story => {
	return {
		type: ADD_STORY,
		payload: {
			story
		}
	};
};
