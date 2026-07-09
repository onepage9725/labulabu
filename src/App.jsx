import React, { useState } from 'react';
import { 
  FadeDownNav, 
  StaggeredHeroTitle, 
  FadeUpHeroContent, 
  FadeUpGridCard 
} from './animations';

import '../style.css'; // Assuming style.css is at root

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const products = [
    { id: 1, category: 'BALL', title: 'CHICKEN FLOSSIE BALLS (4 / 8 PCS)', img: '/backery/Chicken Flossie Balls_4pcs.png' },
    { id: 2, category: 'BALL', title: 'VEGETARIAN FLOSSIE BALLS (4 / 8 PCS)', img: '/backery/Vegetarian-Floss Balls_4pcs.png' },
    { id: 3, category: 'BALL', title: 'SPICY SEAWEED CHICKEN FLOSSIE... (4 PCS)', img: '/backery/Vegetarian-Floss Balls_4pcs.png' },
    { id: 4, category: 'BALL', title: 'YAM CAKE BALLS (4 PCS)', img: '/backery/Vegetarian-Floss Balls_4pcs.png' },
    { id: 5, category: 'WHOLE & SLICED CAKES', title: 'BLACK FOREST CAKE', img: '/backery/Black Forest Cake.png' },
    { id: 6, category: 'SPONGE CAKES', title: 'DARK CHOCOLATE SPONGE CAKE', img: '/backery/Dark Chocolate Sponge Cake.png' },
    { id: 7, category: 'ROLLS', title: 'PANDAN GULA MELAKA ROLL', img: '/backery/Pandan Gula Melaka Roll.png' },
    { id: 8, category: 'WHOLE & SLICED CAKES', title: 'PANDAN GULA MELAKA SANTAN CAKE', img: '/backery/Pandan Gula Melaka Santan Cake.png' },
    { id: 9, category: 'WHOLE & SLICED CAKES', title: 'BAKED CHEESE CAKE SLICE', img: '/backery/Slice_Baked Cheese Cake Slice.png' },
    { id: 10, category: 'WHOLE & SLICED CAKES', title: 'BLACK FOREST CAKE SLICE', img: '/backery/Slice_Black Forest Cake.png' },
    { id: 11, category: 'WHOLE & SLICED CAKES', title: 'BLACK SESAME PEANUT CAKE', img: '/backery/Slice_Black Sesame Peanut Cake.png' },
    { id: 12, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (ORIGINAL)', img: '/backery/Slice_Boston Pie Cake_Original.png' },
    { id: 13, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (CHOCOLATE)', img: '/backery/Slice_Boston Pie Cake_Slice_Chocolate.png' },
    { id: 14, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (LEMON)', img: '/backery/Slice_Boston Pie Cake_Slice_Lemon.png' },
    { id: 15, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (MANGO)', img: '/backery/Slice_Boston Pie Cake_Slice_Mango.png' },
    { id: 16, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (STRAWBERRY)', img: '/backery/Slice_Boston Pie Cake_Slice_Strawberry.png' },
    { id: 17, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (TIRAMISU)', img: '/backery/Slice_Boston Pie Cake_Slice_Tiramisu.png' }
  ];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  return (
    <>
      <div className="top-banner" style={{ zIndex: 100, position: 'sticky', top: 0 }}>
        <span style={{ color: 'var(--secondary-color)' }}>ORDER FRESH BAKE HERE</span>
      </div>

      <FadeDownNav>
        <header className="navbar" style={{ zIndex: 99, position: 'sticky', top: '35px', backgroundColor: 'var(--background-color)' }}>
          <div className="nav-left">
            {/* Empty space to keep logo centered on desktop */}
          </div>
          <div className="nav-center">
            {/* Kept original logo reference */}
            <img src="/labulogo.png" alt="Labu+labu" className="logo" onError={(e) => e.target.outerHTML='<h2 class="logo-text">Labu+labu</h2>'} />
          </div>
          <div className="nav-right">
            {/* Cart link removed temporarily */}
          </div>
        </header>
      </FadeDownNav>

      <section className="hero container">
        <StaggeredHeroTitle text={"fresh, daily,\nmindful"} />
        
        <FadeUpHeroContent delay={0.6}>
          <div className="hero-subtitle">
            <p className="mobile-subtitle" style={{ margin: 0, textAlign: 'inherit', whiteSpace: 'nowrap' }}>
              handmade bakes, coffee &<br className="mobile-break-hidden" />
              meals — served Wed-Sun at<br className="mobile-break-visible" />
              <a href="#location" className="underline">Taman Cheras Indah, Kuala Lumpur</a>
            </p>
          </div>
        </FadeUpHeroContent>
      </section>

      <main className="main-content container">
        <aside className="sidebar">
          <ul className="filter-list">
              <li><a href="#" className={activeCategory === 'ALL' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('ALL'); }}>ALL</a></li>
              <li><a href="#" className={activeCategory === 'BALL' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('BALL'); }}>BALLS</a></li>
              <li><a href="#" className={activeCategory === 'SPONGE CAKES' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('SPONGE CAKES'); }}>SPONGE CAKES</a></li>
              <li><a href="#" className={activeCategory === 'LOAF CAKES' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('LOAF CAKES'); }}>LOAF CAKES</a></li>
              <li><a href="#" className={activeCategory === 'ROLLS' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('ROLLS'); }}>ROLLS</a></li>
              <li><a href="#" className={activeCategory === 'WHOLE & SLICED CAKES' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('WHOLE & SLICED CAKES'); }}>WHOLE & SLICED CAKES</a></li>
              <li><a href="#" className={activeCategory === 'BOSTON PIE CAKES' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('BOSTON PIE CAKES'); }}>BOSTON PIE CAKES</a></li>
              <li><a href="#" className={activeCategory === 'COOKIES' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveCategory('COOKIES'); }}>COOKIES</a></li>
          </ul>
        </aside>

        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <FadeUpGridCard key={product.id} index={index}>
              <div className="card-image-wrapper">
                {product.img ? (
                  <img src={product.img} alt={product.title} style={{ width: '100%', height: 'auto', display: 'block', backgroundColor: 'var(--product-surface-color)' }} />
                ) : (
                  <div className="image-placeholder"></div>
                )}
              </div>
              <div className="card-content">
                {/* Category removed as requested */}
                <h3 className="product-title">{product.title}</h3>
                <p className="description" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ESPRESSO, OAT MILK, CARAMEL DRIZZLE
                </p>
                <p className="price">RM 20.00</p>
              </div>
            </FadeUpGridCard>
          ))}
        </div>
      </main>

      <footer className="site-footer container">
        <div className="footer-top">
          <img src="/labulogo.png" alt="Labu+labu" className="large-footer-logo-img" onError={(e) => e.target.outerHTML='<h1 class="large-footer-logo">Labu+labu</h1>'} />
          <div className="footer-subtitle">
            <p>
              handmade bakes, coffee &<br />
              meals
            </p>
          </div>
        </div>

        <div className="footer-content" id="contact">
          <div className="map-placeholder">
            Map Image Placeholder
          </div>
          <div className="footer-contacts">
            <h2>contacts</h2>
            <p>
              Wednesday to Thursday: 12-9 pm<br />
              Friday to Saturday: 12-10 pm<br />
              Sunday: 12-9 pm<br />
              Monday & Tuesday: Closed
            </p>
            <p>
              26, Jalan Indah 23, Taman Cheras Indah,<br />
              55300 Kuala Lumpur, Selangor
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/labulabubakery" target="_blank" rel="noreferrer" style={{ marginRight: '10px' }}>
                <img src="/fblogo.png" alt="Facebook" className="social-logo" />
              </a>
              <a href="https://www.instagram.com/labulabubakery" target="_blank" rel="noreferrer">
                <img src="/instalogo.png" alt="Instagram" className="social-logo" />
              </a>
            </div>
            <p className="phone">013-902 0018</p>
            <p className="email">labulabubakerycafe@gmail.com</p>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2026 Labu+labu Cafe</p>
        <p>Built with ❤️</p>
      </div>
    </>
  );
}
