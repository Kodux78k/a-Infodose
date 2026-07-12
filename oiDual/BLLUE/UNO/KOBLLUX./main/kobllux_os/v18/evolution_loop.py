

import time



class EvolutionLoop:


    def __init__(self):

        self.cycle=0



    def run(self):

        while True:

            self.cycle+=1


            print(

            "Evolution cycle",

            self.cycle

            )


            time.sleep(10)



