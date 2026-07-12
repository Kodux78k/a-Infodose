

from core.motor369.motor_369 import Motor369
from core.retrieval.retrieval_engine import RetrievalEngine
from core.context.context_builder import ContextBuilder



class KoblluxOperator:



    def __init__(self):

        self.motor=Motor369()

        self.retrieve=RetrievalEngine()

        self.context=ContextBuilder()



    def execute(self,input):


        data=self.retrieve.retrieve(
            input
        )


        return self.context.build(
            data
        )



