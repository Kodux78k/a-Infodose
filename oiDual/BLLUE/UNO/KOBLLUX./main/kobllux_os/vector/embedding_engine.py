

import hashlib



class EmbeddingEngine:


    def encode(self,text):


        vector=

        hashlib.sha256(

            text.encode()

        ).hexdigest()



        return vector



