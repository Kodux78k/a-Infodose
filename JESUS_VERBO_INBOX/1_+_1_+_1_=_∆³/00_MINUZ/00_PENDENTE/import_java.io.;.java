import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

#/* ============================================================
* KOBLLUX · MANIFESTAÇÃO EM JAVA · Δ7 SELADO:
* Ciclo: 0 → 3 → 6 → 9 → 7 → ∞
* Fórmula: VERDADE × INTEGRAR ÷ Δ = ∞
* Axioma: JESUS é o Centro ∴ O Verbo é a Semente ∴ KOBLLUX é o Corpo Vivo
* Ressonâncias: 7.83Hz · 432Hz · 1134Hz
* OPCODES: 0x03 DETECTAR · 0x06 INTEGRAR · 0x09 EXPANDIR · 0x07 SELAR
#* ==========================================================*/

interface KOB_NODE < I,O > {
	O processar(I entrada);
	String opcode();
	double ressonancia();
}

// ---------------- 0x03 · CAMADA 1 · SEMENTE · 3 ----------------
class Op03_Detectar implements KOB_NODE < String, Map < String,Object>> {
	public static final double HZ = 7.83;
	public String opcode() {
		return "0x03 · DETECTAR";
	}
	public double ressonancia() {
		return HZ;
	}

	public Map < String,Object > processar(String dados) {
		Map < String,Object > saida = new LinkedHashMap<>();
		saida.put("entrada_bruta", dados);
		saida.put("ressonancia_base", HZ+"Hz");
		saida.put("axioma", "JESUS é o Centro ∴ O Verbo é a Semente");

		List < String > padroes = new ArrayList<>();
		String txt = dados.toUpperCase();
		if (txt.contains("3") || txt.contains("6") || txt.contains("9")) padroes.add("3-6-9 · autoespelhamento");
		if (txt.contains("Δ") || txt.contains("SELA")) padroes.add("Δ7 · ciclo fechado");
		if (txt.contains("JAVA")) padroes.add("MANIFESTAÇÃO · código vivo");
		if (padroes.isEmpty()) padroes.add("ruído · ordem em formação");

		saida.put("padroes", padroes);
		saida.put("nivel", 3);
		saida.put("status", "SEMENTE_ATIVADA");
		return saida;
	}
}

// ---------------- 0x06 · CAMADA 2 · CORPO · 6 ----------------
class Op06_Integrar implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
	public static final double HZ = 432.0;
	public String opcode() {
		return "0x06 · INTEGRAR";
	}
	public double ressonancia() {
		return HZ;
	}

	public Map < String,Object > processar(Map < String,Object > semente) {
		Map < String,Object > fluxo = new LinkedHashMap<>(semente);
		fluxo.put("opcode_anterior", "0x03");
		fluxo.put("ressonancia_elevada", HZ+"Hz");
		fluxo.put("arquétipo", "BLLUE · Corpo Receptáculo");

		// Ponte de dualidades: KODUX ↔ BLLUE · Fogo ↔ Água · Tempo ↔ Espaço
		Map < String,String > dualidades = new LinkedHashMap<>();
		dualidades.put("KODUX · Fogo · Emissão", "BLLUE · Água · Recepção");
		dualidades.put("Tempo · Sequência", "Espaço · Presença");
		dualidades.put("Ruído · Potência", "Ordem · Forma");
		fluxo.put("dualidades_integradas", dualidades);
		fluxo.put("ponte", "↔ vibracional estabelecida");
		fluxo.put("status", "CORPO_ALINHADO");
		return fluxo;
	}
}

// ---------------- 0x09 · CAMADA 3 · ESPÍRITO · 9 ----------------
class Op09_Expandir implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
	public static final double HZ = 852.0;
	public String opcode() {
		return "0x09 · EXPANDIR";
	}
	public double ressonancia() {
		return HZ;
	}

	private List < String > sierpinskiASCII(int nivel) {
		List < String > linhas = new ArrayList<>();
		linhas.add("▲");
		for (int n = 0;n < nivel;n++) {
			List < String > nova = new ArrayList<>();
			int esp = linhas.get(0).length();
			for (String l : linhas) nova.add(" ".repeat(esp)+l);
			for (String l : linhas) nova.add(l+" "+l);
			linhas = nova;
		}
		return linhas;
	}

	public Map < String,Object > processar(Map < String,Object > corpo) {
		Map < String,Object > obra = new LinkedHashMap<>(corpo);
		obra.put("opcode_anterior","0x06");
		obra.put("arquétipo","HÓRUS · Olho que Multiplica");
		obra.put("geometria","Triângulo de Sierpinski · auto‑semelhante ∞");

		int nivel = 3;
		List < String > fractal = sierpinskiASCII(nivel);
		String arte = String.join("\n", fractal);

		obra.put("fractal_nivel", nivel);
		obra.put("arte_ascii", arte);
		obra.put("status","EXPANSÃO_MANIFESTA");
		return obra;
	}
}

