

from agents.multiagent import MultiAgentSystem
from rag.rag_engine import RAGEngine
from learning.self_learning import SelfLearningLoop
from vector.embedding_engine import EmbeddingEngine



class IntelligenceCore:


    def __init__(self):

        self.agents=

        MultiAgentSystem()


        self.rag=

        RAGEngine()


        self.learning=

        SelfLearningLoop()


        self.embedding=

        EmbeddingEngine()



    def process(self,message):


        context=

        self.rag.augment(message)


        agents=

        self.agents.route(message)



        memory=

        {

        "embedding":

        self.embedding.encode(message),

        "context":

        context,

        "agents":

        agents

        }


        self.learning.learn(

            message,

            memory

        )


        return memory



