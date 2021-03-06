import React from 'react';
import MovieSeriesPageHeader from './MovieSeriesPageHeader';
import MovieSeriesPageTabs from './MovieSeriesPageTabs';
import MovieSeriesPageTabBody from './MovieSeriesPageTabBody';
import './MovieSeriesPage.scss';
import { connect } from 'react-redux';
import Spinner from '../shared/Spinner';
import { bindActionCreators } from 'redux';
import {
	fetchWatchListStatus,
	addMovieToWatchList,
	deleteMovieFromWatchList
} from '../UserPage/UserWatchList/actions';
import {
	fetchMovie,
	fetchReviewByMovieUserId as fetchReview,
	setReview,
	removeReviewSet,
	fetchAwards,
	fetchStatistics,
	fetchPostsByFilm
} from './Movie.redux/actions';

interface IProps {
	fetchedMovie: any;
	fetchMovie: (movieId: string) => object;
	fetchReview: (userId: string, movieId: string) => object;
	setReview: (
		userId: string,
		movieId: string,
		text: string,
		prevId?: string
	) => object;
	removeReviewSet: () => object;
	ownReview: any;
	match: any;
	avatar?: string;
	userId: string;
	username: string;
	fetchWatchListStatus: (movieId: string) => object;
	watchListStatus?: any;
	addMovieToWatchList: (movieId: string) => object;
	deleteMovieFromWatchList: (watchId: string, movieId: string) => object;
	watchListLoading?: boolean;
	fetchAwards: (id: any) => any;
	awards: any;
	fetchStatistics: (movieId: string) => void;
	statistics: any;
	fetchPostsByFilm: (movieId: string) => void;
	posts?: Array<any>;
}

const MovieSeriesPage: React.SFC<IProps> = props => {
	const {
		fetchedMovie,
		fetchMovie,
		avatar,
		userId,
		username,
		fetchReview,
		ownReview,
		setReview,
		removeReviewSet,
		fetchWatchListStatus,
		watchListStatus,
		addMovieToWatchList,
		deleteMovieFromWatchList,
		watchListLoading,
		fetchAwards,
		awards,
		statistics,
		fetchStatistics,
		fetchPostsByFilm,
		posts
	} = props;
	const currentMovieId = props.match.params.id;
	const mainPath = `/movies/${currentMovieId}`;

	if (!fetchedMovie || fetchedMovie.id != currentMovieId) {
		fetchMovie(currentMovieId);
		return <Spinner />;
	}

	if (!watchListStatus || watchListStatus.movieId != currentMovieId) {
		fetchWatchListStatus(currentMovieId);
		return <Spinner />;
	}

	const movie = fetchedMovie;

	return (
		<div className="movie-series-page">
			<MovieSeriesPageHeader
				movie={movie}
				ownReview={ownReview}
				fetchReview={fetchReview}
				userId={userId}
				movieId={movie.id}
				setReview={setReview}
				removeReviewSet={removeReviewSet}
				watchListStatus={watchListStatus}
				addMovieToWatchList={addMovieToWatchList}
				deleteMovieFromWatchList={deleteMovieFromWatchList}
				watchListLoading={watchListLoading}
			/>
			<MovieSeriesPageTabs mainPath={mainPath} />
			<MovieSeriesPageTabBody
				ownReview={ownReview}
				setReview={setReview}
				fetchReview={fetchReview}
				mainPath={mainPath}
				removeReviewSet={removeReviewSet}
				movie={movie}
				currentUser={{ avatar, id: userId, name: username }}
				fetchAwards={fetchAwards}
				awards={awards}
				statistics={statistics}
				fetchStatistics={fetchStatistics}
				fetchPostsByFilm={fetchPostsByFilm}
				posts={posts}
			/>
		</div>
	);
};

const mapStateToProps = (rootState, props) => ({
	...props,
	fetchedMovie: rootState.movie.fetchedMovie,
	avatar: rootState.profile.profileInfo && rootState.profile.profileInfo.avatar,
	userId: rootState.profile.profileInfo && rootState.profile.profileInfo.id,
	username: rootState.profile.profileInfo && rootState.profile.profileInfo.name,
	ownReview: rootState.movie.ownReview,
	watchListStatus: rootState.watchList.watchListStatus,
	watchListLoading: rootState.watchList.isLoading,
	awards: rootState.movie.awards,
	statistics: rootState.movie.statistics,
	posts: rootState.movie.posts
});

const mapDispatchToProps = dispatch => {
	const actions = {
		fetchMovie,
		fetchReview,
		setReview,
		removeReviewSet,
		fetchWatchListStatus,
		addMovieToWatchList,
		deleteMovieFromWatchList,
		fetchAwards,
		fetchStatistics,
		fetchPostsByFilm
	};
	return bindActionCreators(actions, dispatch);
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MovieSeriesPage);
