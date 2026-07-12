

import time



class EvolutionLoop:


    def __init__(
        self,
        intelligence
    ):

        self.intelligence=intelligence

        self.active=False



    def start(self):


        self.active=True


        while self.active:


            self.intelligence.process(

            "AUTO EVOLUTION CYCLE"

            )


            time.sleep(30)



