/* ============================================================================
   SALES CHANNELS — the places people can buy from.

   THIS IS THE "ONE PLACE TO CHANGE A LINK" FILE.

   A buy-button URL is built as:     base  +  the value from products.js

   So if your shop moves to a new domain, or a marketplace changes its URL
   format, you edit ONE line here and every product on the site follows.

   FIELDS
     id       must match the key used under `links:` in products.js
     name     the text on the button
     base     the part of the URL that is identical for every product
     color    button colour
     primary  true = the big filled button. Use on at most one channel.
     note     small grey line under the button (optional)

   ESCAPE HATCH: if a value in products.js starts with http:// or https://
   it is used exactly as written and `base` is ignored. Good for odd one-offs
   like a shortened link or a listing that doesn't follow the pattern.

   Delete any channel you don't use. A product that doesn't list a channel
   simply won't show that button — no placeholder, no dead link.
   ========================================================================== */

window.CHANNELS = [

  {
    id: "mystore",
    name: "Buy direct",
    base: "https://electrodonut.com/product/",
    color: "#FF3D7F",
    primary: true,
    note: "Best price · ships from our workshop"
  },

  {
    id: "amazon",
    name: "Amazon",
    base: "https://www.amazon.com/dp/",
    color: "#FF9900",
    note: "Fast Prime delivery"
  },

  {
    id: "tindie",
    name: "Tindie",
    base: "https://www.tindie.com/products/",
    color: "#3B7EA1",
    note: "Marketplace for indie hardware"
  },

  {
    id: "aliexpress",
    name: "AliExpress",
    base: "https://www.aliexpress.com/item/",
    color: "#E62E04",
    note: "Cheapest, slowest shipping"
  },

  {
    id: "kofi",
    name: "Ko-fi",
    // Ko-fi shop links have no shared pattern, so leave base empty and paste
    // the whole link in products.js instead.
    base: "",
    color: "#FF5E5B",
    note: "Buy through my Ko-fi shop"
  },

  {
    id: "whatsapp",
    name: "Order on WhatsApp",
    base: "https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20order%3A%20",
    color: "#25D366",
    note: "Custom quantities & questions"
  }

];
