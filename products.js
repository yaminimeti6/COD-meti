// Replace the second product's placeholder name, image, and course prices with
// the merchant's actual details when provided.
const PRODUCTS = [
  {
    id: 'slimofast',
    theme: 'slimofast',
    name: 'Slimofast',
    subtitle: 'Best-selling weightloss product',
    badge: 'BEST SELLER',
    detailBadge: 'BEST SELLING WEIGHTLOSS PRODUCT',
    image: 'https://slimofast.shop/SlimoMaine.webp',
    imageAlt: 'Slimofast product image',
    rating: '4.8 · 2,800+ Reviews',
    courses: [
      { months: 1, price: 499 },
      { months: 2, price: 799 },
      { months: 3, price: 999 }
    ],
    usage: 'Take 1 capsule in the morning or evening, 30 minutes before meals with water for best fat loss results.'
  },
  {
    id: 'product-two',
    theme: 'sleepo',
    name: 'Sleepo Veda',
    subtitle: 'Natural sleep support',
    badge: 'NEW PRODUCT',
    detailBadge: "INDIA'S FAVOURITE SLEEP FORMULA",
    image: '4_English_New_8caf955d-adaa-4791-9c43-c5ef9e187bc8.webp',
    imageAlt: 'Sleepo Veda natural sleep product',
    rating: '',
    courses: [
      { months: 2, price: 699 },
      { months: 3, price: 899 }
    ],
    usage: ''
  }
];
