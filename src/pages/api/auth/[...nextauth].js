import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
// import GitHubProvider from 'next-auth/providers/github';

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: "102076741157-16dpomif1h5n06kppu3jqihqk2o47r89.apps.googleusercontent.com",
			clientSecret: "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",
		}),
		// GitHubProvider({
		// 	clientId: process.env.GITHUB_CLIENT_ID,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET,
		// }),
	],
	secret: process.env.SECRET,
});
