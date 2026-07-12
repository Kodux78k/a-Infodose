

class ContextBuilder:


    def build(
    self,
    question,
    documents
    ):


        return {

        "question":question,

        "sources":documents,

        "instruction":
        "Recuperar antes de gerar"

        }



