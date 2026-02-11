"use client";

export default function ContactSection({ landing }) {
  const c = landing?.contact || {};
  const title = c.title || "Contacto";
  const subtitle = c.subtitle || "";
  const address = c.address || "";
  const whatsapp = c.whatsapp || "";
  const mapEmbedUrl = c.mapEmbedUrl || "";
  const hours = Array.isArray(c.hours) ? c.hours : [];

  const waText = "Hola! Quiero hacer una consulta.";
  const waPhone = String(whatsapp).replace(/\D/g, "");
  const waLink = waPhone
    ? `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`
    : null;

  return (
    <section id="contacto" className="mx-auto max-w-6xl px-4 py-12 text-black">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-black/70">{subtitle}</p> : null}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mapa */}
        <div className="border rounded-2xl overflow-hidden bg-white">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              className="w-full h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa"
            />
          ) : (
            <div className="h-[320px] flex items-center justify-center text-sm text-black/60">
              Configurá el mapa desde Admin → Landing.
            </div>
          )}

          <div className="p-4 border-t">
            {address ? (
              <div className="text-sm">
                <span className="font-semibold">Dirección:</span>{" "}
                <span className="text-black/70">{address}</span>
              </div>
            ) : null}

            {waLink ? (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
              >
                Consultar por WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        {/* Horarios */}
        <div className="border rounded-2xl bg-white p-4">
          <div className="font-semibold">Horarios</div>

          <div className="mt-4 space-y-2">
            {hours.length ? (
              hours.map((h, idx) => {
                const first = h.from && h.to ? `${h.from}–${h.to}` : "";
                const second = h.from2 && h.to2 ? `${h.from2}–${h.to2}` : "";
                const isClosed = !first && !second;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between border rounded-xl px-3 py-2"
                  >
                    <div className="text-sm font-semibold">{h.day}</div>
                    <div className="text-sm text-black/70">
                      {isClosed ? (
                        <span className="font-semibold text-black/60">Cerrado</span>
                      ) : (
                        <>
                          {first ? <span>{first}</span> : null}
                          {first && second ? <span> · </span> : null}
                          {second ? <span>{second}</span> : null}
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-black/60">
                Cargá los horarios desde Admin → Landing.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
