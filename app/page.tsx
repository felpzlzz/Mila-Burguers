"use client";

import Image from "next/image";
import {
  ArrowRight, CircleHelp,
  Clock3, CreditCard, Heart, House, Instagram, MapPin, Minus, Plus,
  QrCode, Receipt, ShoppingBag, ShoppingBasket, ShoppingCart, Trash2, Truck,
  WalletCards, X, MessageCircle
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Extra = { name: string; price: number };
type Product = {
  id: number; name: string; category: string; price: number; description: string;
  image: string; available: boolean; extras: Extra[];
};
type CartItem = {
  cartId: string; id: number; name: string; basePrice: number; image: string;
  quantity: number; extras: Extra[]; obs: string;
};
type Modal = "product" | "checkout" | "hours" | "info" | "payments" | null;

const PRODUCTS: Product[] = [
  {
    "id": 1,
    "name": "Milla Bacon Master",
    "category": "burgers",
    "price": 32.9,
    "description": "Pão brioche, hambúrguer artesanal 160g, tiras crocantes de bacon, queijo cheddar fatiado, cebola caramelizada e maionese especial da casa.",
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": [
      {
        "name": "Carne Extra 160g",
        "price": 10.0
      },
      {
        "name": "Bacon Extra",
        "price": 5.0
      },
      {
        "name": "Queijo Cheddar Extra",
        "price": 4.0
      }
    ]
  },
  {
    "id": 2,
    "name": "Double Cheddar Smash",
    "category": "burgers",
    "price": 28.9,
    "description": "Pão brioche, 2x smashes artesanais 90g, muito queijo cheddar cremoso, molho especial e picles refinado.",
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": [
      {
        "name": "Bacon Crocante",
        "price": 5.0
      },
      {
        "name": "Molho Especial Extra",
        "price": 3.0
      }
    ]
  },
  {
    "id": 3,
    "name": "Milla Chicken Crispy",
    "category": "burgers",
    "price": 27.9,
    "description": "Pão com gergelim, sobrecoxa empanada ultra crocante 150g, queijo prato, alface americana fresca, tomate e maionese de ervas.",
    "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": []
  },
  {
    "id": 4,
    "name": "Combo Quarteto Milla",
    "category": "combos",
    "price": 89.9,
    "description": "4x Burgers Artesanais Clássicos + Batata G Recheada + Refrigerante 2L bem gelado!",
    "image": "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": [
      {
        "name": "Trocar Bebida por Coca-Cola 2L",
        "price": 4.0
      }
    ]
  },
  {
    "id": 5,
    "name": "Combo Casal Especial",
    "category": "combos",
    "price": 59.9,
    "description": "2x Bacon Master + Batata M Crocante + 2x Canned Drinks.",
    "image": "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": []
  },
  {
    "id": 6,
    "name": "Batata Frita Rustica P",
    "category": "batatas",
    "price": 12.0,
    "description": "Batatas crocantes temperadas com sal de ervas e páprica doce.",
    "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": [
      {
        "name": "Adicionar Molho de Cheddar e Bacon",
        "price": 6.0
      }
    ]
  },
  {
    "id": 7,
    "name": "Batata Recheada Especial G",
    "category": "batatas",
    "price": 25.0,
    "description": "Porção generosa de batatas cobertas com cheddar cremoso derretido e pedaços reais de bacon.",
    "image": "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": []
  },
  {
    "id": 8,
    "name": "Pepsi Black / Pepsi Twist 2L",
    "category": "bebidas",
    "price": 12.0,
    "description": "Refrigerante Pepsi bem gelado!",
    "image": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": []
  },
  {
    "id": 9,
    "name": "Coca-Cola Lata 350ml",
    "category": "bebidas",
    "price": 7.0,
    "description": "Lata 350ml gelada.",
    "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80",
    "available": true,
    "extras": []
  }
];
const DELIVERY_FEE = 7;
const WHATSAPP_NUMBER = "5547984697110";
const STORAGE_KEY = "milla-burgers-cart-v1";

