window.KODUX = {

    executar(config) {

        console.log("Δ1134", config);

        KBLX.dispatch({

            type: config.type,

            payload: config.payload,

            constants: config.constants || {},

            protocol: config.protocol || "HORUS.1134"

        });

    }

};