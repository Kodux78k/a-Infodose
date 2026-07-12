

import json
import time



class SessionManager:


    def save(
    self,
    user,
    message,
    response
    ):


        data={

        "user":user,

        "message":message,

        "response":response,

        "timestamp":
        time.time()

        }


        with open(
        "memory/sessions/history.json",
        "a",
        encoding="utf8"
        ) as f:

            f.write(
            json.dumps(
            data,
            ensure_ascii=False
            )+"\n"
            )



