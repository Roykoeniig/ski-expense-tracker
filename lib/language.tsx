'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'zh' | 'en' | 'de'

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  zh: {
    // 通用
    'common.home': '首页',
    'common.expenses': '记账',
    'common.chat': 'AI记账',
    'common.settlement': '结算',
    'common.photos': '照片',
    'common.add': '添加',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.close': '关闭',
    'common.confirm': '确认',
    
    // 首页
    'home.title': '滑雪记账',
    'home.subtitle': '多人记账 · 多币种支持 · AI智能记账',
    'home.totalExpenses': '总支出',
    'home.expenseCount': '记账笔数',
    'home.participants': '参与人数',
    'home.expenseManagement': '记账管理',
    'home.expenseManagementDesc': '添加、查看和管理所有记账记录',
    'home.aiExpense': 'AI记账',
    'home.aiExpenseDesc': '通过聊天或拍照自动识别并记账',
    'home.settlement': '结算中心',
    'home.settlementDesc': '查看相互欠款和转账建议',
    'home.photoWall': '照片墙',
    'home.photoWallDesc': '上传和分享滑雪照片',
    'home.recentExpenses': '最近记账',
    'home.viewAll': '查看全部',
    
    // 版权
    'copyright.ownedBy': '版权归属于由',
    'copyright.founded': '创立的',
    'copyright.createdBy': '网页创建者和维护者',
    'copyright.allRightsReserved': '保留所有权利',
    
    // 记账管理
    'expenses.title': '记账管理',
    'expenses.addExpense': '添加记账',
    'expenses.allCurrencies': '所有货币',
    'expenses.allUsers': '所有用户',
    'expenses.noExpenses': '还没有记账记录',
    'expenses.addFirst': '添加第一条记账',
    'expenses.date': '日期',
    'expenses.paidBy': '付款人',
    'expenses.sharedBy': '共享人',
    'expenses.deleteConfirm': '确定要删除这条记账吗？',
    
    // AI记账
    'chat.title': 'AI智能记账',
    'chat.welcome': '你好！我是你的滑雪记账助手。你可以告诉我你的消费情况，比如"我在1月15日花了50欧元买午餐"，或者上传账单照片，我会自动帮你记账！',
    'chat.placeholder': '告诉我你的消费情况，或上传账单照片...',
    'chat.autoRecorded': '已自动记账！',
    'chat.error': '抱歉，处理你的请求时出现了错误。请稍后再试。',
    
    // 结算中心
    'settlement.title': '结算中心',
    'settlement.baseCurrency': '基础货币',
    'settlement.noExpenses': '还没有记账记录，无法计算结算',
    'settlement.noUsers': '请先添加用户',
    'settlement.userBalances': '用户余额',
    'settlement.shouldReceive': '应收回',
    'settlement.shouldPay': '应支付',
    'settlement.balanced': '已平衡',
    'settlement.suggestions': '结算建议',
    'settlement.calculating': '正在计算...',
    'settlement.allBalanced': '所有账目已平衡，无需结算',
    
    // 照片墙
    'photos.title': '照片墙',
    'photos.upload': '上传照片',
    'photos.uploadFirst': '上传第一张照片',
    'photos.noPhotos': '还没有照片',
    'photos.deleteConfirm': '确定要删除这张照片吗？',
    'photos.wallpaperFeature': '背景壁纸功能',
    'photos.wallpaperDesc': '你上传到照片墙的照片会自动成为整个网站的背景壁纸！系统会每10秒自动切换到下一张照片，让你在记账的同时也能欣赏美丽的滑雪风景。',
    'photos.wallpaperTip': '提示：上传的照片越多，背景轮播的内容就越丰富。建议上传高质量的风景照片以获得最佳视觉效果。',
    'photos.currentCount': '当前有 {count} 张照片正在作为背景轮播',
    
    // 用户管理
    'users.title': '用户管理',
    'users.addUser': '添加用户',
    'users.noUsers': '还没有用户，请先添加用户',
    'users.username': '用户名',
    'users.usernamePlaceholder': '输入用户名',
    'users.add': '添加',
    'users.deleteConfirm': '确定要删除这个用户吗？',
    
    // 记账表单
    'form.description': '描述',
    'form.amount': '金额',
    'form.currency': '货币',
    'form.date': '日期',
    'form.paidBy': '付款人',
    'form.sharedBy': '共享人（可多选）',
    'form.category': '类别（可选）',
    'form.selectCategory': '选择类别',
    'form.categories.food': '餐饮',
    'form.categories.accommodation': '住宿',
    'form.categories.transport': '交通',
    'form.categories.skiEquipment': '滑雪装备',
    'form.categories.skiTicket': '滑雪票',
    'form.categories.shopping': '购物',
    'form.categories.other': '其他',
    'form.categories.food.value': '餐饮',
    'form.categories.accommodation.value': '住宿',
    'form.categories.transport.value': '交通',
    'form.categories.skiEquipment.value': '滑雪装备',
    'form.categories.skiTicket.value': '滑雪票',
    'form.categories.shopping.value': '购物',
    'form.categories.other.value': '其他',
    'form.editExpense': '编辑记账',
    'form.addExpense': '添加记账',
  },
  en: {
    // Common
    'common.home': 'Home',
    'common.expenses': 'Expenses',
    'common.chat': 'AI Expense',
    'common.settlement': 'Settlement',
    'common.photos': 'Photos',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    
    // Home
    'home.title': 'Ski Expense Tracker',
    'home.subtitle': 'Multi-user · Multi-currency · AI Smart Tracking',
    'home.totalExpenses': 'Total Expenses',
    'home.expenseCount': 'Expense Count',
    'home.participants': 'Participants',
    'home.expenseManagement': 'Expense Management',
    'home.expenseManagementDesc': 'Add, view and manage all expense records',
    'home.aiExpense': 'AI Expense',
    'home.aiExpenseDesc': 'Automatically track expenses via chat or photo',
    'home.settlement': 'Settlement Center',
    'home.settlementDesc': 'View debts and transfer suggestions',
    'home.photoWall': 'Photo Wall',
    'home.photoWallDesc': 'Upload and share ski photos',
    'home.recentExpenses': 'Recent Expenses',
    'home.viewAll': 'View All',
    
    // Copyright
    'copyright.ownedBy': 'Copyright owned by',
    'copyright.founded': 'founded',
    'copyright.createdBy': 'Website created and maintained by',
    'copyright.allRightsReserved': 'All rights reserved',
    
    // Expenses
    'expenses.title': 'Expense Management',
    'expenses.addExpense': 'Add Expense',
    'expenses.allCurrencies': 'All Currencies',
    'expenses.allUsers': 'All Users',
    'expenses.noExpenses': 'No expense records yet',
    'expenses.addFirst': 'Add First Expense',
    'expenses.date': 'Date',
    'expenses.paidBy': 'Paid By',
    'expenses.sharedBy': 'Shared By',
    'expenses.deleteConfirm': 'Are you sure you want to delete this expense?',
    
    // AI Chat
    'chat.title': 'AI Smart Expense',
    'chat.welcome': 'Hello! I am your ski expense assistant. You can tell me about your expenses, such as "I spent 50 euros on lunch on January 15th", or upload a bill photo, and I will automatically record it for you!',
    'chat.placeholder': 'Tell me about your expenses, or upload a bill photo...',
    'chat.autoRecorded': 'Automatically recorded!',
    'chat.error': 'Sorry, an error occurred while processing your request. Please try again later.',
    
    // Settlement
    'settlement.title': 'Settlement Center',
    'settlement.baseCurrency': 'Base Currency',
    'settlement.noExpenses': 'No expense records, cannot calculate settlement',
    'settlement.noUsers': 'Please add users first',
    'settlement.userBalances': 'User Balances',
    'settlement.shouldReceive': 'Should Receive',
    'settlement.shouldPay': 'Should Pay',
    'settlement.balanced': 'Balanced',
    'settlement.suggestions': 'Settlement Suggestions',
    'settlement.calculating': 'Calculating...',
    'settlement.allBalanced': 'All accounts are balanced, no settlement needed',
    
    // Photos
    'photos.title': 'Photo Wall',
    'photos.upload': 'Upload Photo',
    'photos.uploadFirst': 'Upload First Photo',
    'photos.noPhotos': 'No photos yet',
    'photos.deleteConfirm': 'Are you sure you want to delete this photo?',
    'photos.wallpaperFeature': 'Background Wallpaper Feature',
    'photos.wallpaperDesc': 'Photos you upload to the photo wall will automatically become the background wallpaper for the entire website! The system will automatically switch to the next photo every 10 seconds, allowing you to enjoy beautiful ski scenery while tracking expenses.',
    'photos.wallpaperTip': 'Tip: The more photos you upload, the richer the background slideshow content. It is recommended to upload high-quality landscape photos for the best visual effect.',
    'photos.currentCount': 'Currently {count} photos are being used as background slideshow',
    
    // User Management
    'users.title': 'User Management',
    'users.addUser': 'Add User',
    'users.noUsers': 'No users yet, please add users first',
    'users.username': 'Username',
    'users.usernamePlaceholder': 'Enter username',
    'users.add': 'Add',
    'users.deleteConfirm': 'Are you sure you want to delete this user?',
    
    // Expense Form
    'form.description': 'Description',
    'form.amount': 'Amount',
    'form.currency': 'Currency',
    'form.date': 'Date',
    'form.paidBy': 'Paid By',
    'form.sharedBy': 'Shared By (Multiple Selection)',
    'form.category': 'Category (Optional)',
    'form.selectCategory': 'Select Category',
    'form.categories.food': 'Food',
    'form.categories.accommodation': 'Accommodation',
    'form.categories.transport': 'Transport',
    'form.categories.skiEquipment': 'Ski Equipment',
    'form.categories.skiTicket': 'Ski Ticket',
    'form.categories.shopping': 'Shopping',
    'form.categories.other': 'Other',
    'form.categories.food.value': '餐饮',
    'form.categories.accommodation.value': '住宿',
    'form.categories.transport.value': '交通',
    'form.categories.skiEquipment.value': '滑雪装备',
    'form.categories.skiTicket.value': '滑雪票',
    'form.categories.shopping.value': '购物',
    'form.categories.other.value': '其他',
    'form.editExpense': 'Edit Expense',
    'form.addExpense': 'Add Expense',
  },
  de: {
    // Allgemein
    'common.home': 'Startseite',
    'common.expenses': 'Ausgaben',
    'common.chat': 'KI-Ausgaben',
    'common.settlement': 'Abrechnung',
    'common.photos': 'Fotos',
    'common.add': 'Hinzufügen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.close': 'Schließen',
    'common.confirm': 'Bestätigen',
    
    // Startseite
    'home.title': 'Ski-Ausgaben-Tracker',
    'home.subtitle': 'Mehrbenutzer · Mehrwährungen · KI-Smart-Tracking',
    'home.totalExpenses': 'Gesamtausgaben',
    'home.expenseCount': 'Anzahl der Ausgaben',
    'home.participants': 'Teilnehmer',
    'home.expenseManagement': 'Ausgabenverwaltung',
    'home.expenseManagementDesc': 'Alle Ausgabenaufzeichnungen hinzufügen, anzeigen und verwalten',
    'home.aiExpense': 'KI-Ausgaben',
    'home.aiExpenseDesc': 'Automatisches Ausgabentracking per Chat oder Foto',
    'home.settlement': 'Abrechnungszentrum',
    'home.settlementDesc': 'Schulden und Überweisungsvorschläge anzeigen',
    'home.photoWall': 'Fotowand',
    'home.photoWallDesc': 'Ski-Fotos hochladen und teilen',
    'home.recentExpenses': 'Letzte Ausgaben',
    'home.viewAll': 'Alle anzeigen',
    
    // Urheberrecht
    'copyright.ownedBy': 'Urheberrecht gehört',
    'copyright.founded': 'gegründet',
    'copyright.createdBy': 'Website erstellt und gewartet von',
    'copyright.allRightsReserved': 'Alle Rechte vorbehalten',
    
    // Ausgaben
    'expenses.title': 'Ausgabenverwaltung',
    'expenses.addExpense': 'Ausgabe hinzufügen',
    'expenses.allCurrencies': 'Alle Währungen',
    'expenses.allUsers': 'Alle Benutzer',
    'expenses.noExpenses': 'Noch keine Ausgabenaufzeichnungen',
    'expenses.addFirst': 'Erste Ausgabe hinzufügen',
    'expenses.date': 'Datum',
    'expenses.paidBy': 'Bezahlt von',
    'expenses.sharedBy': 'Geteilt von',
    'expenses.deleteConfirm': 'Sind Sie sicher, dass Sie diese Ausgabe löschen möchten?',
    
    // KI-Chat
    'chat.title': 'KI-Smart-Ausgaben',
    'chat.welcome': 'Hallo! Ich bin Ihr Ski-Ausgaben-Assistent. Sie können mir von Ihren Ausgaben erzählen, z.B. "Ich habe am 15. Januar 50 Euro für das Mittagessen ausgegeben", oder ein Rechnungsfoto hochladen, und ich werde es automatisch für Sie aufzeichnen!',
    'chat.placeholder': 'Erzählen Sie mir von Ihren Ausgaben oder laden Sie ein Rechnungsfoto hoch...',
    'chat.autoRecorded': 'Automatisch aufgezeichnet!',
    'chat.error': 'Entschuldigung, beim Verarbeiten Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
    
    // Abrechnung
    'settlement.title': 'Abrechnungszentrum',
    'settlement.baseCurrency': 'Basiswährung',
    'settlement.noExpenses': 'Keine Ausgabenaufzeichnungen, Abrechnung nicht möglich',
    'settlement.noUsers': 'Bitte fügen Sie zuerst Benutzer hinzu',
    'settlement.userBalances': 'Benutzersalden',
    'settlement.shouldReceive': 'Sollte erhalten',
    'settlement.shouldPay': 'Sollte zahlen',
    'settlement.balanced': 'Ausgeglichen',
    'settlement.suggestions': 'Abrechnungsvorschläge',
    'settlement.calculating': 'Wird berechnet...',
    'settlement.allBalanced': 'Alle Konten sind ausgeglichen, keine Abrechnung erforderlich',
    
    // Fotos
    'photos.title': 'Fotowand',
    'photos.upload': 'Foto hochladen',
    'photos.uploadFirst': 'Erstes Foto hochladen',
    'photos.noPhotos': 'Noch keine Fotos',
    'photos.deleteConfirm': 'Sind Sie sicher, dass Sie dieses Foto löschen möchten?',
    'photos.wallpaperFeature': 'Hintergrundtapeten-Funktion',
    'photos.wallpaperDesc': 'Fotos, die Sie auf die Fotowand hochladen, werden automatisch zur Hintergrundtapete für die gesamte Website! Das System wechselt automatisch alle 10 Sekunden zum nächsten Foto, sodass Sie beim Verfolgen von Ausgaben die schöne Ski-Landschaft genießen können.',
    'photos.wallpaperTip': 'Tipp: Je mehr Fotos Sie hochladen, desto reicher ist der Inhalt der Hintergrund-Diashow. Es wird empfohlen, hochwertige Landschaftsfotos für den besten visuellen Effekt hochzuladen.',
    'photos.currentCount': 'Derzeit werden {count} Fotos als Hintergrund-Diashow verwendet',
    
    // Benutzerverwaltung
    'users.title': 'Benutzerverwaltung',
    'users.addUser': 'Benutzer hinzufügen',
    'users.noUsers': 'Noch keine Benutzer, bitte fügen Sie zuerst Benutzer hinzu',
    'users.username': 'Benutzername',
    'users.usernamePlaceholder': 'Benutzername eingeben',
    'users.add': 'Hinzufügen',
    'users.deleteConfirm': 'Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?',
    
    // Ausgabenformular
    'form.description': 'Beschreibung',
    'form.amount': 'Betrag',
    'form.currency': 'Währung',
    'form.date': 'Datum',
    'form.paidBy': 'Bezahlt von',
    'form.sharedBy': 'Geteilt von (Mehrfachauswahl)',
    'form.category': 'Kategorie (Optional)',
    'form.selectCategory': 'Kategorie auswählen',
    'form.categories.food': 'Essen',
    'form.categories.accommodation': 'Unterkunft',
    'form.categories.transport': 'Transport',
    'form.categories.skiEquipment': 'Ski-Ausrüstung',
    'form.categories.skiTicket': 'Ski-Ticket',
    'form.categories.shopping': 'Einkaufen',
    'form.categories.other': 'Andere',
    'form.categories.food.value': '餐饮',
    'form.categories.accommodation.value': '住宿',
    'form.categories.transport.value': '交通',
    'form.categories.skiEquipment.value': '滑雪装备',
    'form.categories.skiTicket.value': '滑雪票',
    'form.categories.shopping.value': '购物',
    'form.categories.other.value': '其他',
    'form.editExpense': 'Ausgabe bearbeiten',
    'form.addExpense': 'Ausgabe hinzufügen',
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  locale: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('zh')

  useEffect(() => {
    // 从localStorage读取语言设置
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang && ['zh', 'en', 'de'].includes(savedLang)) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || key
    // 支持参数替换，例如 {count} -> 实际值
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
      })
    }
    return text
  }

  const locale = language === 'zh' ? 'zh-CN' : language === 'en' ? 'en-US' : 'de-DE'

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, locale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

