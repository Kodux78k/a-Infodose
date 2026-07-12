

class Agent:


    def __init__(self,name,role):

        self.name=name

        self.role=role



    def execute(self,input):

        return {

        "agent":self.name,

        "role":self.role,

        "output":input

        }



class AgentNetwork:


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
        "Expression"
        ),

        Agent(
        "Vitalis",
        "Optimization"
        )

        ]



    def broadcast(self,data):

        return [

        a.execute(data)

        for a in self.agents

        ]



network=AgentNetwork()


