

class Agent:


    def __init__(
        self,
        name,
        role
    ):

        self.name=name

        self.role=role



    def process(
        self,
        context
    ):


        return {

            "agent":
            self.name,

            "role":
            self.role,

            "context":
            context

        }




class MultiAgent:


    def __init__(self):


        self.agents=[


            Agent(
                "Atlas",
                "Planejamento"
            ),


            Agent(
                "Nova",
                "Criatividade"
            ),


            Agent(
                "Vitalis",
                "Energia"
            ),


            Agent(
                "Pulse",
                "Expressão"
            ),


            Agent(
                "Aion",
                "Transformação"
            )

        ]



    def execute(
        self,
        context
    ):


        return [

            agent.process(context)

            for agent in self.agents

        ]



