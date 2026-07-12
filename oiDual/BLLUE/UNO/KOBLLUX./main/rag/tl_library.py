

import os



class TLLibrary:


    def __init__(self):

        self.root="./"



    def scan(self):


        files=[]


        for root,dirs,names in os.walk(
            self.root
        ):

            for file in names:

                if file.endswith(
                    (
                    ".md",
                    ".json",
                    ".txt"
                    )
                ):

                    files.append(

                        os.path.join(
                            root,
                            file
                        )

                    )


        return files



