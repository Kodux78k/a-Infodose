

class VectorMemory:


    def __init__(self):

        self.memory=[]



    def store(self,text):

        self.memory.append(text)



    def retrieve(self,query):

        results=[]

        for item in self.memory:

            if query.lower() in item.lower():

                results.append(item)

        return results



memory=VectorMemory()


