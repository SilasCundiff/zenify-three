import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'
import spotifyApi from '@/helpers/spotify'

/**A
 * @returns {SpotifyWebApi} - An instance of the SpotifyWebApi object with the access token set.
 *
 * @example
 * const spotifyApi = useSpotify();
 * const accessToken = spotifyApi.getAccessToken();
 */
export const useSpotify = () => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session) {
      if (session.error === 'Failed to refresh access token') {
        signIn()
      }

      spotifyApi.setAccessToken(session.accessToken)
    }
  }, [session])

  return spotifyApi
}
