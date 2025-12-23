import React, { useState, useEffect } from 'react';
import { Gift, Star, ShoppingCart, User, Search, Filter, X, Coins, ArrowRightLeft } from 'lucide-react';

const mockTelegramWebApp = {
  ready: () => console.log('App ready'),
  expand: () => console.log('App expanded'),
  close: () => console.log('App closed'),
  MainButton: {
    text: '',
    color: '#2ecc71',
    textColor: '#ffffff',
    isVisible: false,
    isActive: true,
    setText: function(text) { this.text = text; },
    show: function() { this.isVisible = true; },
    hide: function() { this.isVisible = false; },
    enable: function() { this.isActive = true; },
    disable: function() { this.isActive = false; },
    showProgress: function() { console.log('Showing progress'); },
    hideProgress: function() { console.log('Hiding progress'); },
    onClick: function(callback) { this.callback = callback; }
  },
  HapticFeedback: {
    impactOccurred: (style) => console.log('Haptic: ' + style),
    notificationOccurred: (type) => console.log('Notification: ' + type)
  },
  initDataUnsafe: {
    user: {
      id: 123456789,
      first_name: 'QA Tester',
      username: 'qa_engineer',
      language_code: 'ru'
    }
  },
  themeParams: {
    bg_color: '#ffffff',
    text_color: '#000000',
    hint_color: '#999999',
    link_color: '#2481cc',
    button_color: '#2ecc71',
    button_text_color: '#ffffff'
  }
};

const tg = window.Telegram?.WebApp || mockTelegramWebApp;

const mockGifts = [
  { id: 1, name: '🎂 Birthday Cake', description: 'Праздничный торт для особого дня', price: 500, image: '🎂', category: 'birthday', rarity: 'common', available: true },
  { id: 2, name: '🎄 Christmas Tree', description: 'Новогодняя елка с украшениями', price: 1000, image: '🎄', category: 'holiday', rarity: 'rare', available: true },
  { id: 3, name: '💎 Diamond Ring', description: 'Роскошное кольцо с бриллиантом', price: 5000, image: '💎', category: 'luxury', rarity: 'legendary', available: true },
  { id: 4, name: '🌹 Rose Bouquet', description: 'Букет красных роз', price: 300, image: '🌹', category: 'romantic', rarity: 'common', available: true },
  { id: 5, name: '🎁 Mystery Box', description: 'Загадочная коробка с сюрпризом', price: 750, image: '🎁', category: 'special', rarity: 'rare', available: true },
  { id: 6, name: '🏆 Trophy', description: 'Золотой кубок победителя', price: 2000, image: '🏆', category: 'achievement', rarity: 'epic', available: true },
  { id: 7, name: '🎸 Guitar', description: 'Электрогитара для рок-звезды', price: 1500, image: '🎸', category: 'music', rarity: 'rare', available: false },
  { id: 8, name: '🚀 Rocket', description: 'Космическая ракета', price: 10000, image: '🚀', category: 'special', rarity: 'legendary', available: true }
];

