

class EvolutionAgent:


    def __init__(
        self,
        name
    ):

        self.name=name

        self.version=1

        self.skills=[]



    def learn(
        self,
        skill
    ):


        self.skills.append(
            skill
        )


        self.version += 1



        return {

        "agent":

        self.name,


        "version":

        self.version,


        "skills":

        self.skills

        }



class EvolutionManager:


    def __init__(self):

        self.agents=[

        EvolutionAgent("Atlas"),

        EvolutionAgent("Nova"),

        EvolutionAgent("Pulse"),

        EvolutionAgent("Vitalis")

        ]



    def evolve(
        self,
        knowledge
    ):


        return [

        agent.learn(
            knowledge
        )

        for agent in self.agents

        ]



