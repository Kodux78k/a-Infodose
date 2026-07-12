

from datetime import datetime



class KnowledgeBuilder:


    def __init__(self):

        self.documents=[]



    def learn(self,data):


        document={


        "knowledge":

        data,


        "timestamp":

        str(datetime.now())


        }


        self.documents.append(document)


        return document



    def library(self):

        return self.documents



