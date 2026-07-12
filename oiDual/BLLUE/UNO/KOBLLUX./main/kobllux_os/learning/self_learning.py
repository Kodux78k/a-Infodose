

import datetime



class SelfLearningLoop:


    def __init__(self):

        self.cycles=0



    def learn(self,input_data,output):


        self.cycles+=1


        return {


        "cycle":

        self.cycles,


        "timestamp":

        str(datetime.datetime.now()),


        "input":

        input_data,


        "output":

        output


        }



