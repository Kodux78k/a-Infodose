

class DigitalTwin:


    def __init__(self):

        self.profile={

        "memory":[],

        "preferences":{},

        "state":"initialized"

        }



    def update(self,data):

        self.profile["memory"].append(data)

        self.profile["state"]="evolving"



    def snapshot(self):

        return self.profile



twin=DigitalTwin()


