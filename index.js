import '@g-js-api/g.js';

await $.exportConfig({
    type: "live_editor",
    options: { info: true }
});

let newestID = 90000;
let globed = {
    maxPlayers: 0,
    setPlayers: (v) => {
        globed.maxPlayers = v;
        return globed;
    },
    currentPlayer: counter(0),
    counter: (v) => {
        let c = counter(newestID++, true);
        if (v) c.set(v);
        // impl of `globed.counter().waitForInit()`
        c.waitForInit = () => {
            let tempCount = counter();
            let tempGroup;
            let fl = frame_loop(trigger_function(() => {
                c.if_is(LARGER_THAN, 0, trigger_function(() => {
                    compare(tempCount, NOT_EQ, c, undefined, trigger_function(() => {
                        tempGroup = $.trigger_fn_context();
                    }));
                    tempCount.set(c);
                }))
            }));

            Context.set(tempGroup);
            fl.stop();
            return c;
        };

        return c;
    },
    createEvent: (trigger_fn) => {
        let evCounter = globed.counter();
        on(count(evCounter.item, 1), trigger_fn);
        return trigger_function(() => {
            evCounter.set(1); // temporarily sets event counter to 1, representing event fire
            wait(0.05);
            evCounter.set(0);
        });
    },
    exclusiveEvent: (excludedPlayers, trigger_fn) => {
        let evCounter = globed.counter();
        on(count(evCounter.item, 1), trigger_function(() => {
            excludedPlayers.forEach((playerID) => {
                compare(globed.currentPlayer, NOT_EQ, playerID, trigger_fn);
            });
        }));
        return trigger_function(() => {
            evCounter.set(1); // temporarily sets event counter to 1, representing event fire
            wait(0.05);
            evCounter.set(0);
        });
    },
    // event type where only some players are included
    inclusiveEvent: (includedPlayers, trigger_fn) => {
        let evCounter = globed.counter();
        on(count(evCounter.item, 1), trigger_function(() => {
            includedPlayers.forEach((playerID) => {
                compare(globed.currentPlayer, EQ, playerID, trigger_fn);
            });
        }));
        return trigger_function(() => {
            evCounter.set(1); // temporarily sets event counter to 1, representing event fire
            wait(0.05);
            evCounter.set(0);
        });
    },
    onPlayerJoin: (cb) => {
        let tempCount = counter();
        frame_loop(trigger_function(() => {
            compare(tempCount, EQ, counter(80001, true), undefined, trigger_function(() => {
                cb();
            }));
            tempCount.set(counter(80001, true));
        }));
    },
    onPlayerLeave: (cb) => {
        let tempCount = counter();
        frame_loop(trigger_function(() => {
            compare(tempCount, EQ, counter(80002, true), undefined, trigger_function(() => {
                cb();
            }));
            tempCount.set(counter(80002, true));
        }));
    }, // impl later
    createPlayer: (fn) => {
        // player system (adds 1 to player count on join, more sophisticated sys will be implemented later)
        let playerCount = globed.counter();
        playerCount.add(1); // adds 1 on player join
        playerCount.display(45, 45);

        playerCount.waitForInit(); // replacing this with `wait(0.5)` makes it actually pulse the BG, albeit delayed
        globed.currentPlayer.set(playerCount);

        // item IDs for callback
        let [accountID, latestJoin, latestLeave] = [counter(80000, true), counter(80001, true), counter(80002, true)];

        // checks what player you are then does callback with the actual player ID
        for (let i = 0; i < globed.maxPlayers; i++) {
            compare(playerCount, EQ, i + 1, trigger_function(() => {
                fn(i + 1, accountID, latestJoin, latestLeave)
            }))
        };
    }
}

export default globed;