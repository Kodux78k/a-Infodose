

class Agent:


    def __init__(self,name,role):

        self.name=name

        self.role=role



    def execute(self,input):

        return {

        "agent":self.name,

        "role":self.role,

        "result":

        f"{self.role} processando {input}"

        }



class AgentSwarm:


    def __init__(self):


        self.agents=[

            Agent(
            "Atlas",
            "Planner"
            ),

            Agent(
            "Nova",
            "Creator"
            ),

            Agent(
            "Pulse",
            "Emotion"
            ),

            Agent(
            "Vitalis",
            "Optimization"
            )

        ]



    def run(self,input):


        return [

        agent.execute(input)

        for agent in self.agents

        ]