function App() {
  const [balance, setBalance] = useState(2500);
  const [tonBalance, setTonBalance] = useState(5.5);
  const [myGifts, setMyGifts] = useState([]);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedGift, setSelectedGift] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showConverter, setShowConverter] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  const [convertDirection, setConvertDirection] = useState('ton-to-stars');

  const TON_TO_STARS_RATE = 500;
  const STARS_TO_TON_RATE = 0.002;

  useEffect(() => {
    tg.ready();
    tg.expand();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePurchase = (gift) => {
    if (balance < gift.price) {
      showNotification('Недостаточно средств! Не хватает ' + (gift.price - balance) + ' Stars', 'error');
      tg.HapticFeedback.notificationOccurred('error');
      return;
    }
    if (!gift.available) {
      showNotification('Этот подарок уже продан', 'error');
      tg.HapticFeedback.notificationOccurred('error');
      return;
    }
    setBalance(prev => prev - gift.price);
    setMyGifts(prev => [...prev, { ...gift, purchaseDate: new Date().toISOString() }]);
    gift.available = false;
    showNotification('Подарок "' + gift.name + '" успешно куплен!', 'success');
    tg.HapticFeedback.notificationOccurred('success');
    setSelectedGift(null);
  };

  const handleTopUp = () => {
    const amount = 1000;
    setBalance(prev => prev + amount);
    showNotification('Баланс пополнен на ' + amount + ' Stars', 'success');
    tg.HapticFeedback.notificationOccurred('success');
  };

  const handleConvert = () => {
    const amount = parseFloat(convertAmount);
    
    if (!amount || amount <= 0) {
      showNotification('Введите корректную сумму', 'error');
      return;
    }

    if (convertDirection === 'ton-to-stars') {
      if (amount > tonBalance) {
        showNotification('Недостаточно TON! У вас: ' + tonBalance.toFixed(2) + ' TON', 'error');
        return;
      }
      const starsToAdd = Math.floor(amount * TON_TO_STARS_RATE);
      setTonBalance(prev => prev - amount);
      setBalance(prev => prev + starsToAdd);
      showNotification('Конвертировано ' + amount + ' TON в ' + starsToAdd + ' Stars!', 'success');
    } else {
      if (amount > balance) {
        showNotification('Недостаточно Stars! У вас: ' + balance + ' Stars', 'error');
        return;
      }
      const tonToAdd = amount * STARS_TO_TON_RATE;
      setBalance(prev => prev - amount);
      setTonBalance(prev => prev + tonToAdd);
      showNotification('Конвертировано ' + amount + ' Stars в ' + tonToAdd.toFixed(2) + ' TON!', 'success');
    }
    
    tg.HapticFeedback.notificationOccurred('success');
    setShowConverter(false);
    setConvertAmount('');
  };

  const getFilteredGifts = () => {
    let filtered = [...mockGifts];
    if (searchQuery) {
      filtered = filtered.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterCategory !== 'all') {
      filtered = filtered.filter(g => g.category === filterCategory);
    }
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  };

  const getRarityBadge = (rarity) => {
    const badges = { common: 'bg-gray-100 text-gray-700', rare: 'bg-blue-100 text-blue-700', epic: 'bg-purple-100 text-purple-700', legendary: 'bg-yellow-100 text-yellow-700' };
    return badges[rarity] || 'bg-gray-100 text-gray-700';
  };

  const getRarityColor = (rarity) => {
    const colors = { common: 'text-gray-600', rare: 'text-blue-600', epic: 'text-purple-600', legendary: 'text-yellow-600' };
    return colors[rarity] || 'text-gray-600';
  };

  const calculateConversion = () => {
    const amount = parseFloat(convertAmount) || 0;
    if (convertDirection === 'ton-to-stars') {
      return Math.floor(amount * TON_TO_STARS_RATE);
    } else {
      return (amount * STARS_TO_TON_RATE).toFixed(4);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-20">
      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-purple-900 flex items-center gap-2">
              <Gift className="w-6 h-6" />
              Gift Shop
            </h1>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-900 text-sm">{tonBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                <span className="font-bold text-yellow-900 text-sm">{balance}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('marketplace')} className={'flex-1 py-2 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'marketplace' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Магазин
            </button>
            <button onClick={() => setActiveTab('collection')} className={'flex-1 py-2 px-4 rounded-lg font-medium transition-all ' + (activeTab === 'collection' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              <User className="w-4 h-4 inline mr-2" />
              Коллекция ({myGifts.length})
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className={'fixed top-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ' + (notification.type === 'success' ? 'bg-green-500' : 'bg-red-500') + ' text-white font-medium animate-slide-down'}>
          {notification.message}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="p-4">
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Поиск подарков..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Фильтры
              </button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none">
                <option value="price-asc">Цена ↑</option>
                <option value="price-desc">Цена ↓</option>
                <option value="name">По имени</option>
              </select>
            </div>
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-2">
                <p className="font-medium text-sm text-gray-700">Категория:</p>
                <div className="flex flex-wrap gap-2">
                  {['all', 'birthday', 'holiday', 'luxury', 'romantic', 'special'].map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)} className={'px-3 py-1 rounded-full text-sm ' + (filterCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                      {cat === 'all' ? 'Все' : cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {getFilteredGifts().map(gift => (
              <div key={gift.id} onClick={() => setSelectedGift(gift)} className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105">
                <div className="text-6xl mb-3 text-center">{gift.image}</div>
                <h3 className="font-bold text-sm mb-1 truncate">{gift.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-yellow-600 font-bold">
                    <Star className="w-4 h-4 fill-yellow-600 mr-1" />
                    {gift.price}
                  </span>
                  <span className={'text-xs px-2 py-1 rounded ' + getRarityBadge(gift.rarity)}>{gift.rarity}</span>
                </div>
                {!gift.available && <div className="text-xs text-red-600 font-medium">Продано</div>}
              </div>
            ))}
          </div>
          {getFilteredGifts().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Подарки не найдены</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'collection' && (
        <div className="p-4">
          <div className="bg-white rounded-xl shadow-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Всего подарков</p>
                <p className="text-2xl font-bold text-purple-900">{myGifts.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Общая стоимость</p>
                <p className="text-2xl font-bold text-yellow-600 flex items-center">
                  <Star className="w-5 h-5 fill-yellow-600 mr-1" />
                  {myGifts.reduce((sum, g) => sum + g.price, 0)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={handleTopUp} className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700">
                Пополнить баланс (+1000 Stars)
              </button>
              <button onClick={() => setShowConverter(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center justify-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                Конвертер TON ⇄ Stars
              </button>
            </div>
          </div>
          {myGifts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Коллекция пуста</p>
              <p className="text-sm">Начните собирать подарки!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {myGifts.map((gift, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                  <div className="text-6xl mb-3 text-center">{gift.image}</div>
                  <h3 className="font-bold text-sm mb-1 truncate">{gift.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className={getRarityColor(gift.rarity)}>{gift.rarity}</span>
                    <span>{new Date(gift.purchaseDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showConverter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
            <button onClick={() => setShowConverter(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ArrowRightLeft className="w-6 h-6 text-blue-600" />
              Конвертер валют
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ваш баланс TON:</span>
                <span className="font-bold text-blue-600">{tonBalance.toFixed(2)} TON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ваш баланс Stars:</span>
                <span className="font-bold text-yellow-600">{balance} Stars</span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Направление конвертации:</label>
                <div className="flex gap-2">
                  <button onClick={() => setConvertDirection('ton-to-stars')} className={'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (convertDirection === 'ton-to-stars' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>
                    TON → Stars
                  </button>
                  <button onClick={() => setConvertDirection('stars-to-ton')} className={'flex-1 py-3 px-4 rounded-lg font-medium transition-all ' + (convertDirection === 'stars-to-ton' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700')}>
                    Stars → TON
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма {convertDirection === 'ton-to-stars' ? 'TON' : 'Stars'}:
                </label>
                <input type="number" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} placeholder="0.00" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg" />
              </div>
              {convertAmount && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Вы получите:</span>
                    <span className="text-xl font-bold text-green-600">
                      {convertDirection === 'ton-to-stars' ? calculateConversion() + ' Stars' : calculateConversion() + ' TON'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Курс: 1 TON = {TON_TO_STARS_RATE} Stars
                  </p>
                </div>
              )}
              <button onClick={handleConvert} disabled={!convertAmount || parseFloat(convertAmount) <= 0} className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-105 transition-all">
                Конвертировать
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedGift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 animate-slide-up">
            <button onClick={() => setSelectedGift(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
            <div className="text-8xl mb-4 text-center">{selectedGift.image}</div>
            <h2 className="text-2xl font-bold mb-2">{selectedGift.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={'text-sm px-3 py-1 rounded-full ' + getRarityBadge(selectedGift.rarity)}>{selectedGift.rarity}</span>
              <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">{selectedGift.category}</span>
            </div>
            <p className="text-gray-600 mb-4">{selectedGift.description}</p>
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Цена:</span>
                <span className="text-2xl font-bold text-yellow-600 flex items-center">
                  <Star className="w-6 h-6 fill-yellow-600 mr-1" />
                  {selectedGift.price}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-600">Ваш баланс:</span>
                <span className={'font-medium ' + (balance >= selectedGift.price ? 'text-green-600' : 'text-red-600')}>{balance} Stars</span>
              </div>
            </div>
            {!selectedGift.available ? (
              <button disabled className="w-full py-4 bg-gray-300 text-gray-500 rounded-xl font-bold text-lg">Продано</button>
            ) : balance < selectedGift.price ? (
              <div className="space-y-2">
                <button disabled className="w-full py-4 bg-gray-300 text-gray-500 rounded-xl font-bold text-lg">Недостаточно средств</button>
                <button onClick={() => { handleTopUp(); setSelectedGift(null); }} className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700">
                  Пополнить баланс
                </button>
              </div>
            ) : (
              <button onClick={() => handlePurchase(selectedGift)} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all">
                Купить за {selectedGift.price} Stars
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
