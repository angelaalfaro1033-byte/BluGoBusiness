import { useMemo, useState } from 'react'
import heroImage from './assets/casa-miel-hero.png'

type IconName =
  | 'bag'
  | 'search'
  | 'plus'
  | 'minus'
  | 'x'
  | 'sparkles'
  | 'game'
  | 'star'
  | 'arrow'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'globe'
  | 'coffee'

const icons: Record<IconName, React.ReactNode> = {
  bag: <><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  sparkles: <><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" /><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14ZM19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13Z" /></>,
  game: <><path d="M8.2 7h7.6a4 4 0 0 1 3.8 2.7l1.7 5a2.5 2.5 0 0 1-4 2.7L15 15h-6l-2.3 2.4a2.5 2.5 0 0 1-4-2.7l1.7-5A4 4 0 0 1 8.2 7Z" /><path d="M7 10v4M5 12h4M16 11h.01M18 13h.01" /></>,
  star: <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.3-4.2 6-.9L12 3Z" />,
  arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
  facebook: <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" />,
  tiktok: <path d="M15 3c.4 2.4 1.8 3.8 4 4v4c-1.5 0-2.8-.4-4-1v6a6 6 0 1 1-6-6v4a2 2 0 1 0 2 2V3h4Z" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
  coffee: <><path d="M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z" /><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2" /></>,
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}

const categories = ['Todos', 'Cafés', 'Bebidas frías', 'Tortas', 'Galletas', 'Postres', 'Snacks']

