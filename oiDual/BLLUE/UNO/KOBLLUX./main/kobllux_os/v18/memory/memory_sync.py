

import json



class MemorySync:


    def save(self,data,path):

        with open(
            path,
            "w"
        ) as f:

            json.dump(
                data,
                f,
                indent=4
            )



    def load(self,path):

        with open(path) as f:

            return json.load(f)



