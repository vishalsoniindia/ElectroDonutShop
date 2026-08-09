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
     category     used by the filter buttons on the homepage.
     tags         optional list — not shown, but searchable.
     badge        optional label on the card: "New", "Best seller"…
     stock        "in_stock" | "low_stock" | "sold_out" | "preorder"
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
    id: "esp32-cloner-pro",
    title: "ESP32 Cloner Pro",
    price: "$49",
    was: "$59",
    blurb: "Read, back up and clone any ESP32 in a single click.",
    category: "Tools",
    tags: ["esp32", "flasher", "usb-c"],
    badge: "Best seller",
    stock: "in_stock",
    images: ["1.svg", "2.svg"],
    specs: {
      "Chip support": "ESP32, ESP32-S2/S3, ESP32-C3",
      "Interface": "USB-C, 921600 baud",
      "Power": "Bus powered, 5V 500mA",
      "Dimensions": "62 × 34 × 12 mm",
      "Included": "Board, USB-C cable, 6-pin harness"
    },
    links: {
      mystore: "esp32-cloner-pro",
      amazon: "B0EXAMPLE1",
      tindie: "esp32-cloner-pro",
      whatsapp: "ESP32%20Cloner%20Pro"
    },
    prices: {
      mystore: "$49",
      amazon: "$54",
      tindie: "$52"
    },
    description: `
The Cloner Pro pulls a full firmware image off an ESP32, verifies it, and
writes it back to as many blank boards as you like — without you touching a
command line.

## Why it exists

Flashing one board is easy. Flashing forty identical boards, checking each one
actually took, and keeping track of which ones failed is not. This does that
part for you.

- **One-click clone** — read source, verify, write target, verify again
- **Batch mode** — queue boards and walk away, failures are logged
- **Auto chip detect** — no jumper fiddling, no BOOT button dance
- **Offline** — the desktop app never phones home

## What's in the box

The board, a 1 m USB-C cable, and a 6-pin harness that fits the usual
dev-board headers. The desktop app is a free download and works on Windows,
macOS and Linux.
`
  },

  {
    id: "donut-dev-board",
    title: "Donut Dev Board",
    price: "$29",
    blurb: "A round ESP32-C3 board with 18 broken-out pins and a real power switch.",
    category: "Boards",
    tags: ["esp32-c3", "dev board", "wifi", "ble"],
    badge: "New",
    stock: "in_stock",
    images: ["1.svg", "2.svg"],
    specs: {
      "MCU": "ESP32-C3, RISC-V 160 MHz",
      "Memory": "4 MB flash, 400 KB SRAM",
      "Wireless": "Wi-Fi 4, Bluetooth 5 LE",
      "GPIO": "18 broken out, all 3.3 V",
      "Power": "USB-C or 3.7 V LiPo, with charger"
    },
    links: {
      mystore: "donut-dev-board",
      amazon: "B0EXAMPLE2",
      tindie: "donut-dev-board",
      aliexpress: "1005000000002.html",
      whatsapp: "Donut%20Dev%20Board"
    },
    prices: {
      mystore: "$29",
      amazon: "$33",
      tindie: "$31",
      aliexpress: "$27"
    },
    description: `
Round, because everything else is a rectangle.

Underneath the shape it's a straightforward ESP32-C3 board: USB-C, a LiPo
charger, a power switch that actually cuts power, and 18 GPIO on a ring of
castellated pads you can either solder headers into or reflow straight onto
another board.

## Notes

- The LiPo connector is JST-PH 2.0 mm, the common one
- Charge current is 500 mA, set by a resistor you can swap
- The RGB LED is on \`GPIO 8\`, the button on \`GPIO 9\`
- Works with Arduino, ESP-IDF, PlatformIO and MicroPython
`
  },

  {
    id: "sprinkle-sensor-kit",
    title: "Sprinkle Sensor Kit",
    price: "from $19",
    blurb: "Twelve common sensors, pre-wired with keyed connectors. No breadboard.",
    category: "Kits",
    tags: ["sensors", "kit", "beginner", "i2c"],
    stock: "low_stock",
    images: ["1.svg", "2.svg"],
    specs: {
      "Sensors": "12 modules — temp, humidity, light, motion, distance, IMU…",
      "Connector": "4-pin JST-SH, keyed, I²C + power",
      "Cables": "12 × 100 mm, 2 × 200 mm included",
      "Compatible": "Qwiic / STEMMA QT / Grove (adapter included)"
    },
    links: {
      mystore: "sprinkle-sensor-kit",
      amazon: "B0EXAMPLE3",
      aliexpress: "1005000000003.html",
      whatsapp: "Sprinkle%20Sensor%20Kit"
    },
    prices: {
      mystore: "$19",
      amazon: "$24",
      aliexpress: "$17"
    },
    description: `
Every sensor in this kit uses the same keyed 4-pin connector, so you
physically cannot wire one in backwards. That single decision removes most of
the reasons a beginner project doesn't work.

## What's included

Temperature & humidity, ambient light, colour, PIR motion, time-of-flight
distance, ultrasonic distance, 6-axis IMU, magnetometer, barometer, soil
moisture, current sense, and a rotary encoder.

## Good to know

Ten of the twelve are I²C and can share one bus. The two analog ones come with
a small ADC breakout so they can join the same chain. Example code for all
twelve lives in one repo, one file per sensor.
`
  }

];
