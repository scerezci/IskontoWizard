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
      color: "primary"
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
      <div className="mb-3">
        <label className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
        <div className="position-relative">
          {children}
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            {status === 'success' && (
              <CheckCircle className="text-success" size={16} />
            )}
            {status === 'error' && (
              <AlertCircle className="text-danger" size={16} />
            )}
            {status === 'warning' && (
              <AlertCircle className="text-warning" size={16} />
            )}
          </div>
        </div>
        {error && (
          <div className="text-danger small mt-1">
            <AlertCircle size={12} className="me-1" />
            {error}
          </div>
        )}
        {!error && validation && !validation.isValid && (
          <div className="text-warning small mt-1">
            <AlertCircle size={12} className="me-1" />
            {validation.message}
          </div>
        )}
      </div>
    );
  };

  const renderStepContent = () => {
    const getInputClasses = (field) => {
      const status = getFieldStatus(field);
      let classes = 'form-control';
      
      switch (status) {
        case 'success':
          classes += ' is-valid';
          break;
        case 'error':
          classes += ' is-invalid';
          break;
        case 'warning':
          classes += ' border-warning';
          break;
        default:
          break;
      }
      
      return classes;
    };

    switch (currentStep) {
      case 0:
        return (
          <div>
            {/* İlk Satır - Kod, Durum, Açıklama */}
            <div className="row mb-4">
              <div className="col-md-4">
                <InputWrapper field="kod" label="Kod" required>
                  <input
                    type="text"
                    value={formData.kod}
                    onChange={(e) => handleInputChange('kod', e.target.value)}
                    className={getInputClasses('kod')}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>
              
              <div className="col-md-4">
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
              </div>

              <div className="col-md-4">
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
            </div>

            {/* İkinci Satır - Tarihler */}
            <div className="row mb-4">
              <div className="col-md-3">
                <InputWrapper field="baslangicTarihi" label="Başlangıç Tarihi" required>
                  <input
                    type="date"
                    value={formData.baslangicTarihi}
                    onChange={(e) => handleInputChange('baslangicTarihi', e.target.value)}
                    className={getInputClasses('baslangicTarihi')}
                  />
                </InputWrapper>
              </div>
              
              <div className="col-md-3">
                <InputWrapper field="bitisTarihi" label="Bitiş Tarihi" required>
                  <input
                    type="date"
                    value={formData.bitisTarihi}
                    onChange={(e) => handleInputChange('bitisTarihi', e.target.value)}
                    className={getInputClasses('bitisTarihi')}
                  />
                </InputWrapper>
              </div>

              <div className="col-md-3">
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
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="verziparitiKampanya"
                    checked={formData.verziparitiKampanya}
                    onChange={() => handleCheckboxChange('verziparitiKampanya')}
                    className="form-check-input"
                  />
                  <label className="form-check-label" htmlFor="verziparitiKampanya">
                    Verzipariti Kampanya
                  </label>
                </div>
              </div>
            </div>

            {/* Üçüncü Satır - Belge ve Saha */}
            <div className="row mb-4">
              <div className="col-md-3">
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
              </div>

              <div className="col-md-3">
                <InputWrapper field="sayi" label="Sayı">
                  <input
                    type="number"
                    value={formData.sayi}
                    onChange={(e) => handleInputChange('sayi', e.target.value)}
                    className={getInputClasses('sayi')}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-3">
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
              </div>

              <div className="col-md-3">
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
            </div>

            {/* Dördüncü Satır - İskonto/Promosyon ve Ödeme */}
            <div className="row mb-4">
              <div className="col-md-6">
                <InputWrapper field="iskontoPromosyonMetni" label="İskonto/Promosyon Metni">
                  <input
                    type="text"
                    value={formData.iskontoPromosyonMetni}
                    onChange={(e) => handleInputChange('iskontoPromosyonMetni', e.target.value)}
                    className={getInputClasses('iskontoPromosyonMetni')}
                    placeholder="İskonto/Promosyon metni"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-6">
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
            </div>

            {/* Beşinci Satır - Arama Alanları */}
            <div className="row mb-4">
              <div className="col-md-3">
                <InputWrapper field="iskontoGrubu" label="İskonto Grubu">
                  <div className="input-group">
                    <input
                      type="text"
                      value={formData.iskontoGrubu}
                      onChange={(e) => handleInputChange('iskontoGrubu', e.target.value)}
                      className={getInputClasses('iskontoGrubu')}
                      placeholder="İskonto Grubu"
                    />
                    <button className="btn btn-primary" type="button">
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-3">
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
              </div>

              <div className="col-md-3">
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
              </div>

              <div className="col-md-3">
                <InputWrapper field="hareketTipi" label="Hareket Tipi">
                  <div className="input-group">
                    <input
                      type="text"
                      value={formData.hareketTipi}
                      onChange={(e) => handleInputChange('hareketTipi', e.target.value)}
                      className={getInputClasses('hareketTipi')}
                      placeholder="Hareket Tipi"
                    />
                    <button className="btn btn-primary" type="button">
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>
              </div>
            </div>

            {/* Altıncı Satır - Kontrat ve Checkboxlar */}
            <div className="row mb-4">
              <div className="col-md-6">
                <InputWrapper field="kontratButce" label="Kontrat Bütçe">
                  <div className="input-group">
                    <input
                      type="text"
                      value={formData.kontratButce}
                      onChange={(e) => handleInputChange('kontratButce', e.target.value)}
                      className={getInputClasses('kontratButce')}
                      placeholder="Kontrat Bütçe"
                    />
                    <button className="btn btn-primary" type="button">
                      <Search size={16} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <div className="mt-4">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      id="sefBarindaBolunun"
                      checked={formData.sefBarindaBolunun}
                      onChange={() => handleCheckboxChange('sefBarindaBolunun')}
                      className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="sefBarindaBolunun">
                      Şef Barında Bölünün
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="commercePortalKampanya"
                      checked={formData.commercePortalKampanya}
                      onChange={() => handleCheckboxChange('commercePortalKampanya')}
                      className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor="commercePortalKampanya">
                      CommercePortal Kampanya
                    </label>
                  </div>
                </div>
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