import React, { PureComponent } from "react";
import AddComment from "../../shared/AddComment/AddComment";
import "./Post.scss";
import { ReactComponent as SettingIcon } from '../../../assets/icons/general/settings.svg';
import { ReactComponent as LikeIcon } from '../../../assets/icons/general/likeIcon.svg';
import { ReactComponent as CommentIcon } from '../../../assets/icons/general/commentIcon.svg';
import { ReactComponent as ShareIcon } from '../../../assets/icons/general/shareIcon.svg';
import Comment from "../Comment/Comment";
import Tag from "../Tag/Tag";
import PostEditModal from "../PostEditModal/PostEditModal";
import PostContent from "../PostContent/PostContent";
import config from "../../../config";

type IPostProps = {
    post:{
		user:{
			name: string,
			avatar: string,
			any
		}
		created_At?: string,
		image_url: string,
		description?: string,
		content?: {
			image: string,
			link: string,
			description: string
		},
		comments?: {
			id: string,
			author: string,
			commentDate: string,
			commentBody: string,
			parentId?: string
		}[],
		tags?: {
			id: string,
			tagName: string
		}[]
	}
}

interface IPostState {
    isModalShown: boolean,
};

class Post extends PureComponent<IPostProps, IPostState> {
    constructor(props: IPostProps) {
        super(props);
        this.state = { 
            isModalShown: false
		};
	}
	isOwnPost() {
        return true;
    }
	toggleModal = () => {
        this.setState({ isModalShown: !this.state.isModalShown });
	}
	isModalShown() {
        return this.state.isModalShown ? 
            <PostEditModal isOwn={this.isOwnPost()} /> :
            null;
	}
	nestComments(commentList) {
		const commentMap = {};
		commentList.forEach(comment => commentMap[comment.id] = comment);
		commentList.forEach(comment => {
			if(comment.parentId != null) {
				const parent = commentMap[comment.parentId];
				if (! parent.children){
					parent.children = [];
				}
				parent.children.push(comment);
			}
		});
		return commentList.filter(comment => {
			return comment.parentId == null;
		});
	}
	nestedComments =  (this.props.post.comments) ? this.nestComments(this.props.post.comments) : this.props.post.comments;
	render () {
		const {post: {user, created_At, image_url, description, content, comments, tags}} =  this.props;
		return (
			<div className='post-item'>
				<div className='post-item-header'>
					<img className='post-item-avatar' src={user.avatar || config.DEFAULT_AVATAR} alt="author" />
					<div className='post-item-info'>
						<div className='post-item-author-name'>{user.name}</div>
						{created_At && <div className='post-item-post-time'>{created_At}</div>}
					</div>
					<button className='post-item-settings' onClick={this.toggleModal}>
						<SettingIcon />
						{this.isModalShown()}
					</button>
				</div>
				{image_url && <img className='post-item-image' src={image_url} alt="post" /> }
				{description && <div className="post-body">{description}</div>}
				{content && 
					<PostContent content={content}/>
				}
				<div className='post-item-action-buttons'>
					<button>
						<LikeIcon /></button>
					<button>
						<CommentIcon /></button>
					<button className=''>
						<ShareIcon /></button>
				</div>
				<div className='post-item-last-reaction'> 
					<img className='post-item-reaction-image' src={user.avatar || config.DEFAULT_AVATAR}
						alt="author" />
					<div className='post-item-reaction-text'>Appreciated by&nbsp;<strong>Doug Walker</strong></div>
				</div>
			
				{ tags && 
					<div>
						<div className="horizontal-stroke"></div>
						<div className="tag-items">
							{ tags.map(item =>
								<Tag tagItem={item} key={item.id} />
							)}
						</div>
					
					</div>
				}
				{ this.nestedComments && 
					<div>
					{ this.nestedComments.map(item => 
						<div style={{width: "100%"}}>
							<div className="horizontal-stroke"></div>
							<Comment commentItem={item} key={item.id} /> 
						</div>
						)
					}
					</div>
				}
				<AddComment></AddComment>
			</div>
		);
	}   
}

export default Post;