(function (global) {

    class Registry {

        constructor(name) {
            this.name = name;
            this.state = {};
        }

        get(key) {
            return this.state[key];
        }

        set(key, value) {

            this.state[key] = value;

            KBLX.emit("registry:update", {
                registry: this.name,
                key,
                value
            });

        }

        merge(obj) {

            Object.assign(this.state, obj);

            KBLX.emit("registry:update", {
                registry: this.name,
                data: obj
            });

        }

    }

    const KBLX = {

        version: "2.0.0",

        REG: {

            PLAYER: new Registry("PLAYER"),

            UI: new Registry("UI"),

            AUDIO: new Registry("AUDIO"),

            PLAYLISTS: new Registry("PLAYLISTS"),

            HORUS: new Registry("HORUS"),

            ARCHETYPES: new Registry("ARCHETYPES")

        },

        listeners: {},

        on(event, callback) {

            if (!this.listeners[event])
                this.listeners[event] = [];

            this.listeners[event].push(callback);

        },

        emit(event, payload) {

            (this.listeners[event] || []).forEach(fn => fn(payload));

        },

        dispatch(protocol) {

            console.log("⚡", protocol.type);

            switch (protocol.type) {

                case "PLAYER_PLAY":

                    this.REG.PLAYER.set("playing", true);

                    togglePlay();

                    break;

                case "PLAYER_PAUSE":

                    this.REG.PLAYER.set("playing", false);

                    togglePlay();

                    break;

                case "PLAYER_NEXT":

                    playNext();

                    break;

                case "PLAYER_PREV":

                    playPrev();

                    break;

                case "PLAYLIST_CREATE":

                    this.REG.PLAYLISTS.set(
                        "new",
                        protocol.payload
                    );

                    createPlaylist();

                    break;

                case "UI_MODE":

                    this.REG.UI.set(
                        "mode",
                        protocol.payload
                    );

                    updateWidgetState(protocol.payload);

                    break;

                default:

                    console.warn("Protocolo desconhecido", protocol);

            }

            this.log(protocol);

        },

        log(protocol) {

            let logs =
                this.REG.HORUS.get("logs") || [];

            logs.push({

                protocol,

                date: new Date()

            });

            this.REG.HORUS.set("logs", logs);

        }

    };

    global.KBLX = KBLX;

})(window);