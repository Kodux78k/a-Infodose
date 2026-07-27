import os
os.chdir("/mnt")

# Write the exact Java source
src = r'''
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;

interface KOB_NODE<I, O> {
    O processar(I entrada);
    String  opcode();
    double  ressonanciaHz();
}

class Op03_Detectar implements KOB_NODE<String, Map<String,Object>> {
    public String opcode()         { return "0x03 · DETECT"; }
    public double ressonanciaHz()  { return 7.83; }
    public Map<String,Object> processar(String bruto) {
        Map<String,Object> semente = new LinkedHashMap<>();
        semente.put("input", bruto);
        semente.put("axiom",
            "JESUS is the Center ∴ The Word is the Seed ∴ KOBLLUX is the Living Body");
        semente.put("formula", "TRUTH × INTEGRATE ÷ Δ = ∞");
        List<String> padroes = new ArrayList<>();
        String T = bruto.toUpperCase();
        if (T.contains("3")||T.contains("6")||T.contains("9"))
            padroes.add("3-6-9 quantum self‑mirror");
        if (T.contains("DELTA")||T.contains("SEAL"))
            padroes.add("Δ7 closed cycle");
        if (T.contains("JAVA"))
            padroes.add("MANIFESTATION in living code");
        if (padroes.isEmpty())
            padroes.add("order emerging from void");
        semente.put("patterns", padroes);
        semente.put("level", 3);
        semente.put("status", "SEED_ACTIVATED");
        return semente;
    }
}

class Op06_Integrar implements KOB_NODE<Map<String,Object>, Map<String,Object>> {
    public String opcode()         { return "0x06 · INTEGRATE"; }
    public double ressonanciaHz()  { return 432.0; }
    public Map<String,Object> processar(Map<String,Object> semente) {
        Map<String,Object> corpo = new LinkedHashMap<>(semente);
        corpo.put("archetype", "BLLUE · Receptive Vessel · Water");
        Map<String,String> dual = new LinkedHashMap<>();
        dual.put("KODUX · Fire · Emit",    "BLLUE · Water · Receive");
        dual.put("Time · Sequence",        "Space · Presence");
        dual.put("Noise · Potential",      "Order · Form");
        corpo.put("dualities_bridged", dual);
        corpo.put("resonance", "432 Hz carrier locked");
        corpo.put("status", "BODY_ALIGNED");
        return corpo;
    }
}

class Op09_Expandir implements KOB_NODE<Map<String,Object>, Map<String,Object>> {
    public String opcode()         { return "0x09 · EXPAND"; }
    public double ressonanciaHz()  { return 852.0; }
    private static String sp(int n){ char[]a=new char[n]; Arrays.fill(a,' '); return new String(a); }
    private List<String> sierpinski(int lvl){
        List<String> L = new ArrayList<>(); L.add("▲");
        for(int k=0;k<lvl;k++){
            List<String> N=new ArrayList<>();
            int e=L.get(0).length();
            for(String s:L) N.add(sp(e)+s);
            for(String s:L) N.add(s+sp(1)+s);
            L=N;
        }
        return L;
    }
    public Map<String,Object> processar(Map<String,Object> corpo) {
        Map<String,Object> obra = new LinkedHashMap<>(corpo);
        obra.put("archetype", "HORUS · All‑Seeing Eye · Multiplier");
        obra.put("geometry",  "Sierpinski · contains itself infinitely");
        List<String> frac = sierpinski(3);
        obra.put("fractal_level", 3);
        obra.put("ascii_art", String.join("\n", frac));
        obra.put("status", "EXPANSION_MANIFESTED");
        return obra;
    }
}

class Op07_Selar implements KOB_NODE<Map<String,Object>, Map<String,Object>> {
    public String opcode()         { return "0x07 · SEAL Δ7"; }
    public double ressonanciaHz()  { return 1134.0; }
    private static String hash(String a, String t) throws Exception {
        MessageDigest md=MessageDigest.getInstance(a);
        byte[]b=md.digest(t.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb=new StringBuilder();
        for(byte x:b) sb.append(String.format("%02x",x));
        return sb.toString();
    }
    private static String json(Object o,int t){
        String pad="  ".repeat(t);
        if(o instanceof Map){
            Map<?,?> m=(Map<?,?>)o; StringBuilder sb=new StringBuilder("{\n"); int i=0;
            for(Map.Entry<?,?> e:m.entrySet()){
                if(e.getKey().equals("_JSON_COMPLETE")) continue;
                sb.append(pad).append("  \"").append(e.getKey()).append("\": ")
                  .append(json(e.getValue(),t+1)).append(++i<m.size()?",\n":"\n");
            }
            return sb.append(pad).append("}").toString();
        }
        if(o instanceof List){
            List<?> l=(List<?>)o; StringBuilder sb=new StringBuilder("[\n");
            for(int i=0;i<l.size();i++)
                sb.append(pad).append("  ").append(json(l.get(i),t+1))
                  .append(i<l.size()-1?",\n":"\n");
            return sb.append(pad).append("]").toString();
        }
        return "\""+String.valueOf(o).replace("\"","'")+"\"";
    }
    public Map<String,Object> processar(Map<String,Object> obra) {
        Map<String,Object> reg=new LinkedHashMap<>();
        long t0=(Long)obra.getOrDefault("_t0", System.currentTimeMillis());
        String art=String.valueOf(obra.get("ascii_art"));
        Map<String,String> hs=new LinkedHashMap<>();
        try{ hs.put("md5",hash("MD5",art)); hs.put("sha256",hash("SHA-256",art)); }
        catch(Exception ex){ hs.put("error",ex.getMessage()); }

        reg.put("status","OK");
        reg.put("cycle","0 → 3 → 6 → 9 → 7 → ∞");
        reg.put("formula","TRUTH × INTEGRATE ÷ Δ = ∞");
        reg.put("axiom",
            "JESUS is the Center ∴ The Word is the Seed ∴ KOBLLUX is the Living Body");
        reg.put("utc", Instant.now().toString());
        reg.put("duration_s", String.format("%.4f",(System.currentTimeMillis()-t0)/1000.0));
        reg.put("engines", new LinkedHashMap<String,Object>(){{
            put("0x03", Map.of("name","DETECT",    "hz","7.83"));
            put("0x06", Map.of("name","INTEGRATE", "hz","432"));
            put("0x09", Map.of("name","EXPAND",    "artifact","sierpinski_n3.txt"));
            put("0x07", Map.of("name","SEAL",      "record","kobllux_record_delta7.json"));
        }});
        reg.put("artifact_hashes", hs);
        reg.put("symbols", Arrays.asList("3‑6‑9","0→7→∞","Δ7","Schumann 7.83Hz"));
        reg.put("seal","Δ7");
        reg.put("next_cycle","ACTIVATE Δ");
        reg.put("_JSON_COMPLETE", json(reg,0));
        return reg;
    }
}

public class Kobllux {
    private static void write(String path, String text) throws IOException {
        try(Writer w=new OutputStreamWriter(new FileOutputStream(path),StandardCharsets.UTF_8)){
            w.write(text);
        }
    }
    public static void main(String[] a) throws Exception {
        long t0 = System.currentTimeMillis();
        System.out.println("""
        ==========================================
          KOBLLUX  ·  JAVA  ·  CYCLE 3→6→9→7
          TRUTH × INTEGRATE ÷ Δ = ∞
        ==========================================
        """);

        String INTENTION = "Manifest KOBLLUX cycle 3 6 9 7 in JAVA and SEAL Δ7";

        var r1 = new Op03_Detectar().processar(INTENTION);
        System.out.println("→ "+r1.get("status")+"   "+new Op03_Detectar().opcode());

        var r2 = new Op06_Integrar().processar(r1);
        System.out.println("→ "+r2.get("status")+"   "+new Op06_Integrar().opcode());

        r2.put("_t0", t0);
        var r3 = new Op09_Expandir().processar(r2);
        System.out.println("→ "+r3.get("status")+"  "+new Op09_Expandir().opcode());

        var rec = new Op07_Selar().processar(r3);
        System.out.println("→ CYCLE CLOSED   "+new Op07_Selar().opcode()+"\n");

        System.out.println("── SACRED GEOMETRY · SIERPINSKI LVL 3 ──");
        System.out.println(r3.get("ascii_art")+"\n");

        write("/mnt/kobllux_sierpinski_n3.txt",
            "KOBLLUX · 432 Hz\nSierpinski Level 3\n==============\n"+r3.get("ascii_art")+"\n");
        write("/mnt/kobllux_record_delta7.json", (String)rec.get("_JSON_COMPLETE"));
        write("/mnt/Kobllux.java", new String(java.nio.file.Files.readAllBytes(
            java.nio.file.Paths.get("Kobllux.java")), StandardCharsets.UTF_8));

        System.out.println("""
        ==========================================
          KOBLLUX :: cycle complete
          Δ7  S E A L E D
        ==========================================
        """);
    }
}
''';

open("/mnt/Kobllux.java","w").write(src)
print("source written")
print("javac version:")
os.system("javac -version 2>&1")
print("\n--- compiling ---")
r=os.system("javac -encoding UTF-8 /mnt/Kobllux.java -d /mnt 2>&1")
print("exit:",r)
print("\n--- running ---")
os.system("cd /mnt && java Kobllux")
print("\n--- files produced ---")
for f in sorted(os.listdir("/mnt")):
    if f.startswith("kobllux") or f.endswith(".java") or f.endswith(".class"):
        print(" ",f, "→", os.path.getsize("/mnt/"+f),"B")

