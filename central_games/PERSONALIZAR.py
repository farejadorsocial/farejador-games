# -*- coding: utf-8 -*-
"""Preenche seus dados em todo o site de uma vez.

Uso (precisa de Python 3):  python PERSONALIZAR.py
Rode UMA vez, depois de saber seu domínio e e-mail. O ID do AdSense pode ficar vazio por enquanto
e ser preenchido depois (rode de novo; os campos que você deixar em branco são mantidos).
"""
import os, re, json

ROOT = os.path.dirname(os.path.abspath(__file__))
EXTS = (".html", ".js", ".xml", ".txt", ".md")

def ask(msg, default=""):
    v = input(msg + (" [%s]" % default if default else "") + ": ").strip()
    return v or default

cfg_path = os.path.join(ROOT, "js", "site-config.js")
cfg = open(cfg_path, encoding="utf-8").read()
def cur(key):
    m = re.search(key + r':\s*"([^"]*)"', cfg)
    return m.group(1) if m else ""

print("== Farejador Games: personalizar site ==")
site = ask("Endereço do site com https (ex.: https://farejadorgames.com.br)", cur("siteUrl") if "SEUDOMINIO" not in cur("siteUrl") else "").rstrip("/")
email = ask("E-mail de contato público", cur("email") if "SEUDOMINIO" not in cur("email") else "")
nome = ask("Nome do responsável (pessoa ou empresa) que aparece em Sobre/Privacidade/Contato", cur("responsavel"))
client = ask("ID do AdSense (ca-pub-XXXXXXXXXXXXXXXX) — deixe vazio se ainda não tem", cur("adsenseClient"))

if not site.startswith("https://") or not email or not nome:
    raise SystemExit("Preencha site (com https://), e-mail e nome do responsável.")

tokens = {"{{SITE_URL}}": site, "{{EMAIL}}": email, "{{RESPONSAVEL}}": nome}
changed = 0
for dp, _, files in os.walk(ROOT):
    for f in files:
        if not f.endswith(EXTS) or f == "PERSONALIZAR.py":
            continue
        p = os.path.join(dp, f)
        s = open(p, encoding="utf-8").read()
        n = s
        for k, v in tokens.items():
            n = n.replace(k, v)
        if n != s:
            open(p, "w", encoding="utf-8").write(n); changed += 1

cfg = re.sub(r'siteUrl:\s*"[^"]*"', 'siteUrl: "%s"' % site, cfg)
cfg = re.sub(r'email:\s*"[^"]*"', 'email: "%s"' % email, cfg)
if re.search(r'responsavel:\s*"', cfg):
    cfg = re.sub(r'responsavel:\s*"[^"]*"', 'responsavel: "%s"' % nome, cfg)
cfg = re.sub(r'adsenseClient:\s*"[^"]*"', 'adsenseClient: "%s"' % client, cfg)
open(cfg_path, "w", encoding="utf-8").write(cfg)

if client.startswith("ca-pub-"):
    pub = client.replace("ca-", "", 1)
    open(os.path.join(ROOT, "ads.txt"), "w", encoding="utf-8").write("google.com, %s, DIRECT, f08c47fec0942fa0\n" % pub)

print("\nPronto. %d arquivo(s) atualizado(s)." % changed)
print("Anúncios continuam DESLIGADOS (adsEnabled: false em js/site-config.js).")
print("Só ligue depois que o AdSense aprovar o site e o H5 Games Ads liberar sua conta.")