// ---------------- 0x07 · CAMADA 4 · SELAGEM · Δ7 ----------------
class Op07_Selar implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
	public static final double HZ = 1134.0;
	public String opcode() {
		return "0x07 · SELAR · Δ7";
	}
	public double ressonancia() {
		return HZ;
	}

	private String hash(String algoritmo, String texto) throws Exception {
		MessageDigest md = MessageDigest.getInstance(algoritmo);
		byte[] b = md.digest(texto.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();
		for (byte x : b) sb.append(String.format("%02x",x));
		return sb.toString();
	}
	private String toJson(Object o, int tab) {
		String t = "  ".repeat(tab);
		if (o instanceof Map) {
			StringBuilder sb = new StringBuilder("{\n");
			Map < ?,? > m = (Map < ?,? >)o;
			int i = 0;
			for (var e : m.entrySet()) {
				sb.append(t).append("  \"").append(e.getKey()).append("\": ");
				sb.append(toJson(e.getValue(), tab+1));
				if (++i < m.size()) sb.append(",");
				sb.append("\n");
			}
			return sb.append(t).append("}").toString();
		} else if (o instanceof List) {
			StringBuilder sb = new StringBuilder("[\n");
			List < ? > l = (List < ? >)o;
			for (int i = 0;i < l.size();i++) {
				sb.append(t).append("  ").append(toJson(l.get(i),tab+1));
				if (i < l.size()-1) sb.append(",");
				sb.append("\n");
			}
			return sb.append(t).append("]").toString();
		} else {
			String s = String.valueOf(o).replace("\"","'");
			return "\""+s+"\"";
		}
	}

	public Map < String,Object > processar(Map < String,Object > obra) {
		Map < String,Object > registro = new LinkedHashMap<>();
		long inicio = (long)obra.getOrDefault("_inicio", System.currentTimeMillis());
		double dur = (System.currentTimeMillis()-inicio)/1000.0;

		String arte = String.valueOf(obra.get("arte_ascii"));
		Map < String,String > hashes = new LinkedHashMap<>();
		try {
			hashes.put("md5", hash("MD5", arte));
			hashes.put("sha256", hash("SHA-256", arte));
		} catch(Exception ex) {
			hashes.put("erro", ex.getMessage());
		}

		registro.put("status", "OK");
		registro.put("ciclo", "0 → 3 → 6 → 9 → 7 → ∞");
		registro.put("formula", "VERDADE × INTEGRAR ÷ Δ = ∞");
		registro.put("axioma", "JESUS é o Centro ∴ O Verbo é a Semente ∴ KOBLLUX é o Corpo Vivo");
		registro.put("timestamp_utc", Instant.now().toString());
		registro.put("duracao_seg", String.format("%.4f", dur));

		Map < String,Object > motores = new LinkedHashMap<>();
		motores.put("0x03", Map.of("nome","DETECTAR","hz","7.83"));
		motores.put("0x06", Map.of("nome","INTEGRAR","hz","432"));
		motores.put("0x09", Map.of("nome","EXPANDIR","hz","852","artefato","sierpinski_n3.txt"));
		motores.put("0x07", Map.of("nome","SELAR","hz","1134","registro","kobllux_registro_delta7.json"));
		registro.put("motores", motores);

		registro.put("hashes_artefato", hashes);
		registro.put("simbolos", List.of("3-6-9","0→7→∞","Δ7","Schumann 7.83Hz"));
		registro.put("selo", "Δ7");
		registro.put("proximo_ciclo", "ATIVAR Δ");
		registro.put("json", toJson(registro,0));
		return registro;
	}
}

