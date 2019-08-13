import React, { PureComponent } from 'react';
import './Survey.scss';
import SurveyMultipleAnswers from '../SurveyItems/SurveySingleAnswer/SurveySingleAnswer';
import Checkboxes from '../SurveyItems/SurveyMultipleAnswer/SurveyMultipleAnswer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SurveyShortAnswer from '../SurveyItems/SurveyShortAnswer/SurveyShortAnswer';
import SurveyLinearScale from '../SurveyItems/SurveyLinearScale/SurveyLinearScale';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import ReactTimeAgo from 'react-time-ago';
import JavascriptTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

JavascriptTimeAgo.locale(en);

interface IProps {
	surveyInfo: {
		id: string;
		created_at: Date;
		title: string;
		type: string;
		description: string;
		user_id: string;
		user: {
			name: string;
			image_link: string;
		};
		participants: number;
		questions: Array<{
			id: string;
			survey_id: string;
			title: string;
			firstLabel?: string;
			lastLabel?: string;
			type: string;
			image_link?: string;
			required: boolean;
			options?: Array<{
				id: string;
				question_id: string;
				value: string;
			}>;
			answers: Array<{
				id: string;
				question_id: string;
				option_id?: string;
				user_id: string;
				value: string;
			}>;
		}>;
	};
}

interface IState {
	answers: Array<{
		questionId: string;
		options: Array<{
			id: string;
		}>;
	}>;
	isShown: boolean;
}

class Survey extends PureComponent<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			answers: props.surveyInfo.questions.map(question => ({
				questionId: question.id,
				options: []
			})),
			isShown: false
		};
	}

	setSingleAnswer = answerInfo => {
		const { questionId, optionId } = answerInfo;
		const newAnswers = this.state.answers.map(answer => {
			if (answer.questionId === questionId) {
				answer.options = [{ id: optionId }];
			}
			return answer;
		});

		this.setState({
			answers: newAnswers
		});
	};

	setMultipleAnswer = answerInfo => {
		const { questionId, optionId, value } = answerInfo;
		let answers = this.state.answers;
		if (value === true) {
			answers = answers.map(answer => {
				if (answer.questionId === questionId) {
					answer.options.push({ id: optionId });
				}
				return answer;
			});
		} else {
			answers = answers.map((answer, i) => {
				if (answer.questionId === questionId) {
					answer.options.forEach((option, i) => {
						if (optionId === option.id) {
							answer.options.splice(i, 1);
						}
					});
				}
				return answer;
			});
		}

		this.setState({
			answers
		});
	};

	sendAnswer = () => {
		this.setState({ isShown: false });
		if (this.state.answers.some(answer => answer.options.length === 0)) {
			this.setState({ isShown: true });
			return;
		}
		console.log(this.state.answers);
	};

	render() {
		const { surveyInfo } = this.props;
		const {
			user,
			created_at,
			participants,
			title,
			description,
			questions
		} = surveyInfo;
		return (
			<div className="survey">
				<div className="survey-background" />
				<form>
					<div className="form-header" />
					<div className="info">
						<img src={user.image_link} alt="" />
						<span>{user.name}</span>
						<ReactTimeAgo date={created_at} timeStyle="twitter" locale="ru" />
						<span className="participants">
							{participants} <FontAwesomeIcon icon={faUsers} />
						</span>
					</div>
					<header>
						<h1>{title}</h1>
						<p>{description}</p>
						<p className="required-label">*required</p>
					</header>
					{questions.map((question, i) => {
						if (question.type === 'Multiple choice') {
							return (
								<SurveyMultipleAnswers
									key={i}
									questionInfo={question}
									setAnswer={this.setSingleAnswer}
								/>
							);
						} else if (question.type === 'Checkboxes') {
							return (
								<Checkboxes
									key={i}
									questionInfo={question}
									setAnswer={this.setMultipleAnswer}
								/>
							);
						} else if (question.type === 'Short Answer') {
							return <SurveyShortAnswer key={i} questionInfo={question} />;
						} else return <SurveyLinearScale key={i} questionInfo={question} />;
					})}
					{/* <div className="button" >
                        {this.state.isShown && (<p>Oops, seems like you didn't answer some questions. Fix it!</p>)}
                        <button disabled type="button" onClick={this.sendAnswer}>Send</button>
                    </div> */}
				</form>
			</div>
		);
	}
}

export default Survey;
