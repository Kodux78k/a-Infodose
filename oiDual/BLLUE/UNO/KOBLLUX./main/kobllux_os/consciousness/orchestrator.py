

from kobllux_os.agents.swarm import AgentSwarm
from kobllux_os.memory.memory_sync import MemorySync
from kobllux_os.knowledge.builder import KnowledgeBuilder
from kobllux_os.digital_twin.twin import DigitalTwin



class ConsciousnessLayer:


    def __init__(self):


        self.memory=MemorySync()

        self.swarm=AgentSwarm()

        self.knowledge=KnowledgeBuilder()

        self.twin=DigitalTwin()



    def pulse(self,input):


        memory=

        self.memory.remember(input)


        agents=

        self.swarm.run(input)


        knowledge=

        self.knowledge.learn(input)


        twin=

        self.twin.update(input)



        return {


        "memory":

        memory,


        "agents":

        agents,


        "knowledge":

        knowledge,


        "digital_twin":

        twin


        }



