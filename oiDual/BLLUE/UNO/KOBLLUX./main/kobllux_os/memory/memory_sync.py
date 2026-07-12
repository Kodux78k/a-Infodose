

from graph_memory import GraphMemory



class MemorySync:


    def __init__(self):

        self.memory=GraphMemory()



    def remember(self,data):

        return self.memory.add_memory(
            data
        )



    def snapshot(self):

        return self.memory.export()



