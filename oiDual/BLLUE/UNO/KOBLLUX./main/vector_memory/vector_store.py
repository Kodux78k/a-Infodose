

import json
import os

from embeddings.engine import EmbeddingEngine



FILE="vector_memory/store.json"



class VectorMemory:



    def __init__(self):

        self.encoder=EmbeddingEngine()


        if not os.path.exists(FILE):

            with open(FILE,"w") as f:

                json.dump([],f)



    def add(
        self,
        text
    ):


        with open(FILE) as f:

            data=json.load(f)



        data.append({

            "text":
            text,


            "vector":

            self.encoder.encode(text)

        })



        with open(FILE,"w") as f:

            json.dump(

                data,

                f

            )



    def all(self):

        with open(FILE) as f:

            return json.load(f)



