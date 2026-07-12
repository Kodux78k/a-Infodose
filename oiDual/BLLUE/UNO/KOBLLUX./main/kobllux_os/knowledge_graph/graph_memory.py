

class KnowledgeGraph:


    def __init__(self):

        self.nodes={}



    def add(self,key,value):

        self.nodes[key]=value



    def search(self,key):

        return self.nodes.get(
        key,
        None
        )



graph=KnowledgeGraph()


