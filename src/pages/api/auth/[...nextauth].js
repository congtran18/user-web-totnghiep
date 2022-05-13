import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
// import GitHubProvider from 'next-auth/providers/github';
import { toast } from "react-toastify";
import axios from 'axios';
import Cookies from 'js-cookie'
import CredentialsProvider from "next-auth/providers/credentials"

function fixedEncodeURI(str) {
	return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID,
			clientSecret: process.env.FACEBOOK_SECRET
		}),
	],
	callbacks: {
		// async jwt({ token, account, user }) {
		// 	// Persist the OAuth access_token to the token right after signin
		// 	if (account) {
		// 		token.accessToken = account.access_token
		// 	}
		// 	return token
		// },
		session: async ({ session, token, user }) => {
			// Send properties to the client, like an access_token from a provider.

			if (!session.accessToken) {
				const getToken = await axios.get(fixedEncodeURI(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-email/email?email=${session.user.email}&name=${session.user.name}`))
				session.role = getToken.data.role
				session.accessToken = getToken.data.accessToken
			}
			return Promise.resolve(session)
		}
	},
	// events: {
	// 	signIn: async (message) => {
	// 		const getToken = await axios.get(fixedEncodeURI(`${process.env.NEXT_PUBLIC_DB_URL}/users/check-email/email?email=${message.user.email}&name=${message.user.name}`))
	// 		message.account.role = getToken.data.role
	// 		message.account.access_token = getToken.data.accessToken
	// 	},
	// },
	secret: 'key',
});
