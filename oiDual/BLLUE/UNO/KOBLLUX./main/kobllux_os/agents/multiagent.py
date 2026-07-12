

class Agent:


    def __init__(self,name,role):

        self.name=name

        self.role=role



    def execute(self,task):

        return {

            "agent":self.name,

            "role":self.role,

            "task":task

        }



class MultiAgentSystem:


    def __init__(self):

        self.agents=[

            Agent(
                "ATLAS",
                "Planejamento"
            ),

            Agent(
                "NOVA",
                "Criacao"
            ),

            Agent(
                "VITALIS",
                "Otimizacao"
            ),

            Agent(
                "PULSE",
                "Expressao"
            )

        ]



    def route(self,task):


        return [

            agent.execute(task)

            for agent in self.agents

        ]



