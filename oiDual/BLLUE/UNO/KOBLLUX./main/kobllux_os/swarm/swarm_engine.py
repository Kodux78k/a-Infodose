

class AgentSwarm:


    def __init__(self):

        self.nodes=[]



    def add_agent(self,name,role):


        self.nodes.append({

        "name":name,

        "role":role

        })



    def collective_reasoning(self,input):


        return {

        "input":

        input,

        "swarm":

        self.nodes,

        "mode":

        "distributed"

        }



