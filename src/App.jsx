import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
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
  const navbarRef = useRef(null);
  const orderFilterRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('ALL');
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
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [expandedBannerIndex, setExpandedBannerIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isAccountPromptOpen, setIsAccountPromptOpen] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState('');
  const addFeedbackTimeoutRef = useRef(null);
  const cartPulseTimeoutRef = useRef(null);

  const categoryOptions = [
    'ALL',
    'BALL',
    'SPONGE CAKES',
    'LOAF CAKES',
    'ROLLS',
    'WHOLE & SLICED CAKES',
    'BOSTON PIE CAKES',
    'COOKIES'
  ];

  const outletOptions = [
    'Sunway Mentari - Bakery',
    'Nusa Sentral - Bakery',
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
        label: `${dateObj.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric'
        })}, ${dateObj.toLocaleDateString('en-US', { weekday: 'short' })}`
      };
    });
  }, []);

  const toInputDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isSameDaySelfCollectOutlet = (outletName) => (
    outletName === 'Nusa Sentral - Bakery' || outletName === 'Taman Indah Cheras - Cafe'
  );

  const products = [
    {
      id: 1,
      category: 'BALL',
      title: 'CHICKEN FLOSSIE BALLS',
      img: '/backery/Chicken Flossie Balls.png',
      tags: [
        { label: 'Best Seller', tone: 'highlight' }
      ]
    },
    {
      id: 2,
      category: 'BALL',
      title: 'VEGETARIAN FLOSSIE BALLS',
      img: '/backery/Vegetarian Flossie Balls.png',
      tags: [
        { label: 'New', tone: 'default' }
      ]
    },
    {
      id: 3,
      category: 'BALL',
      title: 'SPICY SEAWEED CHICKEN FLOSSIE BALLS',
      img: '/backery/Chicken Flossie Balls.png',
      tags: [
        { label: 'Limited Edition', tone: 'highlight' }
      ]
    },
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

  const bannerSlides = [
    { id: 'banner-1', title: 'Freshly Baked Daily', img: '/backery/Chicken Flossie Balls.png' },
    { id: 'banner-2', title: 'Handcrafted Cakes', img: '/backery/Black Forest Cake.png' },
    { id: 'banner-3', title: 'Seasonal Signatures', img: '/backery/Slice Yam Burnt Cheesecake.png' }
  ];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const isRestrictedOutlet = isSameDaySelfCollectOutlet(selectedOutlet);
  const visibleDateOptions = isRestrictedOutlet ? dateOptions.slice(0, 1) : dateOptions;

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

  const effectiveOrderType = dummyOrderSelection?.orderType || orderType;
  const isOrderSetupComplete = Boolean(
    dummyOrderSelection?.orderType &&
    dummyOrderSelection?.outlet &&
    dummyOrderSelection?.date
  );
  const deliveryFee = effectiveOrderType === 'Delivery' ? 20 : 0;
  const cartGrandTotal = cartSubtotal + deliveryFee;

  const formatProductTitle = (title) => title
    .toLowerCase()
    .split(' ')
    .map((word) => (word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : ''))
    .join(' ');

  const formatCategoryLabel = (category) => {
    if (category === 'BALL') {
      return 'Balls';
    }

    return category
      .toLowerCase()
      .split(' ')
      .map((word) => (word === '&' ? '&' : `${word.charAt(0).toUpperCase()}${word.slice(1)}`))
      .join(' ');
  };

  const openOrderSetupIfIncomplete = () => {
    return false;
  };

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
  };

  const chooseOrderType = (type) => {
    setOrderType(type);
  };

  const goToDateStep = () => {
    if (!selectedOutlet) {
      return;
    }

    if (isSameDaySelfCollectOutlet(selectedOutlet)) {
      const todayValue = toInputDate(new Date());
      setSelectedDate(todayValue);
      setOrderType('Self Collect');
      setOrderSetupStep(2);
      return;
    }

    setSelectedDate('');
    setOrderSetupStep(2);
  };

  const goToOrderMethodStep = () => {
    if (!selectedDate) {
      return;
    }

    if (isSameDaySelfCollectOutlet(selectedOutlet)) {
      setOrderType('Self Collect');
      setOrderSetupStep(3);
      return;
    }

    setOrderType('');
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
    if (openOrderSetupIfIncomplete()) {
      return;
    }

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
          title: formatProductTitle(product.title),
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [bannerSlides.length]);

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
    if (openOrderSetupIfIncomplete()) {
      return;
    }
    setIsCartOpen(true);
    setCartStep('cart');
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setCustomerErrors({});
  };

  const goToCheckoutDetails = () => {
    if (openOrderSetupIfIncomplete()) {
      return;
    }

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

  const goToNextBanner = () => {
    setActiveBannerIndex((current) => (current + 1) % bannerSlides.length);
  };

  const goToPreviousBanner = () => {
    setActiveBannerIndex((current) => (current - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const handleCarouselTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleCarouselTouchEnd = (event) => {
    if (touchStartX === null) {
      return;
    }

    const endX = event.changedTouches[0].clientX;
    const delta = endX - touchStartX;

    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        goToNextBanner();
      } else {
        goToPreviousBanner();
      }
    }

    setTouchStartX(null);
  };

  const openCategoryDrawer = () => {
    setIsCategoryDrawerOpen(true);
  };

  const chooseCategoryFromDrawer = (category) => {
    setActiveCategory(category);
    setIsCategoryDrawerOpen(false);
  };

  const closeAccountPrompt = () => {
    setIsAccountPromptOpen(false);
  };

  const selectedDateLabel = dateOptions.find((option) => option.value === selectedDate)?.label || 'Choose date';
  const selectedOutletLabel = selectedOutlet
    ? selectedOutlet.split(' - ')[0]
    : 'Choose outlet';

  const syncOrderSelection = (nextOrderType, nextOutlet, nextDate) => {
    if (nextOrderType && nextOutlet && nextDate) {
      setDummyOrderSelection({
        orderType: nextOrderType,
        outlet: nextOutlet,
        date: nextDate,
        savedAt: new Date().toISOString()
      });
      return;
    }

    setDummyOrderSelection(null);
  };

  const handleOutletFilterChange = (nextOutlet) => {
    const restrictedOutlet = isSameDaySelfCollectOutlet(nextOutlet);
    const todayValue = toInputDate(new Date());
    const nextDate = restrictedOutlet ? todayValue : selectedDate;
    const nextOrderType = restrictedOutlet ? 'Self Collect' : orderType;

    setSelectedOutlet(nextOutlet);
    setSelectedDate(nextDate);
    setOrderType(nextOrderType);
    syncOrderSelection(nextOrderType, nextOutlet, nextDate);
    setOpenFilterDropdown('');
  };

  const handleDateFilterChange = (nextDate) => {
    setSelectedDate(nextDate);
    syncOrderSelection(orderType, selectedOutlet, nextDate);
    setOpenFilterDropdown('');
  };

  const handleOrderTypeFilterChange = (nextOrderType) => {
    setOrderType(nextOrderType);
    syncOrderSelection(nextOrderType, selectedOutlet, selectedDate);
    setOpenFilterDropdown('');
  };

  const toggleFilterDropdown = (dropdownName) => {
    setOpenFilterDropdown((current) => (current === dropdownName ? '' : dropdownName));
  };

  const closeFilterDropdowns = () => {
    setOpenFilterDropdown('');
  };

  const handleAccountLoginSubmit = (event) => {
    event.preventDefault();
    setIsAccountPromptOpen(false);
  };

  useEffect(() => {
    if (!isCategoryDrawerOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsCategoryDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCategoryDrawerOpen]);

  useEffect(() => {
    if (!navbarRef.current || typeof window === 'undefined') {
      return undefined;
    }

    const updateNavHeight = () => {
      const navHeight = Math.ceil(navbarRef.current.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--navbar-height', `${navHeight}px`);
    };

    updateNavHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateNavHeight();
    });

    resizeObserver.observe(navbarRef.current);
    window.addEventListener('resize', updateNavHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateNavHeight);
      document.documentElement.style.removeProperty('--navbar-height');
    };
  }, []);

  useEffect(() => {
    if (!openFilterDropdown) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!orderFilterRef.current || orderFilterRef.current.contains(event.target)) {
        return;
      }
      closeFilterDropdowns();
    };

    const handleEscapeClose = (event) => {
      if (event.key === 'Escape') {
        closeFilterDropdowns();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleEscapeClose);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleEscapeClose);
    };
  }, [openFilterDropdown]);

  return (
    <>
      <div className="top-banner">
        <span style={{ color: 'var(--secondary-color)' }}>ORDER FRESH BAKE HERE</span>
      </div>

      <header className="navbar" ref={navbarRef}>
          <div className="nav-left nav-left-desktop">
            <button className="nav-icon-button" type="button" aria-label="Open category menu" onClick={openCategoryDrawer}>
              <svg viewBox="0 0 24 24" className="nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="nav-mobile-left" aria-hidden="true">
            <button className="mobile-nav-icon-button mobile-smile-button" type="button" aria-label="Open category menu" onClick={openCategoryDrawer}>
              <svg viewBox="0 0 24 24" className="mobile-nav-icon" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="nav-center">
            {/* Kept original logo reference */}
            <img src="/labulogo.png" alt="Labu+labu" className="logo" onError={(e) => e.target.outerHTML='<h2 class="logo-text">Labu+labu</h2>'} />
          </div>

          <div className="nav-mobile-right" aria-hidden="true">
            <button className="mobile-nav-icon-button mobile-account-icon-button" type="button" aria-label="Account options" onClick={() => setIsAccountPromptOpen(true)}>
              <img src="/smiling face.png" alt="Smiling face" className="mobile-smile-icon" />
            </button>
          </div>

          <div className="nav-right nav-right-desktop">
            <button className="nav-icon-button" type="button" aria-label="Account options" onClick={() => setIsAccountPromptOpen(true)}>
              <img
                src="/smiling face.png"
                alt="Smiling face"
                className="nav-icon"
                onError={(e) => { e.currentTarget.src = '/backery/backeryupdate/smiling face.png'; }}
              />
            </button>
          </div>
      </header>

      <section className="sticky-order-filters" aria-label="Order filters">
        <div className="container sticky-order-filters-inner" ref={orderFilterRef}>
          <div className="order-filter-field">
            <label id="order-filter-outlet-label">Outlet</label>
            <div className={openFilterDropdown === 'outlet' ? 'order-filter-dropdown is-open' : 'order-filter-dropdown'}>
              <button
                type="button"
                className="order-filter-trigger"
                aria-haspopup="listbox"
                aria-expanded={openFilterDropdown === 'outlet'}
                aria-labelledby="order-filter-outlet-label"
                onClick={() => toggleFilterDropdown('outlet')}
              >
                <span className="order-filter-trigger-text">{selectedOutletLabel}</span>
                <span className="order-filter-chevron" aria-hidden="true">⌄</span>
              </button>

              {openFilterDropdown === 'outlet' && (
                <ul className="order-filter-menu" role="listbox" aria-labelledby="order-filter-outlet-label">
                  {outletOptions.map((outlet) => (
                    <li key={`sticky-${outlet}`}>
                      <button
                        type="button"
                        className={selectedOutlet === outlet ? 'order-filter-option active' : 'order-filter-option'}
                        onClick={() => handleOutletFilterChange(outlet)}
                      >
                        {outlet}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="order-filter-field">
            <label id="order-filter-date-label">Date</label>
            <div className={openFilterDropdown === 'date' ? 'order-filter-dropdown is-open' : 'order-filter-dropdown'}>
              <button
                type="button"
                className="order-filter-trigger"
                aria-haspopup="listbox"
                aria-expanded={openFilterDropdown === 'date'}
                aria-labelledby="order-filter-date-label"
                onClick={() => toggleFilterDropdown('date')}
                disabled={!selectedOutlet}
              >
                <span className="order-filter-trigger-text">{selectedDateLabel}</span>
                <span className="order-filter-chevron" aria-hidden="true">⌄</span>
              </button>

              {openFilterDropdown === 'date' && selectedOutlet && (
                <ul className="order-filter-menu" role="listbox" aria-labelledby="order-filter-date-label">
                  {visibleDateOptions.map((dateOption) => (
                    <li key={`sticky-${dateOption.value}`}>
                      <button
                        type="button"
                        className={selectedDate === dateOption.value ? 'order-filter-option active' : 'order-filter-option'}
                        onClick={() => handleDateFilterChange(dateOption.value)}
                      >
                        {dateOption.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="order-filter-field">
            <label id="order-filter-method-label">Order Method</label>
            <div className={openFilterDropdown === 'method' ? 'order-filter-dropdown is-open' : 'order-filter-dropdown'}>
              <button
                type="button"
                className="order-filter-trigger"
                aria-haspopup="listbox"
                aria-expanded={openFilterDropdown === 'method'}
                aria-labelledby="order-filter-method-label"
                onClick={() => toggleFilterDropdown('method')}
                disabled={!selectedOutlet || !selectedDate}
              >
                <span className="order-filter-trigger-text">{orderType || 'Choose method'}</span>
                <span className="order-filter-chevron" aria-hidden="true">⌄</span>
              </button>

              {openFilterDropdown === 'method' && selectedOutlet && selectedDate && (
                <ul className="order-filter-menu" role="listbox" aria-labelledby="order-filter-method-label">
                  <li>
                    <button
                      type="button"
                      className={orderType === 'Delivery' ? 'order-filter-option active' : 'order-filter-option'}
                      onClick={() => handleOrderTypeFilterChange('Delivery')}
                      disabled={isRestrictedOutlet}
                    >
                      Delivery
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className={orderType === 'Self Collect' ? 'order-filter-option active' : 'order-filter-option'}
                      onClick={() => handleOrderTypeFilterChange('Self Collect')}
                    >
                      Self Collect
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="carousel-section container" aria-label="Promotional banners">
        <div
          className="banner-carousel"
          onTouchStart={handleCarouselTouchStart}
          onTouchEnd={handleCarouselTouchEnd}
        >
          <div className="banner-track" style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}>
            {bannerSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className="banner-slide"
                onClick={() => setExpandedBannerIndex(index)}
                aria-label={`View banner: ${slide.title}`}
              >
                <img src={slide.img} alt={slide.title} className="banner-slide-image" />
                <span className="banner-slide-title">{slide.title}</span>
              </button>
            ))}
          </div>

          <button type="button" className="banner-nav banner-nav-prev" onClick={goToPreviousBanner} aria-label="Previous banner">
            ‹
          </button>
          <button type="button" className="banner-nav banner-nav-next" onClick={goToNextBanner} aria-label="Next banner">
            ›
          </button>

          <div className="banner-dots" role="tablist" aria-label="Banner selector">
            {bannerSlides.map((slide, index) => (
              <button
                key={`${slide.id}-dot`}
                type="button"
                className={index === activeBannerIndex ? 'banner-dot active' : 'banner-dot'}
                onClick={() => setActiveBannerIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <main className="main-content container">
        <section className="top-category-bar" aria-label="Product categories">
          <ul className="filter-list top-filter-list">
              {categoryOptions.map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className={activeCategory === category ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(category);
                    }}
                  >
                    {category === 'BALL' ? 'BALLS' : category}
                  </a>
                </li>
              ))}
          </ul>
        </section>

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
                aria-label={`Add ${formatProductTitle(product.title)} to cart`}
              >
                <div className="card-image-wrapper">
                  {Array.isArray(product.tags) && product.tags.length > 0 && (
                    <div className="product-tag-stack" aria-label="Product tags">
                      {product.tags.map((tag) => (
                        <span
                          key={`${product.id}-${tag.label}`}
                          className={tag.tone ? `product-tag ${tag.tone}` : 'product-tag'}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {product.img ? (
                    <img src={product.img} alt={formatProductTitle(product.title)} className="product-image" />
                  ) : (
                    <div className="image-placeholder"></div>
                  )}
                  <span className={`added-feedback-pill${recentlyAddedKey === currentCartKey ? ' visible' : ''}`}>
                    Added
                  </span>
                </div>
                <div className="card-content">
                  <h3 className="product-title">{formatProductTitle(product.title)}</h3>
                  <p className="description" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Espresso, Oat Milk, Caramel, Drizzle
                  </p>

                  <div className="product-card-actions">
                    <p className="price">RM {PRODUCT_PRICE.toFixed(2)}</p>
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

      <section className="faq-section container" aria-labelledby="faq-title">
        <h2 id="faq-title">FAQ</h2>
        <div className="faq-grid faq-category-grid">
          <details className="faq-category" open>
            <summary>About Product</summary>
            <div className="faq-category-content">
              <details className="faq-item" open>
                <summary>How early should I place my order?</summary>
                <p>Please place your order at least 1 day in advance for best availability.</p>
              </details>
              <details className="faq-item">
                <summary>Can I request same-day orders?</summary>
                <p>Selected items may be available the same day depending on stock and production schedule.</p>
              </details>
              <details className="faq-item">
                <summary>Can I customize cake wording?</summary>
                <p>Short wording requests are available for selected whole cakes. Add your note in checkout remark.</p>
              </details>
            </div>
          </details>

          <details className="faq-category">
            <summary>About Delivery</summary>
            <div className="faq-category-content">
              <details className="faq-item" open>
                <summary>How much is delivery fee?</summary>
                <p>Delivery orders include a flat RM 20 delivery fee.</p>
              </details>
              <details className="faq-item">
                <summary>Can I change delivery address after placing order?</summary>
                <p>You can update it before payment confirmation by editing your checkout details.</p>
              </details>
              <details className="faq-item">
                <summary>Is delivery available for all outlets?</summary>
                <p>Nusa Sentral and Taman Indah Cheras are same-day self collect only.</p>
              </details>
            </div>
          </details>

          <details className="faq-category">
            <summary>About Self Collect</summary>
            <div className="faq-category-content">
              <details className="faq-item" open>
                <summary>How do I choose a pickup time?</summary>
                <p>Choose your outlet and date first, then our team will confirm the pickup timing.</p>
              </details>
              <details className="faq-item">
                <summary>Can someone else collect on my behalf?</summary>
                <p>Yes, share your order name and contact number with the person collecting.</p>
              </details>
              <details className="faq-item">
                <summary>Can I switch between delivery and self collect?</summary>
                <p>Yes, you can update order method before completing checkout.</p>
              </details>
            </div>
          </details>
        </div>
      </section>

      <footer className="site-footer container">
        <div className="footer-content" id="contact">
          <a
            className="map-link-card"
            href="https://maps.app.goo.gl/bPjK4z7ARuuCEjg18"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Labu+labu location in Google Maps"
          >
            <div className="map-frame-wrap">
              <iframe
                title="Labu+labu location map"
                src="https://www.google.com/maps?q=Labu+labu+Bakery+Cafe+Kuala+Lumpur&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </a>
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
                <img src="/labufb.png" alt="Facebook" className="social-logo" />
              </a>
              <a href="https://www.instagram.com/labulabubakery" target="_blank" rel="noreferrer">
                <img src="/labuinsta.png" alt="Instagram" className="social-logo" />
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
                  {deliveryFee > 0 && <p className="cart-fee">Delivery fee: RM {deliveryFee.toFixed(2)}</p>}
                  <p className="cart-grand-total">Total: RM {cartGrandTotal.toFixed(2)}</p>
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
                  {deliveryFee > 0 && <p className="checkout-subtotal"><strong>Delivery fee:</strong> RM {deliveryFee.toFixed(2)}</p>}
                  <p className="checkout-subtotal"><strong>Total:</strong> RM {cartGrandTotal.toFixed(2)}</p>
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
                  {deliveryFee > 0 && <p><strong>Delivery fee:</strong> RM {deliveryFee.toFixed(2)}</p>}
                  <p><strong>Total:</strong> RM {cartGrandTotal.toFixed(2)}</p>
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

      {isAccountPromptOpen && (
        <div className="account-prompt-overlay" onClick={closeAccountPrompt} role="presentation">
          <div className="account-prompt-modal" role="dialog" aria-modal="true" aria-label="Account options" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="account-prompt-close" onClick={closeAccountPrompt} aria-label="Close account options">×</button>
            <h3>Login</h3>
            <p>Sign in to continue your order.</p>

            <form className="account-login-form" onSubmit={handleAccountLoginSubmit}>
              <label htmlFor="accountEmail">Email</label>
              <input id="accountEmail" name="email" type="email" placeholder="name@email.com" required />

              <label htmlFor="accountPassword">Password</label>
              <input id="accountPassword" name="password" type="password" placeholder="Enter your password" required />

              <button type="submit" className="account-action-button primary">Login</button>
            </form>

            <div className="account-text-links">
              <button type="button" className="account-link-button" onClick={closeAccountPrompt}>Sign Up</button>
              <button type="button" className="account-link-button" onClick={closeAccountPrompt}>Forgot Password?</button>
              <button type="button" className="account-guest-link" onClick={closeAccountPrompt}>Continue as Guest</button>
            </div>
          </div>
        </div>
      )}

      <div
        className={isCategoryDrawerOpen ? 'category-drawer-overlay is-open' : 'category-drawer-overlay'}
        onClick={() => setIsCategoryDrawerOpen(false)}
        role="presentation"
        aria-hidden={!isCategoryDrawerOpen}
      >
        <aside
          className={isCategoryDrawerOpen ? 'category-drawer is-open' : 'category-drawer'}
          role="dialog"
          aria-modal="true"
          aria-label="Category menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="category-drawer-top-row">
            <button type="button" className="category-drawer-close-inline" onClick={() => setIsCategoryDrawerOpen(false)}>
              <span aria-hidden="true">×</span>
              <span>Close</span>
            </button>
          </div>

          <ul className="category-drawer-list">
            {categoryOptions.map((category) => (
              <li key={`drawer-${category}`}>
                <button
                  type="button"
                  className={activeCategory === category ? 'category-drawer-item active' : 'category-drawer-item'}
                  onClick={() => chooseCategoryFromDrawer(category)}
                >
                  <span>{formatCategoryLabel(category)}</span>
                  <span className="category-drawer-chevron" aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {expandedBannerIndex !== null && (
        <div className="banner-modal-overlay" onClick={() => setExpandedBannerIndex(null)} role="presentation">
          <div className="banner-modal" role="dialog" aria-modal="true" aria-label="Expanded banner" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="banner-modal-close" onClick={() => setExpandedBannerIndex(null)} aria-label="Close banner preview">
              Close
            </button>
            <img
              src={bannerSlides[expandedBannerIndex].img}
              alt={bannerSlides[expandedBannerIndex].title}
              className="banner-modal-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
