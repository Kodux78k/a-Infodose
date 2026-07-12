

class AgentEconomy:


    def __init__(self):

        self.resources={}



    def reward(self,agent,value):


        self.resources[agent]=\

        self.resources.get(agent,0)+value



    def ranking(self):


        return sorted(

        self.resources.items(),

        key=lambda x:x[1],

        reverse=True

        )


