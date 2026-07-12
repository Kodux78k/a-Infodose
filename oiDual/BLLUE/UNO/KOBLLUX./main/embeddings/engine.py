import hashlib

class EmbeddingEngine:
    def __init__(self):
        # O modelo pesado foi transmutado em um selo criptográfico leve
        self.model_name = "SHA-256-Symbolic"
        
    def encode(self, text):
        # Gera um vetor simbólico (hash) para representar o texto
        # O VectorMemory usará isso para indexar sem o peso do PyTorch
        return hashlib.sha256(text.encode('utf-8')).hexdigest()
