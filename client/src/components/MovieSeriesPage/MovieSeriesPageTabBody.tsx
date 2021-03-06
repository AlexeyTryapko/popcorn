import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DiscussionComponent from './DiscussionComponent/DiscussionComponent';
import FilmBasicTabComponent from './FilmBasicTabComponent/FilmBasicTabComponent';
import MovieSeriesReviews from './MovieSeriesReviews/MovieSeriesReviews';
import MovieSeriesPosts from './MovieSeriesPosts/MovieSeriesPosts';
import MovieSeriesAwards from './MovieSeriesAwards/MovieSeriesAwards';
import MovieSeriesStatistics from './MovieSeriesStatistics/MovieSeriesStatistics';
import StaffCast from './StaffCast/StaffCast';
import TMovie from './TMovie';
import { IDiscussionUser } from '../UserPage/UserEvents/UserEvents.service';

interface IProps {
	mainPath: string;
	movie: TMovie;
	currentUser: IDiscussionUser;
	fetchAwards: (id: any) => any;
	awards: any;
	fetchStatistics: (movieId: string) => void;
	statistics: any;
	fetchPostsByFilm: (movieId: string) => void;
	posts?: any[];
	ownReview: any;
	setReview: any;
	removeReviewSet: any;
	fetchReview: any;
}

const MovieSeriesPageTabBody: React.SFC<IProps> = ({
	mainPath,
	movie,
	currentUser,
	fetchAwards,
	awards,
	fetchStatistics,
	statistics,
	fetchPostsByFilm,
	posts,
	ownReview,
	setReview,
	removeReviewSet,
	fetchReview
}) => {
	return (
		<div className={'movie-series-page-tab-body'}>
			<Switch>
				<Route
					exact={true}
					path={`${mainPath}`}
					render={() => <FilmBasicTabComponent movie={movie} />}
				/>
				<Route
					path={`${mainPath}/cast-crew`}
					render={() => <StaffCast movie={movie} />}
				/>
				<Route
					path={`${mainPath}/reviews`}
					render={() => (
						<MovieSeriesReviews
							ownReview={ownReview}
							movie={movie}
							setReview={setReview}
							userId={currentUser.id}
							removeReviewSet={removeReviewSet}
							fetchReview={fetchReview}
						/>
					)}
				/>
				<Route
					path={`${mainPath}/posts`}
					render={() => (
						<MovieSeriesPosts
							posts={posts}
							fetchPostsByFilm={() => fetchPostsByFilm(movie.id)}
						/>
					)}
				/>
				<Route
					path={`${mainPath}/awards`}
					render={() => {
						return (
							<MovieSeriesAwards
								awards={awards}
								imdbId={movie.imdb_id}
								fetchAwards={fetchAwards}
							/>
						);
					}}
				/>
			</Switch>
			<DiscussionComponent
				entityId={movie.id}
				messages={movie.messages}
				currentUser={currentUser}
				entityIdName="movieId"
			/>
		</div>
	);
};

export default MovieSeriesPageTabBody;
