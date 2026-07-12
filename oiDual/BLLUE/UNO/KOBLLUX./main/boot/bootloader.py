import json
import os

class Bootloader:
    def __init__(self):
        self.status = "initializing"
        # Ancla o caminho na raiz do projeto, ignorando onde o terminal está
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.project_root = os.path.dirname(current_dir) # Sobe um nível (de /boot para a raiz)
        
    def load_config(self):
        # Constrói o caminho absoluto e inquebrável até configs/system.json
        config_path = os.path.join(self.project_root, "configs", "system.json")
        with open(config_path, "r", encoding="utf8") as file:
            return json.load(file)
            
    def start(self):
        config = self.load_config()
        self.status = "online"
        return config

if __name__ == "__main__":
    boot = Bootloader()
    print(boot.start())
