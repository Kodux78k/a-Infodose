

from kobllux_os.rag.rag_engine import rag

from kobllux_os.agents.agent_network import network

from kobllux_os.creation_engine.creator import creator



class Orchestrator:


    def process(self,input):


        context=

        rag.retrieve_before_generate(
        input
        )


        agents=

        network.broadcast(
        context
        )


        artifact=

        creator.create(
        agents
        )


        return artifact



orchestrator=Orchestrator()


