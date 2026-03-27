export interface Product {
  id: string;
  name: string;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  fullSpecs?: string[];
  features?: string[];
  category: string;
  image: string;
  price?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cliente';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  category: string;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, productName: string, category: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

export interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export interface SuccessCaseResult {
  metric: string;
  label: string;
}

export interface SuccessCaseTestimonial {
  text: string;
  author: string;
  role: string;
}

export interface SuccessCase {
  id: string;
  title: string;
  client: string;
  industry: string;
  location: string;
  image: string;
  shortDesc: string;
  challenge: string;
  solution: string;
  products: string[];
  results: SuccessCaseResult[];
  testimonial: SuccessCaseTestimonial;
  tags: string[];
}
