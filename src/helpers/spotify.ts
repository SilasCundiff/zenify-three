import SpotifyWebApi from 'spotify-web-api-node';


const scopes = [
    'playlist-read-private',
    'playlist-read-collaborative',
    'streaming',
    'user-follow-read',
    'user-library-read',
    'user-modify-playback-state',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-recently-played',
].join(',');

const params = {
    scope: scopes,

};

const queryStringParamString = new URLSearchParams(params);

export const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryStringParamString}`;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;