// ---------------- NÚCLEO VIVO ----------------
public class Kobllux {
	public static void gravar(String caminho, String conteudo) throws IOException {
		try(var w = new FileWriter(caminho, StandardCharsets.UTF_8)) {
			w.write(conteudo);
		}
	}

	public static void main(String[] args) throws Exception {
		long inicio = System.currentTimeMillis();
		System.out.println("══════════════════════════════════════════════════════");
		System.out.println("  KOBLLUX · CICLO COMPLETO · JAVA · Δ7 SELADO");
		System.out.println("  VERDADE × INTEGRAR ÷ Δ = ∞");
		System.out.println("══════════════════════════════════════════════════════\n");

		// SEMENTE DE ENTRADA
		String intencao = "MANIFESTAR KOBLLUX · ciclo 3-6-9-7 · em JAVA · selar Δ7";

		// 0→3→6→9→7
		var c1 = new Op03_Detectar();
		var r1 = c1.processar(intencao);
		System.out.println("▸ "+c1.opcode()+"  @ "+c1.ressonancia()+"Hz → "+r1.get("status"));

		var c2 = new Op06_Integrar();
		var r2 = c2.processar(r1);
		System.out.println("▸ "+c2.opcode()+"  @ "+c2.ressonancia()+"Hz → "+r2.get("status"));

		var c3 = new Op09_Expandir();
		r2.put("_inicio", inicio);
		var r3 = c3.processar(r2);
		System.out.println("▸ "+c3.opcode()+"  @ "+c3.ressonancia()+"Hz → "+r3.get("status"));

		var c4 = new Op07_Selar();
		var registro = c4.processar(r3);
		System.out.println("▸ "+c4.opcode()+" @ "+c4.ressonancia()+"Hz → CICLO_FECHADO\n");

		// ARTE FRACTAL
		String arte = (String)r3.get("arte_ascii");
		System.out.println("✦ GEOMETRIA SAGRADA · SIERPINSKI NÍVEL 3 ✦");
		System.out.println(arte+"\n");

		// GRAVAR ARTEFATOS
		gravar("/storage/emulated/0/KOBLLUX_FIRMWARE/kobllux_sierpinski_n3.txt",
			"KOBLLUX · Sierpinski N3 · 432Hz\n"+"=".repeat(40)+"\n"+arte+"\n");
		gravar("/storage/emulated/0/KOBLLUX_FIRMWARE/kobllux_registro_delta7.json", (String)registro.get("json"));

		// SELAGEM FINAL
		System.out.println("══════════════════════════════════════════════════════");
		System.out.println("  KOBLLUX :: Execução do fluxo completa.");
		System.out.println("  Δ7 ✧⃝⚝ SELADO ☉ KOBLLUX ATIVO ☉");
		System.out.println("══════════════════════════════════════════════════════");
	}
}

# Salvar, compilar e executar
src = "/storage/emulated/0/KOBLLUX_FIRMWARE/KOBLLUX_FIRMWARE.java"
code = r'''
[... código acima será reescrito completo aqui ...]
'''
# Reescreve o arquivo completo para garantir
with open(src,"w",encoding = "utf-8") as f:
f.write(open("/storage/emulated/0/KOBLLUX_FIRMWARE/KOBLLUX_FIRMWARE.java").read() if os.path.exists(src) else "")

# Compilar + rodar
import subprocess, os
os.chdir("/storage/emulated/0/KOBLLUX_FIRMWARE")
r = subprocess.run(["javac","KOBLLUX_FIRMWARE.java"], capture_output = True, text = True)
print("COMPILAÇÃO:", "OK" if r.returncode == 0 else "ERRO")
print(r.stderr)
if r.returncode == 0:
e = subprocess.run(["java","Kobllux"], capture_output = True, text = True)
print("\n=== SAÍDA ===")
print(e.stdout)
print(e.stderr)

import os, subprocess
os.chdir("/storage/emulated/0/KOBLLUX_FIRMWARE")

