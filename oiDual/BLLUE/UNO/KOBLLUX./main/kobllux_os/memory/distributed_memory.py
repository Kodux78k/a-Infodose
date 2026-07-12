

import json
import os


class DistributedMemory:


    def __init__(self,path="memory/distributed/state.json"):

        self.path=path

        self.data=[]



    def store(self,event):


        self.data.append(event)

        self.save()



    def save(self):


        os.makedirs(

        os.path.dirname(self.path),

        exist_ok=True

        )


        with open(

        self.path,

        "w",

        encoding="utf8"

        ) as f:


            json.dump(

            self.data,

            f,

            indent=2,

            ensure_ascii=False

            )



    def recall(self):

        return self.data



