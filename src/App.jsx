import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  FadeDownNav, 
  StaggeredHeroTitle, 
  FadeUpHeroContent, 
  FadeUpGridCard 
} from './animations';

import '../style.css'; // Assuming style.css is at root

const SPECIAL_PACK_PRODUCTS = new Set([
  'CHICKEN FLOSSIE BALLS',
  'VEGETARIAN FLOSSIE BALLS',
  'SPICY SEAWEED CHICKEN FLOSSIE BALLS'
]);

const PRODUCT_PRICE = 20;

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showOrderSetup, setShowOrderSetup] = useState(true);
  const [orderSetupStep, setOrderSetupStep] = useState(1);
  const [orderType, setOrderType] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dummyOrderSelection, setDummyOrderSelection] = useState(null);
  const [packSelections, setPackSelections] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState('cart');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    contactNumber: '',
    address: '',
    remark: ''
  });
  const [customerErrors, setCustomerErrors] = useState({});
  const [recentlyAddedKey, setRecentlyAddedKey] = useState('');
  const [cartPulse, setCartPulse] = useState(false);
  const addFeedbackTimeoutRef = useRef(null);
  const cartPulseTimeoutRef = useRef(null);

  const outletOptions = [
    'Sunway Mentari - Bakery',
    'Musa Sentral - Bakery',
    'Taman Indah Cheras - Cafe'
  ];

  const dateOptions = useMemo(() => {
    const today = new Date();

    const toInputDate = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return Array.from({ length: 15 }, (_, index) => {
      const dateObj = new Date(today);
      dateObj.setDate(today.getDate() + index);
      return {
        value: toInputDate(dateObj),
        label: dateObj.toLocaleDateString('en-MY', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      };
    });
  }, []);

  const products = [
    { id: 1, category: 'BALL', title: 'CHICKEN FLOSSIE BALLS', img: '/backery/Chicken Flossie Balls.png' },
    { id: 2, category: 'BALL', title: 'VEGETARIAN FLOSSIE BALLS', img: '/backery/Vegetarian Flossie Balls.png' },
    { id: 3, category: 'BALL', title: 'SPICY SEAWEED CHICKEN FLOSSIE BALLS', img: '/backery/Chicken Flossie Balls.png' },
    { id: 4, category: 'WHOLE & SLICED CAKES', title: 'YAM CAKE', img: '/backery/Slice Yam Burnt Cheesecake.png' },
    { id: 5, category: 'WHOLE & SLICED CAKES', title: 'BLACK FOREST CAKE', img: '/backery/Dark Chocolate Sponge Cake (2).png' },
    { id: 6, category: 'SPONGE CAKES', title: 'DARK CHOCOLATE SPONGE CAKE', img: '/backery/Dark Chocolate Sponge Cake.png' },
    { id: 7, category: 'ROLLS', title: 'PANDAN GULA MELAKA ROLL', img: '/backery/Pandan Gula Melaka Roll.png' },
    { id: 8, category: 'WHOLE & SLICED CAKES', title: 'PANDAN GULA MELAKA SANTAN CAKE', img: '/backery/Slice Pandan Gula Melaka Santan Cake.png' },
    { id: 9, category: 'WHOLE & SLICED CAKES', title: 'BAKED CHEESE CAKE SLICE', img: '/backery/Slice Baked Cheese Cake.png' },
    { id: 10, category: 'WHOLE & SLICED CAKES', title: 'BLACK FOREST CAKE SLICE', img: '/backery/Slice Black Forest Cake.png' },
    { id: 11, category: 'WHOLE & SLICED CAKES', title: 'BLACK SESAME PEANUT CAKE', img: '/backery/Slice Black Sesame Cake.png' },
    { id: 12, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (ORIGINAL)', img: '/backery/Slice Original Boston Pie Cake.png' },
    { id: 13, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (CHOCOLATE)', img: '/backery/Slice Chocolate Boston Pie Cake.png' },
    { id: 14, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (LEMON)', img: '/backery/Slice Lemon Boston Pie Cake.png' },
    { id: 15, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (MANGO)', img: '/backery/Slice Mango Boston Pie Cake.png' },
    { id: 16, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (STRAWBERRY)', img: '/backery/Slice Strawberry Boston Pie Cake.png' },
    { id: 17, category: 'BOSTON PIE CAKES', title: 'BOSTON PIE CAKE (TIRAMISU)', img: '/backery/Slice Tiramisu Boston Pie Cake.png' }
  ];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const totalCartQuantity = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
    [cartItems]
  );

  const cartSummaryItems = useMemo(
    () => cartItems.map((item) => ({
      key: item.key,
      title: item.title,
      packSize: item.packSize,
      quantity: item.quantity,
      image: item.image
    })),
    [cartItems]
  );

  const saveDummyOrderSelection = () => {
    if (!orderType || !selectedOutlet || !selectedDate) {
      return;
    }

    const dummyData = {
      orderType,
      outlet: selectedOutlet,
      date: selectedDate,
      savedAt: new Date().toISOString()
    };

    setDummyOrderSelection(dummyData);
    setShowOrderSetup(false);
  };

  const chooseOrderType = (type) => {
    setOrderType(type);
    setSelectedOutlet('');
    setSelectedDate('');
    setOrderSetupStep(2);
  };

  const goToDateStep = () => {
    if (!selectedOutlet) {
      return;
    }
    setSelectedDate('');
    setOrderSetupStep(3);
  };

  const requiresPackSelection = (product) => SPECIAL_PACK_PRODUCTS.has(product.title);

  const selectedPackForProduct = (product) => {
    if (!requiresPackSelection(product)) {
      return '';
    }

    return packSelections[product.id] || '8pcs';
  };

  const choosePackSize = (productId, packSize) => {
    setPackSelections((current) => ({
      ...current,
      [productId]: packSize
    }));
  };

  const addToCart = (product) => {
    const selectedPack = selectedPackForProduct(product);

    if (requiresPackSelection(product) && !selectedPack) {
      return;
    }

    const cartKey = `${product.id}-${selectedPack || 'standard'}`;

    setCartItems((current) => {
      const existingItem = current.find((item) => item.key === cartKey);

      if (existingItem) {
        return current.map((item) => (
          item.key === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }

      return [
        ...current,
        {
          key: cartKey,
          id: product.id,
          title: product.title,
          image: product.img,
          packSize: selectedPack,
          quantity: 1,
          price: PRODUCT_PRICE
        }
      ];
    });

    setCartStep('cart');

    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }
    if (cartPulseTimeoutRef.current) {
      clearTimeout(cartPulseTimeoutRef.current);
    }

    setRecentlyAddedKey(cartKey);
    setCartPulse(true);

    addFeedbackTimeoutRef.current = setTimeout(() => {
      setRecentlyAddedKey('');
    }, 900);

    cartPulseTimeoutRef.current = setTimeout(() => {
      setCartPulse(false);
    }, 700);
  };

  useEffect(() => () => {
    if (addFeedbackTimeoutRef.current) {
      clearTimeout(addFeedbackTimeoutRef.current);
    }
    if (cartPulseTimeoutRef.current) {
      clearTimeout(cartPulseTimeoutRef.current);
    }
  }, []);

  const updateCartQuantity = (cartKey, delta) => {
    setCartItems((current) => current.map((item) => {
      if (item.key !== cartKey) {
        return item;
      }

      return {
        ...item,
        quantity: Math.max(1, item.quantity + delta)
      };
    }));
  };

  const removeCartItem = (cartKey) => {
    setCartItems((current) => current.filter((item) => item.key !== cartKey));
  };

  const openCart = () => {
    setIsCartOpen(true);
    setCartStep('cart');
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setCustomerErrors({});
  };

  const goToCheckoutDetails = () => {
    if (cartItems.length === 0) {
      return;
    }

    setCartStep('details');
  };

  const handleCustomerInputChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((current) => ({
      ...current,
      [name]: value
    }));

    setCustomerErrors((current) => ({
      ...current,
      [name]: ''
    }));
  };

  const proceedToPayment = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!customerDetails.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!customerDetails.contactNumber.trim()) {
      nextErrors.contactNumber = 'Contact number is required.';
    }

    if (!customerDetails.address.trim()) {
      nextErrors.address = 'Address is required.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setCustomerErrors(nextErrors);
      return;
    }

    setCustomerErrors({});
    setCartStep('payment');
  };

  const handleCardKeyDown = (event, product) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      addToCart(product);
    }
  };

  return (
    <>
      <div className="top-banner">
        <span style={{ color: 'var(--secondary-color)' }}>ORDER FRESH BAKE HERE</span>
      </div>

      <FadeDownNav>
        <header className="navbar">
          <div className="nav-left nav-left-desktop">
            <button className="nav-icon-button" type="button" aria-label="Smiling face button">
              <img src="/smiling face.png" alt="Smiling face" className="nav-icon" />
            </button>
          </div>

          <div className="nav-mobile-left" aria-hidden="true">
            <button className="mobile-nav-icon-button" type="button" aria-label="Open menu">
              <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <button className="mobile-nav-icon-button" type="button" aria-label="Search">
              <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <div className="nav-center">
            {/* Kept original logo reference */}
            <img src="/labulogo.png" alt="Labu+labu" className="logo" onError={(e) => e.target.outerHTML='<h2 class="logo-text">Labu+labu</h2>'} />
          </div>

          <div className="nav-mobile-right" aria-hidden="true">
            <button className="mobile-nav-icon-button" type="button" aria-label="Account">
              <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 0 0-16 0"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button className={`mobile-nav-icon-button mobile-cart-icon-button${cartPulse ? ' cart-pulse' : ''}`} type="button" aria-label="Cart" onClick={openCart}>
              <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h15l-1.5 9h-11z"></path>
                <path d="M6 8L4 4H2"></path>
              </svg>
              <span className="mobile-cart-badge">{totalCartQuantity}</span>
            </button>
          </div>

          <div className="nav-right nav-right-desktop">
            <button className={`nav-icon-button nav-cart-icon-button${cartPulse ? ' cart-pulse' : ''}`} type="button" aria-label="Open cart" onClick={openCart}>
              <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8h15l-1.5 9h-11z"></path>
                <path d="M6 8L4 4H2"></path>
              </svg>
              <span className="desktop-cart-badge">{totalCartQuantity}</span>
            </button>
            <button className="nav-icon-button" type="button" aria-label="Heart button">
              <img
                src="/Hear.png"
                alt="Heart"
                className="nav-icon"
                onError={(e) => { e.currentTarget.src = '/backery/backeryupdate/Heart.png'; }}
              />
            </button>
          </div>
        </header>
      </FadeDownNav>

      {showOrderSetup && (
        <div className="order-setup-overlay" role="dialog" aria-modal="true" aria-labelledby="order-setup-title">
          <div className={`order-setup-modal${orderSetupStep > 1 ? ' with-back' : ''}`}>
            {orderSetupStep > 1 && (
              <button
                type="button"
                className="modal-back-button"
                onClick={() => setOrderSetupStep(orderSetupStep - 1)}
                aria-label="Back"
              >
                Back
              </button>
            )}

            <div className="order-step-indicator" aria-hidden="true">
              <span className={orderSetupStep >= 1 ? 'step-dot active' : 'step-dot'}></span>
              <span className={orderSetupStep >= 2 ? 'step-dot active' : 'step-dot'}></span>
              <span className={orderSetupStep >= 3 ? 'step-dot active' : 'step-dot'}></span>
            </div>

            {orderSetupStep === 1 && (
              <div className="order-frame">
                <h2 id="order-setup-title">Choose order type</h2>
                <div className="order-step">
                  <div className="order-type-options">
                    <button
                      type="button"
                      className="option-button"
                      onClick={() => chooseOrderType('Delivery')}
                    >
                      Delivery
                    </button>
                    <button
                      type="button"
                      className="option-button"
                      onClick={() => chooseOrderType('Self Collect')}
                    >
                      Self Collect
                    </button>
                  </div>
                </div>
              </div>
            )}

            {orderSetupStep === 2 && (
              <div className="order-frame">
                <h2 id="order-setup-title">Choose outlet</h2>
                <div className="order-step">
                  <div className="outlet-options">
                    {outletOptions.map((outlet) => (
                      <button
                        key={outlet}
                        type="button"
                        className={selectedOutlet === outlet ? 'outlet-button active' : 'outlet-button'}
                        onClick={() => setSelectedOutlet(outlet)}
                      >
                        {outlet}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="confirm-order-setup"
                  onClick={goToDateStep}
                  disabled={!selectedOutlet}
                >
                  Next
                </button>
              </div>
            )}

            {orderSetupStep === 3 && (
              <div className="order-frame">
                <h2 id="order-setup-title">Choose date</h2>
                <div className="order-step">
                  <div className="date-options">
                    {dateOptions.map((dateOption) => (
                      <button
                        key={dateOption.value}
                        type="button"
                        className={selectedDate === dateOption.value ? 'date-option-button active' : 'date-option-button'}
                        onClick={() => setSelectedDate(dateOption.value)}
                      >
                        {dateOption.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="confirm-order-setup"
                  onClick={saveDummyOrderSelection}
                  disabled={!selectedDate}
                >
                  Confirm options
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
              {(() => {
                const selectedPack = selectedPackForProduct(product);
                const currentCartKey = `${product.id}-${selectedPack || 'standard'}`;

                return (
              <div
                className="product-card-clickable"
                role="button"
                tabIndex={0}
                onClick={() => addToCart(product)}
                onKeyDown={(event) => handleCardKeyDown(event, product)}
                aria-label={`Add ${product.title} to cart`}
              >
                <div className="card-image-wrapper">
                  {product.img ? (
                    <img src={product.img} alt={product.title} className="product-image" />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                  <span className={`added-feedback-pill${recentlyAddedKey === currentCartKey ? ' visible' : ''}`}>
                    Added
                  </span>
                </div>
                <div className="card-content">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="description" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    ESPRESSO, OAT MILK, CARAMEL DRIZZLE
                  </p>
                  <p className="price">RM {PRODUCT_PRICE.toFixed(2)}</p>

                  <div className="product-card-actions">
                    {requiresPackSelection(product) && (
                      <div className="pack-selector" onClick={(event) => event.stopPropagation()}>
                        <div className="pack-buttons">
                          <button
                            type="button"
                            className={selectedPack === '4pcs' ? 'pack-button active' : 'pack-button'}
                            onClick={() => choosePackSize(product.id, '4pcs')}
                          >
                            4pcs
                          </button>
                          <button
                            type="button"
                            className={selectedPack === '8pcs' ? 'pack-button active' : 'pack-button'}
                            onClick={() => choosePackSize(product.id, '8pcs')}
                          >
                            8pcs
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="add-to-cart-button"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={requiresPackSelection(product) && !selectedPack}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
                );
              })()}
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
              <div className="third-party-logo" aria-label="Third party partner">
                <svg viewBox="0 0 48 48" className="third-party-icon" role="img" aria-hidden="true">
                  <circle cx="24" cy="24" r="22" />
                  <path d="M15 30l9-14 9 14h-4l-5-8-5 8z" fill="var(--background-color)" />
                </svg>
                <span>Third Party Partner</span>
              </div>
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

      <button className={`floating-cart-button${cartPulse ? ' cart-pulse' : ''}`} type="button" aria-label="Open cart" onClick={openCart}>
        <svg viewBox="0 0 24 24" className="floating-cart-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8h15l-1.5 9h-11z"></path>
          <path d="M6 8L4 4H2"></path>
        </svg>
        <span className="floating-cart-badge">{totalCartQuantity}</span>
      </button>

      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart} role="presentation">
          <aside className="cart-drawer" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Shopping cart">
            <div className="cart-header">
              <h2>
                {cartStep === 'cart' && 'Your Cart'}
                {cartStep === 'details' && 'Checkout Details'}
                {cartStep === 'payment' && 'Payment Method'}
              </h2>
              <button type="button" className="cart-close-button" onClick={closeCart} aria-label="Close cart">Close</button>
            </div>

            {cartStep === 'cart' && (
              <>
                <div className="cart-items-wrap">
                  {cartItems.length === 0 ? (
                    <p className="cart-empty">No items yet. Add a product to continue.</p>
                  ) : (
                    cartItems.map((item) => (
                      <div key={item.key} className="cart-item">
                        <img src={item.image} alt={item.title} className="cart-item-image" />
                        <div className="cart-item-content">
                          <h3>{item.title}</h3>
                          {item.packSize && <p className="cart-item-meta">{item.packSize}</p>}
                          <p className="cart-item-price">RM {item.price.toFixed(2)}</p>
                        </div>
                        <div className="cart-item-actions">
                          <div className="qty-controller">
                            <button type="button" onClick={() => updateCartQuantity(item.key, -1)} aria-label="Decrease quantity">-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => updateCartQuantity(item.key, 1)} aria-label="Increase quantity">+</button>
                          </div>
                          <button type="button" className="remove-item-button" onClick={() => removeCartItem(item.key)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="cart-footer">
                  <p className="cart-total">Subtotal: RM {cartSubtotal.toFixed(2)}</p>
                  <button
                    type="button"
                    className="cart-proceed-button"
                    onClick={goToCheckoutDetails}
                    disabled={cartItems.length === 0}
                  >
                    Proceed
                  </button>
                </div>
              </>
            )}

            {cartStep === 'details' && (
              <div className="checkout-details-step">
                <div className="order-summary-card">
                  <h3>Order setup</h3>
                  <p><strong>Order type:</strong> {dummyOrderSelection?.orderType || 'Not selected'}</p>
                  <p><strong>Outlet:</strong> {dummyOrderSelection?.outlet || 'Not selected'}</p>
                  <p><strong>Date:</strong> {dummyOrderSelection?.date || 'Not selected'}</p>
                </div>

                <div className="order-summary-card">
                  <div className="order-summary-header">
                    <h3>Products in cart</h3>
                    <button type="button" className="edit-cart-button" onClick={() => setCartStep('cart')}>
                      Edit
                    </button>
                  </div>
                  {cartSummaryItems.length === 0 ? (
                    <p>No products added yet.</p>
                  ) : (
                    <div className="checkout-product-list">
                      {cartSummaryItems.map((item) => (
                        <div key={item.key} className="checkout-product-line">
                          <img src={item.image} alt={item.title} className="checkout-product-image" />
                          <div className="checkout-product-text">
                            <p className="checkout-product-title">{item.title}</p>
                            {item.packSize && <p className="checkout-product-meta">{item.packSize}</p>}
                            <div className="summary-qty-controller">
                              <button type="button" onClick={() => updateCartQuantity(item.key, -1)} aria-label="Decrease quantity">-</button>
                              <span>{item.quantity}</span>
                              <button type="button" onClick={() => updateCartQuantity(item.key, 1)} aria-label="Increase quantity">+</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="checkout-subtotal"><strong>Subtotal:</strong> RM {cartSubtotal.toFixed(2)}</p>
                </div>

                <form className="checkout-form" onSubmit={proceedToPayment}>
                  <label htmlFor="customerName">Name</label>
                  <input
                    id="customerName"
                    name="name"
                    type="text"
                    value={customerDetails.name}
                    onChange={handleCustomerInputChange}
                    required
                  />
                  {customerErrors.name && <p className="form-error">{customerErrors.name}</p>}

                  <label htmlFor="contactNumber">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    value={customerDetails.contactNumber}
                    onChange={handleCustomerInputChange}
                    required
                  />
                  {customerErrors.contactNumber && <p className="form-error">{customerErrors.contactNumber}</p>}

                  <label htmlFor="deliveryAddress">Address</label>
                  <textarea
                    id="deliveryAddress"
                    name="address"
                    value={customerDetails.address}
                    onChange={handleCustomerInputChange}
                    required
                  />
                  {customerErrors.address && <p className="form-error">{customerErrors.address}</p>}

                  <label htmlFor="orderRemark">Remark (optional)</label>
                  <textarea
                    id="orderRemark"
                    name="remark"
                    value={customerDetails.remark}
                    onChange={handleCustomerInputChange}
                  />

                  <div className="checkout-actions">
                    <button type="button" className="checkout-back-button" onClick={() => setCartStep('cart')}>
                      Back
                    </button>
                    <button type="submit" className="cart-proceed-button">Proceed Payment</button>
                  </div>
                </form>
              </div>
            )}

            {cartStep === 'payment' && (
              <div className="payment-step">
                <div className="order-summary-card">
                  <h3>Order summary</h3>
                  <p><strong>Order type:</strong> {dummyOrderSelection?.orderType || 'Not selected'}</p>
                  <p><strong>Outlet:</strong> {dummyOrderSelection?.outlet || 'Not selected'}</p>
                  <p><strong>Date:</strong> {dummyOrderSelection?.date || 'Not selected'}</p>
                  {cartSummaryItems.length > 0 && (
                    <div className="payment-items-block">
                      <p><strong>Items:</strong></p>
                      <div className="checkout-product-list">
                        {cartSummaryItems.map((item) => (
                          <div key={item.key} className="checkout-product-line">
                            <img src={item.image} alt={item.title} className="checkout-product-image" />
                            <div className="checkout-product-text">
                              <p className="checkout-product-title">{item.title}</p>
                              {item.packSize && <p className="checkout-product-meta">{item.packSize}</p>}
                              <div className="summary-qty-controller">
                                <button type="button" onClick={() => updateCartQuantity(item.key, -1)} aria-label="Decrease quantity">-</button>
                                <span>{item.quantity}</span>
                                <button type="button" onClick={() => updateCartQuantity(item.key, 1)} aria-label="Increase quantity">+</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p><strong>Subtotal:</strong> RM {cartSubtotal.toFixed(2)}</p>
                  <p><strong>Name:</strong> {customerDetails.name}</p>
                  <p><strong>Contact:</strong> {customerDetails.contactNumber}</p>
                  <p><strong>Address:</strong> {customerDetails.address}</p>
                  {customerDetails.remark && <p><strong>Remark:</strong> {customerDetails.remark}</p>}
                </div>
                <p className="payment-placeholder">Payment method setup is ready for your next instruction.</p>
                <button type="button" className="checkout-back-button" onClick={() => setCartStep('details')}>
                  Back to details
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