const categories = [
  { id: "all", label: "🍔 Todos", title: "Nosso Cardápio" },
  { id: "burgers", label: "🍔 Burgers", title: "🍔 Burgers Artesanais" },
  { id: "combos", label: "🔥 Combos", title: "🔥 Combos Promocionais" },
  { id: "batatas", label: "🍟 Batatas", title: "🍟 Batatas Crocantes" },
  { id: "bebidas", label: "🥤 Bebidas", title: "🥤 Bebidas Geladas" },
];

const hours = [
  ["Terça-Feira", "18:30 — 22:30", 2],
  ["Quarta-Feira", "18:30 — 22:30", 3],
  ["Quinta-Feira", "18:30 — 22:30", 4],
  ["Sexta-Feira", "18:30 — 00:00", 5],
  ["Sábado", "18:30 — 00:00", 6],
  ["Domingo", "18:30 — 22:30", 0],
  ["Segunda-Feira", "Fechado", 1],
] as const;

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function getBrazilDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: dayMap[get("weekday")] ?? 0, hour: Number(get("hour")), minute: Number(get("minute")) };
}

function getStoreStatus() {
  const { day, hour, minute } = getBrazilDate();
  const current = hour * 60 + minute;
  let open = false;
  let closesAt = "";
  if ([2, 3, 4, 0].includes(day)) {
    open = current >= 1110 && current <= 1350;
    closesAt = "22:30";
  } else if ([5, 6].includes(day)) {
    open = current >= 1110 || current <= 30;
    closesAt = "00:00";
  }
  return { open, day, closesAt };
}

