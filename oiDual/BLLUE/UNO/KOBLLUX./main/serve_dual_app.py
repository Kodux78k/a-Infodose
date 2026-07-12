import http.server
import socketserver
import os

# Ancra o servidor na pasta do Dual App
os.chdir("apps/dual_app")

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"🌀 ESPELHO DE VIDRO ERGUIDO EM: http://localhost:{PORT}")
    print("💠 O Dual App Infodose está respirando.")
    httpd.serve_forever()
