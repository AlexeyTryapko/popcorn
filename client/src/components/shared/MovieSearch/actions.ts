import {
	SEARCH_MOVIE_TITLE,
	DELETE_SEARCH_DATA,
	FETCH_MOVIE_PROPERTIES
} from './actionTypes';

export const searchTitle = (inputData: string) => ({
	type: SEARCH_MOVIE_TITLE,
	payload: { inputData }
});

export const deleteSearchData = () => ({
	type: DELETE_SEARCH_DATA
});

export const fetchMovieProperties = (
	movieId: string,
	properties: Array<string>
) => ({
	type: FETCH_MOVIE_PROPERTIES,
	payload: { movieId, properties }
});
