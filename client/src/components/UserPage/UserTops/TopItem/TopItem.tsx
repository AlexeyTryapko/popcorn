import React, { useState, useEffect } from 'react';
import './TopItem.scss';
import { ReactComponent as CloseIcon } from '../../../../assets/icons/general/closeIcon.svg';
import TopConstructor from './TopConstructor/TopConstructor';
import { ITopItem } from '../UserTops.service';
import TopListItem from '../../../TopListPage/TopListItem';
import Moment from 'react-moment';

interface ITopItemProps {
	topItem: ITopItem;
	isOwnData: boolean;
	deleteTop: (topItem: ITopItem) => void;
	saveUserTop: (topItem: ITopItem) => void;
	uploadImage: (data: any, titleId: string) => void;
	uploadUrl: string;
	urlForTop: string;
	history?: {
		push: (path: string) => any;
	};
}

const TopItem: React.FC<ITopItemProps> = ({
	saveUserTop,
	topItem,
	isOwnData,
	deleteTop,
	uploadImage,
	uploadUrl,
	urlForTop
}) => {
	const [editTop, canEditTop] = useState(topItem.isNewTop || false);
	const [title, setTitle] = useState(topItem.title);
	const [topImageUrl, setTopImageUrl] = useState(topItem.topImageUrl);
	useEffect(() => {
		if (urlForTop === topItem.id) {
			setTopImageUrl(uploadUrl);
		}
	}, [topItem.id, uploadUrl, urlForTop]);

	function toogleEdit() {
		canEditTop(!editTop);
	}

	function saveTop(movies: any[]) {
		const movieInTop = movies.filter(movie => movie.movie.title.trim() !== '');
		if (title.trim() === '') {
			setTitle('New top');
		}
		saveUserTop({ ...topItem, movieInTop, title, topImageUrl });
		canEditTop(false);
	}

	function handleUploadFile(e, topId: string) {
		const data = new FormData();
		data.append('file', e.target.files[0]);
		if (uploadImage) {
			uploadImage(data, topId);
		} else {
			console.log('no uploadImage method');
		}
	}

	return (
		<div>
			<div
				className="top-item"
				style={editTop ? { gridTemplateRows: '60px 1fr' } : undefined}
			>
				{editTop || topItem.movieInTop.length === 0 ? (
					<input
						maxLength={140}
						placeholder="Top name"
						className="top-title-input"
						onChange={e => setTitle(e.target.value)}
						value={title}
					/>
				) : (
					<div>
						<TopListItem
							top={{ ...topItem, created_at: undefined, user: undefined }}
						/>
					</div>
				)}
				<input
					name="image"
					type="file"
					onChange={e => handleUploadFile(e, topItem.id)}
					id={`${topItem.id}image`}
					accept=".jpg, .jpeg, .png"
					hidden={true}
				/>
				{editTop && (
					<label
						htmlFor={`${topItem.id}image`}
						className="top-upload-image hover"
					>
						Upload Image
					</label>
				)}
				{!editTop && isOwnData && (
					<div
						className="edit-top hover"
						onClick={toogleEdit}
						style={editTop ? { alignSelf: 'center' } : undefined}
					>
						Edit
					</div>
				)}
				{!editTop && isOwnData && (
					<div className="last">
						{
							<Moment
								format="ll"
								local
								className="created-at"
								style={editTop ? { display: 'none' } : undefined}
							>
								{String(topItem.created_at)}
							</Moment>
						}
						<div
							className="delete-top hover"
							style={editTop ? { marginTop: '10px' } : undefined}
							onClick={() => deleteTop(topItem)}
						>
							<CloseIcon className="close-icon" />
						</div>
					</div>
				)}
				{editTop && <img className="image-top" src={topImageUrl} alt="" />}
			</div>
			{(editTop || topItem.movieInTop.length === 0) && (
				<TopConstructor
					moviesList={topItem.movieInTop}
					saveTop={saveTop}
					closeTopEditor={toogleEdit}
				/>
			)}
		</div>
	);
};

export default TopItem;
