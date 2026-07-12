

import json


class Indexer:



    def create(
        self,
       files
    ):


        with open(
            "index.json",
            "w"
        ) as f:


            json.dump(

                {

                "documents":
                files

                },

                f,

                indent=2

            )



