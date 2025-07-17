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
    gridData: [
      {
        id: 1,
        hdy: '',
        ksl: '',
        sira: 1,
        altLimit: 1.00,
        ustLimit: 999999.00,
        hedef: 1.00,
        hediyeBagli: 'Ve',
        kosulBagli: 'Ve'
      }
    ],
    hedefUrunKriterTipi: 'Faal',
    maksUygulamaSayisi2: '1000',
    // Modal form fields
    modalHdy: '',
    modalKsl: '',
    modalAltLimit: '',
    modalUstLimit: '',
    modalHedef: '',
    hedefMiktarYaklasmaOrani: false,
    kumulatifMiktarTutarBaglıUygulama: false
  });

  const [errors, setErrors] = useState({});
  const [fieldValidations, setFieldValidations] = useState({});

  const steps = [
    {
      title: "Temel Bilgiler",
      description: "Kampanya temel bilgilerini girin",
      icon: User,
      color: "from-primary to-info"
    },
    {
      title: "Kriterler",
      description: "Kampanya kriterlerini belirleyin",
      icon: Target,
      color: "from-info to-warning"
    },
    {
      title: "Hedef Kriterleri",
      description: "Hedef kriterlerini ayarlayın",
      icon: Settings,
      color: "from-warning to-success"
    },
    {
      title: "Kademeler",
      description: "Kademe bilgilerini düzenleyin",
      icon: List,
      color: "from-success to-primary"
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
      minLength: 1,
      message: "Açıklama seçimi zorunludur"
    },
    dagitimciKriterTipi: {
      required: true,
      message: "Dağıtımcı kriter tipi seçimi zorunludur"
    },
    dagitimciKriteri: {
      required: true,
      message: "Dağıtımcı kriteri zorunludur"
    },
    hedefUrunKriterTip: {
      required: true,
      message: "Hedef ürün kriter tipi seçimi zorunludur"
    },
    uygulamaTipi: {
      required: true,
      message: "Uygulama tipi seçimi zorunludur"
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
      case 1: return ['dagitimciKriterTipi', 'dagitimciKriteri'];
      case 2: return ['hedefUrunKriterTip', 'uygulamaTipi'];
      case 3: return []; // Kademeler adımı için zorunlu alan yok
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
      id: selectedRecord ? selectedRecord.id : Date.now(),
      hdy: formData.modalHdy,
      ksl: formData.modalKsl,
      sira: formData.gridData.length + 1,
      altLimit: parseFloat(formData.modalAltLimit) || 0,
      ustLimit: parseFloat(formData.modalUstLimit) || 0,
      hedef: parseFloat(formData.modalHedef) || 0,
      hediyeBagli: 'Ve',
      kosulBagli: 'Ve'
    };
    
    if (modalType === 'yeni') {
      setFormData(prev => ({
        ...prev,
        gridData: [...prev.gridData, recordData],
        modalHdy: '',
        modalKsl: '',
        modalAltLimit: '',
        modalUstLimit: '',
        modalHedef: ''
      }));
    } else if (modalType === 'duzenle') {
      setFormData(prev => ({
        ...prev,
        gridData: prev.gridData.map(item => 
          item.id === selectedRecord.id ? { ...item, ...recordData } : item
        ),
        modalHdy: '',
        modalKsl: '',
        modalAltLimit: '',
        modalUstLimit: '',
        modalHedef: ''
      }));
    }
    
    closeModal();
  };

  const handleDeleteRecord = (id) => {
    if (window.confirm('Bu kaydı silmek istediğinizden emin misiniz?')) {
      setFormData(prev => ({
        ...prev,
        gridData: prev.gridData.filter(item => item.id !== id)
      }));
    }
  };

  const handleEditRecord = (record) => {
    setFormData(prev => ({
      ...prev,
      modalHdy: record.hdy || '',
      modalKsl: record.ksl || '',
      modalAltLimit: record.altLimit.toString(),
      modalUstLimit: record.ustLimit.toString(),
      modalHedef: record.hedef.toString()
    }));
    openModal('duzenle', record);
  };

  const handleViewRecord = (record) => {
    setFormData(prev => ({
      ...prev,
      modalHdy: record.hdy || '',
      modalKsl: record.ksl || '',
      modalAltLimit: record.altLimit.toString(),
      modalUstLimit: record.ustLimit.toString(),
      modalHedef: record.hedef.toString()
    }));
    openModal('izle', record);
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
        <label className="form-label fw-medium small text-dark">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
        <div className="position-relative">
          {children}
          <div className="position-absolute top-50 end-0 translate-middle-y me-3" style={{ pointerEvents: 'none' }}>
            {status === 'success' && (
              <CheckCircle className="text-success" size={14} />
            )}
            {status === 'error' && (
              <AlertCircle className="text-danger" size={14} />
            )}
            {status === 'warning' && (
              <AlertCircle className="text-warning" size={14} />
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
            <div className="row mb-3">
              <div className="col-md-4">
                <InputWrapper field="kod" label="Kod" required>
                  <input
                    type="text"
                    value={formData.kod}
                    onChange={(e) => handleInputChange('kod', e.target.value)}
                    className={`${getInputClasses('kod')} form-control-sm`}
                    placeholder="Kod giriniz"
                  />
                </InputWrapper>
              </div>
              
              <div className="col-md-4">
                <InputWrapper field="durum" label="Durum" required>
                  <select
                    value={formData.durum}
                    onChange={(e) => handleInputChange('durum', e.target.value)}
                    className={`${getInputClasses('durum')} form-select-sm`}
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
                    className={`${getInputClasses('aciklama')} form-select-sm`}
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
            <div className="row mb-3">
              <div className="col-md-3">
                <InputWrapper field="baslangicTarihi" label="Başlangıç Tarihi" required>
                  <input
                    type="date"
                    value={formData.baslangicTarihi}
                    onChange={(e) => handleInputChange('baslangicTarihi', e.target.value)}
                    className={`${getInputClasses('baslangicTarihi')} form-control-sm`}
                  />
                </InputWrapper>
              </div>
              
              <div className="col-md-3">
                <InputWrapper field="bitisTarihi" label="Bitiş Tarihi" required>
                  <input
                    type="date"
                    value={formData.bitisTarihi}
                    onChange={(e) => handleInputChange('bitisTarihi', e.target.value)}
                    className={`${getInputClasses('bitisTarihi')} form-control-sm`}
                  />
                </InputWrapper>
              </div>

              <div className="col-md-3">
                <InputWrapper field="belgetipi" label="Belge Tip">
                  <select
                    value={formData.belgetipi}
                    onChange={(e) => handleInputChange('belgetipi', e.target.value)}
                    className={`${getInputClasses('belgetipi')} form-select-sm`}
                  >
                    <option value="Hepsi">Hepsi</option>
                    <option value="Fatura">Fatura</option>
                    <option value="İrsaliye">İrsaliye</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="verziparitiKampanya"
                    checked={formData.verziparitiKampanya}
                    onChange={() => handleCheckboxChange('verziparitiKampanya')}
                    className="form-check-input"
                  />
                  <label className="form-check-label small" htmlFor="verziparitiKampanya">
                    Verzipariti Kampanya
                  </label>
                </div>
              </div>
            </div>

            {/* Üçüncü Satır - Belge ve Saha */}
            <div className="row mb-3">
              <div className="col-md-3">
                <InputWrapper field="belgeTur" label="Belge Tür">
                  <select
                    value={formData.belgeTur}
                    onChange={(e) => handleInputChange('belgeTur', e.target.value)}
                    className={`${getInputClasses('belgeTur')} form-select-sm`}
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
                    className={`${getInputClasses('sayi')} form-control-sm`}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-3">
                <InputWrapper field="uygulamaYeri" label="Uygulama Yeri">
                  <select
                    value={formData.uygulamaYeri}
                    onChange={(e) => handleInputChange('uygulamaYeri', e.target.value)}
                    className={`${getInputClasses('uygulamaYeri')} form-select-sm`}
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
                    className={`${getInputClasses('vadeGunu')} form-control-sm`}
                    placeholder="255"
                  />
                </InputWrapper>
              </div>
            </div>

            {/* Dördüncü Satır - İskonto/Promosyon ve Ödeme */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="iskontoPromosyonMetni" label="İskonto/Promosyon Metni">
                  <input
                    type="text"
                    value={formData.iskontoPromosyonMetni}
                    onChange={(e) => handleInputChange('iskontoPromosyonMetni', e.target.value)}
                    className={`${getInputClasses('iskontoPromosyonMetni')} form-control-sm`}
                    placeholder="İskonto/Promosyon metni"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <InputWrapper field="odemeTipi" label="Ödeme Tipi">
                  <select
                    value={formData.odemeTipi}
                    onChange={(e) => handleInputChange('odemeTipi', e.target.value)}
                    className={`${getInputClasses('odemeTipi')} form-select-sm`}
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
            <div className="row mb-3">
              <div className="col-md-3">
                <InputWrapper field="iskontoGrubu" label="İskonto Grubu">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.iskontoGrubu}
                      onChange={(e) => handleInputChange('iskontoGrubu', e.target.value)}
                      className={getInputClasses('iskontoGrubu')}
                      placeholder="İskonto Grubu"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-3">
                <InputWrapper field="iadeCezaIsk" label="İade Ceza İsk.">
                  <select
                    value={formData.iadeCezaIsk}
                    onChange={(e) => handleInputChange('iadeCezaIsk', e.target.value)}
                    className={`${getInputClasses('iadeCezaIsk')} form-select-sm`}
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
                    className={`${getInputClasses('butcedeUygula')} form-select-sm`}
                  >
                    <option value="Evet">Evet</option>
                    <option value="Hayır">Hayır</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-3">
                <InputWrapper field="hareketTipi" label="Hareket Tipi">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.hareketTipi}
                      onChange={(e) => handleInputChange('hareketTipi', e.target.value)}
                      className={getInputClasses('hareketTipi')}
                      placeholder="Hareket Tipi"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>
            </div>

            {/* Altıncı Satır - Kontrat ve Checkboxlar */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="kontratButce" label="Kontrat Bütçe">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.kontratButce}
                      onChange={(e) => handleInputChange('kontratButce', e.target.value)}
                      className={getInputClasses('kontratButce')}
                      placeholder="Kontrat Bütçe"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <div className="mt-3">
                  <div className="form-check mb-2">
                    <input
                      type="checkbox"
                      id="sefBarindaBolunun"
                      checked={formData.sefBarindaBolunun}
                      onChange={() => handleCheckboxChange('sefBarindaBolunun')}
                      className="form-check-input"
                    />
                    <label className="form-check-label small" htmlFor="sefBarindaBolunun">
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
                    <label className="form-check-label small" htmlFor="commercePortalKampanya">
                      CommercePortal Kampanya
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            {/* Kriterler Başlığı */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="text-primary fw-semibold mb-3">Kriterler</h6>
              </div>
            </div>

            {/* İlk Satır - Dağıtımcı Kriterleri */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="dagitimciKriterTipi" label="Dağıtımcı Kriter Tipi" required>
                  <select
                    value={formData.dagitimciKriterTipi}
                    onChange={(e) => handleInputChange('dagitimciKriterTipi', e.target.value)}
                    className={`${getInputClasses('dagitimciKriterTipi')} form-select-sm`}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Bölge">Bölge</option>
                    <option value="Hepsi">Hepsi</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <InputWrapper field="dagitimciKriteri" label="Dağıtımcı Kriteri" required>
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.dagitimciKriteri}
                      onChange={(e) => handleInputChange('dagitimciKriteri', e.target.value)}
                      className={getInputClasses('dagitimciKriteri')}
                      placeholder="04.0001"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                  <small className="text-muted">Solmazlar(Unidoğ)</small>
                </InputWrapper>
              </div>
            </div>

            {/* İkinci Satır - Uygulama Kriterleri */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="uygulamaKriteri" label="Uygulama Kriteri">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.uygulamaKriteri}
                      onChange={(e) => handleInputChange('uygulamaKriteri', e.target.value)}
                      className={getInputClasses('uygulamaKriteri')}
                      placeholder="Uygulama Kriteri"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <InputWrapper field="musteriKriter" label="Müşteri Kriter">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.musteriKriter}
                      onChange={(e) => handleInputChange('musteriKriter', e.target.value)}
                      className={getInputClasses('musteriKriter')}
                      placeholder="ISK001"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                  <small className="text-muted">ISK001 Solmazlar</small>
                </InputWrapper>
              </div>
            </div>

            {/* Üçüncü Satır - Checkboxlar ve Ek Alanlar */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    id="uygulamaKriteriKullanimi"
                    checked={formData.uygulamaKriteriKullanimi}
                    onChange={() => handleCheckboxChange('uygulamaKriteriKullanimi')}
                    className="form-check-input"
                  />
                  <label className="form-check-label small" htmlFor="uygulamaKriteriKullanimi">
                    Uygulama Kriteri Kullanımı
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <InputWrapper field="musteriKriterTipi" label="Müşteri Kriter Tipi">
                  <select
                    value={formData.musteriKriterTipi}
                    onChange={(e) => handleInputChange('musteriKriterTipi', e.target.value)}
                    className={`${getInputClasses('musteriKriterTipi')} form-select-sm`}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Bölge">Bölge</option>
                    <option value="Hepsi">Hepsi</option>
                  </select>
                </InputWrapper>
              </div>
            </div>

            {/* Dördüncü Satır - İade Nedeni ve Ek Saha Kriteri */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="iadeNedeni" label="İade Nedeni">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.iadeNedeni}
                      onChange={(e) => handleInputChange('iadeNedeni', e.target.value)}
                      className={getInputClasses('iadeNedeni')}
                      placeholder="İade Nedeni"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <InputWrapper field="ekSahaKriteri" label="Ek Saha Kriteri">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.ekSahaKriteri}
                      onChange={(e) => handleInputChange('ekSahaKriteri', e.target.value)}
                      className={getInputClasses('ekSahaKriteri')}
                      placeholder="Ek Saha Kriteri"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            {/* Hedef Kriterleri Başlığı */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="text-primary fw-semibold mb-3">Hedef Kriterleri</h6>
              </div>
            </div>

            {/* İlk Satır - Hedef Ürün Kriter Tipi, Uygulama Tipi */}
            <div className="row mb-3">
              <div className="col-md-4">
                <InputWrapper field="hedefUrunKriterTip" label="Hedef Ürün Kriter Tipi" required>
                  <select
                    value={formData.hedefUrunKriterTip}
                    onChange={(e) => handleInputChange('hedefUrunKriterTip', e.target.value)}
                    className={`${getInputClasses('hedefUrunKriterTip')} form-select-sm`}
                  >
                    <option value="">Seçiniz</option>
                    <option value="Kod">Kod</option>
                    <option value="Grup">Grup</option>
                    <option value="Kategori">Kategori</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="uygulamaTipi" label="Uygulama Tipi" required>
                  <select
                    value={formData.uygulamaTipi}
                    onChange={(e) => handleInputChange('uygulamaTipi', e.target.value)}
                    className={`${getInputClasses('uygulamaTipi')} form-select-sm`}
                  >
                    <option value="Genel">Genel</option>
                    <option value="Özel">Özel</option>
                    <option value="Grup">Grup</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="hedefUrunKriter" label="Hedef Ürün Kriter">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.hedefUrunKriter}
                      onChange={(e) => handleInputChange('hedefUrunKriter', e.target.value)}
                      className={getInputClasses('hedefUrunKriter')}
                      placeholder="ANT004"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                  <small className="text-muted">Mana Pet 100ml</small>
                </InputWrapper>
              </div>
            </div>

            {/* İkinci Satır - Hedef Tipi, Hedef Ürün Birimi */}
            <div className="row mb-3">
              <div className="col-md-4">
                <InputWrapper field="hedefTip" label="Hedef Tip">
                  <select
                    value={formData.hedefTip}
                    onChange={(e) => handleInputChange('hedefTip', e.target.value)}
                    className={`${getInputClasses('hedefTip')} form-select-sm`}
                  >
                    <option value="Miktar">Miktar</option>
                    <option value="Tutar">Tutar</option>
                    <option value="Yüzde">Yüzde</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="hedefUrunBirimi" label="Hedef Ürün Birimi">
                  <select
                    value={formData.hedefUrunBirimi}
                    onChange={(e) => handleInputChange('hedefUrunBirimi', e.target.value)}
                    className={`${getInputClasses('hedefUrunBirimi')} form-select-sm`}
                  >
                    <option value="Birim 1">Birim 1</option>
                    <option value="Birim 2">Birim 2</option>
                    <option value="Kg">Kg</option>
                    <option value="Litre">Litre</option>
                  </select>
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="ekSahaKriteri2" label="Ek Saha Kriteri">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      value={formData.ekSahaKriteri2}
                      onChange={(e) => handleInputChange('ekSahaKriteri2', e.target.value)}
                      className={getInputClasses('ekSahaKriteri2')}
                      placeholder="Ek Saha Kriteri"
                    />
                    <button className="btn btn-outline-primary btn-sm" type="button">
                      <Search size={14} />
                    </button>
                  </div>
                </InputWrapper>
              </div>
            </div>

            {/* Üçüncü Satır - Bilgi */}
            <div className="row mb-3">
              <div className="col-md-12">
                <InputWrapper field="bilgi" label="Bilgi">
                  <textarea
                    value={formData.bilgi}
                    onChange={(e) => handleInputChange('bilgi', e.target.value)}
                    className={`${getInputClasses('bilgi')} form-control-sm`}
                    rows="3"
                    placeholder="Bilgi giriniz..."
                  />
                </InputWrapper>
              </div>
            </div>

            {/* Dördüncü Satır - Dağıtımcı Kota Tutarı */}
            <div className="row mb-3">
              <div className="col-md-6">
                <InputWrapper field="dağitimciKotaTutari" label="Dağıtımcı Kota Tutarı">
                  <input
                    type="number"
                    value={formData.dağitimciKotaTutari}
                    onChange={(e) => handleInputChange('dağitimciKotaTutari', e.target.value)}
                    className={`${getInputClasses('dağitimciKotaTutari')} form-control-sm`}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-6">
                <InputWrapper field="maksUygulamaTutari" label="Maks Uygulama Tutarı">
                  <input
                    type="number"
                    value={formData.maksUygulamaTutari}
                    onChange={(e) => handleInputChange('maksUygulamaTutari', e.target.value)}
                    className={`${getInputClasses('maksUygulamaTutari')} form-control-sm`}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>
            </div>

            {/* Beşinci Satır - Checkbox'lar (Sol Taraf) */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="maksUygulamaTutariIskontoControl"
                        checked={formData.maksUygulamaTutariIskontoControl}
                        onChange={() => handleCheckboxChange('maksUygulamaTutariIskontoControl')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="maksUygulamaTutariIskontoControl">
                        Maks Uygulama Tutarı İskonto Bazlı Kontrol Edilsin
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="promosyonKoli"
                        checked={formData.promosyonKoli}
                        onChange={() => handleCheckboxChange('promosyonKoli')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="promosyonKoli">
                        Promosyon Koli İçinden Uygulanın
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="birUstKademeleIskPro"
                        checked={formData.birUstKademeleIskPro}
                        onChange={() => handleCheckboxChange('birUstKademeleIskPro')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="birUstKademeleIskPro">
                        Bir Üst Kademeli İsk/Pro Önerilisin mi?
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="opsiyonelIskonto"
                        checked={formData.opsiyonelIskonto}
                        onChange={() => handleCheckboxChange('opsiyonelIskonto')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="opsiyonelIskonto">
                        Opsiyonel İskonto
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row">
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="hedefMiktarYaklasmaOrani"
                        checked={formData.hedefMiktarYaklasmaOrani}
                        onChange={() => handleCheckboxChange('hedefMiktarYaklasmaOrani')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="hedefMiktarYaklasmaOrani">
                        Hedef Miktar Yaklaşma Oranı
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="kumulatifMiktarTutarBaglıUygulama"
                        checked={formData.kumulatifMiktarTutarBaglıUygulama}
                        onChange={() => handleCheckboxChange('kumulatifMiktarTutarBaglıUygulama')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="kumulatifMiktarTutarBaglıUygulama">
                        Kümülatif Miktar/Tutar Destegi Uygulama
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="hedeflerSonraSatilan"
                        checked={formData.hedeflerSonraSatilan}
                        onChange={() => handleCheckboxChange('hedeflerSonraSatilan')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="hedeflerSonraSatilan">
                        Hedefler Sonra Satılanlarda Kullanılır
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="smsGonderimi"
                        checked={formData.smsGonderimi}
                        onChange={() => handleCheckboxChange('smsGonderimi')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="smsGonderimi">
                        SMS Gönderimi Yapılsın
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Altıncı Satır - Daha Fazla Checkbox'lar */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="row">
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="azalanHedefKademe"
                        checked={formData.azalanHedefKademe}
                        onChange={() => handleCheckboxChange('azalanHedefKademe')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="azalanHedefKademe">
                        Azalan Hedef Kademe Uygula
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="otomatikFiyat"
                        checked={formData.otomatikFiyat}
                        onChange={() => handleCheckboxChange('otomatikFiyat')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="otomatikFiyat">
                        Otomatik Fiyat Oluşturulsun
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="tutarHediyesi"
                        checked={formData.tutarHediyesi}
                        onChange={() => handleCheckboxChange('tutarHediyesi')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="tutarHediyesi">
                        Tutar Hediyesi Koşul Ürünlerine Dağıtılsın
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="row">
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="maksUygulamaSayisiIskontoControl"
                        checked={formData.maksUygulamaSayisiIskontoControl}
                        onChange={() => handleCheckboxChange('maksUygulamaSayisiIskontoControl')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="maksUygulamaSayisiIskontoControl">
                        Maks Uygulama Sayısı İskonto Bazlı Kontrol Edilsin
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="iskontoTanimlamaBagli"
                        checked={formData.iskontoTanimlamaBagli}
                        onChange={() => handleCheckboxChange('iskontoTanimlamaBagli')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="iskontoTanimlamaBagli">
                        İskonto Tanımlama Bağlı Mesaj Oluşturulsun
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="iskProUygulanacakUrunAdediControl"
                        checked={formData.iskProUygulanacakUrunAdediControl}
                        onChange={() => handleCheckboxChange('iskProUygulanacakUrunAdediControl')}
                        className="form-check-input"
                      />
                      <label className="form-check-label small" htmlFor="iskProUygulanacakUrunAdediControl">
                        İsk/Pro Uygulanacak Ürün Adedi İskonto Bazlı Kontrol Edilsin
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Yedinci Satır - Belge Vade */}
            <div className="row mb-3">
              <div className="col-md-12">
                <h6 className="text-primary fw-semibold mb-3">Belge Vade</h6>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-4">
                <InputWrapper field="belgeVade" label="Belge Vade">
                  <input
                    type="number"
                    value={formData.belgeVade}
                    onChange={(e) => handleInputChange('belgeVade', e.target.value)}
                    className={`${getInputClasses('belgeVade')} form-control-sm`}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="maksUygulamaSayisi" label="Maks Uygulama Sayısı">
                  <input
                    type="number"
                    value={formData.maksUygulamaSayisi}
                    onChange={(e) => handleInputChange('maksUygulamaSayisi', e.target.value)}
                    className={`${getInputClasses('maksUygulamaSayisi')} form-control-sm`}
                    placeholder="0"
                  />
                </InputWrapper>
              </div>

              <div className="col-md-4">
                <InputWrapper field="maksUygulamaSayisi2" label="Maks Uygulama Sayısı">
                  <input
                    type="number"
                    value={formData.maksUygulamaSayisi2}
                    onChange={(e) => handleInputChange('maksUygulamaSayisi2', e.target.value)}
                    className={`${getInputClasses('maksUygulamaSayisi2')} form-control-sm`}
                    placeholder="1000"
                  />
                </InputWrapper>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            {/* Kademeler Başlığı */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="text-primary fw-semibold mb-3">Kademeler</h6>
              </div>
            </div>

            {/* Butonlar */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="d-flex gap-2 flex-wrap">
                  <button 
                    type="button" 
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        modalHdy: '',
                        modalKsl: '',
                        modalAltLimit: '',
                        modalUstLimit: '',
                        modalHedef: ''
                      }));
                      openModal('yeni');
                    }}
                  >
                    🔄 Yenile
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        modalHdy: '',
                        modalKsl: '',
                        modalAltLimit: '',
                        modalUstLimit: '',
                        modalHedef: ''
                      }));
                      openModal('yeni');
                    }}
                  >
                    📄 Yeni
                  </button>
                  <button type="button" className="btn btn-warning btn-sm">
                    ✏️ Düzenle
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm">
                    👁️ İzle
                  </button>
                  <button type="button" className="btn btn-danger btn-sm">
                    🗑️ Sil
                  </button>
                  <button type="button" className="btn btn-info btn-sm">
                    📋 Koşul
                  </button>
                  <button type="button" className="btn btn-success btn-sm">
                    🎁 Hediye
                  </button>
                  <button type="button" className="btn btn-info btn-sm">
                    🏷️ Hediye Grup
                  </button>
                  <button type="button" className="btn btn-info btn-sm">
                    💰 Kota
                  </button>
                  <button type="button" className="btn btn-info btn-sm">
                    📊 Ürün Bazında İskonto Giriş
                  </button>
                  <button type="button" className="btn btn-warning btn-sm">
                    📦 Üreri Paketi Tanımı
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Tablosu */}
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover table-sm">
                    <thead className="table-primary">
                      <tr>
                        <th style={{ width: '80px' }}>HDY</th>
                        <th style={{ width: '80px' }}>KSL</th>
                        <th style={{ width: '60px' }}>Sı...</th>
                        <th style={{ width: '120px' }}>ALT LİMİT</th>
                        <th style={{ width: '120px' }}>ÜST LİMİT</th>
                        <th style={{ width: '120px' }}>HEDEF</th>
                        <th style={{ width: '120px' }}>HEDİYE BAĞLA...</th>
                        <th style={{ width: '120px' }}>KOŞUL BAĞLA...</th>
                        <th style={{ width: '100px' }}>İŞLEMLER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.gridData.length > 0 ? (
                        formData.gridData.map((row, index) => (
                          <tr key={row.id}>
                            <td>{row.hdy}</td>
                            <td>{row.ksl}</td>
                            <td>{row.sira}</td>
                            <td>{row.altLimit.toFixed(2)}</td>
                            <td>{row.ustLimit.toFixed(2)}</td>
                            <td>{row.hedef.toFixed(2)}</td>
                            <td>{row.hediyeBagli}</td>
                            <td>{row.kosulBagli}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  type="button"
                                  className="btn btn-warning btn-sm"
                                  onClick={() => handleEditRecord(row)}
                                  title="Düzenle"
                                >
                                  ✏️
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleViewRecord(row)}
                                  title="Görüntüle"
                                >
                                  👁️
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteRecord(row.id)}
                                  title="Sil"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center text-muted">
                            Henüz kayıt bulunmamaktadır. "Yeni" butonuna tıklayarak kayıt ekleyebilirsiniz.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
        <div className="container-fluid py-3">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-primary mb-2">
              CRM Kampanya Wizard
            </h1>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              Kampanya bilgilerini adım adım tamamlayın
            </p>
          </div>

          {/* Progress Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body py-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-medium text-secondary">
                      Adım {currentStep + 1} / {steps.length}
                    </span>
                    <span className="text-muted small">
                      {Math.round(getStepProgress())}% Tamamlandı
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
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
          <div className="row justify-content-center mb-4">
            <div className="col-lg-10">
              <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
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
                        width: '40px',
                        height: '40px',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}>
                        {isCompleted && !isActive ? (
                          <Check size={16} />
                        ) : (
                          <IconComponent size={16} />
                        )}
                      </div>
                      <span className={`text-center small fw-medium ${
                        isActive ? 'text-primary' : 'text-secondary'
                      }`} style={{ maxWidth: '70px', fontSize: '0.75rem' }}>
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
                <div className="card-header bg-primary text-white py-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-white bg-opacity-25 rounded p-2 me-3">
                      {React.createElement(steps[currentStep].icon, { 
                        className: "text-white", 
                        size: 20 
                      })}
                    </div>
                    <div>
                      <h5 className="card-title mb-1 fw-semibold">
                        {steps[currentStep].title}
                      </h5>
                      <p className="card-text mb-0 opacity-75 small">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card-body p-4" style={{ minHeight: '400px' }}>
                  {renderStepContent()}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="row justify-content-center mt-3">
            <div className="col-lg-10">
              <div className="card shadow-sm">
                <div className="card-body py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`
                        btn d-flex align-items-center gap-2 px-3 py-2 btn-sm
                        ${currentStep === 0
                          ? 'btn-outline-secondary disabled'
                          : 'btn-outline-primary'
                        }
                      `}
                    >
                      <ChevronLeft size={16} />
                      Önceki
                    </button>
                    
                    <div className="d-flex align-items-center gap-3">
                      {currentStep < steps.length - 1 ? (
                        <button
                          onClick={nextStep}
                          disabled={!canProceed()}
                          className={`
                            btn d-flex align-items-center gap-2 px-3 py-2 btn-sm
                            ${canProceed()
                              ? 'btn-primary shadow-sm'
                              : 'btn-outline-secondary disabled'
                            }
                          `}
                        >
                          Sonraki
                          <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('Form Data:', formData);
                            alert('🎉 Kampanya başarıyla oluşturuldu!');
                          }}
                          className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 btn-sm shadow-sm"
                        >
                          <Check size={16} />
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
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{getModalTitle()}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <InputWrapper field="modalHdy" label="HDY">
                      <input
                        type="text"
                        value={formData.modalHdy}
                        onChange={(e) => handleInputChange('modalHdy', e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="HDY"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-6">
                    <InputWrapper field="modalKsl" label="KSL">
                      <input
                        type="text"
                        value={formData.modalKsl}
                        onChange={(e) => handleInputChange('modalKsl', e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="KSL"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <InputWrapper field="modalAltLimit" label="Alt Limit">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.modalAltLimit}
                        onChange={(e) => handleInputChange('modalAltLimit', e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="1.00"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-4">
                    <InputWrapper field="modalUstLimit" label="Üst Limit">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.modalUstLimit}
                        onChange={(e) => handleInputChange('modalUstLimit', e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="999999.00"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>
                  <div className="col-md-4">
                    <InputWrapper field="modalHedef" label="Hedef">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.modalHedef}
                        onChange={(e) => handleInputChange('modalHedef', e.target.value)}
                        className="form-control form-control-sm"
                        placeholder="1.00"
                        disabled={modalType === 'izle'}
                      />
                    </InputWrapper>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={closeModal}>
                  İptal
                </button>
                {modalType !== 'izle' && (
                  <button type="button" className="btn btn-primary btn-sm" onClick={handleModalSubmit}>
                    {modalType === 'yeni' ? 'Ekle' : 'Güncelle'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Custom CSS */}
      <style>{`
        .form-control-sm, .form-select-sm {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        
        .input-group-sm > .form-control,
        .input-group-sm > .form-select {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        
        .input-group-sm > .btn {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
        
        .form-check-label {
          font-size: 0.875rem;
        }
        
        .btn-sm {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }
        
        .card-body {
          padding: 1rem;
        }
        
        .form-label {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .row {
          margin-bottom: 0.75rem;
        }
        
        .container-fluid {
          padding: 1rem;
        }
        
        .card {
          margin-bottom: 1rem;
        }
        
        .card-header {
          padding: 0.75rem 1rem;
        }
        
        .progress {
          height: 4px;
        }
        
        .form-check {
          margin-bottom: 0.5rem;
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
        
        .table-sm th, .table-sm td {
          padding: 0.3rem;
          font-size: 0.8rem;
        }
        
        .table-responsive {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .modal {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
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
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
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
        
        .h3 {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0.5rem;
          }
          
          .card-body {
            padding: 0.75rem;
          }
          
          .h3 {
            font-size: 1.25rem;
          }
          
          .form-control-sm, .form-select-sm {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
          
          .table-responsive {
            font-size: 0.7rem;
          }
        } {
          padding: 1rem;
        }
        
        .form-label {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .row {
          margin-bottom: 0.75rem;
        }
        
        .container-fluid {
          padding: 1rem;
        }
        
        .card {
          margin-bottom: 1rem;
        }
        
        .card-header {
          padding: 0.75rem 1rem;
        }
        
        .progress {
          height: 4px;
        }
        
        .form-check {
          margin-bottom: 0.5rem;
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
        
        .table-sm th, .table-sm td {
          padding: 0.3rem;
          font-size: 0.8rem;
        }
        
        .table-responsive {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .modal {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
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
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
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
        
        .h3 {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0.5rem;
          }
          
          .card-body {
            padding: 0.75rem;
          }
          
          .h3 {
            font-size: 1.25rem;
          }
          
          .form-control-sm, .form-select-sm {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
          
          .table-responsive {
            font-size: 0.7rem;
            padding: 1rem;
          }
        
        .form-label {
          margin-bottom: 0.25rem;
          font-weight: 500;
        }
        
        .row {
          margin-bottom: 0.75rem;
        }
        
        .container-fluid {
          padding: 1rem;
        }
        
        .card {
          margin-bottom: 1rem;
        }
        
        .card-header {
          padding: 0.75rem 1rem;
        }
        
        .progress {
          height: 4px;
        }
        
        .form-check {
          margin-bottom: 0.5rem;
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
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        
        .shadow-sm {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
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
        
        .h3 {
          background: linear-gradient(45deg, #007bff, #6f42c1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @media (max-width: 768px) {
          .container-fluid {
            padding: 0.5rem;
          }
          
          .card-body {
            padding: 0.75rem;
          }
          
          .h3 {
            font-size: 1.25rem;
          }
          
          .form-control-sm, .form-select-sm {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;