const products = [
  { id: 1, name: 'Cappuccino de casa', description: 'Espresso doble, leche sedosa y cacao.', price: 8900, category: 'Cafés', tag: 'Favorito', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Latte vainilla', description: 'Vainilla natural y espuma aterciopelada.', price: 10500, category: 'Cafés', image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Mocha intenso', description: 'Chocolate oscuro, espresso y leche.', price: 11500, category: 'Cafés', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Cold brew naranja', description: 'Infusión lenta, naranja y hielo.', price: 9900, category: 'Bebidas frías', tag: 'Refrescante', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Limonada de coco', description: 'Coco cremoso, limón fresco y hielo.', price: 10900, category: 'Bebidas frías', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Torta de zanahoria', description: 'Especias cálidas y crema de queso.', price: 12000, category: 'Tortas', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=85' },
  { id: 7, name: 'Cheesecake de frutos rojos', description: 'Cremoso, con compota artesanal.', price: 13500, category: 'Postres', tag: 'Nuevo', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85' },
  { id: 8, name: 'Galleta de chocolate', description: 'Centro suave y chips de chocolate.', price: 5500, category: 'Galletas', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85' },
  { id: 9, name: 'Brownie de cacao', description: 'Chocolate al 70% y escamas de sal.', price: 7500, category: 'Postres', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85' },
  { id: 10, name: 'Croissant de almendras', description: 'Hojaldre crujiente y crema de almendra.', price: 8000, category: 'Snacks', tag: 'Horneado hoy', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85' },
  { id: 11, name: 'Torta de chocolate', description: 'Bizcocho húmedo y ganache de cacao.', price: 12500, category: 'Tortas', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85' },
  { id: 12, name: 'Affogato', description: 'Helado de vainilla bañado en espresso.', price: 9500, category: 'Postres', image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=900&q=85' },
]

const money = (value: number) => `$ ${new Intl.NumberFormat('es-CO').format(value)}`

function Quantity({ value, onChange, compact = false }: { value: number; onChange: (value: number) => void; compact?: boolean }) {
  return (
    <div className={`quantity ${compact ? 'quantity--compact' : ''}`} aria-label="Selector de cantidad">
      <button onClick={() => onChange(value - 1)} aria-label="Restar uno"><Icon name="minus" size={15} /></button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Sumar uno"><Icon name="plus" size={15} /></button>
    </div>
  )
}

function ProductCard({ product, quantity, onAdd, onQuantity }: { product: typeof products[number]; quantity: number; onAdd: () => void; onQuantity: (value: number) => void }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        {product.tag && <span className="product-tag">{product.tag}</span>}
      </div>
      <div className="product-content">
        <div className="product-topline">
          <h3>{product.name}</h3>
          <span className="product-price">{money(product.price)}</span>
        </div>
        <p>{product.description}</p>
        {quantity > 0 ? (
          <Quantity value={quantity} onChange={onQuantity} />
        ) : (
          <button className="add-button" onClick={onAdd}>Agregar <Icon name="plus" size={17} /></button>
        )}
      </div>
    </article>
  )
}

function App() {
  const [category, setCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orderOpen, setOrderOpen] = useState(false)
  const [recommended, setRecommended] = useState(products[9])
  const [spinning, setSpinning] = useState(false)

  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category
    const normalized = `${product.name} ${product.description}`.toLowerCase()
    return matchesCategory && normalized.includes(query.toLowerCase())
  }), [category, query])

  const cartItems = products.filter((product) => cart[product.id])
  const totalItems = Object.values(cart).reduce((sum, amount) => sum + amount, 0)
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0)

  const updateQuantity = (id: number, amount: number) => {
    setCart((current) => {
      if (amount <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: amount }
    })
  }

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    window.setTimeout(() => {
      const options = products.filter((product) => product.id !== recommended.id)
      setRecommended(options[Math.floor(Math.random() * options.length)])
      setSpinning(false)
    }, 850)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Casa Miel, ir al inicio">
          <span className="brand-mark"><Icon name="coffee" size={23} /></span>
          <span><strong>Casa Miel</strong><small>café & repostería</small></span>
        </a>
        <button className="cart-trigger" onClick={() => setCartOpen(true)}>
          <Icon name="bag" size={20} /><span>Tu pedido</span>
          {totalItems > 0 && <b>{totalItems}</b>}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><i /> Preparado con calma</span>
            <h1>Sabores que acompañan <em>tu momento.</em></h1>
            <p>Elige algo delicioso, nosotros nos encargamos del resto.</p>
            <a href="#menu" className="hero-link">Explorar el menú <Icon name="arrow" size={18} /></a>
          </div>
          <div className="hero-visual">
            <img src={heroImage} alt="Cappuccino y croissant de Casa Miel" />
            <div className="hero-note"><span>Hecho en casa</span><strong>con ingredientes honestos</strong></div>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading">
            <div><span className="section-kicker">Nuestra carta</span><h2>¿Qué se te antoja hoy?</h2></div>
            <p>{filtered.length} opciones para disfrutar</p>
          </div>

          <div className="menu-tools">
            <label className="search-box">
              <Icon name="search" size={20} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en el menú..." aria-label="Buscar productos" />
              {query && <button onClick={() => setQuery('')} aria-label="Limpiar búsqueda"><Icon name="x" size={15} /></button>}
            </label>
            <div className="chips" role="group" aria-label="Categorías del menú">
              {categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} quantity={cart[product.id] || 0} onAdd={() => updateQuantity(product.id, 1)} onQuantity={(amount) => updateQuantity(product.id, amount)} />
              ))}
            </div>
          ) : (
            <div className="empty-state"><Icon name="search" size={28} /><h3>No encontramos ese antojo</h3><p>Prueba con otra búsqueda o categoría.</p></div>
          )}
        </section>

        <section className="roulette-section">
          <div className="roulette-copy">
            <span className="section-kicker">Ruleta de recomendaciones</span>
            <h2>¿No sabes qué pedir?</h2>
            <p>Déjate sorprender. Un giro y te recomendamos algo delicioso de nuestra carta.</p>
            <button onClick={spin} disabled={spinning} className="spin-button"><Icon name="sparkles" size={19} /> {spinning ? 'Buscando tu antojo...' : 'Girar la ruleta'}</button>
          </div>
          <div className={`recommendation-card ${spinning ? 'is-spinning' : ''}`}>
            <div className="roulette-wheel">
              <span>Café</span><span>Dulce</span><span>Frío</span><span>Horno</span>
              <div><Icon name="sparkles" size={24} /></div>
            </div>
            <div className="recommendation-result">
              <img src={recommended.image} alt="" />
              <div><small>Hoy te recomendamos</small><strong>{recommended.name}</strong><span>{money(recommended.price)}</span></div>
              <button onClick={() => updateQuantity(recommended.id, (cart[recommended.id] || 0) + 1)} aria-label={`Agregar ${recommended.name}`}><Icon name="plus" size={18} /></button>
            </div>
          </div>
        </section>

        <section className="extras-section">
          <a className="extra-card review-card" href="https://search.google.com/local/writereview?placeid=ChIJeT-vHwDFOI4R7HQHWrITPeQ" target="_blank" rel="noreferrer">
            <span className="extra-icon"><Icon name="star" size={23} /></span>
            <div><small>Tu opinión es importante</small><h3>Califica tu experiencia</h3><p>Déjanos tu reseña en Google</p></div>
            <Icon name="arrow" size={20} />
          </a>
          <a className="extra-card game-card" href="https://artsandculture.google.com/play" target="_blank" rel="noreferrer">
            <span className="extra-icon"><Icon name="game" size={25} /></span>
            <div><small>Mientras esperas</small><h3>Haz más divertida tu espera</h3><p>Explora juegos de arte y cultura</p></div>
            <Icon name="arrow" size={20} />
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <div className="brand brand--footer"><span className="brand-mark"><Icon name="coffee" size={23} /></span><span><strong>Casa Miel</strong><small>café & repostería</small></span></div>
          <p>Momentos simples, sabores memorables.</p>
        </div>
        <div className="footer-connect">
          <div><span className="section-kicker">Conecta con el restaurante</span><p>Síguenos y descubre más</p></div>
          <nav aria-label="Redes sociales">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Icon name="instagram" /></a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><Icon name="tiktok" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="facebook" /></a>
            <a href="#" aria-label="Página web"><Icon name="globe" /></a>
          </nav>
        </div>
        <div className="footer-bottom"><span>© 2025 Casa Miel</span><span>Hecho con cariño en Colombia</span></div>
      </footer>

      {totalItems > 0 && !cartOpen && (
        <button className="floating-cart" onClick={() => setCartOpen(true)}>
          <span><Icon name="bag" size={20} /><b>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</b></span>
          <span>{money(total)}</span>
        </button>
      )}

      <div className={`drawer-backdrop ${cartOpen ? 'visible' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
        <div className="drawer-header">
          <div><span className="section-kicker">Tu selección</span><h2>Resumen del pedido</h2></div>
          <button onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><Icon name="x" /></button>
        </div>
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty"><span><Icon name="bag" size={29} /></span><h3>Tu pedido está vacío</h3><p>Agrega algo delicioso del menú para comenzar.</p><button onClick={() => setCartOpen(false)}>Ver el menú</button></div>
          ) : (
            cartItems.map((product) => (
              <div className="cart-item" key={product.id}>
                <img src={product.image} alt="" />
                <div><h3>{product.name}</h3><span>{money(product.price * cart[product.id])}</span><Quantity compact value={cart[product.id]} onChange={(amount) => updateQuantity(product.id, amount)} /></div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-line"><span>Total a pagar</span><strong>{money(total)} <small>COP</small></strong></div>
            <p>El pago se realiza directamente en el restaurante.</p>
            <button className="waiter-button" onClick={() => setOrderOpen(true)}>Mostrar pedido al mesero <Icon name="arrow" size={18} /></button>
            <a className="waiting-link" href="https://artsandculture.google.com/play" target="_blank" rel="noreferrer"><Icon name="game" size={20} /><span><small>Mientras preparamos tu pedido</small>Juega mientras esperas</span><Icon name="arrow" size={17} /></a>
          </div>
        )}
      </aside>

      {orderOpen && (
        <div className="order-modal" role="dialog" aria-modal="true" aria-labelledby="order-title">
          <div className="order-sheet">
            <button className="modal-close" onClick={() => setOrderOpen(false)} aria-label="Cerrar resumen"><Icon name="x" /></button>
            <span className="order-check">✓</span>
            <span className="section-kicker">Listo para mostrar</span>
            <h2 id="order-title">Este es mi pedido</h2>
            <p className="order-intro">Muéstrale esta pantalla a nuestro equipo para confirmar.</p>
            <div className="order-list">
              {cartItems.map((product) => <div key={product.id}><span><b>{cart[product.id]}×</b> {product.name}</span><strong>{money(product.price * cart[product.id])}</strong></div>)}
            </div>
            <div className="order-total"><span>Total a pagar</span><strong>{money(total)} <small>COP</small></strong></div>
            <p className="thank-you">Gracias por elegir Casa Miel.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
