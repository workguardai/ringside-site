// Ringside site settings. Fill these in before going live.
// Anything still in [SQUARE BRACKETS] is treated as "not set":
// buttons fall back to the contact section and analytics stays off.
window.RINGSIDE_CONFIG = {
  // WhatsApp number in international format, digits only (e.g. 34600111222)
  whatsappNumber: "[WHATSAPP NUMBER]",
  // Contact email shown on the page and used by the contact form (mailto)
  email: "besasonos@gmail.com",
  // Where "Book a free review" goes. Leave as is to use WhatsApp, or set a
  // full link (e.g. a booking page or "mailto:you@example.com")
  reviewLink: "[WHATSAPP/EMAIL LINK]",
  // Where the contact form is sent: Ringside Scout's inbound endpoint. If empty, the form opens
  // the visitor's email app instead (the old behaviour).
  inboundUrl: "https://scout.urawise.eu/api/inbound",
  // GA4 measurement ID from a NEW data stream for ringside.urawise.eu (G-XXXXXXX)
  ga4Id: "G-V2EL07BWHQ"
};
