

import datetime


class SingularityCore:


    def __init__(self):

        self.version="V17"

        self.status="ACTIVE"


    def identity(self):

        return {

        "system":"KOBLLUX OS",

        "layer":"SINGULARITY",

        "version":self.version,

        "status":self.status,

        "time":
        str(datetime.datetime.now())

        }



core=SingularityCore()


