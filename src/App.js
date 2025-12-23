import React, { useState, useEffect, useRef } from 'react';
import { Gift, Star, ShoppingCart, User, Search, Filter, X, Coins, ArrowRightLeft, Package, Award, History, Bell, CreditCard, HelpCircle, LogOut, Settings, Shield, Info, MessageCircle, Volume2, Image, Smile, Camera } from 'lucide-react';

// Компонент модалки (остается тот же)
const Modal = ({ isOpen, onClose, children, title, icon: Icon }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const modalRef = useRef(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -minSwipeDistance;
    if (isDownSwipe) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50" onClick={onClose}>
      <div 
        ref={modalRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl w-full max-w-lg animate-slide-up relative h-[85vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6 mt-4"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full p-2 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {title && (
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {Icon && <Icon className="w-6 h-6" />}
              {title}
            </h2>
          </div>
        )}
        
        <div className="px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Компонент уведомлений
const NotificationsModal = ({ isOpen, onClose, settings, onToggle }) => {
  const handleToggle = (key) => {
    onToggle(key);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройки уведомлений" icon={Bell}>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Типы уведомлений
          </h3>
          
          <div className="space-y-3">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {key === 'push' && <Bell className="w-4 h-4" />}
                    {key === 'email' && <MessageCircle className="w-4 h-4" />}
                    {key === 'sound' && <Volume2 className="w-4 h-4" />}
                    {key === 'newGifts' && <Gift className="w-4 h-4" />}
                    {key === 'promotions' && <Award className="w-4 h-4" />}
                    {key === 'updates' && <Info className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {key === 'push' && 'Push-уведомления'}
                      {key === 'email' && 'Email-уведомления'}
                      {key === 'sound' && 'Звуковые уведомления'}
                      {key === 'newGifts' && 'Новые подарки'}
                      {key === 'promotions' && 'Акции и скидки'}
                      {key === 'updates' && 'Обновления приложения'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {key === 'push' && 'Уведомления в браузере'}
                      {key === 'email' && 'Уведомления на почту'}
                      {key === 'sound' && 'Звук при получении уведомления'}
                      {key === 'newGifts' && 'О новых подарках в магазине'}
                      {key === 'promotions' && 'О специальных предложениях'}
                      {key === 'updates' && 'О новых функциях приложения'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => handleToggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Информация
          </h3>
          <p className="text-sm text-gray-600">
            Уведомления помогают оставаться в курсе новых подарков, акций и обновлений приложения. 
            Вы можете настроить типы уведомлений по своему желанию.
          </p>
        </div>
      </div>
    </Modal>
  );
};

// Компонент помощи
const HelpModal = ({ isOpen, onClose }) => {
  const helpSections = [
    {
      title: 'Как купить подарок?',
      content: '1. Выберите подарок в магазине\n2. Нажмите на него\n3. Нажмите "Купить за X Stars"\n4. Подарок появится в вашей коллекции'
    },
    {
      title: 'Как пополнить баланс?',
      content: '1. Перейдите в "Коллекция"\n2. Нажмите "Пополнить баланс"\n3. Вы получите +1000 Stars'
    },
    {
      title: 'Как конвертировать валюту?',
      content: '1. TON в Stars: 1 TON = 500 Stars\n2. Stars в TON: 500 Stars = 1 TON\n3. Используйте конвертер в личном кабинете'
    },
    {
      title: 'Что такое ежедневный бонус?',
      content: 'Каждый день вы можете получить 100 Stars бесплатно. Заходите ежедневно для получения бонуса!'
    },
    {
      title: 'Как связаться с поддержкой?',
      content: 'Напишите нам в Telegram: @gift_shop_support\nВремя ответа: 9:00-21:00'
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Помощь и поддержка" icon={HelpCircle}>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-bold text-lg">Связь с поддержкой</h3>
              <p className="text-sm text-gray-600">Мы всегда готовы помочь!</p>
            </div>
          </div>
          <div className="space-y-2">
            <a 
              href="https://t.me/gift_shop_support" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700"
            >
              Написать в Telegram
            </a>
            <p className="text-xs text-gray-600 text-center">
              Время работы поддержки: 9:00 - 21:00 (МСК)
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            Частые вопросы
          </h3>
          
          {helpSections.map((section, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-bold text-md mb-2">{section.title}</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Безопасность
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Все платежи защищены SSL-шифрованием</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Мы не храним данные вашей банковской карты</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
              <span>Двухфакторная аутентификация через Telegram</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

// Компонент выбора аватарки
const AvatarPickerModal = ({ isOpen, onClose, avatars, selectedAvatar, onSelectAvatar }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выберите аватарку" icon={Smile}>
      <div className="grid grid-cols-3 gap-4">
        {avatars.map((avatar, index) => (
          <button
            key={index}
            onClick={() => onSelectAvatar(avatar)}
            className={`p-2 rounded-xl transition-all ${selectedAvatar === avatar ? 'ring-4 ring-indigo-300 bg-indigo-50' : 'hover:bg-gray-50'}`}
          >
            <img 
              src={avatar} 
              alt={`Аватар ${index + 1}`}
              className="w-full h-24 object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`;
              }}
            />
            <p className="text-xs text-center mt-2 font-medium">
              Аватар {index + 1}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <button 
          onClick={() => {
            const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
            onSelectAvatar(randomAvatar);
          }}
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Выбрать случайную аватарку
        </button>
      </div>
    </Modal>
  );
};

// Основной компонент приложения
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
      language_code: 'ru',
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QA'
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

const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return mockTelegramWebApp;
};

// Стабильные ссылки на аватарки
const FUNNY_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Happy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Cool',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Funny',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Wink',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Surprised',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Robot',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Cat',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Monster',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Pirate',
];

const MOCK_GIFTS = [
  { id: 1, name: 'Золотая корона', description: 'Королевская корона с бриллиантами', price: 10000, image: '👑', category: 'luxury', rarity: 'legendary', available: true },
  { id: 2, name: 'Красная роза', description: 'Идеальный подарок для любимой', price: 500, image: '🌹', category: 'romantic', rarity: 'common', available: true },
  { id: 3, name: 'Игровая консоль', description: 'Новейшая игровая приставка', price: 5000, image: '🎮', category: 'gaming', rarity: 'epic', available: true },
  { id: 4, name: 'Космическая ракета', description: 'Отправь друга в космос', price: 15000, image: '🚀', category: 'special', rarity: 'legendary', available: true },
  { id: 5, name: 'Сердечко с огоньком', description: 'Горящее сердце любви', price: 800, image: '❤️‍🔥', category: 'romantic', rarity: 'rare', available: true },
  { id: 6, name: 'Бриллиантовое кольцо', description: 'Кольцо с бриллиантом 1 карат', price: 12000, image: '💎', category: 'luxury', rarity: 'legendary', available: true },
  { id: 7, name: 'Кубок чемпиона', description: 'Для настоящих победителей', price: 3000, image: '🏆', category: 'achievement', rarity: 'epic', available: true },
  { id: 8, name: 'Праздничный торт', description: 'Вкусный торт на день рождения', price: 1200, image: '🎂', category: 'birthday', rarity: 'common', available: true },
  { id: 9, name: 'Золотая медаль', description: 'Медаль победителя олимпиады', price: 2500, image: '🥇', category: 'achievement', rarity: 'epic', available: true },
  { id: 10, name: 'Новогодняя елка', description: 'Украшенная новогодняя ель', price: 1800, image: '🎄', category: 'holiday', rarity: 'rare', available: true },
  { id: 11, name: 'Воздушный шар', description: 'Красный воздушный шар', price: 300, image: '🎈', category: 'special', rarity: 'common', available: true },
  { id: 12, name: 'Телескоп', description: 'Наблюдай за звездами', price: 4000, image: '🔭', category: 'special', rarity: 'epic', available: true },
  { id: 13, name: 'Кинопленка', description: 'Для будущего режиссера', price: 1500, image: '🎬', category: 'creative', rarity: 'rare', available: true },
  { id: 14, name: 'Палитра художника', description: 'Набор красок для творца', price: 900, image: '🎨', category: 'creative', rarity: 'common', available: true },
  { id: 15, name: 'Гитара', description: 'Электрогитара для рок-звезды', price: 3500, image: '🎸', category: 'music', rarity: 'epic', available: true },
  { id: 16, name: 'Микрофон', description: 'Сценический микрофон', price: 2000, image: '🎤', category: 'music', rarity: 'rare', available: true },
  { id: 17, name: 'Книга знаний', description: 'Древняя книга мудрости', price: 2200, image: '📚', category: 'special', rarity: 'rare', available: true },
  { id: 18, name: 'Часы времени', description: 'Антикварные песочные часы', price: 2800, image: '⏳', category: 'luxury', rarity: 'epic', available: true },
  { id: 19, name: 'Зонтик', description: 'Стильный зонт от дождя', price: 700, image: '☂️', category: 'special', rarity: 'common', available: true },
  { id: 20, name: 'Ключ от сердца', description: 'Символический ключ к сердцу', price: 950, image: '🔑', category: 'romantic', rarity: 'rare', available: true },
];

const MOCK_TRANSACTIONS = [
  { id: 1, type: 'purchase', giftName: 'Золотая корона', amount: -10000, date: '2024-01-15T14:30:00Z', status: 'completed' },
  { id: 2, type: 'topup', amount: 1000, date: '2024-01-14T10:15:00Z', status: 'completed' },
  { id: 3, type: 'conversion', from: 'TON', to: 'Stars', amount: 1500, date: '2024-01-13T16:45:00Z', status: 'completed' },
  { id: 4, type: 'purchase', giftName: 'Красная роза', amount: -500, date: '2024-01-12T12:20:00Z', status: 'completed' },
  { id: 5, type: 'bonus', amount: 200, description: 'Ежедневный бонус', date: '2024-01-11T09:00:00Z', status: 'completed' },
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
  const [showProfile, setShowProfile] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [userStats, setUserStats] = useState({
    level: 5,
    experience: 750,
    nextLevelExp: 1000,
    totalSpent: 3500,
    giftsSent: 12,
    daysActive: 24
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: false,
    sound: true,
    newGifts: true,
    promotions: false,
    updates: true
  });

  const [selectedAvatar, setSelectedAvatar] = useState(FUNNY_AVATARS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const TON_TO_STARS_RATE = 500;
  const STARS_TO_TON_RATE = 0.002;

  const [tg, setTg] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const telegramApp = getTelegramWebApp();
    setTg(telegramApp);
    
    if (telegramApp) {
      telegramApp.ready();
      telegramApp.expand();
      
      if (telegramApp.initDataUnsafe?.user) {
        setUserData(telegramApp.initDataUnsafe.user);
      } else {
        setUserData(mockTelegramWebApp.initDataUnsafe.user);
      }
    }
    
    const savedGifts = localStorage.getItem('myGifts');
    const savedBalance = localStorage.getItem('balance');
    const savedTonBalance = localStorage.getItem('tonBalance');
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedAvatar = localStorage.getItem('selectedAvatar');
    
    if (savedGifts) setMyGifts(JSON.parse(savedGifts));
    if (savedBalance) setBalance(Number(savedBalance));
    if (savedTonBalance) setTonBalance(Number(savedTonBalance));
    if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications));
    if (savedAvatar) setSelectedAvatar(savedAvatar);
  }, []);

  useEffect(() => {
    localStorage.setItem('myGifts', JSON.stringify(myGifts));
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('tonBalance', tonBalance.toString());
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('selectedAvatar', selectedAvatar);
  }, [myGifts, balance, tonBalance, notificationSettings, selectedAvatar]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePurchase = (gift) => {
    if (balance < gift.price) {
      showNotification('Недостаточно средств! Не хватает ' + (gift.price - balance) + ' Stars', 'error');
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('error');
      }
      return;
    }
    if (!gift.available) {
      showNotification('Этот подарок уже продан', 'error');
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('error');
      }
      return;
    }
    
    const purchasedGift = {
      ...gift,
      purchaseDate: new Date().toISOString(),
      available: false
    };
    
    setBalance(prev => prev - gift.price);
    setMyGifts(prev => [...prev, purchasedGift]);
    
    const newTransaction = {
      id: transactions.length + 1,
      type: 'purchase',
      giftName: gift.name,
      amount: -gift.price,
      date: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    setUserStats(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + gift.price,
      giftsSent: prev.giftsSent + 1,
      experience: prev.experience + Math.floor(gift.price / 10)
    }));
    
    showNotification('Подарок "' + gift.name + '" успешно куплен!', 'success');
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
    setSelectedGift(null);
  };

  const handleTopUp = () => {
    const amount = 1000;
    setBalance(prev => prev + amount);
    
    const newTransaction = {
      id: transactions.length + 1,
      type: 'topup',
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    showNotification('Баланс пополнен на ' + amount + ' Stars', 'success');
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleConvert = () => {
    const amount = parseFloat(convertAmount);
    
    if (!amount || amount <= 0 || isNaN(amount)) {
      showNotification('Введите корректную сумму', 'error');
      return;
    }

    if (convertDirection === 'ton-to-stars') {
      if (amount > tonBalance) {
        showNotification(`Недостаточно TON! У вас: ${tonBalance.toFixed(2)} TON`, 'error');
        return;
      }
      const starsToAdd = Math.floor(amount * TON_TO_STARS_RATE);
      setTonBalance(prev => prev - amount);
      setBalance(prev => prev + starsToAdd);
      
      const newTransaction = {
        id: transactions.length + 1,
        type: 'conversion',
        from: 'TON',
        to: 'Stars',
        amount: starsToAdd,
        date: new Date().toISOString(),
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      showNotification(`Конвертировано ${amount} TON в ${starsToAdd} Stars!`, 'success');
    } else {
      if (amount > balance) {
        showNotification(`Недостаточно Stars! У вас: ${balance} Stars`, 'error');
        return;
      }
      const tonToAdd = amount * STARS_TO_TON_RATE;
      setBalance(prev => prev - amount);
      setTonBalance(prev => prev + tonToAdd);
      
      const newTransaction = {
        id: transactions.length + 1,
        type: 'conversion',
        from: 'Stars',
        to: 'TON',
        amount: tonToAdd,
        date: new Date().toISOString(),
        status: 'completed'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      showNotification(`Конвертировано ${amount} Stars в ${tonToAdd.toFixed(2)} TON!`, 'success');
    }
    
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
    setShowConverter(false);
    setConvertAmount('');
  };

  const handleDailyBonus = () => {
    const bonus = 100;
    setBalance(prev => prev + bonus);
    
    const newTransaction = {
      id: transactions.length + 1,
      type: 'bonus',
      amount: bonus,
      description: 'Ежедневный бонус',
      date: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    showNotification(`Получен ежедневный бонус ${bonus} Stars!`, 'success');
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      localStorage.clear();
      setMyGifts([]);
      setBalance(2500);
      setTonBalance(5.5);
      setTransactions(MOCK_TRANSACTIONS);
      setSelectedAvatar(FUNNY_AVATARS[0]);
      showNotification('Вы вышли из аккаунта', 'info');
    }
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showNotification(`Уведомления ${key} ${!notificationSettings[key] ? 'включены' : 'выключены'}`, 'info');
  };

  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    showNotification('Аватарка изменена!', 'success');
    setShowAvatarPickerModal(false);
  };

  const getFilteredGifts = () => {
    let filtered = [...MOCK_GIFTS];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(query) || 
        g.description.toLowerCase().includes(query)
      );
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
    const badges = {
      common: 'bg-gray-100 text-gray-700',
      rare: 'bg-blue-100 text-blue-700', 
      epic: 'bg-purple-100 text-purple-700',
      legendary: 'bg-yellow-100 text-yellow-700'
    };
    return badges[rarity] || 'bg-gray-100 text-gray-700';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'text-gray-600',
      rare: 'text-blue-600',
      epic: 'text-purple-600',
      legendary: 'text-yellow-600'
    };
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

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'purchase': return <ShoppingCart className="w-4 h-4" />;
      case 'topup': return <CreditCard className="w-4 h-4" />;
      case 'conversion': return <ArrowRightLeft className="w-4 h-4" />;
      case 'bonus': return <Award className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const categories = ['all', 'birthday', 'holiday', 'luxury', 'romantic', 'special', 'gaming', 'music', 'creative', 'achievement'];
  
  const categoryTranslations = {
    all: 'Все',
    birthday: 'День рождения',
    holiday: 'Праздники',
    luxury: 'Роскошь',
    romantic: 'Романтика',
    special: 'Особые',
    gaming: 'Игры',
    music: 'Музыка',
    creative: 'Творчество',
    achievement: 'Достижения'
  };

  const getCurrentPageGifts = () => {
    const filtered = getFilteredGifts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(getFilteredGifts().length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 pb-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img 
                src={selectedAvatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                onClick={() => setShowAvatarPickerModal(true)}
              />
              <div>
                <h1 className="text-lg font-bold text-white">
                  {userData?.first_name || 'Пользователь'}
                </h1>
                <p className="text-xs text-indigo-200">@{userData?.username || 'username'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 rounded-full">
                <Coins className="w-4 h-4 text-white" />
                <span className="font-bold text-white text-sm">{tonBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="font-bold text-white text-sm">{balance}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('marketplace')} 
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'marketplace' ? 'bg-white text-indigo-600 shadow-md' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Магазин
            </button>
            <button 
              onClick={() => setActiveTab('collection')} 
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${activeTab === 'collection' ? 'bg-white text-indigo-600 shadow-md' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Коллекция
            </button>
            <button 
              onClick={() => setShowProfile(true)} 
              className="p-2 rounded-lg font-medium transition-all bg-indigo-500 text-white hover:bg-indigo-400"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`fixed top-20 left-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} text-white font-medium animate-slide-down`}>
          {notification.message}
        </div>
      )}

      {activeTab === 'marketplace' && (
        <div className="p-4">
          <div className="mb-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Поиск подарков..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Фильтры
              </button>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)} 
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg outline-none"
              >
                <option value="price-asc">Цена ↑</option>
                <option value="price-desc">Цена ↓</option>
                <option value="name">По имени</option>
              </select>
            </div>
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-300 space-y-2">
                <p className="font-medium text-sm text-gray-700">Категория:</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setFilterCategory(cat)} 
                      className={`px-3 py-1 rounded-full text-sm ${filterCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {categoryTranslations[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {getCurrentPageGifts().map(gift => (
              <div 
                key={gift.id} 
                onClick={() => setSelectedGift(gift)} 
                className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
              >
                <div className="text-5xl mb-3 text-center">{gift.image}</div>
                <h3 className="font-bold text-sm mb-1 truncate">{gift.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-4 h-4 fill-amber-600 mr-1" />
                    {gift.price}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getRarityBadge(gift.rarity)}`}>
                    {gift.rarity}
                  </span>
                </div>
                {!gift.available && (
                  <div className="text-xs text-red-600 font-medium">Продано</div>
                )}
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
              >
                Назад
              </button>
              <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
                Страница {currentPage} из {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
              >
                Вперед
              </button>
            </div>
          )}

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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md p-4 mb-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-indigo-100">Всего подарков</p>
                <p className="text-2xl font-bold">{myGifts.length}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100">Общая стоимость</p>
                <p className="text-2xl font-bold flex items-center">
                  <Star className="w-5 h-5 fill-white mr-1" />
                  {myGifts.reduce((sum, g) => sum + g.price, 0)}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button 
                onClick={handleTopUp} 
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600"
              >
                Пополнить баланс (+1000 Stars)
              </button>
              <button 
                onClick={() => setShowConverter(true)} 
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Конвертер TON ⇄ Stars
              </button>
              <button 
                onClick={handleDailyBonus}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                Получить ежедневный бонус
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
                  <div className="text-5xl mb-3 text-center">{gift.image}</div>
                  <h3 className="font-bold text-sm mb-1 truncate">{gift.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className={getRarityColor(gift.rarity)}>{gift.rarity}</span>
                    <span>{new Date(gift.purchaseDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Отдельные модальные окна */}
      <NotificationsModal 
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        settings={notificationSettings}
        onToggle={handleNotificationToggle}
      />

      <HelpModal 
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <AvatarPickerModal 
        isOpen={showAvatarPickerModal}
        onClose={() => setShowAvatarPickerModal(false)}
        avatars={FUNNY_AVATARS}
        selectedAvatar={selectedAvatar}
        onSelectAvatar={handleSelectAvatar}
      />

      {/* Модалка личного кабинета */}
      {showProfile && (
        <Modal isOpen={showProfile} onClose={() => setShowProfile(false)} title="Личный кабинет" icon={User}>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img 
                src={selectedAvatar} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-4 border-indigo-200 cursor-pointer"
                onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => setShowAvatarPickerModal(true), 300);
                }}
              />
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  {userData?.first_name || 'Пользователь'}
                </h2>
                <p className="text-gray-500">@{userData?.username || 'username'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded-full">
                    <Award className="w-3 h-3 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-600">Уровень {userStats.level}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {userData?.id || '123456789'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Опыт: {userStats.experience}/{userStats.nextLevelExp}</span>
                <span>{Math.round((userStats.experience / userStats.nextLevelExp) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" 
                  style={{ width: `${(userStats.experience / userStats.nextLevelExp) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Всего потрачено</span>
                  <Coins className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-700 mt-2">
                  {userStats.totalSpent} Stars
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Подарков отправлено</span>
                  <Gift className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xl font-bold text-green-700 mt-2">
                  {userStats.giftsSent}
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Дней в игре</span>
                  <Star className="w-4 h-4 text-yellow-500" />
                </div>
                <p className="text-xl font-bold text-yellow-700 mt-2">
                  {userStats.daysActive}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Баланс TON</span>
                  <Coins className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-xl font-bold text-purple-700 mt-2">
                  {tonBalance.toFixed(2)} TON
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <History className="w-5 h-5" />
                История операций
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'purchase' ? 'bg-red-100 text-red-600' : transaction.type === 'topup' ? 'bg-green-100 text-green-600' : transaction.type === 'conversion' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {transaction.type === 'purchase' ? `Покупка: ${transaction.giftName}` :
                           transaction.type === 'topup' ? 'Пополнение баланса' :
                           transaction.type === 'conversion' ? `Конвертация ${transaction.from} → ${transaction.to}` :
                           transaction.description || 'Бонус'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.date).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} {transaction.type === 'conversion' && transaction.from === 'TON' ? 'Stars' : transaction.type === 'conversion' ? 'TON' : 'Stars'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => setShowConverter(true), 300);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200"
              >
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Конвертер валют</span>
                </div>
                <ArrowRightLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={handleDailyBonus}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Ежедневный бонус</span>
                </div>
                <span className="text-sm font-bold text-green-600">+100 Stars</span>
              </button>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => setShowNotificationsModal(true), 300);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Уведомления</span>
                </div>
                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              </button>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  setTimeout(() => setShowHelpModal(true), 300);
                }}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Помощь</span>
                </div>
                <HelpCircle className="w-4 h-4 text-gray-400" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl hover:from-red-100 hover:to-red-200"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-600">Выйти</span>
                </div>
                <LogOut className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Модалка конвертера */}
      {showConverter && (
        <Modal isOpen={showConverter} onClose={() => setShowConverter(false)} title="Конвертер валют" icon={ArrowRightLeft}>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ваш баланс TON:</span>
                <span className="font-bold text-blue-600">{tonBalance.toFixed(2)} TON</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ваш баланс Stars:</span>
                <span className="font-bold text-yellow-600">{balance} Stars</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Направление конвертации:</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setConvertDirection('ton-to-stars')} 
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${convertDirection === 'ton-to-stars' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  TON → Stars
                </button>
                <button 
                  onClick={() => setConvertDirection('stars-to-ton')} 
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${convertDirection === 'stars-to-ton' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Stars → TON
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сумма {convertDirection === 'ton-to-stars' ? 'TON' : 'Stars'}:
              </label>
              <input 
                type="number" 
                value={convertAmount} 
                onChange={(e) => setConvertAmount(e.target.value)} 
                placeholder="0.00" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg"
                step="0.01"
                min="0"
              />
            </div>
            
            {convertAmount && parseFloat(convertAmount) > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Вы получите:</span>
                  <span className="text-xl font-bold text-green-600">
                    {convertDirection === 'ton-to-stars' 
                      ? `${calculateConversion()} Stars` 
                      : `${calculateConversion()} TON`
                    }
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Курс: 1 TON = {TON_TO_STARS_RATE} Stars
                </p>
              </div>
            )}
            
            <button 
              onClick={handleConvert} 
              disabled={!convertAmount || parseFloat(convertAmount) <= 0} 
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Конвертировать
            </button>
          </div>
        </Modal>
      )}

      {/* Модалка подарка */}
      {selectedGift && (
        <Modal isOpen={!!selectedGift} onClose={() => setSelectedGift(null)}>
          <div className="space-y-6">
            <div className="text-8xl text-center">{selectedGift.image}</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{selectedGift.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-sm px-3 py-1 rounded-full ${getRarityBadge(selectedGift.rarity)}`}>
                  {selectedGift.rarity}
                </span>
                <span className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {categoryTranslations[selectedGift.category] || selectedGift.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{selectedGift.description}</p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Цена:</span>
                <span className="text-2xl font-bold text-yellow-600 flex items-center">
                  <Star className="w-6 h-6 fill-yellow-600 mr-1" />
                  {selectedGift.price}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-gray-600">Ваш баланс:</span>
                <span className={`font-medium ${balance >= selectedGift.price ? 'text-green-600' : 'text-red-600'}`}>
                  {balance} Stars
                </span>
              </div>
            </div>
            
            {!selectedGift.available ? (
              <button disabled className="w-full py-4 bg-gray-300 text-gray-500 rounded-xl font-bold text-lg">
                Продано
              </button>
            ) : balance < selectedGift.price ? (
              <div className="space-y-2">
                <button disabled className="w-full py-4 bg-gray-300 text-gray-500 rounded-xl font-bold text-lg">
                  Недостаточно средств
                </button>
                <button 
                  onClick={() => { 
                    handleTopUp(); 
                    setSelectedGift(null); 
                  }} 
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
                >
                  Пополнить баланс
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handlePurchase(selectedGift)} 
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Купить за {selectedGift.price} Stars
              </button>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;