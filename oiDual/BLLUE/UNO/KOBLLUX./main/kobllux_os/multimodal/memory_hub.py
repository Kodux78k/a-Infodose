

class MultimodalMemory:


    def __init__(self):

        self.storage={

        "text":[],

        "audio":[],

        "image":[],

        "video":[],

        "data":[]

        }



    def store(
        self,
        modality,
        content
    ):


        if modality in self.storage:

            self.storage[modality].append(content)


        return self.storage



    def retrieve(
        self,
        modality
    ):


        return self.storage.get(
            modality,
            []
        )



