

class Agent:


    def __init__(self,name,role):

        self.name=name

        self.role=role

        self.energy=1



    def process(self,data):

        return {

        "agent":self.name,

        "role":self.role,

        "input":data

        }



class AgentSwarm:


    def __init__(self):

        self.agents=[]



    def add(self,agent):

        self.agents.append(agent)



    def organize(self):

        return sorted(

            self.agents,

            key=lambda x:x.energy,

            reverse=True

        )



