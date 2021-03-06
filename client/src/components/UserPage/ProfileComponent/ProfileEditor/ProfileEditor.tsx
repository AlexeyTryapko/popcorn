import React, { Component } from 'react';
import './ProfileEditor.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import MovieSearch from '../../../shared/MovieSearch/MovieSearch';

interface IProfileEditorProps {
	user: {
		male: boolean;
		female: boolean;
		name: string;
		location: string;
		aboutMe: string;
		favoriteLists: Array<{
			movie: { id: number; name: string; release_date: string };
		}>;
	};
	onEditCancel: () => void;
	onEditSave: (any) => void;
}

interface IProfileEditorState {
	gender: boolean;
	name: string;
	location: string;
	aboutMe: string;
	favoriteMovies: Array<{ id: number; name: string; release_date: string }>;
}

class ProfileEditor extends Component<
	IProfileEditorProps,
	IProfileEditorState
> {
	constructor(props: IProfileEditorProps) {
		super(props);
		const favoriteLists = props.user.favoriteLists.filter(item => item.movie);
		this.state = {
			name: props.user.name,
			gender: props.user.male,
			aboutMe: props.user.aboutMe,
			location: props.user.location,
			favoriteMovies: favoriteLists.map(item => item.movie)
		};
	}

	onGenderChange = e => {
		this.setState({
			gender: e.target.value === 'male'
		});
	};

	onChangeData = (e, keyword: string) => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		this.setState({
			...this.state,
			[keyword]: value
		});
	};

	onEditCancel = () => {
		this.props.onEditCancel();
	};
	onEditSave = () => {
		this.props.onEditSave(this.state);
	};

	onDeleteFavoriteMovie = (e, id) => {
		e.preventDefault();
		const recievedMovies = this.state.favoriteMovies.filter(movie => movie);
		const newMovies = recievedMovies.filter(movie => movie.id !== id);
		this.setState({ favoriteMovies: newMovies });
	};

	onAddFavoriteMovie = movie => {
		const newMovie = {
			id: movie.id,
			name: movie.title,
			release_date: movie.release_date
		};

		const newMovies = [...this.state.favoriteMovies, newMovie];
		this.setState({ favoriteMovies: newMovies });
	};

	render() {
		const { gender, name, location, aboutMe, favoriteMovies } = this.state;

		return (
			<div className="profile-editor">
				<div className="profileRow">
					<p className="field">Name:</p>
					<input
						type="text"
						value={name}
						onChange={e => this.onChangeData(e, 'name')}
					/>
				</div>
				<div className="profileRow">
					<p className="field">Gender:</p>
					<div className="editor-gender">
						<label>
							<input
								type="radio"
								value="male"
								checked={gender}
								onChange={this.onGenderChange}
							/>
							Male
						</label>
						<label>
							<input
								type="radio"
								value="female"
								checked={!gender}
								onChange={this.onGenderChange}
							/>
							Female
						</label>
					</div>
				</div>
				<div className="profileRow">
					<p className="field">Location:</p>
					<input
						type="text"
						value={location}
						onChange={e => this.onChangeData(e, 'location')}
					/>
				</div>
				<div className="profileRow">
					<p className="field">About:</p>
					<input
						type="text"
						value={aboutMe}
						onChange={e => this.onChangeData(e, 'aboutMe')}
					/>
				</div>
				<div className="profileRow">
					<p className="field fav-movies">Favorite movies:</p>
					<div className="content">
						<div className="favourite">
							{favoriteMovies.map(item => {
								return (
									item && (
										<NavLink key={item.id} to={'/movies/' + item.id}>
											<p>
												{item.name}
												<span className="release-date">
													{item.release_date
														? ' (' + item.release_date.slice(0, 4) + ')'
														: null}
												</span>
												<button
													className="delete-movie"
													onClick={e => this.onDeleteFavoriteMovie(e, item.id)}
												>
													<FontAwesomeIcon
														className="icon"
														icon={faTimesCircle}
													/>
												</button>
											</p>
										</NavLink>
									)
								);
							})}
						</div>
						<div style={{ width: '100%', marginTop: '15px', display: 'block' }}>
							<MovieSearch
								onSelectMovie={movie => this.onAddFavoriteMovie(movie)}
								elasticProperties={['id', 'title', 'release_date']}
							/>
						</div>
					</div>
				</div>
				<div className="profileRow">
					<div className="field" />
					<div className="content profile-buttons">
						<button className="btn cancel-btn" onClick={this.onEditCancel}>
							Cancel
						</button>
						<button className="btn save-btn" onClick={this.onEditSave}>
							Save
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileEditor;
