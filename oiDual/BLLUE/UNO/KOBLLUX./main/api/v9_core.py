

from rag.retriever import RAGRetriever

from agents.multi_agent import MultiAgent

from render_engine.engine import RenderEngine



class KoblluxV9:


    def __init__(self):

        self.rag=RAGRetriever()

        self.agents=MultiAgent()

        self.render=RenderEngine()



    def run(
        self,
        question
    ):


        context=self.rag.retrieve(

            question

        )


        agents=self.agents.execute(

            context

        )


        return self.render.render(

            agents

        )



