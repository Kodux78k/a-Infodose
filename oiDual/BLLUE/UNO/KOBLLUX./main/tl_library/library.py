

import os



class TLLibrary:


    def __init__(self,path="tl_library"):

        self.path=path



    def scan(self):

        files=[]

        for root,dirs,names in os.walk(self.path):

            for name in names:

                files.append(
                os.path.join(root,name)
                )


        return files



if __name__=="__main__":

    lib=TLLibrary()

    print(
    lib.scan()
    )