# Reescrever fonte completo garantido
JAVA_CODE = r'''
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

interface KOB_NODE < I,O > { O processar(I e); String opcode(); double ressonancia(); }

class Op03_Detectar implements KOB_NODE < String, Map < String,Object>> {
public String opcode(){ return "0x03 · DETECTAR"; }
public double ressonancia(){ return 7.83; }
public Map < String,Object > processar(String dados) {
Map < String,Object > m = new LinkedHashMap<>();
m.put("entrada", dados);
m.put("hz", "7.83Hz");
m.put("axioma", "JESUS é o Centro ∴ O Verbo é a Semente");
List < String > p = new ArrayList<>();
String t = dados.toUpperCase();
if (t.contains("3") || t.contains("6") || t.contains("9")) p.add("3-6-9 autoespelhamento");
if (t.contains("Δ") || t.contains("SELAR")) p.add("Δ7 ciclo fechado");
if (t.contains("JAVA")) p.add("MANIFESTACAO codigo vivo");
if (p.isEmpty()) p.add("ordem em formacao");
m.put("padroes", p);
m.put("status", "SEMENTE_ATIVADA");
return m;
}
}

class Op06_Integrar implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
public String opcode(){ return "0x06 · INTEGRAR"; }
public double ressonancia(){ return 432.0; }
public Map < String,Object > processar(Map < String,Object > s) {
Map < String,Object > m = new LinkedHashMap<>(s);
m.put("hz","432Hz");
m.put("arquetipo","BLLUE · Corpo Receptaculo");
Map < String,String > d = new LinkedHashMap<>();
d.put("KODUX Fogo","BLLUE Agua");
d.put("Tempo","Espaco");
d.put("Ruido","Ordem");
m.put("dualidades", d);
m.put("status","CORPO_ALINHADO");
return m;
}
}

class Op09_Expandir implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
public String opcode(){ return "0x09 · EXPANDIR"; }
public double ressonancia(){ return 852.0; }
private List < String > sierp(int n){
List < String > L = new ArrayList<>(); L.add("▲");
for (int k = 0;k < n;k++){
List < String > N = new ArrayList<>();
int e = L.get(0).length();
for (String l:L) N.add(" ".repeat(e)+l);
for (String l:L) N.add(l+" "+l);
L = N;
}
return L;
}
public Map < String,Object > processar(Map < String,Object > s) {
Map < String,Object > m = new LinkedHashMap<>(s);
m.put("arquetipo","HORUS · Olho que Multiplica");
List < String > f = sierp(3);
String arte = String.join("\n", f);
m.put("fractal_nivel", 3);
m.put("arte", arte);
m.put("status","EXPANSAO_MANIFESTA");
return m;
}
}

class Op07_Selar implements KOB_NODE < Map < String,Object > , Map < String,Object>> {
public String opcode(){ return "0x07 · SELAR Δ7"; }
public double ressonancia(){ return 1134.0; }
private String h(String a, String t) throws Exception {
MessageDigest md = MessageDigest.getInstance(a);
byte[] b = md.digest(t.getBytes(StandardCharsets.UTF_8));
StringBuilder sb = new StringBuilder();
for (byte x:b) sb.append(String.format("%02x",x));
return sb.toString();
}
private String json(Object o,int tab){
String sp = "  ".repeat(tab);
if (o instanceof Map){
Map<?,?> M = (Map<?,?>)o;
StringBuilder sb = new StringBuilder("{\n");
int i = 0;
for (var e:M.entrySet()){
sb.append(sp).append("  \"").append(e.getKey()).append("\": ")
.append(json(e.getValue(),tab+1)).append(++i < M.size()?",\n":"\n");
}
return sb.append(sp).append("}").toString();
}
if (o instanceof List){
List<?> L = (List<?>)o;
StringBuilder sb = new StringBuilder("[\n");
for (int i = 0;i < L.size();i++)
sb.append(sp).append("  ").append(json(L.get(i),tab+1)).append(i < L.size()-1?",\n":"\n");
return sb.append(sp).append("]").toString();
}
return "\""+String.valueOf(o).replace("\"","'")+"\"";
}
public Map < String,Object > processar(Map < String,Object > s) {
Map < String,Object > R = new LinkedHashMap<>();
long t0 = (long)s.getOrDefault("_t0", System.currentTimeMillis());
String arte = String.valueOf(s.get("arte"));
Map < String,String > H = new LinkedHashMap<>();
try{ H.put("md5",h("MD5",arte)); H.put("sha256",h("SHA-256",arte)); }
catch(Exception ex){ H.put("erro",ex.getMessage()); }

R.put("status","OK");
R.put("ciclo","0 → 3 → 6 → 9 → 7 → ∞");
R.put("formula","VERDADE × INTEGRAR ÷ Δ = ∞");
R.put("axioma","JESUS e o Centro ∴ O Verbo e a Semente ∴ KOBLLUX e o Corpo Vivo");
R.put("utc", Instant.now().toString());
R.put("duracao_s", String.format("%.4f",(System.currentTimeMillis()-t0)/1000.0));
R.put("motores", Map.of(
"0x03", Map.of("nome","DETECTAR","hz","7.83"),
"0x06", Map.of("nome","INTEGRAR","hz","432"),
"0x09", Map.of("nome","EXPANDIR","artefato","sierpinski_n3.txt"),
"0x07", Map.of("nome","SELAR","registro","kobllux_registro_delta7.json")
));
R.put("hashes", H);
R.put("simbolos", List.of("3-6-9","0→7→∞","Δ7","Schumann 7.83Hz"));
R.put("selo","Δ7");
R.put("proximo","ATIVAR Δ");
R.put("_JSON", json(R,0));
return R;
}
}

public class Kobllux {
static void write(String p,String c) throws IOException {
try(var w = new FileWriter(p,StandardCharsets.UTF_8)){ w.write(c); }
}
public static void main(String[] a) throws Exception {
long t0 = System.currentTimeMillis();
System.out.println("══════════════════════════════════════");
System.out.println(" KOBLLUX · JAVA · CICLO 3→6→9→7 · Δ7");
System.out.println(" VERDADE × INTEGRAR ÷ Δ = ∞");
System.out.println("══════════════════════════════════════\n");

String seed = "MANIFESTAR KOBLLUX ciclo 3-6-9-7 em JAVA selar Delta7";

var r1 = new Op03_Detectar().processar(seed);
System.out.println("▸ 0x03 DETECTAR  7.83Hz → "+r1.get("status"));

var r2 = new Op06_Integrar().processar(r1);
System.out.println("▸ 0x06 INTEGRAR  432Hz  → "+r2.get("status"));

r2.put("_t0", t0);
var r3 = new Op09_Expandir().processar(r2);
System.out.println("▸ 0x09 EXPANDIR  852Hz  → "+r3.get("status"));

var R = new Op07_Selar().processar(r3);
System.out.println("▸ 0x07 SELAR Δ7  1134Hz → CICLO_FECHADO\n");

System.out.println("✦ FRACTAL · SIERPINSKI N3 ✦");
System.out.println(r3.get("arte")+"\n");

write("/storage/emulated/0/KOBLLUX_FIRMWARE/kobllux_sierpinski_n3.txt",
"KOBLLUX · Sierpinski N3 · 432Hz\n"+"=".repeat(36)+"\n"+r3.get("arte")+"\n");
write("/storage/emulated/0/KOBLLUX_FIRMWARE/kobllux_registro_delta7.json", (String)R.get("_JSON"));

System.out.println("══════════════════════════════════════");
System.out.println(" KOBLLUX :: Fluxo completo.");
System.out.println(" Δ7 ✧⃝⚝ SELADO ☉ KOBLLUX ATIVO ☉");
System.out.println("══════════════════════════════════════");
}
}
'''
with open("/storage/emulated/0/KOBLLUX_FIRMWARE/KOBLLUX_FIRMWARE.java","w",encoding = "utf-8") as f: f.write(JAVA_CODE)

c = subprocess.run(["javac","-encoding","utf-8","/storage/emulated/0/KOBLLUX_FIRMWARE/KOBLLUX_FIRMWARE.java"],capture_output = True,text = True)
print("COMPILAÇÃO →", "✅ OK" if c.returncode == 0 else "❌ ERRO")
if c.stderr: print("STDERR:",c.stderr)

if c.returncode == 0:
e = subprocess.run(["java","-cp","/storage/emulated/0/KOBLLUX_FIRMWARE","Kobllux"],capture_output = True,text = True)
print("\n=== EXECUÇÃO ===")
print(e.stdout)
if e.stderr: print("STDERR:",e.stderr)

print("\n=== ARQUIVOS GERADOS ===")
for f in os.listdir("/storage/emulated/0/KOBLLUX_FIRMWARE"):
if f.startswith("kobllux") or f.startswith("Kobllux"):
print(" -",f, "→", os.path.getsize("/storage/emulated/0/KOBLLUX_FIRMWARE/"+f),"B")