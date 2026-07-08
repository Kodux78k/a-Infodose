/**
 * ⧈ KOBLLUX_Δ³ :: CORPO/logic/crypto_vault.js
 * #rust #typescript
 * Lógica de Criptografia e Segurança (AES-GCM)
 * Δ7: Segurança e Concorrência (Rust) / Gestão de Estado (TypeScript)
 */

export const CryptoVault = {
    algo: { name: 'AES-GCM', length: 256 },
    pbkdf2: { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000 },
    
    async getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw", 
            enc.encode(password), 
            "PBKDF2", 
            false, 
            ["deriveKey"]
        );
        return window.crypto.subtle.deriveKey(
            { ...this.pbkdf2, salt: salt }, 
            keyMaterial, 
            this.algo, 
            false, 
            ["encrypt", "decrypt"]
        );
    },

    async encrypt(data, password) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(password, salt);
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv }, 
            key, 
            encoded
        );
        const bundle = { 
            s: Array.from(salt), 
            iv: Array.from(iv), 
            d: Array.from(new Uint8Array(encrypted)) 
        };
        return JSON.stringify(bundle);
    },

    async decrypt(bundleStr, password) {
        try {
            const bundle = JSON.parse(bundleStr);
            const salt = new Uint8Array(bundle.s);
            const iv = new Uint8Array(bundle.iv);
            const data = new Uint8Array(bundle.d);
            const key = await this.getKey(password, salt);
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv }, 
                key, 
                data
            );
            return JSON.parse(new TextDecoder().decode(decrypted));
        } catch(e) { 
            throw new Error("Senha incorreta ou dados corrompidos"); 
        }
    }
};
