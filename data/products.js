/* ============================================================================
   PRODUCTS

   TO ADD A PRODUCT
     1. Copy one { ... } block below, including its trailing comma
     2. Change the values
     3. Put photos in  assets/products/<your-id>/  and list them under images
     4. Save. Refresh the browser. Done.

   FIELDS
     id           required. Lowercase, no spaces. Becomes the page address:
                  product.html?id=<this>
     title        required. Product name.
     price        any text — "$49", "from $29", "Ask for a quote".
     was          optional. Crossed-out old price, adds a "Sale" badge.
     blurb        one line, shown on the card in the grid.
     category     used by the filter buttons on the homepage. One name, or
                  a list to put the product under several at once:
                      category: "Tools"
                      category: ["Tools", "Products"]
     tags         optional list — not shown, but searchable.
     badge        optional label on the card: "New", "Best seller"…
     stock        "in_stock" | "low_stock" | "sold_out" | "preorder"
                  Leave the line out entirely and no stock label is shown.
     images       filenames inside assets/products/<id>/
     specs        table of key: value pairs
     links        WHERE TO BUY. Each key must match an id in channels.js.
                  The value is just this product's id on that site — the
                  rest of the URL comes from channels.js.
     prices       optional per-shop price shown on each buy button.
                  Only appears when site.js -> product.showPrices is true.
                  You type these yourself; nothing is fetched. See the
                  README section "Why prices can't update themselves".
     description  long text. Written between backticks so it can span lines.
                  Supports:  ## heading   - bullet   **bold**   `code`
                  A blank line starts a new paragraph.

   The three products below are EXAMPLES. Delete them once you add real ones.
   ========================================================================== */

window.PRODUCTS = [

  {
    id: "rgb-pendant",
    title: "RGB Pendent",
    price: "$25.99",
    was: "$35.99",
    blurb: "Free Shipping",
    category: ["Products", "Kits"],
    tags: ["wearable", "kits", "coincell"],
    // badge: "Best seller",
    stock: "in_stock",
    images: ["1.jpeg", "2.png" , "3.jpg" , "4.jpg"],
    specs: {
      "Switches": "Switches for RGB",
      "Colors": "Select a Color from 7 Options",
      "Battery": "CR2032 (Battery Not Included)",
      "Dimensions": "32.1 × 21 × 60.3 mm",
      "Included": "Pendent, Necklace Cord"
    },
    links: {
      tindie: "https://www.tindie.com/products/vishalsoniindia/rgb-pendant/",
      kofi: "https://ko-fi.com/s/3b19d0dca5"
    },
    // prices: {
    //   tindie: "$52"
    // },
    description: `
- Battery (CR2032) not included.
- Visibility is reduced in direct sunlight.
- Performs best in indoor or low-light conditions.

## What is it?
The pendant features three individual switches, each controlling one color of the RGB LED—Red, Green, and Blue. By turning the switches on and off in different combinations, you can create 7 unique colors, allowing the pendant to match different outfits, occasions, or moods. It is powered by a coin cell battery.

## What makes it special?
This is very simple to build and can be assembled with basic soldering skills. No programming is required. It runs on a coin cell battery, so there's no need to recharge it.
`
  }

];
