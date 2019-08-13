import { combineReducers } from 'redux';
import movieReducer from '../components/MovieSeriesPage/Movie.redux/reducer';
import profileHeader from '../components/UserPage/reducer';
import storyReducer from '../components/MainPage/StoryList/story.redux/reducer';
import feedReducer from '../components/MainPage/FeedBlock/FeedBlock.redux/reducer';
import eventsReducer from '../components/UserPage/UserEvents/reduser';

const reducers = {};

export default combineReducers({
	...reducers,
	movie: movieReducer,
	profile: profileHeader,
	story: storyReducer,
	feed: feedReducer,
	events: eventsReducer
});
