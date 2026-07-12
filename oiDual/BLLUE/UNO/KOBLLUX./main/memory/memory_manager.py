

import json



class MemoryManager:


    def __init__(self):

        self.file="memory.json"



    def save(self,data):

        with open(
        self.file,
        "w",
        encoding="utf8"
        ) as f:

            json.dump(
            data,
            f,
            indent=2,
            ensure_ascii=False
            )



