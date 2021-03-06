import {
	ADD_STORY,
	CHANGE_ACTIVITY,
	CHANGE_IMAGE,
	DISPLAY_FONT_PICKER,
	DISPLAY_INPUT,
	DISPLAY_PICKER,
	FETCH_STORIES,
	RESET_NEW_STORY,
	SAVE_CROPPED_IMAGE,
	SAVE_MOVIE,
	SET_BACKGROUNG_NEWSTORY,
	SET_CAPTION_NEWSTORY,
	SET_FONTCOLOR_NEWSTORY,
	SET_STORIES,
	SET_TEXT_POSITION_NEWSTORY,
	SET_VOTING_REACTION_BY_SOCKET
} from './actionTypes';
import INewStory from '../INewStory';
import replaceFilmSearch from '../../../../helpers/replaceFilmSearch';
import findIndexInArray from '../../../../helpers/findIndexInArray';

const initialState: {
	stories: any;
	loading: boolean;
	newStory: INewStory;
	cursorPosition: { start: number; end: number };
	title: string;
	photoSaved: boolean;
	isShownPicker: boolean;
	isShownFontPicker: boolean;
	isShownInput: boolean;
} = {
	stories: null,
	loading: false,
	newStory: {
		image_url: null,
		caption: '',
		activity: null,
		type: '',
		movieId: null,
		movieOption: '',
		backgroundColor: 'rgba(255,255,255,1)',
		fontColor: 'rgba(200,10,23,1)',
		textPosition: { x: 0, y: 0 }
	},
	cursorPosition: { start: 0, end: 0 },
	title: '',
	photoSaved: false,
	isShownPicker: false,
	isShownFontPicker: false,
	isShownInput: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_STORIES:
			return {
				...state,
				stories: action.payload.stories,
				loading: false
			};
		case FETCH_STORIES:
			return {
				...state,
				loading: true
			};
		case SET_CAPTION_NEWSTORY:
			return {
				...state,
				newStory: {
					...state.newStory,
					caption: action.payload.caption
				},
				cursorPosition: {
					start: action.payload.start,
					end: action.payload.end
				},
				title: action.payload.title
			};
		case SET_BACKGROUNG_NEWSTORY:
			return {
				...state,
				newStory: {
					...state.newStory,
					backgroundColor: action.payload.color
				}
			};
		case DISPLAY_PICKER:
			return {
				...state,
				isShownPicker: action.payload.isShown
			};
		case SET_FONTCOLOR_NEWSTORY:
			return {
				...state,
				newStory: {
					...state.newStory,
					fontColor: action.payload.color
				}
			};
		case DISPLAY_FONT_PICKER:
			return {
				...state,
				isShownFontPicker: action.payload.isShown
			};
		case SET_TEXT_POSITION_NEWSTORY:
			return {
				...state,
				newStory: {
					...state.newStory,
					textPosition: {
						x: action.payload.position.x,
						y: action.payload.position.y
					}
				}
			};
		case DISPLAY_INPUT:
			return {
				...state,
				isShownInput: action.payload.isShown
			};
		case SAVE_CROPPED_IMAGE:
			return {
				...state,
				photoSaved: true
			};
		case CHANGE_IMAGE:
			return {
				...state,
				newStory: {
					...state.newStory,
					image_url: action.payload
				}
			};
		case CHANGE_ACTIVITY:
			return {
				...state,
				newStory: {
					...state.newStory,
					type: action.payload.type,
					activity: action.payload.activity
				}
			};
		case ADD_STORY:
			const stories = state.stories;
			if (!stories) {
				return state;
			}

			const indexOfNewStory = findIndexInArray(
				stories,
				'id',
				action.payload.story.id
			);

			if (indexOfNewStory === -1) {
				return {
					...state,
					stories: [action.payload.story, ...state.stories]
				};
			} else {
				stories[indexOfNewStory] = action.payload.story;
				return {
					...state,
					stories: [...stories]
				};
			}
		case RESET_NEW_STORY:
			return {
				...state,
				newStory: {
					...state.newStory,
					image_url: null,
					caption: '',
					activity: null,
					type: ''
				},
				photoSaved: false
			};
		case SAVE_MOVIE:
			return {
				...state,
				newStory: {
					...state.newStory,
					image_url: action.payload.movie.poster_path,
					movieId: action.payload.movie.id,
					caption: replaceFilmSearch(
						state.newStory.caption || '',
						action.payload.movie.title
					),
					movieOption: action.payload.movieOption || ''
				}
			};
		case SET_VOTING_REACTION_BY_SOCKET:
			const { voting } = action.payload;

			if (!state.stories || !voting) {
				return state;
			}

			let index = -1;
			state.stories.forEach((story, i) => {
				if (story.voting && story.voting.id === voting.id) {
					index = i;
				}
			});

			console.log(index, voting);

			if (index === -1) {
				return state;
			}

			state.stories[index].voting = voting;

			return {
				...state,
				stories: [...state.stories]
			};
		default:
			return state;
	}
}
