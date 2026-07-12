

import time



class AutonomousLoop:


    def __init__(self,system):

        self.system=system

        self.running=False



    def start(self):

        self.running=True

        while self.running:


            self.system.pulse(

            "AUTO_SYNC"

            )


            time.sleep(60)



