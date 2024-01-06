# Zenify V3

> Online Spotify particle visualizer using ThreeJS, Nextjs, Tailwind, TypeScript, and SpotifyAPI

### Fully ported from Next 12 -> 14 and updated to use ThreeJS

I've always loved audio visualizers, and wanted to make my own. This visualizer isn't anywhere near done, I have a lot planned for it, including tighter syncing, more visual options, a ui overhaul to make it loot less like a Spotify clone, etc.

Requires the following Environment variables:

```
NEXTAUTH_URL={full site url}
NEXT_PUBLIC_CLIENT_SECRET={public key from spotify dashbaord}
NEXT_PUBLIC_CLIENT_ID={public client id from spotify dashboard}
JWT_SECRET={hashed value to use as a jwt secret}
```

Credits for some of the code and inspirations:
[tympanus.net](https://tympanus.net/codrops/2023/12/19/creating-audio-reactive-visuals-with-dynamic-particles-in-three-js/)
[spotify-viz](https://github.com/zachwinter/spotify-viz)

TODO:

- [] Improve UI player elements
- [] Fix Refresh Token
- [] Add instructions for activating a spotify session if player takes too long to load
- [] improve image loading placeholders
- [] add buttons to hide the ui outside of the player, as well as independently hide just the center content
