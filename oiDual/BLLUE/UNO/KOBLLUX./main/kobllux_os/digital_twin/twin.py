

class DigitalTwin:


    def __init__(self,name="KOBLLUX"):

        self.identity=name

        self.state={

        "mode":"learning",

        "memory":"active",

        "evolution":0

        }



    def update(self,event):


        self.state["last_event"]=event

        self.state["evolution"] += 1


        return self.state



