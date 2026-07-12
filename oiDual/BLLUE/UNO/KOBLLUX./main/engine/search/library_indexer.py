

import os
import json



class LibraryIndexer:


    def __init__(self,path="tl_library"):

        self.path=path
        self.index=[]



    def scan(self):

        for root,dirs,files in os.walk(self.path):

            for file in files:

                self.index.append({

                "file":file,

                "path":
                os.path.join(root,file)

                })


        return self.index



    def save(self):

        with open(
        "tl_library/index/library.json",
        "w",
        encoding="utf8"
        ) as f:

            json.dump(
            self.index,
            f,
            indent=2,
            ensure_ascii=False
            )



if __name__=="__main__":

    i=LibraryIndexer()

    i.scan()

    i.save()

    print(
    "TL_LIBRARY INDEXADA"
    )


