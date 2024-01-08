import type { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from './spotify'

/**
 * This function is used to refresh the access token of the Spotify API.
 *
 * @param {JWT} token - The JWT object that contains the current access and refresh tokens.
 *
 * @returns {Promise<Object>} Returns a promise that resolves to an object. If the access token is successfully refreshed,
 * the object contains the new access token, the time when the new token expires, and the new refresh token (if provided by Spotify API).
 * If the refresh token is not provided by Spotify API, the old refresh token is used. If the access token cannot be refreshed,
 * the object contains the old token and an error message.
 *
 * @throws Will throw an error if the Spotify API client is not set up correctly.
 */
export const refreshAccessToken = async (token: JWT) => {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      expiresIn: Date.now() + refreshedToken.expires_in * 1000,
      refreshedToken: refreshedToken.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    return {
      ...token,
      error: 'Failed to refresh access token',
    }
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || ''
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || ''

//
export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
  ],

  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        }
      }

      if (typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token
      }

      return await refreshAccessToken(token)
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.username = token.username as string

      return session
    },
  },
}