export default function Home() {
  const [category, setCategory] = useState("all");
  const [modal, setModal] = useState<Modal>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [product, setProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [productObs, setProductObs] = useState("");
  const [store, setStore] = useState({ open: false, day: 0, closesAt: "" });
  const [hydrated, setHydrated] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setStore(getStoreStatus());
    setHydrated(true);
    const timer = window.setInterval(() => setStore(getStoreStatus()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    document.body.style.overflow = modal || cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, cartOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredProducts = useMemo(
    () => category === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => {
      const extras = item.extras.reduce((s, e) => s + e.price, 0);
      return sum + (item.basePrice + extras) * item.quantity;
    }, 0);
    const fee = orderType === "delivery" ? DELIVERY_FEE : 0;
    return { subtotal, fee, total: subtotal + fee, count: cart.reduce((s, i) => s + i.quantity, 0) };
  }, [cart, orderType]);

  function openProduct(p: Product) {
    if (!p.available) return;
    setProduct(p);
    setModalQty(1);
    setSelectedExtras([]);
    setProductObs("");
    setModal("product");
  }

  function addQuick(p: Product) {
    if (!p.available) return;
    setCart((current) => {
      const idx = current.findIndex((i) => i.id === p.id && i.extras.length === 0 && !i.obs);
      if (idx >= 0) return current.map((i, n) => n === idx ? { ...i, quantity: i.quantity + 1 } : i);
      return [...current, { cartId: crypto.randomUUID(), id: p.id, name: p.name, basePrice: p.price, image: p.image, quantity: 1, extras: [], obs: "" }];
    });
  }

  function addConfigured() {
    if (!product) return;
    setCart((current) => [...current, {
      cartId: crypto.randomUUID(), id: product.id, name: product.name, basePrice: product.price,
      image: product.image, quantity: modalQty, extras: selectedExtras, obs: productObs.trim(),
    }]);
    setModal(null);
    setCartOpen(true);
  }

  function changeCartQty(id: string, delta: number) {
    setCart((current) => current.flatMap((i) => {
      if (i.cartId !== id) return [i];
      const quantity = i.quantity + delta;
      return quantity > 0 ? [{ ...i, quantity }] : [];
    }));
  }

  function openCheckout() {
    if (!cart.length) {
      window.alert("Adicione produtos ao carrinho antes de continuar!");
      return;
    }
    setCartOpen(false);
    setModal("checkout");
  }

  function submitCheckout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const payment = String(form.get("payment") || "PIX");
    const change = String(form.get("change") || "").trim();
    const generalObs = String(form.get("obs") || "").trim();

    let address = "";
    if (orderType === "delivery") {
      const cep = String(form.get("cep") || "").trim();
      const neighborhood = String(form.get("neighborhood") || "").trim();
      const street = String(form.get("address") || "").trim();
      const number = String(form.get("number") || "").trim();
      const complement = String(form.get("complement") || "").trim();
      address = `*Endereço:* ${street}, Nº ${number} - ${neighborhood}${complement ? ` (${complement})` : ""}${cep ? ` | CEP: ${cep}` : ""}`;
    } else {
      address = "*Tipo:* 🛍️ RETIRADA NO BALCÃO";
    }

    let message = `🍔 *NOVO PEDIDO - MILLA BURGER'S* 🍔\n\n`;
    message += `*Cliente:* ${name}\n*Telefone:* ${phone}\n${address}\n\n`;
    message += `--------------------------------\n🛒 *ITENS DO PEDIDO:*\n\n`;
    cart.forEach((item) => {
      const extras = item.extras.reduce((s, e) => s + e.price, 0);
      const total = (item.basePrice + extras) * item.quantity;
      message += `▪ *${item.quantity}x ${item.name}* - ${money(total)}\n`;
      if (item.extras.length) message += `   └ *Adicionais:* ${item.extras.map((e) => e.name).join(", ")}\n`;
      if (item.obs) message += `   └ *Obs:* ${item.obs}\n`;
    });
    message += `\n--------------------------------\n`;
    message += `*Subtotal:* ${money(totals.subtotal)}\n`;
    if (orderType === "delivery") message += `*Taxa de Entrega:* ${money(totals.fee)}\n`;
    message += `*TOTAL:* ${money(totals.total)}\n--------------------------------\n\n`;
    message += `💳 *Forma de Pagamento:* ${payment}\n`;
    if (payment === "Dinheiro" && change) message += `*Troco para:* ${change}\n`;
    if (generalObs) message += `*Observações Gerais:* ${generalObs}\n`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSending(false);
  }

  const statusText = store.open ? "Aberto Agora" : "Fechado Agora";

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo-box" aria-label="Milla Burger's">
            <ShoppingBasket className="header-logo-icon" aria-hidden="true" />
          </div>
          <h1 className="brand-title">Milla <span>Burger’s</span></h1>
          <div className={`status-badge ${store.open ? "open" : "closed"}`}>
            <span className="status-dot" />
            <span>{statusText}</span>
          </div>
          <div className="info-pills">
            <div className="info-pill-item"><Truck size={16} /> Entrega (40-60m)</div>
            <div className="info-pill-item"><ShoppingBag size={16} /> Retirada (20-30m)</div>
          </div>
          <div className="header-actions">
            <button className="btn-header" onClick={() => setModal("hours")}><Clock3 size={16} /> Horários</button>
            <button className="btn-header" onClick={() => setModal("info")}><CircleHelp size={16} /> Informações</button>
            <button className="btn-header" onClick={() => setModal("payments")}><CreditCard size={16} /> Pagamentos</button>
          </div>
        </div>
      </header>

      <div className="categories-wrapper">
        <div className="container">
          <div className="categories-container" aria-label="Categorias do cardápio">
            {categories.map((c) => (
              <button key={c.id} className={`category-btn ${category === c.id ? "active" : ""}`} onClick={() => setCategory(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container menu-section" id="menu">
        <h2 className="section-title">{categories.find((c) => c.id === category)?.title ?? "Nosso Cardápio"}</h2>
        <div className="products-grid">
          {filteredProducts.map((p) => (
            <article key={p.id} className={`product-card ${!p.available ? "unavailable" : ""}`} onClick={() => openProduct(p)}>
              <div className="product-img-wrapper">
                <Image src={p.image} alt={p.name} className="product-img" fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw" />
                {!p.available && <span className="product-badge-unavailable">Indisponível</span>}
              </div>
              <div className="product-info">
                <h3 className="product-title">{p.name}</h3>
                <p className="product-description">{p.description}</p>
                <div className="product-footer">
                  <span className="product-price">{money(p.price)}</span>
                  <button className="btn-add" disabled={!p.available} onClick={(e) => { e.stopPropagation(); addQuick(p); }}>
                    {p.available ? <><Plus size={15} /> Adicionar</> : "Indisponível"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <button className="cart-float-btn" onClick={() => setCartOpen(true)} aria-label={`Abrir carrinho com ${totals.count} itens`}>
        <ShoppingCart size={20} /><span>Carrinho</span><span className="cart-badge">{totals.count}</span>
      </button>

      {cartOpen && <div className="modal-overlay active" style={{ zIndex: 1000 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setCartOpen(false); }}>
        <aside className="cart-drawer active" role="dialog" aria-modal="true" aria-label="Seu pedido">
          <div className="cart-header">
            <h3 className="cart-title"><ShoppingCart size={20} /> Seu Pedido</h3>
            <button className="modal-close" style={{ position: "static" }} onClick={() => setCartOpen(false)} aria-label="Fechar carrinho"><X /></button>
          </div>
          <div className="cart-body">
            <div className="cart-type-selector">
              <button className={`btn-type ${orderType === "delivery" ? "active" : ""}`} onClick={() => setOrderType("delivery")}>🚚 ENTREGA</button>
              <button className={`btn-type ${orderType === "pickup" ? "active" : ""}`} onClick={() => setOrderType("pickup")}>🛍️ RETIRADA</button>
            </div>
            {!cart.length ? (
              <div className="empty-state"><ShoppingBasket className="empty-state-icon" /><p>Seu carrinho está vazio.</p></div>
            ) : cart.map((item) => {
              const extras = item.extras.reduce((s, e) => s + e.price, 0);
              const itemTotal = (item.basePrice + extras) * item.quantity;
              return (
                <div className="cart-item" key={item.cartId}>
                  <Image src={item.image} alt="" className="cart-item-img" width={60} height={60} />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.name}</div>
                    {item.extras.length > 0 && <div className="cart-item-extras">+ {item.extras.map((e) => e.name).join(", ")}</div>}
                    {item.obs && <div className="cart-item-extras"><em>Obs: {item.obs}</em></div>}
                    <div className="cart-item-price">{money(itemTotal)}</div>
                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button className="btn-qty" onClick={() => changeCartQty(item.cartId, -1)} aria-label="Diminuir quantidade"><Minus size={16} /></button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="btn-qty" onClick={() => changeCartQty(item.cartId, 1)} aria-label="Aumentar quantidade"><Plus size={16} /></button>
                      </div>
                      <button className="btn-remove" onClick={() => setCart((c) => c.filter((x) => x.cartId !== item.cartId))}><Trash2 size={14} /> Remover</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row"><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
              <div className="summary-row" style={{ display: orderType === "delivery" ? "flex" : "none" }}><span>Taxa de Entrega</span><span>{money(totals.fee)}</span></div>
              <div className="summary-row total"><span>Total</span><span>{money(totals.total)}</span></div>
            </div>
            <button className="btn-submit" style={{ marginTop: 16 }} onClick={openCheckout}>Avançar para Checkout <ArrowRight size={18} /></button>
          </div>
        </aside>
      </div>}

      {modal === "product" && product && (
        <ModalShell onClose={() => setModal(null)} label="Detalhes do produto">
          <div className="modal-body">
            <Image src={product.image} alt={product.name} className="product-modal-img" width={900} height={500} priority />
            <h2 className="modal-title">{product.name}</h2>
            <p className="modal-product-description">{product.description}</p>
            <div className="modal-product-price">{money((product.price + selectedExtras.reduce((s,e)=>s+e.price,0)) * modalQty)}</div>
            {product.extras.length > 0 && <>
              <div className="option-group-title">Adicionais</div>
              {product.extras.map((extra) => {
                const checked = selectedExtras.some((e) => e.name === extra.name);
                return <label className="checkbox-option" key={extra.name}>
                  <span>{extra.name} <span className="modal-extra-price">(+{money(extra.price)})</span></span>
                  <input type="checkbox" checked={checked} onChange={() => setSelectedExtras((current) => checked ? current.filter((e) => e.name !== extra.name) : [...current, extra])} />
                </label>;
              })}
            </>}
            <div className="option-group-title">Observações</div>
            <textarea className="obs-textarea" value={productObs} onChange={(e) => setProductObs(e.target.value)} placeholder="Ex: Tirar salada, maionese à parte..." />
            <div className="modal-product-actions">
              <div className="quantity-control">
                <button className="btn-qty" onClick={() => setModalQty((q) => Math.max(1, q - 1))}><Minus /></button>
                <span className="qty-val">{modalQty}</span>
                <button className="btn-qty" onClick={() => setModalQty((q) => q + 1)}><Plus /></button>
              </div>
              <button className="btn-add" style={{ padding: "12px 20px", fontSize: ".95rem" }} onClick={addConfigured}>Adicionar ao Carrinho</button>
            </div>
          </div>
        </ModalShell>
      )}

      {modal === "checkout" && (
        <ModalShell onClose={() => setModal(null)} label="Finalizar pedido">
          <div className="modal-header"><h3 className="modal-title"><Receipt /> Finalizar Pedido</h3></div>
          <div className="modal-body">
            <form onSubmit={submitCheckout}>
              <div className="form-group"><label className="form-label">Nome Completo *</label><input name="name" className="form-control" required placeholder="Digite seu nome" /></div>
              <div className="form-group"><label className="form-label">WhatsApp / Telefone *</label><input name="phone" type="tel" className="form-control" required placeholder="(47) 99999-9999" /></div>
              {orderType === "delivery" && <div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">CEP</label><input name="cep" className="form-control" placeholder="89228-271" /></div>
                  <div className="form-group" style={{ flex: 2 }}><label className="form-label">Bairro *</label><input name="neighborhood" className="form-control" required placeholder="Comasa" /></div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ flex: 3 }}><label className="form-label">Rua / Endereço *</label><input name="address" className="form-control" required placeholder="Rua Ponte Serrada" /></div>
                  <div className="form-group" style={{ flex: 1 }}><label className="form-label">Nº *</label><input name="number" className="form-control" required placeholder="1152" /></div>
                </div>
                <div className="form-group"><label className="form-label">Complemento</label><input name="complement" className="form-control" placeholder="Apto, Bloco, Referência" /></div>
              </div>}
              <div className="form-group"><label className="form-label">Forma de Pagamento *</label>
                <select name="payment" className="form-control" defaultValue="PIX" required>
                  <option value="PIX">📱 PIX</option><option value="Cartão de Crédito/Débito">💳 Cartão de Crédito / Débito</option><option value="Dinheiro">💵 Dinheiro</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Troco (se necessário)</label><input name="change" className="form-control" placeholder="Ex: Troco para R$ 50,00" /></div>
              <div className="form-group"><label className="form-label">Observações do Pedido</label><textarea name="obs" className="form-control" rows={2} placeholder="Ex: Tirar a cebola, maionese à parte..." /></div>
              <div className="cart-summary" style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 8, color: "var(--primary)" }}>RESUMO DO PEDIDO</div>
                <div className="checkout-summary-list">{cart.map((item) => {
                  const extras = item.extras.reduce((s,e)=>s+e.price,0);
                  return <div className="checkout-summary-line" key={item.cartId}><span>{item.quantity}x {item.name}</span><span>{money((item.basePrice + extras) * item.quantity)}</span></div>;
                })}</div>
                <div className="summary-row total"><span>TOTAL</span><span>{money(totals.total)}</span></div>
              </div>
              <button type="submit" className="btn-submit" disabled={sending}><MessageCircle size={21} /> {sending ? "Abrindo WhatsApp..." : "FINALIZAR PEDIDO PELO WHATSAPP"}</button>
            </form>
          </div>
        </ModalShell>
      )}

      {modal === "hours" && <ModalShell onClose={() => setModal(null)} label="Horários de funcionamento">
        <div className="modal-header"><h3 className="modal-title"><Clock3 style={{ color: "var(--primary)" }} /> Horários de Funcionamento</h3></div>
        <div className="modal-body">
          <div style={{ marginBottom: 16, textAlign: "center" }}>
            <div className={store.open ? "status-message-open" : "status-message-closed"}>{store.open ? "🟢 ABERTO AGORA" : "🔴 FECHADO AGORA"}</div>
            <div className="status-message-sub">{store.open ? `Recebendo pedidos até ${store.closesAt}.` : "Confira os horários abaixo."}</div>
          </div>
          {hours.map(([day, value, index]) => <div className={`hours-row ${store.day === index ? "today" : ""}`} key={day}><span>{day}</span><span>{value}</span></div>)}
        </div>
      </ModalShell>}

      {modal === "info" && <ModalShell onClose={() => setModal(null)} label="Sobre a Milla Burger's">
        <div className="modal-header"><h3 className="modal-title"><CircleHelp style={{ color: "var(--primary)" }} /> Sobre a Milla Burger’s</h3></div>
        <div className="modal-body">
          <InfoCard icon={<Truck />} title="ENTREGA">Receba seu pedido no conforto da sua casa com rapidez e segurança.</InfoCard>
          <InfoCard icon={<ShoppingBag />} title="RETIRADA">Faça seu pedido e retire diretamente conosco sem pegar filas.</InfoCard>
          <InfoCard icon={<MapPin />} title="LOCALIZAÇÃO">Rua Ponte Serrada, 1152 - Comasa, Joinville - SC<a href="https://maps.google.com/?q=Rua+Ponte+Serrada+1152+Comasa+Joinville+SC" target="_blank" rel="noopener noreferrer" className="btn-action-card"><MapPin size={15} /> VER LOCALIZAÇÃO NO MAPA</a></InfoCard>
          <InfoCard icon={<MessageCircle />} title="WHATSAPP">Dúvidas ou atendimento direto? Mande uma mensagem para nós.<a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-action-card"><MessageCircle size={15} /> PEDIR PELO WHATSAPP</a></InfoCard>
          <InfoCard icon={<Instagram />} title="INSTAGRAM">Acompanhe nossas novidades, bastidores e promoções diárias!<a href="https://instagram.com/millaburgers" target="_blank" rel="noopener noreferrer" className="btn-action-card"><Instagram size={15} /> @millaburgers</a></InfoCard>
          <div className="info-card" style={{ borderColor: "var(--primary)" }}><div className="info-card-header"><Heart size={18} /> FEITO PARA VOCÊ</div><div className="info-card-body">A Milla Burger’s nasceu da paixão pelo artesanal. Usamos ingredientes selecionados, pães artesanais e blens de carnes suculentas preparados no ponto certo para garantir &quot;amor a cada mordida&quot;!</div></div>
        </div>
      </ModalShell>}

      {modal === "payments" && <ModalShell onClose={() => setModal(null)} label="Formas de pagamento">
        <div className="modal-header"><h3 className="modal-title"><CreditCard style={{ color: "var(--primary)" }} /> Formas de Pagamento</h3></div>
        <div className="modal-body">
          <InfoCard icon={<WalletCards />} title="DINHEIRO">Pagamento em dinheiro na entrega ou retirada. Aceitamos troco (informe no checkout).</InfoCard>
          <InfoCard icon={<QrCode />} title="PIX">Pagamento rápido e seguro via PIX. A chave será informada na confirmação do pedido.</InfoCard>
          <InfoCard icon={<CreditCard />} title="CARTÃO DE CRÉDITO E DÉBITO">Levamos a maquininha até você na entrega ou no balcão.
            <div className="payment-methods-grid"><div className="payment-card-method"><CreditCard /> Visa</div><div className="payment-card-method"><CreditCard /> Mastercard</div><div className="payment-card-method"><CreditCard /> Elo / Hipercard</div></div>
          </InfoCard>
        </div>
      </ModalShell>}

      <nav className="mobile-nav" aria-label="Navegação principal">
        <button className="nav-item active" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><House /> Início</button>
        <button className="nav-item" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}><ShoppingBasket /> Cardápio</button>
        <button className="nav-item" onClick={() => setCartOpen(true)}><ShoppingCart /> Carrinho</button>
        <button className="nav-item" onClick={() => setModal("info")}><CircleHelp /> Informações</button>
      </nav>
    </>
  );
}

function ModalShell({ children, onClose, label }: { children: React.ReactNode; onClose: () => void; label: string }) {
  return <div className="modal-overlay active" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} role="presentation">
    <div className="modal-container" role="dialog" aria-modal="true" aria-label={label}>
      <button className="modal-close" onClick={onClose} aria-label="Fechar"><X /></button>
      {children}
    </div>
  </div>;
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <div className="info-card"><div className="info-card-header">{icon} {title}</div><div className="info-card-body">{children}</div></div>;
}
