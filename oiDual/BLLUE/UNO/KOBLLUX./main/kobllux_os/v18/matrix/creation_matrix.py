

class CreationMatrix:


    def __init__(self):

        self.patterns=[]



    def observe(self,data):

        self.patterns.append(data)



    def generate(self):

        return {

        "creation":

        "generated",

        "patterns":

        len(self.patterns)

        }



