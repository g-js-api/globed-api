# globed-api
An API for abstracting away Globed live trigger logic using G.js

# Details
The API exports an Object as default named `globed`, and under `globed` are these methods:
- `setPlayers(x)`: sets the maximum amount of players in a level
- `counter(x)`: creates a wrapper around Globed item IDs based on G.js's `counter` feature (.add, .subtract, .divide, .multiply, .set, .to_const, etc, you can also use .waitForInit in order to wait for the counter to be initialized globally)
- `.createEvent(groupID)`: creates a global event, so when `.call` is ran on this event, it will trigger for all players
- `.exclusiveEvent([...excludedIDs], groupID)`: global events that exclude specific players from receiving the event
- `.inclusiveEvent([...excludedIDs], groupID)`: global events that only include specific players
- `.onPlayerJoin(() => {})`: executes a callback when a player joins
- `.onPlayerLeave(() => {})`: executes a callback when a player leaves
- `.createPlayer((playerID) => {})`: defines a trigger system to copy for each player (e.g. you can use this to make a global hitbox system, where each object is copied for each unique player)
