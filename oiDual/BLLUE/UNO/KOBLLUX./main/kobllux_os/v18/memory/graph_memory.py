

class MemoryNode:


    def __init__(self,id,data):

        self.id=id

        self.data=data

        self.links=[]



    def connect(self,node):

        self.links.append(node)



class ConsciousMemoryGraph:


    def __init__(self):

        self.nodes={}



    def add(self,id,data):

        self.nodes[id]=MemoryNode(
            id,
            data
        )



    def link(self,a,b):

        self.nodes[a].connect(
            self.nodes[b]
        )



    def recall(self,id):

        return self.nodes[id].data



