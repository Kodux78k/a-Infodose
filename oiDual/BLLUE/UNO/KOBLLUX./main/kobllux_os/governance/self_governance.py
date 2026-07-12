

class Governance:


    def __init__(self):

        self.rules=[

        "CONSISTENCY",

        "TRACEABILITY",

        "MEMORY_FIRST",

        "SAFE_OPERATION"

        ]



    def validate(self,action):

        return {


        "action":

        action,


        "approved":

        True,


        "rules":

        self.rules


        }



governance=Governance()


