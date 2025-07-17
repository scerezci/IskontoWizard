import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertCircle, CheckCircle, Search, User, Settings, Target, List, Sparkles } from 'lucide-react';

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
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
      color: "from-primary to-info"
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
        <label className="form-label fw-medium">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
        <div className="position-relative">
          {children}
          <div className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ pointerEvents: 'none' }}>
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
          <div className="text-danger small mt-1 d-flex align-items-center">
            <AlertCircle size={12} className="me-1" />
            {error}
          </div>
        )}
        {!error && validation && !validation.isValid && (
          <div className="text-warning small mt-1 d-flex align-items-center">
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
                    placeholder="Kod giriniz"
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
                    <button className="btn btn-outline-primary" type="button">
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
                    <button className="btn btn-outline-primary" type="button">
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
                    <button className="btn btn-outline-primary" type="button">
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
    <div>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light">
        <div className="container-fluid py-4">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-primary mb-3">
              CRM Kampanya Wizard
            </h1>
            <p className="lead text-muted">
              Kampanya bilgilerini adım adım tamamlayın
            </p>
          </div>

          {/* Progress Bar */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-medium text-secondary">
                      Adım {currentStep + 1} / {steps.length}
                    </span>
                    <span className="text-muted">
                      {Math.round(getStepProgress())}% Tamamlandı
                    </span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-gradient progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${getStepProgress()}%` }}
                      aria-valuenow={getStepProgress()}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="row justify-content-center mb-5">
            <div className="col-lg-10">
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = completedSteps.includes(index);
                  const isAccessible = index <= currentStep;

                  return (
                    <div
                      key={index}
                      className={`d-flex flex-column align-items-center ${
                        isAccessible ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => {
                        if (isAccessible) {
                          setCurrentStep(index);
                        }
                      }}
                      style={{ 
                        cursor: isAccessible ? 'pointer' : 'not-allowed',
                        opacity: isAccessible ? 1 : 0.5,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div className={`
                        rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm
                        ${isActive 
                          ? 'bg-primary text-white' 
                          : isCompleted 
                            ? 'bg-success text-white' 
                            : 'bg-light text-secondary'
                        }
                      `}
                      style={{
                        width: '50px',
                        height: '50px',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}>
                        {isCompleted && !isActive ? (
                          <Check size={20} />
                        ) : (
                          <IconComponent size={20} />
                        )}
                      </div>
                      <span className={`text-center small fw-medium ${
                        isActive ? 'text-primary' : 'text-secondary'
                      }`} style={{ maxWidth: '80px' }}>
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className={`
                card shadow-lg border-0 transition-all
                ${isAnimating ? 'opacity-50' : 'opacity-100'}
              `} style={{
                transition: 'all 0.3s ease',
                transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
              }}>
                <div className="card-header bg-primary text-white">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-25 rounded p-2 me-3">
                      {React.createElement(steps[currentStep].icon, { 
                        className: "text-white", 
                        size: 24 
                      })}
                    </div>
                    <div>
                      <h4 className="card-title mb-1">
                        {steps[currentStep].title}
                      </h4>
                      <p className="card-text mb-0 opacity-75">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4" style={{ minHeight: '500px' }}>
                  {renderStepContent()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-10">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`
                        btn d-flex align-items-center gap-2 px-4 py-2
                        ${currentStep === 0
                          ? 'btn-outline-secondary disabled'
                          : 'btn-outline-primary'
                        }
                      `}
                    >
                      <ChevronLeft size={20} />
                      Önceki
                    </button>
                    
                    <div className="d-flex align-items-center gap-3">
                      {currentStep < steps.length - 1 ? (
                        <button
                          onClick={nextStep}
                          disabled={!canProceed()}
                          className={`
                            btn d-flex align-items-center gap-2 px-4 py-2
                            ${canProceed()
                              ? 'btn-primary shadow-sm'
                              : 'btn-outline-secondary disabled'
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
                          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                        >
                          <Check size={20} />
                          Kampanyayı Oluştur
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {getModalTitle()}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6">
                    <InputWrapper field="hdy" label="HDY">
                      <input
                        type="text"
                        value={formData.hdy || ''}
                        onChange={(e) => handleInputChange('hdy', e.target.value)}
                        className="form-control"
                        placeholder="HDY değeri"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-md-6">
                    <InputWrapper field="ksl" label="KŞL">
                      <input
                        type="text"
                        value={formData.ksl || ''}
                        onChange={(e) => handleInputChange('ksl', e.target.value)}
                        className="form-control"
                        placeholder="KŞL değeri"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-md-6">
                    <InputWrapper field="altLimit" label="Alt Limit">
                      <input
                        type="number"
                        value={formData.altLimit || ''}
                        onChange={(e) => handleInputChange('altLimit', e.target.value)}
                        className="form-control"
                        placeholder="Alt limit değeri"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-md-6">
                    <InputWrapper field="ustLimit" label="Üst Limit">
                      <input
                        type="number"
                        value={formData.ustLimit || ''}
                        onChange={(e) => handleInputChange('ustLimit', e.target.value)}
                        className="form-control"
                        placeholder="Üst limit değeri"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-md-6">
                    <InputWrapper field="hedef" label="Hedef">
                      <input
                        type="number"
                        value={formData.hedef || ''}
                        onChange={(e) => handleInputChange('hedef', e.target.value)}
                        className="form-control"
                        placeholder="Hedef değeri"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>

                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Notlar</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Ek notlar..."
                        disabled={modalType === 'izle'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  {modalType === 'izle' ? 'Kapat' : 'İptal'}
                </button>
                
                {modalType !== 'izle' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleModalSubmit}
                  >
                    {modalType === 'yeni' ? (
                      <>
                        <span className="me-2">➕</span>
                        Kayıt Ekle
                      </>
                    ) : (
                      <>
                        <span className="me-2">✏️</span>
                        Güncelle
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
      <style>{`
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .progress-bar {
          background: linear-gradient(45deg, #007bff, #6f42c1);
        }
        
        .card {
          border: none;
        }
        
        .card-header {
          background: linear-gradient(45deg, #007bff, #6f42c1) !important;
        }
        
        .btn-primary {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          border: none;
        }
        
        .btn-primary:hover {
          background: linear-gradient(45deg, #0056b3, #5a2d91);
          transform: translateY(-1px);
        }
        
        .btn-success {
          background: linear-gradient(45deg, #28a745, #20c997);
          border: none;
        }
        
        .btn-success:hover {
          background: linear-gradient(45deg, #1e7e34, #17a2b8);
          transform: translateY(-1px);
        }
        
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .form-check-input:checked {
          background-color: #007bff;
          border-color: #007bff;
        }
        
        .bg-light {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        }
        
        .shadow-lg {
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
        }
        
        .input-group .btn {
          border-left: none;
        }
        
        .input-group .form-control {
          border-right: none;
        }
        
        .input-group .form-control:focus {
          z-index: 3;
        }
        
        .modal-content {
          border: none;
          border-radius: 0.5rem;
        }
        
        .modal-header {
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .modal-footer {
          border-top: 1px solid #dee2e6;
          border-radius: 0 0 0.5rem 0.5rem;
        }
        
        .is-valid {
          border-color: #28a745;
        }
        
        .is-invalid {
          border-color: #dc3545;
        }
        
        .border-warning {
          border-color: #ffc107 !important;
        }
        
        .text-primary {
          color: #007bff !important;
        }
        
        .display-4 {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 1rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .display-4 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;