

import uuid
from datetime import datetime



class NeuralGraph:


    def __init__(self):

        self.entities=[]

        self.connections=[]



    def create_node(
        self,
        data,
        category="memory"
    ):


        node={

        "id":

        str(uuid.uuid4()),


        "data":

        data,


        "category":

        category,


        "time":

        str(datetime.now())


        }


        self.entities.append(node)


        return node



    def connect(
        self,
        source,
        target,
        weight=1
    ):


        self.connections.append({

        "source":source,

        "target":target,

        "weight":weight

        })



    def map(self):


        return {

        "nodes":self.entities,

        "edges":self.connections

        }



