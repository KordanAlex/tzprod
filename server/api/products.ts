const products = [
  { id: 1, name: 'Mechanical Keyboard', price: 12990, image: '/images/keyboard.png', description: 'Cherry MX Brown switches, RGB backlight, aluminum frame. Perfect for both gaming and coding.', category: 'Peripherals' },
  { id: 2, name: 'Wireless Mouse', price: 4990, image: '/images/mouse.png', description: 'Ergonomic design, 16000 DPI sensor, 70-hour battery life. Works on any surface.', category: 'Peripherals' },
  { id: 3, name: '4K Monitor', price: 34990, image: '/images/monitor.png', description: '27-inch IPS panel, 144Hz refresh rate, HDR600. Stunning colors for creative work.', category: 'Displays' },
  { id: 4, name: 'USB-C Hub', price: 3490, image: '/images/usb-c.png', description: '7-in-1: HDMI, USB 3.0 x3, SD card, ethernet, PD charging. Compact aluminum body.', category: 'Accessories' },
  { id: 5, name: 'Webcam HD', price: 6990, image: '/images/camera.png', description: '1080p 60fps, auto-focus, built-in mic with noise cancellation. Stream-ready.', category: 'Accessories' },
  { id: 6, name: 'Standing Desk', price: 45990, image: '/images/chair.png', description: 'Electric height adjustment 60-125cm, memory presets, cable management built-in.', category: 'Furniture' },
  { id: 7, name: 'Noise Cancelling Headphones', price: 19990, image: '/images/headphones.png', description: 'ANC, 30-hour battery, multipoint connection. Crystal clear calls and immersive sound.', category: 'Audio' },
  { id: 8, name: 'Desk Lamp', price: 2990, image: '/images/desc lamp.png', description: 'LED, adjustable color temperature 2700-6500K, USB charging port. Eye-care certified.', category: 'Accessories' },
]

export default defineEventHandler((event) => {
  const query = getQuery(event)

  // GET /api/products?id=1 → single product
  if (query.id) {
    const product = products.find(p => p.id === Number(query.id))
    if (!product) {
      throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    }
    return product
  }

  return products
})
