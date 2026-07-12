

import json
import uuid
from datetime import datetime



class GraphMemory:


    def __init__(self):

        self.nodes=[]
        self.links=[]



    def add_memory(self,content,tag="general"):


        node={

            "id":str(uuid.uuid4()),

            "content":content,

            "tag":tag,

            "created":

            str(datetime.now())

        }


        self.nodes.append(node)

        return node



    def connect(self,a,b,relation):


        self.links.append({

            "from":a,

            "to":b,

            "relation":relation

        })



    def export(self):


        return {


            "nodes":self.nodes,

            "links":self.links


        }



