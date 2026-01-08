import React, { useState } from 'react';
import { Business, Product, Category } from '../types';
import { Plus, Trash2, Edit2, Save, X, Package, DollarSign } from 'lucide-react';

interface BusinessDashboardProps {
  business: Business;
  onUpdateBusiness: (updatedBusiness: Business) => void;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ business, onUpdateBusiness }) => {
  const [products, setProducts] = useState<Product[]>(business.products);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, description: '' });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    onUpdateBusiness({ ...business, products: updatedProducts });
    setNewProduct({ name: '', price: 0, description: '' });
    setIsAdding(false);
  };

  const handleDeleteProduct = (id: string) => {
    if(confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        onUpdateBusiness({ ...business, products: updatedProducts });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">İşletme Yönetim Paneli</h2>
            <p className="text-slate-500 text-sm">Ürünlerinizi ve menünüzü buradan yönetin.</p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
            {business.name}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Package className="text-indigo-600" size={20} />
              Ürün Listesi
            </h3>
            <button 
              onClick={() => setIsAdding(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Yeni Ürün Ekle
            </button>
          </div>

          {isAdding && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
              <h4 className="font-bold text-indigo-900 mb-3 text-sm">Yeni Ürün Bilgileri</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Ürün Adı</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="Örn: Lahmacun"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Fiyat (TL)</label>
                  <input 
                    type="number" 
                    value={newProduct.price || ''}
                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-indigo-800 mb-1">Açıklama</label>
                  <input 
                    type="text" 
                    value={newProduct.description || ''}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    placeholder="İçerik detayları..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-slate-600 text-sm hover:bg-white rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button 
                  onClick={handleAddProduct}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1"
                >
                  <Save size={14} /> Kaydet
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-shadow">
                <div>
                  <h4 className="font-bold text-slate-800">{product.name}</h4>
                  <p className="text-xs text-slate-500">{product.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                    {product.price} TL
                  </span>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            
            {products.length === 0 && !isAdding && (
              <div className="text-center py-10 text-slate-400">
                <Package size={40} className="mx-auto mb-2 opacity-20" />
                <p>Henüz ürün eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
