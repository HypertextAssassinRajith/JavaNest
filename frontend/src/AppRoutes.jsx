import { Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import LoginPage from './pages/LoginPage';
import AdminProductsPage from './pages/AdminProductsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductsPage/>} />
      <Route path="/products/:id" element={<ProductDetail/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/checkout" element={<CheckoutPage/>} />
      <Route path="/payment-success" element={<PaymentSuccessPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/admin/products" element={<AdminProductsPage/>} />
      <Route path="*" element={<p>Not Found</p>} />
    </Routes>
  );
}