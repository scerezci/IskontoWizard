import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, CheckCircle, Search, User, Settings, Target, List, Sparkles } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'yeni', 'duzenle', 'izle'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Temel Bilgiler (Fotoğrafa göre güncellendi)
    kod: '',
    durum: 'Aktif',
    baslangicTarihi: '',
    bitisTarihi: '',
    belgeTur: '',
    sayi: '',
    uygulamaYeri: 'Panorama',
    vadeGunu: '',
    aciklama: '',
    onay: false,
    belgetipi: 'Hepsi',
    iskontoPromosyonMetni: '',
    odemeTipi: 'Hepsi',
    iskontoGrubu: '',
    iadeCezaIsk: 'Hayır',
    butcedeUygula: 'Evet',
    hareketTipi: '',
    kontratButce: '',
    sefBarindaBolunun: false,
    verziparitiKampanya: false,
    commercePortalKampanya: false,
    
    // Diğer adımlar için placeholder
    saha: '',
    hizmetGrubu: '',
    dagitimciKriterTipi: '',
    dagitimciKriteri: '',
    uygulamaKriteri: '',
    uygulamaKriteriKullanimi: false,
    musteriKriter: '',
    musteriKriterTipi: '',
    iadeNedeni: '',
    ekSahaKriteri: '',
    
    // Hedef Kriterleri alanları
    hedefUrunKriterTip: '',
    uygulamaTipi: 'Genel',
    hedefUrunKriter: '',
    ekSahaKriteri2: '',
    bilgi: '',
    hedefTip: 'Miktar',
    hedefUrunBirimi: 'Birim 1',
    maksUygulamaSayisi: '0',
    dağitimciKotaTutari: '',
    maksUygulamaTutari: '',
    iskProUygulanacakUrunAdedi: '',
    belgeVade: '',
    
    // Checkboxlar
    maksUygulamaTutariIskontoControl: false,
    promosyonKoli: false,
    birUstKademeleIskPro: false,
    opsiyonelIskonto: false,
    hedeflerSonraSatilan: false,
    smsGonderimi: false,
    azalanHedefKademe: false,
    otomatikFiyat: false,
    kumülatifMiktarTutar: false,
    iskProUygulanacakUrunAdedi: false,
    maksUygulamaSayisiIskontoControl: false,
    tutarHediyesi: false,
    iskontoTanimlamaBagli: false,
    iskProUygulanacakUrunAdediControl: false,
    
    // Kademeler için alanlar
    hdy: '',
    ksl: '',
    altLimit: '',
    ustLimit: '',
    hedef: '',
    gridData: [],
    
    hedefUrunKriterTipi: 'Faal',
    maksUygulamaSayisi2: '1000'
  });

  const [errors, setErrors] = useState({});
  const [fieldValidations, setFieldValidations] = useState({});

  const steps = [
    {
      title: "Temel Bilgiler",
      description: "Kampanya temel bilgilerini girin",
      icon: User,
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Kriterler",
      description: "Uygulama kriterlerini tanımlayın",
      icon: Target,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Hedef Kriterleri",
      description: "Hedef ürün kriterlerini ve ayarlarını tanımlayın",
      icon: Target,
      color: "from-pink-500 to-red-600"
    },
    {
      title: "Kademeler",
      description: "Kayıtları görüntüleyin, ekleyin ve düzenleyin",
      icon: List,
      color: "from-red-500 to-orange-600"
    }
  ];

  const validationRules = {
    kod: {
      required: true,
      message: "Kod zorunludur"
    },
    durum: {
      required: true,
      message: "Durum seçimi zorunludur"
    },
    baslangicTarihi: {
      required: true,
      message: "Başlangıç tarihi zorunludur"
    },
    bitisTarihi: {
      required: true,
      message: "Bitiş tarihi zorunludur"
    },
    aciklama: {
      required: true,
      minLength: 5,
      message: "Açıklama en az 5 karakter olmalıdır"
    },
    dagitimciKriterTipi: {
      required: true,
      message: "Dağıtımcı kriter tipi seçimi zorunludur"
    }
  };

  const validateField = (fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true, message: '' };

    if (rules.required && (!value || value.toString().trim() === '')) {
      return { isValid: false, message: rules.message || `${fieldName} zorunludur` };
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      return { isValid: false, message: rules.message || `En az ${rules.minLength} karakter gereklidir` };
    }

    return { isValid: true, message: '' };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    const validation = validateField(field, value);
    setFieldValidations(prev => ({
      ...prev,
      [field]: validation
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateCurrentStep = () => {
    const stepFields = getStepFields(currentStep);
    const newErrors = {};
    let isValid = true;

    stepFields.forEach(field => {
      const validation = validateField(field, formData[field]);
      if (!validation.isValid) {
        newErrors[field] = validation.message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const getStepFields = (step) => {
    switch (step) {
      case 0: return ['kod', 'durum', 'baslangicTarihi', 'bitisTarihi', 'aciklama'];
      case 1: return ['dagitimciKriterTipi'];
      case 2: return ['hedefUrunKriterTip'];
      case 3: return ['saha'];
      case 4: return ['hizmetGrubu'];
      case 5: return [];
      default: return [];
    }
  };

  const openModal = (type, record = null) => {
    setModalType(type);
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedRecord(null);
  };

  const handleModalSubmit = () => {
    const recordData = {
      hdy: formData.hdy,
      ksl: formData.ksl,
      altLimit: formData.altLimit,
      ustLimit: formData.ustLimit,
      hedef: formData.hedef
    };
    
    console.log(`${modalType} işlemi:`, recordData);
    
    if (modalType === 'yeni') {
      alert('Kayıt başarıyla eklendi!');
    } else if (modalType === 'duzenle') {
      alert('Kayıt başarıyla güncellendi!');
    }
    
    closeModal();
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'yeni': return 'Yeni Kayıt Ekle';
      case 'duzenle': return 'Kayıt Düzenle';
      case 'izle': return 'Kayıt Görüntüle';
      default: return 'Kayıt İşlemi';
    }
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    setIsAnimating(true);
    
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const getFieldStatus = (fieldName) => {
    const validation = fieldValidations[fieldName];
    const hasError = errors[fieldName];
    
    if (hasError) return 'error';
    if (validation && !validation.isValid) return 'warning';
    if (validation && validation.isValid && formData[fieldName]) return 'success';
    return 'default';
  };

  const InputWrapper = ({ children, field, label, required = false }) => {
    const status = getFieldStatus(field);
    const error = errors[field];
    const validation = fieldValidations[field];

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          {children}
          <div className="absolute right-2 top-2.5">
            {status === 'success' && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            {status === 'warning' && (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
        {!error && validation && !validation.isValid && (
          <p className="text-yellow-500 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validation.message}
          </p>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    const baseInputClasses = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";
    
    const getInputClasses = (field) => {
      const status = getFieldStatus(field);
      let classes = baseInputClasses;
      
      switch (status) {
        case 'success':
          classes += ' border-green-500 bg-green-50';
          break;
        case 'error':
          classes += ' border-red-500 bg-red-50';
          break;
        case 'warning':
          classes += ' border-yellow-500 bg-yellow-50';
          break;
        default:
          classes += ' border-gray-300';
      }
      
      return classes;
    };

    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* İlk Satır - Kod, Durum, Açıklama */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputWrapper field="kod" label="Kod" required>
                <input
                  type="text"
                  value={formData.kod}
                  onChange={(e) => handleInputChange('kod', e.target.value)}
                  className={getInputClasses('kod')}
                  placeholder="0"
                />
              </InputWrapper>
              
              <InputWrapper field="durum" label="Durum" required>
                <select
                  value={formData.durum}
                  onChange={(e) => handleInputChange('durum', e.target.value)}
                  className={getInputClasses('durum')}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Pasif">Pasif</option>
                  <option value="Beklemede">Beklemede</option>
                </select>
              </InputWrapper>

              <InputWrapper field="aciklama" label="Açıklama" required>
                <select
                  value={formData.aciklama}
                  onChange={(e) => handleInputChange('aciklama', e.target.value)}
                  className={getInputClasses('aciklama')}
                >
                  <option value="">Seçiniz</option>
                  <option value="Onay">Onay</option>
                  <option value="Onay/anmadı">Onay/anmadı</option>
                  <option value="Kampanya">Kampanya</option>
                </select>
              </InputWrapper>
            </div>

            {/* İkinci Satır - Tarihler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputWrapper field="baslangicTarihi" label="Başlangıç Tarihi" required>
                <input
                  type="date"
                  value={formData.baslangicTarihi}
                  onChange={(e) => handleInputChange('baslangicTarihi', e.target.value)}
                  className={getInputClasses('baslangicTarihi')}
                  placeholder="10.7.2025"
                />
              </InputWrapper>
              
              <InputWrapper field="bitisTarihi" label="Bitiş Tarihi" required>
                <input
                  type="date"
                  value={formData.bitisTarihi}
                  onChange={(e) => handleInputChange('bitisTarihi', e.target.value)}
                  className={getInputClasses('bitisTarihi')}
                  placeholder="31.12.2025"
                />
              </InputWrapper>

              <InputWrapper field="belgetipi" label="Belge Tip">
                <select
                  value={formData.belgetipi}
                  onChange={(e) => handleInputChange('belgetipi', e.target.value)}
                  className={getInputClasses('belgetipi')}
                >
                  <option value="Hepsi">Hepsi</option>
                  <option value="Fatura">Fatura</option>
                  <option value="İrsaliye">İrsaliye</option>
                </select>
              </InputWrapper>

              <div className="flex items-center space-x-2 mt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verziparitiKampanya}
                    onChange={() => handleCheckboxChange('verziparitiKampanya')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Verzipariti Kampanya</span>
                </label>
              </div>
            </div>

            {/* Üçüncü Satır - Belge ve Saha */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputWrapper field="belgeTur" label="Belge Tür">
                <select
                  value={formData.belgeTur}
                  onChange={(e) => handleInputChange('belgeTur', e.target.value)}
                  className={getInputClasses('belgeTur')}
                >
                  <option value="">Seçiniz</option>
                  <option value="Satış">Satış</option>
                  <option value="İade">İade</option>
                </select>
              </InputWrapper>

              <InputWrapper field="sayi" label="Sayı">
                <input
                  type="number"
                  value={formData.sayi}
                  onChange={(e) => handleInputChange('sayi', e.target.value)}
                  className={getInputClasses('sayi')}
                  placeholder="0"
                />
              </InputWrapper>

              <InputWrapper field="uygulamaYeri" label="Uygulama Yeri">
                <select
                  value={formData.uygulamaYeri}
                  onChange={(e) => handleInputChange('uygulamaYeri', e.target.value)}
                  className={getInputClasses('uygulamaYeri')}
                >
                  <option value="Panorama">Panorama</option>
                  <option value="Merkez">Merkez</option>
                  <option value="Şube">Şube</option>
                </select>
              </InputWrapper>

              <InputWrapper field="vadeGunu" label="Vade Günü">
                <input
                  type="number"
                  value={formData.vadeGunu}
                  onChange={(e) => handleInputChange('vadeGunu', e.target.value)}
                  className={getInputClasses('vadeGunu')}
                  placeholder="255"
                />
              </InputWrapper>
            </div>

            {/* Dördüncü Satır - İskonto/Promosyon ve Ödeme */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper field="iskontoPromosyonMetni" label="İskonto/Promosyon Metni">
                <input
                  type="text"
                  value={formData.iskontoPromosyonMetni}
                  onChange={(e) => handleInputChange('iskontoPromosyonMetni', e.target.value)}
                  className={getInputClasses('iskontoPromosyonMetni')}
                  placeholder="İskonto/Promosyon metni"
                />
              </InputWrapper>

              <InputWrapper field="odemeTipi" label="Ödeme Tipi">
                <select
                  value={formData.odemeTipi}
                  onChange={(e) => handleInputChange('odemeTipi', e.target.value)}
                  className={getInputClasses('odemeTipi')}
                >
                  <option value="Hepsi">Hepsi</option>
                  <option value="Nakit">Nakit</option>
                  <option value="Kredi Kartı">Kredi Kartı</option>
                  <option value="Çek">Çek</option>
                </select>
              </InputWrapper>
            </div>

            {/* Beşinci Satır - Arama Alanları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputWrapper field="iskontoGrubu" label="İskonto Grubu">
                <div className="flex">
                  <input
                    type="text"
                    value={formData.iskontoGrubu}
                    onChange={(e) => handleInputChange('iskontoGrubu', e.target.value)}
                    className={getInputClasses('iskontoGrubu') + ' rounded-r-none'}
                    placeholder="İskonto Grubu"
                  />
                  <button className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors">
                    <Search size={16} />
                  </button>
                </div>
              </InputWrapper>

              <InputWrapper field="iadeCezaIsk" label="İade Ceza İsk.">
                <select
                  value={formData.iadeCezaIsk}
                  onChange={(e) => handleInputChange('iadeCezaIsk', e.target.value)}
                  className={getInputClasses('iadeCezaIsk')}
                >
                  <option value="Hayır">Hayır</option>
                  <option value="Evet">Evet</option>
                </select>
              </InputWrapper>

              <InputWrapper field="butcedeUygula" label="Bütçede Uygula">
                <select
                  value={formData.butcedeUygula}
                  onChange={(e) => handleInputChange('butcedeUygula', e.target.value)}
                  className={getInputClasses('butcedeUygula')}
                >
                  <option value="Evet">Evet</option>
                  <option value="Hayır">Hayır</option>
                </select>
              </InputWrapper>

              <InputWrapper field="hareketTipi" label="Hareket Tipi">
                <div className="flex">
                  <input
                    type="text"
                    value={formData.hareketTipi}
                    onChange={(e) => handleInputChange('hareketTipi', e.target.value)}
                    className={getInputClasses('hareketTipi') + ' rounded-r-none'}
                    placeholder="Hareket Tipi"
                  />
                  <button className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors">
                    <Search size={16} />
                  </button>
                </div>
              </InputWrapper>
            </div>

            {/* Altıncı Satır - Kontrat ve Checkboxlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputWrapper field="kontratButce" label="Kontrat Bütçe">
                <div className="flex">
                  <input
                    type="text"
                    value={formData.kontratButce}
                    onChange={(e) => handleInputChange('kontratButce', e.target.value)}
                    className={getInputClasses('kontratButce') + ' rounded-r-none'}
                    placeholder="Kontrat Bütçe"
                  />
                  <button className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors">
                    <Search size={16} />
                  </button>
                </div>
              </InputWrapper>

              <div className="space-y-3 mt-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sefBarindaBolunun}
                    onChange={() => handleCheckboxChange('sefBarindaBolunun')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Şef Barında Bölünün</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.commercePortalKampanya}
                    onChange={() => handleCheckboxChange('commercePortalKampanya')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">CommercePortal Kampanya</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            {/* Kriterler Bölümü - Fotoğrafa göre */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Kriterler
              </h3>
              
              {/* İlk Satır - Dağıtımcı Kriter Tipi ve Kriteri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputWrapper field="dagitimciKriterTipi" label="Dağıtımcı Kriter Tipi" required>
                  <select
                    value={formData.dagitimciKriterTipi}
                    onChange={(e) => handleInputChange('dagitimciKriterTipi', e.target.value)}
                    className={getInputClasses('dagitimciKriterTipi')}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Kategori">Kategori</option>
                  </select>
                </InputWrapper>

                <InputWrapper field="dagitimciKriteri" label="Dağıtımcı Kriteri">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.dagitimciKriteri}
                      onChange={(e) => handleInputChange('dagitimciKriteri', e.target.value)}
                      className={getInputClasses('dagitimciKriteri') + ' rounded-r-none'}
                      placeholder="Dağıtımcı kriteri girin"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              {/* İkinci Satır - Uygulama Kriteri ve Checkbox */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputWrapper field="uygulamaKriteri" label="Uygulama Kriteri">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.uygulamaKriteri}
                      onChange={(e) => handleInputChange('uygulamaKriteri', e.target.value)}
                      className={getInputClasses('uygulamaKriteri') + ' rounded-r-none'}
                      placeholder="Uygulama kriteri girin"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>

                <div className="flex items-center mt-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.uygulamaKriteriKullanimi}
                      onChange={() => handleCheckboxChange('uygulamaKriteriKullanimi')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 font-medium">Uygulama Kriterleri Kullanılan</span>
                  </label>
                </div>
              </div>

              {/* Üçüncü Satır - Müşteri Kriter ve Müşteri Kriter Tipi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputWrapper field="musteriKriter" label="Müşteri Kriter">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.musteriKriter}
                      onChange={(e) => handleInputChange('musteriKriter', e.target.value)}
                      className={getInputClasses('musteriKriter') + ' rounded-r-none'}
                      placeholder="Müşteri kriteri girin"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>

                <InputWrapper field="musteriKriterTipi" label="Müşteri Kriter Tipi">
                  <select
                    value={formData.musteriKriterTipi}
                    onChange={(e) => handleInputChange('musteriKriterTipi', e.target.value)}
                    className={getInputClasses('musteriKriterTipi')}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Bölge">Bölge</option>
                    <option value="Kategori">Kategori</option>
                  </select>
                </InputWrapper>
              </div>

              {/* Dördüncü Satır - İade Nedeni ve Ek Saha Kriteri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper field="iadeNedeni" label="İade Nedeni">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.iadeNedeni}
                      onChange={(e) => handleInputChange('iadeNedeni', e.target.value)}
                      className={getInputClasses('iadeNedeni') + ' rounded-r-none'}
                      placeholder="İade nedeni girin"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                    <button 
                      type="button"
                      className="px-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-xs">...</span>
                    </button>
                  </div>
                </InputWrapper>

                <InputWrapper field="ekSahaKriteri" label="Ek Saha Kriteri">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.ekSahaKriteri}
                      onChange={(e) => handleInputChange('ekSahaKriteri', e.target.value)}
                      className={getInputClasses('ekSahaKriteri') + ' rounded-r-none'}
                      placeholder="Ek saha kriteri girin"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                    <button 
                      type="button"
                      className="px-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-xs">...</span>
                    </button>
                  </div>
                </InputWrapper>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Hedef Kriterleri Bölümü */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Hedef Kriterleri
              </h3>
              
              {/* İlk Satır - Hedef Ürün Kriter Tip, Uygulama Tipi, Hedef Ürün Kriter, Ek Saha Kriteri */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InputWrapper field="hedefUrunKriterTip" label="Hedef Ürün Kriter Tip">
                  <select
                    value={formData.hedefUrunKriterTip}
                    onChange={(e) => handleInputChange('hedefUrunKriterTip', e.target.value)}
                    className={getInputClasses('hedefUrunKriterTip')}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Kategori">Kategori</option>
                  </select>
                </InputWrapper>

                <InputWrapper field="uygulamaTipi" label="Uygulama Tipi">
                  <select
                    value={formData.uygulamaTipi}
                    onChange={(e) => handleInputChange('uygulamaTipi', e.target.value)}
                    className={getInputClasses('uygulamaTipi')}
                  >
                    <option value="Genel">Genel</option>
                    <option value="Özel">Özel</option>
                    <option value="Grup">Grup</option>
                  </select>
                </InputWrapper>

                <InputWrapper field="hedefUrunKriter" label="Hedef Ürün Kriter">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.hedefUrunKriter}
                      onChange={(e) => handleInputChange('hedefUrunKriter', e.target.value)}
                      className={getInputClasses('hedefUrunKriter') + ' rounded-r-none'}
                      placeholder="Hedef ürün kriter"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>

                <InputWrapper field="ekSahaKriteri2" label="Ek Saha Kriteri">
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.ekSahaKriteri2}
                      onChange={(e) => handleInputChange('ekSahaKriteri2', e.target.value)}
                      className={getInputClasses('ekSahaKriteri2') + ' rounded-r-none'}
                      placeholder="Ek saha kriteri"
                    />
                    <button 
                      type="button"
                      className="px-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
                    >
                      <Search size={16} />
                    </button>
                    <button 
                      type="button"
                      className="px-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-xs">...</span>
                    </button>
                  </div>
                </InputWrapper>
              </div>

              {/* İkinci Satır - Bilgi, Hedef Tip, Hedef Ürün Birimi, Maks. Uygulama Sayısı */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InputWrapper field="bilgi" label="Bilgi">
                  <textarea
                    value={formData.bilgi}
                    onChange={(e) => handleInputChange('bilgi', e.target.value)}
                    className={getInputClasses('bilgi')}
                    rows="2"
                    placeholder="Bilgi giriniz"
                  />
                </InputWrapper>

                <InputWrapper field="hedefTip" label="Hedef Tip">
                  <select
                    value={formData.hedefTip}
                    onChange={(e) => handleInputChange('hedefTip', e.target.value)}
                    className={getInputClasses('hedefTip')}
                  >
                    <option value="Miktar">Miktar</option>
                    <option value="Tutar">Tutar</option>
                    <option value="Adet">Adet</option>
                  </select>
                </InputWrapper>

                <InputWrapper field="hedefUrunBirimi" label="Hedef Ürün Birimi">
                  <select
                    value={formData.hedefUrunBirimi}
                    onChange={(e) => handleInputChange('hedefUrunBirimi', e.target.value)}
                    className={getInputClasses('hedefUrunBirimi')}
                  >
                    <option value="Birim 1">Birim 1</option>
                    <option value="Kg">Kg</option>
                    <option value="Adet">Adet</option>
                    <option value="Litre">Litre</option>
                  </select>
                </InputWrapper>

                <InputWrapper field="maksUygulamaSayisi" label="Maks. Uygulama Sayısı">
                  <input
                    type="number"
                    value={formData.maksUygulamaSayisi}
                    onChange={(e) => handleInputChange('maksUygulamaSayisi', e.target.value)}
                    className={getInputClasses('maksUygulamaSayisi')}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              {/* Üçüncü Satır - Tutarlar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <InputWrapper field="dağitimciKotaTutari" label="Dağıtımcı Kota Tutarı">
                  <input
                    type="text"
                    value={formData.dağitimciKotaTutari}
                    onChange={(e) => handleInputChange('dağitimciKotaTutari', e.target.value)}
                    className={getInputClasses('dağitimciKotaTutari')}
                    placeholder="Dağıtımcı kota tutarı"
                  />
                </InputWrapper>

                <InputWrapper field="maksUygulamaTutari" label="Maks.Uygulama Tutarı">
                  <input
                    type="text"
                    value={formData.maksUygulamaTutari}
                    onChange={(e) => handleInputChange('maksUygulamaTutari', e.target.value)}
                    className={getInputClasses('maksUygulamaTutari')}
                    placeholder="Hedef miktara yaklaşma oranı"
                  />
                </InputWrapper>

                <InputWrapper field="iskProUygulanacakUrunAdedi" label="İsk/Pro Uygulanacak Ürün Adedi">
                  <input
                    type="text"
                    value={formData.iskProUygulanacakUrunAdedi}
                    onChange={(e) => handleInputChange('iskProUygulanacakUrunAdedi', e.target.value)}
                    className={getInputClasses('iskProUygulanacakUrunAdedi')}
                    placeholder="İsk/Pro uygulanacak ürün adedi"
                  />
                </InputWrapper>

                <InputWrapper field="belgeVade" label="Belge Vade">
                  <input
                    type="text"
                    value={formData.belgeVade}
                    onChange={(e) => handleInputChange('belgeVade', e.target.value)}
                    className={getInputClasses('belgeVade')}
                    placeholder="Belge vade"
                  />
                </InputWrapper>
              </div>

              {/* Checkbox Bölümleri */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Sol Kolon Checkboxları */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.maksUygulamaTutariIskontoControl}
                      onChange={() => handleCheckboxChange('maksUygulamaTutariIskontoControl')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Maks. Uygulama Tutarı İskonto Bazlı Kontrol Edilsin</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.promosyonKoli}
                      onChange={() => handleCheckboxChange('promosyonKoli')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Promosyon Koli işlemden uygulanacak</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.birUstKademeleIskPro}
                      onChange={() => handleCheckboxChange('birUstKademeleIskPro')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Bir üst kademele İsk/Pro önerlisin mi?</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.opsiyonelIskonto}
                      onChange={() => handleCheckboxChange('opsiyonelIskonto')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Opsiyonel İskonto</span>
                  </label>
                </div>

                {/* Orta Sol Kolon */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.hedeflerSonraSatilan}
                      onChange={() => handleCheckboxChange('hedeflerSonraSatilan')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Hedefler Sonra Satılan Her Ürüne İskonto</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.smsGonderimi}
                      onChange={() => handleCheckboxChange('smsGonderimi')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>SMS gönderimi yapılsın</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.azalanHedefKademe}
                      onChange={() => handleCheckboxChange('azalanHedefKademe')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Azalan Hedef Kademe Uygula</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.otomatikFiyat}
                      onChange={() => handleCheckboxChange('otomatikFiyat')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Otomatik Fiyat Oluşturulsun</span>
                  </label>
                </div>

                {/* Orta Sağ Kolon */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.kumülatifMiktarTutar}
                      onChange={() => handleCheckboxChange('kumülatifMiktarTutar')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Kümülatif Miktar/Tutar Desteği Uygulansin</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.iskProUygulanacakUrunAdediControl}
                      onChange={() => handleCheckboxChange('iskProUygulanacakUrunAdediControl')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>İsk/Pro Uygulanacak Ürün Adedi</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.maksUygulamaSayisiIskontoControl}
                      onChange={() => handleCheckboxChange('maksUygulamaSayisiIskontoControl')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Maks. Uygulama Sayısı İskonto Bazlı Kontrol Edilsin</span>
                  </label>
                </div>

                {/* Sağ Kolon */}
                <div className="space-y-3">
                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.tutarHediyesi}
                      onChange={() => handleCheckboxChange('tutarHediyesi')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>Tutar Hediyesi Koşul Ürünlerine Dağıtılsın</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.iskontoTanimlamaBagli}
                      onChange={() => handleCheckboxChange('iskontoTanimlamaBagli')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>İskonto Tanımlama Bağlı Mesaj Oluştursun</span>
                  </label>

                  <label className="flex items-start space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.iskProUygulanacakUrunAdediOption}
                      onChange={() => handleCheckboxChange('iskProUygulanacakUrunAdediOption')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span>İsk/Pro Uygulanacak Ürün Adedi İskonto Bazlı Kontrol Edilsin</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Grid Yönetim Arayüzü */}
            <div className="bg-white border rounded-lg overflow-hidden">
              {/* Toolbar */}
              <div className="bg-gray-50 p-4 border-b flex flex-wrap items-center gap-2">
                <button 
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Yenile clicked')}
                >
                  <span className="text-sm">🔄</span>
                  Yenile
                </button>
                
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={() => openModal('yeni')}
                >
                  <span className="text-sm">📄</span>
                  Yeni
                </button>
                
                <button 
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  onClick={() => openModal('duzenle')}
                >
                  <span className="text-sm">✏️</span>
                  Düzenle
                </button>
                
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                  onClick={() => openModal('izle')}
                >
                  <span className="text-sm">👁️</span>
                  İzle
                </button>
                
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Sil clicked')}
                >
                  <span className="text-sm">🗑️</span>
                  Sil
                </button>
                
                <button 
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Koşul clicked')}
                >
                  <span className="text-sm">🔧</span>
                  Koşul
                </button>
                
                <button 
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Hediye clicked')}
                >
                  <span className="text-sm">🎁</span>
                  Hediye
                </button>
                
                <button 
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Hediye Grup clicked')}
                >
                  <span className="text-sm">🎁</span>
                  Hediye Grup
                </button>
                
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Kota clicked')}
                >
                  <span className="text-sm">📊</span>
                  Kota
                </button>
                
                <button 
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Ürün Bazında İskonto Girişi clicked')}
                >
                  <span className="text-sm">🏷️</span>
                  Ürün Bazında İskonto Girişi
                </button>
                
                <button 
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
                  onClick={() => console.log('Ömür Paketi Tanımı clicked')}
                >
                  <span className="text-sm">📦</span>
                  Ömür Paketi Tanımı
                </button>
              </div>

              {/* Grid Header */}
              <div className="bg-gray-100 grid grid-cols-6 gap-4 p-4 text-sm font-semibold text-gray-700">
                <div className="text-center">HDY</div>
                <div className="text-center">KŞL</div>
                <div className="text-center">Sı...</div>
                <div className="text-center">ALT LİMİT</div>
                <div className="text-center">ÜST LİMİT</div>
                <div className="text-center">HEDEF</div>
                <div className="text-center">HEDİYE BAĞL...</div>
                <div className="text-center">KOŞUL BAĞLA...</div>
              </div>

              {/* Grid Content */}
              <div className="min-h-[300px] bg-white">
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-lg font-medium">Herhangi bir kayıt bulunamadı...</p>
                    <p className="text-sm mt-2">Yeni kayıt eklemek için yukarıdaki "Yeni" butonunu kullanın.</p>
                  </div>
                </div>
              </div>

              {/* Grid Footer */}
              <div className="bg-gray-50 p-4 border-t flex justify-between items-center text-sm text-gray-600">
                <div>
                  Toplam: 0 kayıt
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors">
                    ⬅️ Önceki
                  </button>
                  <span className="px-3 py-1">Sayfa 1 / 1</span>
                  <button className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors">
                    Sonraki ➡️
                  </button>
                </div>
              </div>
            </div>

            {/* Bilgi Bölümü */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                Bilgi
              </h4>
              <p className="text-blue-700 text-sm">
                Kayıt eklemek, düzenlemek veya görüntülemek için yukarıdaki ilgili butonları kullanın.
                Kayıt işlemleri popup pencerede gerçekleştirilir.
              </p>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-blue-100">Toplam Kayıt</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-green-100">Aktif Hedefler</div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">0</div>
                <div className="text-orange-100">Bekleyen</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">0%</div>
                <div className="text-purple-100">Tamamlanma</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepProgress = () => {
    const totalSteps = steps.length;
    const progress = ((currentStep + 1) / totalSteps) * 100;
    return Math.min(progress, 100);
  };

  const canProceed = () => {
    const stepFields = getStepFields(currentStep);
    return stepFields.every(field => {
      const validation = validateField(field, formData[field]);
      return validation.isValid;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CRM Kampanya Wizard
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Kampanya bilgilerini adım adım tamamlayın
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700">
              Adım {currentStep + 1} / {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getStepProgress())}% Tamamlandı
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getStepProgress()}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex justify-between items-center mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.includes(index);
            const isAccessible = index <= currentStep;

            return (
              <div
                key={index}
                className={`flex flex-col items-center cursor-pointer transition-all duration-300 min-w-fit mx-2 ${
                  isAccessible ? 'opacity-100' : 'opacity-50'
                }`}
                onClick={() => {
                  if (isAccessible) {
                    setCurrentStep(index);
                  }
                }}
              >
                <div className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                  ${isActive 
                    ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-110` 
                    : isCompleted 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {isCompleted && !isActive ? (
                    <Check size={16} />
                  ) : (
                    <IconComponent size={16} />
                  )}
                </div>
                <span className={`text-xs text-center font-medium max-w-16 md:max-w-20 ${
                  isActive ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className={`
          bg-white rounded-xl shadow-lg p-4 md:p-8 mb-8 transition-all duration-300
          ${isAnimating ? 'opacity-50 transform scale-95' : 'opacity-100 transform scale-100'}
        `}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${steps[currentStep].color} flex items-center justify-center`}>
                {React.createElement(steps[currentStep].icon, { className: "w-5 h-5 text-white" })}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {steps[currentStep].title}
              </h2>
            </div>
            <p className="text-gray-600 text-sm md:text-base ml-0 md:ml-11">
              {steps[currentStep].description}
            </p>
          </div>
          
          <div className="min-h-[400px] md:min-h-[500px]">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto
              ${currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
              }
            `}
          >
            <ChevronLeft size={20} />
            Önceki
          </button>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`
                  flex items-center gap-2 px-6 md:px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto
                  ${canProceed()
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Sonraki
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log('Form Data:', formData);
                  alert('🎉 Kampanya başarıyla oluşturuldu!');
                }}
                className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <Check size={20} />
                Kampanyayı Oluştur
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                {getModalTitle()}
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper field="hdy" label="HDY">
                  <input
                    type="text"
                    value={formData.hdy || ''}
                    onChange={(e) => handleInputChange('hdy', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="HDY değeri"
                    disabled={modalType === 'izle'}
                  />
                </InputWrapper>

                <InputWrapper field="ksl" label="KŞL">
                  <input
                    type="text"
                    value={formData.ksl || ''}
                    onChange={(e) => handleInputChange('ksl', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="KŞL değeri"
                    disabled={modalType === 'izle'}
                  />
                </InputWrapper>

                <InputWrapper field="altLimit" label="Alt Limit">
                  <input
                    type="number"
                    value={formData.altLimit || ''}
                    onChange={(e) => handleInputChange('altLimit', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Alt limit değeri"
                    disabled={modalType === 'izle'}
                  />
                </InputWrapper>

                <InputWrapper field="ustLimit" label="Üst Limit">
                  <input
                    type="number"
                    value={formData.ustLimit || ''}
                    onChange={(e) => handleInputChange('ustLimit', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Üst limit değeri"
                    disabled={modalType === 'izle'}
                  />
                </InputWrapper>

                <InputWrapper field="hedef" label="Hedef">
                  <input
                    type="number"
                    value={formData.hedef || ''}
                    onChange={(e) => handleInputChange('hedef', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Hedef değeri"
                    disabled={modalType === 'izle'}
                  />
                </InputWrapper>

                {/* Ek alanlar eklenebilir */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Notlar
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    rows="3"
                    placeholder="Ek notlar..."
                    disabled={modalType === 'izle'}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                {modalType === 'izle' ? 'Kapat' : 'İptal'}
              </button>
              
              {modalType !== 'izle' && (
                <button
                  onClick={handleModalSubmit}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  {modalType === 'yeni' ? (
                    <>
                      <span>➕</span>
                      Kayıt Ekle
                    </>
                  ) : (
                    <>
                      <span>✏️</span>
                      Güncelle
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;