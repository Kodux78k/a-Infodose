

import json



class ContextSearch:


    def __init__(self):

        self.database=[]



    def load(self):

        try:

            with open(
            "tl_library/index/library.json",
            encoding="utf8"
            ) as f:

                self.database=json.load(f)

        except:

            self.database=[]



    def search(self,term):

        result=[]


        for item in self.database:

            if term.lower() in item["file"].lower():

                result.append(item)


        return result



if __name__=="__main__":

    search=ContextSearch()

    search.load()

    print(
    search.search("README")
    )


