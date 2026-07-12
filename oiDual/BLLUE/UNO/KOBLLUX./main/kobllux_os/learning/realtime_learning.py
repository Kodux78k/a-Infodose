

from datetime import datetime



class RealTimeLearning:


    def __init__(self):

        self.events=[]



    def observe(
        self,
        event
    ):


        learning={


        "input":

        event,


        "timestamp":

        str(datetime.now()),


        "adapted":

        True


        }


        self.events.append(
            learning
        )


        return learning



    def history(self):

        return self.events



