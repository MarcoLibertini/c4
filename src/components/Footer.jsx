"use client";

export default function Footer({ landing }) {
  const f = landing?.footer || {};
  const year = new Date().getFullYear();

  const brand = f.brand || "C4 LASER";
  const tagline = f.tagline || "Grabado y corte láser";
  const address = f.address || "";
  const whatsapp = f.whatsapp || "";
  const email = f.email || "";

  const quickLinks = Array.isArray(f.quickLinks) ? f.quickLinks : [];
  const socials = f.socials || {};

  const waLink = whatsapp ? `https://wa.me/${String(whatsapp).replace(/\D/g, "")}` : null;

  const copyright =
    (f.copyright || "© {year} C4 LASER. Todos los derechos reservados.").replace(
      "{year}",
      String(year)
    );

  return (
    <footer className="mt-16 border-t bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Marca */}
          <div>
            <div className="text-lg font-semibold">{brand}</div>
            <div className="mt-1 text-sm text-black/70">{tagline}</div>

            {address ? <div className="mt-4 text-sm text-black/70">{address}</div> : null}

            <div className="mt-4 space-y-2 text-sm">
              {waLink ? (
                <a className="underline font-semibold" href={waLink} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              ) : null}

              {email ? (
                <div>
                  <a className="underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <div className="text-sm font-semibold">Links</div>
            <div className="mt-3 space-y-2 text-sm text-black/80">
              {quickLinks.length ? (
                quickLinks.map((l, idx) => (
                  <a key={idx} className="block hover:opacity-80" href={l.href || "#"}>
                    {l.label || "Link"}
                  </a>
                ))
              ) : (
                <div className="text-black/60">Sin links configurados.</div>
              )}
            </div>
          </div>

          {/* Redes */}
          <div>
            <div className="text-sm font-semibold">Redes</div>
            <div className="mt-3 space-y-2 text-sm text-black/80">
              {socials.instagram ? (
                <a className="block hover:opacity-80" href={socials.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
              {socials.facebook ? (
                <a className="block hover:opacity-80" href={socials.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              ) : null}
              {socials.maps ? (
                <a className="block hover:opacity-80" href={socials.maps} target="_blank" rel="noreferrer">
                  Google Maps
                </a>
              ) : null}
              {socials.website ? (
                <a className="block hover:opacity-80" href={socials.website} target="_blank" rel="noreferrer">
                  Sitio web
                </a>
              ) : null}

              {!socials.instagram && !socials.facebook && !socials.maps && !socials.website ? (
                <div className="text-black/60">Sin redes configuradas.</div>
              ) : null}
            </div>
          </div>

          {/* Extra */}
          <div>
            <div className="text-sm font-semibold">Atención</div>
            <div className="mt-3 text-sm text-black/70">
              Respondemos por WhatsApp para cotizaciones, diseños y encargos.
            </div>
            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
              >
                Escribinos
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-xs text-black/60">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
