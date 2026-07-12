

from vector_memory.vector_store import VectorMemory
from ai.connector import IAConnector



class KoblluxAgent:



    def __init__(self):

        self.memory=VectorMemory()

        self.ai=IAConnector()



    def execute(
        self,
        message
    ):


        self.memory.add(

            message

        )


        context={

            "query":

            message,


            "memory":

            self.memory.all()

        }



        return self.ai.generate(

            context

        )



