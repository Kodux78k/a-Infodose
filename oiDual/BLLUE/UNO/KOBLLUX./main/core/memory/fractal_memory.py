

import json
import os


MEMORY_FILE="memory.json"



class FractalMemory:



    def __init__(self):

        if not os.path.exists(
            MEMORY_FILE
        ):

            with open(
                MEMORY_FILE,
                "w"
            ) as f:

                json.dump(
                    [],
                    f
                )



    def save(
        self,
        data
    ):


        with open(
            MEMORY_FILE
        ) as f:

            memory=json.load(f)



        memory.append(data)



        with open(
            MEMORY_FILE,
            "w"
        ) as f:

            json.dump(
                memory,
                f,
                indent=2,
                ensure_ascii=False
            )



    def recall(self):


        with open(
            MEMORY_FILE
        ) as f:

            return json.load(f)



