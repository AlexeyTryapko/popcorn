export default interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	password: string | null;
	location: string;
	aboutMe: string;
	male: boolean;
	female: boolean;
	avatar: string;
	reset_token: string;
	emailNotificationNews?: boolean;
	emailNotificationUpdatesFromFollowed?: boolean;
	emailNotificationComments?: boolean;
	emailNotificationEvents?: boolean;
	siteNotificationUpdatesFromFollowed?: boolean;
	siteNotificationComments?: boolean;
	siteNotificationEvents?: boolean;
	privacyProfileInfo?: string;
	privacyMyPosts?: string;
	privacyStories?: string;
	privacyEvents?: string;
	privacySurveys?: string;
	privacyTops?: string;
	privacyCollections?: string;
	privacyWatchlist?: string;
	privacyReviews?: string;
	privacyMessages?: string;
}
