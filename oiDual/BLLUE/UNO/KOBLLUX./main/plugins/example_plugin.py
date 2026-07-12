

class Plugin:


    name="KOBLLUX SAMPLE"



    def run(self,data):

        return {

            "plugin":

            self.name,

            "output":

            data

        }


