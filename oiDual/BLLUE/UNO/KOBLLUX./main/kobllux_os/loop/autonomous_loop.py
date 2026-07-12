

import time



class InfiniteLoop:


    def __init__(self):

        self.running=False



    def start(self):

        self.running=True


        while self.running:

            self.cycle()

            time.sleep(60)



    def cycle(self):

        print(

        "🌀 KOBLLUX AUTONOMOUS CYCLE"

        )



loop=InfiniteLoop()


