

import json
import os



class VectorMemory:


    def __init__(self):

        self.path=

        "database/vector_store/memory.json"



    def save(self,data):


        os.makedirs(

            "database/vector_store",

            exist_ok=True

        )


        memory=[]


        if os.path.exists(self.path):

            with open(self.path) as f:

                memory=json.load(f)



        memory.append(data)


        with open(

            self.path,

            "w"

        ) as f:

            json.dump(

                memory,

                f,

                indent=2

            )



    def search(self):


        if not os.path.exists(self.path):

            return []


        with open(self.path) as f:

            return json.load(f)



