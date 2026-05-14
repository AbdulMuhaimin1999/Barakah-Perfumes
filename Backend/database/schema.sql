CREATE DATABASE IF NOT EXISTS essential_perfume;
USE essential_perfume;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,
  payment_method ENUM('cod', 'stripe') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('Pending', 'Shipped', 'Delivered') DEFAULT 'Pending',
  delivered_at DATETIME NULL DEFAULT NULL COMMENT 'Set when admin marks status Delivered',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Seed: default categories (Men / Women / Luxury / Arabic)
INSERT INTO categories (name, slug) VALUES
  ('Men', 'men'),
  ('Women', 'women'),
  ('Luxury', 'luxury'),
  ('Arabic', 'arabic');

-- Seed: admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin', 'admin@essential.com', '$2a$10$yFY/e7wwarpAiSzMxoJX.Of9yQnZbA.HIDLTo3BNLLZtLIqc/FbFO', 'admin');

-- Seed: full catalog (category_id: 1=Men, 2=Women, 3=Luxury, 4=Arabic). Images: Unsplash or /uploads.
INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES
  ('Bleu Atlas', 'Category: Men. A fresh woody aromatic built for everyday confidence. Top notes: bergamot, grapefruit, sea salt. Heart: lavender, sage, geranium. Base: cedar, vetiver, musk. Concentration: Eau de Parfum. Longevity: 8-10 hours. Season: spring through fall. Occasion: office, travel, gym-to-dinner.', 118.00, 48, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 1),
  ('Noir Gentleman', 'Category: Men. A smoky evening signature. Top: black pepper, citrus zest. Heart: iris, rose, patchouli. Base: oud accord, leather, vanilla. EDP strength. Longevity: 10+ hours. Season: fall and winter. Occasion: formal events, date nights, gala.', 129.00, 36, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 1),
  ('Carbon Drift Sport', 'Category: Men. Energetic citrus-woods for active days. Top: yuzu, green apple, mint. Heart: nutmeg, violet leaf. Base: sandalwood, amberwood, musk. EDT feel with EDP depth. Longevity: 6-8 hours. Season: summer. Occasion: sports, weekends, city commutes.', 89.00, 55, 'https://images.unsplash.com/photo-1615634260167-c8cd4d28bdf9?w=600&q=80', 1),
  ('Oud Meridian', 'Category: Men. Middle Eastern woods meet modern tailoring. Top: saffron, bergamot. Heart: agarwood (oud), rose, amber. Base: musk, incense, vanilla. EDP. Longevity: 12 hours. Season: year-round evenings. Occasion: weddings, luxury dining.', 165.00, 28, 'https://images.unsplash.com/photo-1595425970377-c970029bf477?w=600&q=80', 1),
  ('Santal Commander', 'Category: Men. Creamy sandalwood with a crisp opening. Top: cardamom, lemon. Heart: sandalwood, orris, fig leaf. Base: tonka, musk. EDP. Longevity: 9 hours. Season: all seasons. Occasion: creative workplaces, art openings.', 112.00, 40, 'https://images.unsplash.com/photo-1563170351-82d762b8480e?w=600&q=80', 1),
  ('Arctic Vetiver', 'Category: Men. Green, mineral, and impossibly clean. Top: bergamot, green tea. Heart: vetiver, galbanum, black currant. Base: oakmoss, white musk. EDP. Longevity: 7-9 hours. Season: spring and summer. Occasion: minimalists, daytime meetings.', 98.00, 44, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 1),
  ('Tobacco Reserve', 'Category: Men. Warm gourmand-amber comfort. Top: honey, cinnamon. Heart: tobacco leaf, tonka. Base: vanilla, cacao, woods. EDP. Longevity: 10 hours. Season: autumn and winter. Occasion: lounges, cigar bars, slow evenings.', 134.00, 32, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 1),
  ('Marine Captain', 'Category: Men. Aquatic aromatic breeze. Top: lemon, neroli, marine accord. Heart: rosemary, jasmine. Base: driftwood, ambergris style musk. EDT-EDP hybrid wear. Longevity: 6-7 hours. Season: summer. Occasion: beach, yacht, resort.', 92.00, 60, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 1),
  ('Urban Chrome', 'Category: Men. Metallic musk and soft suede for the city. Top: aldehydes, pear. Heart: violet, cashmeran. Base: musk, cedar. EDP. Longevity: 8 hours. Season: year-round. Occasion: streetwear, nightlife, rooftop parties.', 105.00, 38, 'https://images.unsplash.com/photo-1615634260167-c8cd4d28bdf9?w=600&q=80', 1),
  ('Peak Leather', 'Category: Men. Bold leather chypre. Top: bergamot, rum. Heart: leather, jasmine. Base: patchouli, oakmoss, vetiver. EDP. Longevity: 11 hours. Season: cold weather. Occasion: black-tie optional, statement dressing.', 142.00, 25, 'https://images.unsplash.com/photo-1595425970377-c970029bf477?w=600&q=80', 1),
  ('Rose Elegance', 'Category: Women. Romantic floral musk. Top: Bulgarian rose, lychee. Heart: peony, freesia, magnolia. Base: cedar, musk, amber. EDP. Longevity: 8-10 hours. Season: spring. Occasion: weddings, brunches, garden parties.', 115.00, 50, 'https://images.unsplash.com/photo-1563170351-82d762b8480e?w=600&q=80', 2),
  ('Velvet Bloom', 'Category: Women. Jasmine-vanilla glow. Top: mandarin, pear. Heart: jasmine sambac, orange blossom. Base: vanilla, praline, sandalwood. EDP. Longevity: 9 hours. Season: fall and winter evenings. Occasion: dates, candlelit dinners.', 108.00, 46, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 2),
  ('Gardenia Silk', 'Category: Women. Creamy white florals. Top: bergamot, neroli. Heart: gardenia, tuberose, ylang. Base: musk, sandalwood. EDP. Longevity: 8 hours. Season: summer nights. Occasion: galas, opera, anniversary gifts.', 124.00, 34, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 2),
  ('Amber Lune', 'Category: Women. Soft amber and powdery iris. Top: pink pepper, lemon. Heart: iris, heliotrope, rose. Base: benzoin, vanilla, musk. EDP. Longevity: 10 hours. Season: autumn. Occasion: office-to-evening, cashmere sweaters.', 99.00, 52, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 2),
  ('Peony Whisper', 'Category: Women. Airy peony and blush fruits. Top: red berries, peony buds. Heart: peony, rose. Base: musk, soft woods. EDT concentration feel. Longevity: 5-7 hours. Season: spring and summer. Occasion: daytime, picnics, baby showers.', 86.00, 58, 'https://images.unsplash.com/photo-1615634260167-c8cd4d28bdf9?w=600&q=80', 2),
  ('Iris Couture', 'Category: Women. Powdery iris and suede luxury. Top: violet leaf, carrot seed. Heart: orris butter, rose. Base: leather, vetiver, musk. EDP. Longevity: 9 hours. Season: year-round. Occasion: fashion week, boutique shopping.', 138.00, 30, 'https://images.unsplash.com/photo-1595425970377-c970029bf477?w=600&q=80', 2),
  ('Berry Noir', 'Category: Women. Juicy dark berries and patchouli. Top: blackberry, raspberry. Heart: rose, patchouli. Base: vanilla, musk. EDP. Longevity: 8 hours. Season: winter parties. Occasion: clubbing, New Year celebrations.', 102.00, 41, 'https://images.unsplash.com/photo-1563170351-82d762b8480e?w=600&q=80', 2),
  ('Coconut Sun Luxe', 'Category: Women. Solar tropical gourmand. Top: coconut water, lime. Heart: tiare flower, frangipani. Base: salted vanilla, sandalwood. EDP. Longevity: 7-8 hours. Season: summer. Occasion: vacations, poolside, honeymoons.', 94.00, 47, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 2),
  ('Lily Rain', 'Category: Women. Dewy lily and transparent musk. Top: rain accord, green leaves. Heart: lily of the valley, lotus. Base: white musk, cedar. EDT-EDP. Longevity: 6-8 hours. Season: monsoon and spring. Occasion: spa days, yoga studio.', 88.00, 53, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 2),
  ('Saffron Rose Elixir', 'Category: Women. Spiced rose oriental. Top: saffron, bergamot. Heart: Turkish rose, geranium. Base: oud, patchouli, amber. EDP. Longevity: 11 hours. Season: cool evenings. Occasion: cultural events, fine dining.', 148.00, 27, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 2),
  ('Royal Oud Supreme', 'Category: Luxury. Rare oud and saffron in a jewel bottle concept. Top: saffron, nutmeg. Heart: natural oud accord, rose de mai. Base: incense, sandalwood, ambergris note. Extrait-style concentration. Longevity: 14+ hours. Occasion: collectors, milestone gifts.', 285.00, 18, 'https://images.unsplash.com/photo-1615634260167-c8cd4d28bdf9?w=600&q=80', 3),
  ('Diamond Noir', 'Category: Luxury. Haute floral chypre. Top: truffle, gardenia. Heart: black orchid, spices. Base: patchouli, incense, vanilla. EDP. Longevity: 12 hours. Occasion: red carpet, private salons.', 320.00, 14, 'https://images.unsplash.com/photo-1595425970377-c970029bf477?w=600&q=80', 3),
  ('Imperial Musk Absolu', 'Category: Luxury. White musk at maximum purity. Top: aldehydes, bergamot. Heart: jasmine, ylang. Base: white musk, cashmeran, sandalwood. Absolu. Longevity: 10-12 hours. Occasion: layering base or standalone minimal chic.', 265.00, 16, 'https://images.unsplash.com/photo-1563170351-82d762b8480e?w=600&q=80', 3),
  ('Gold Leaf Parfum', 'Category: Luxury. Honeyed florals and precious resins. Top: honey, apricot. Heart: osmanthus, orange flower. Base: labdanum, benzoin, vanilla. Parfum strength. Longevity: 12 hours. Occasion: winter holidays, heirloom gifting.', 298.00, 12, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 3),
  ('Private Blend Noir 44', 'Category: Luxury. Smoky birch tar and rum. Top: rum, spices. Heart: birch, tobacco. Base: vanilla, guaiac wood. EDP. Longevity: 11 hours. Occasion: exclusive clubs, collectors cabinets.', 275.00, 15, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 3),
  ('Crystal Iris Extrait', 'Category: Luxury. High-definition iris root and glassy aldehydes. Top: aldehydes, mandarin. Heart: iris pallida, rose. Base: musk, ambrette. Extrait. Longevity: 14 hours. Occasion: haute couture front row.', 340.00, 10, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 3),
  ('Al Haramain Gold', 'Category: Arabic. Traditional rose-oud-amber pyramid. Top: saffron, citrus. Heart: damask rose, oud. Base: amber, musk, sandalwood. EDP. Longevity: 12 hours. Occasion: Eid gatherings, family celebrations.', 78.00, 45, 'https://images.unsplash.com/photo-1615634260167-c8cd4d28bdf9?w=600&q=80', 4),
  ('Musk Al Madinah', 'Category: Arabic. Clean white musk and soft florals. Top: citrus clean. Heart: white florals, powder. Base: musk, soft woods. EDP. Longevity: 8 hours. Occasion: daily prayer wear, modest projection.', 68.00, 62, 'https://images.unsplash.com/photo-1595425970377-c970029bf477?w=600&q=80', 4),
  ('Desert Rose Attar', 'Category: Arabic. Oil-style richness without alcohol harshness. Notes: Taif rose, saffron, agarwood, amber. Concentration: attar-inspired EDP. Longevity: 14 hours on fabric. Occasion: weddings, oud layering.', 95.00, 33, 'https://images.unsplash.com/photo-1563170351-82d762b8480e?w=600&q=80', 4),
  ('Oud Sultani', 'Category: Arabic. Deep oud resin and spices. Top: cardamom, black pepper. Heart: Hindi oud accord, patchouli. Base: leather, vanilla. EDP. Longevity: 16 hours. Occasion: winter majlis, evening majesty.', 155.00, 22, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80', 4),
  ('Zam Zam Bakhoor Essence', 'Category: Arabic. Incense-smoke and rose petals. Top: frankincense, rose. Heart: bakhoor accord, spices. Base: amber, musk. EDP. Longevity: 10 hours. Occasion: home hospitality, special Fridays.', 72.00, 48, 'https://images.unsplash.com/photo-1541643609144-2bcf948ba112?w=600&q=80', 4),
  ('Kashmiri Saffron Oil', 'Category: Arabic. Saffron-forward luxury blend. Top: saffron threads, bergamot. Heart: rose, clove. Base: sandalwood, musk. EDP. Longevity: 11 hours. Occasion: gifting, oud collectors.', 110.00, 29, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', 4);
