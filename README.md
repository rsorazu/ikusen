# Bideo Proiektua — IKT Web

Ikus-entzunezko proiekturako web osoa, panel de gestiona barne (Decap CMS).

## Egitura
index.html + style.css + app.js       — Web-shell
admin/index.html + admin/config.yml   — Decap CMS panela
content/*.json                        — Eduki guztia (editagarria panel bidez)

## GitHub + Netlify konfigurazioa

1. Sortu biltegi berri bat GitHuben (edo gehitu repositorio honetan karpeta gisa)
2. admin/config.yml fitxategian aldatu site_url: zure GitHub Pages helbidearekin
3. Igo fitxategi guztiak GitHub-era
4. Activate GitHub Pages: Settings > Pages > main / (root)
5. Netlify-n: Site configuration > Identity > Enable
6. Identity > Services > Git Gateway > Enable
7. Identity > Users > Invite yourself
8. Panela: zure-netlify-app.netlify.app/admin

## Diseinua

Zinema-aretoaren estetika: fondo ia beltza, urre-koloreko eta gorri-koloreko
azentuak (klaketa-zinta gorri/zuria), Bebas Neue tipografia titulu handietan.
Robotika-webaren diseinutik bereizita dago propositu eta gai desberdina baitu.

## Argazkiak

Film-adibideen argazkiak (Drive, Whiplash...) marcador hutsak dira copyright-arazoak
saihesteko. Sub bidez argazki originalak edo zatiak igo ditzakezu /admin panel bidez.
