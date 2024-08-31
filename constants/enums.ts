export enum DATA_LANG {
  EN = 'en',
  CNS = 'cn',
  IND = 'in',
  // HI = 'hi',
  // CNT = 'zh-tw',
  // POR = 'pt',
}

export enum BIND_BONUS {
  DEVICE = 'BIND_DEVICE_BONUS',
  EMAIL = 'BIND_EMAIL_BONUS',
  GOOGLE = 'BIND_GOOGLE_BONUS',
  GOOGLE_EMAIL = 'BIND_GOOGLE_EMAIL_BONUS',
  PHONE = 'BIND_PHONE_BONUS',
}

export enum GAME99_EVENT {
  BANNER_CLICK = 'kgxomn',
  CHINESE = 'k59r0z',
  DAILY_REWARD = '19y27d',
  ENGLISH = 'ul2few',
  ENTER_CASHBACK = '8wk0ut',
  ENTER_EVENT_CENTER = 'kygcc6',
  ENTER_GAME = 'nlp85e',
  ENTER_PROMOTE = '108wvh',
  ENTER_TASK = 'wuh0nl',
  FIRST_RECHARGE = 'muho92',
  FIRST_RECHARGE_CLICK = 'uy6ak7',
  INDONESIAN = 'yty2f1',
  LOGIN = 'qpjb6l',
  LOGOUT = 'jfiyh0',
  OTHER_LANGUAGE = 'yr9rri',
  RECHARGE = 'ul3xyt',
  RECHARGE_CLICK = '3uv8w9',
  REGISTER = '4e68p9',
  REGISTER_CLICK = 'xnoee8',
  VIEW = 'uix5ic',
  VIP_REWARD = '9j6i93',
  WITHDRAW_CLICK = '68j0tf',
  WITHDRAW_ORDER_SUCCESS = 'hgszfc',
}

export enum COLLECT_STATUS {
  CLAIMED = 'CLAIMED',
  FINISHED = 'FINISHED',
  ON_GOING = 'ON_GOING',
}

export enum COLLECT_TYPE {
  CONTENT = 2,
  HEADER = 1,
}

export enum SVGA_NAME {
  COIN_BURST_ANIMATION = 'CoinBurstAnimation',
  COIN_DROP_FLOAT = 'CoinDropFloat',
  COIN_DROP_PROGRESSBAR = 'CoinDropProgressBar',
  EIGHT = 'svga_8',
  ELEVEN = 'svga_11',
  FIVE = 'svga_5',
  GLASS_DOME_ANIMATION = 'GlassDomeAnimation',
  GLASS_DOME_WEB = 'GlassDomeWeb',
  GLOW_TEXT_BG = 'GlowTextBG',
  NINE = 'svga_9',
  ORANGE_CHIP = 'OrangeChip',
  RED_ENVELOPE_1 = 'RedEnvelope001a',
  RED_ENVELOPE_2 = 'RedEnvelope002a',
  SEVEN = 'svga_7',
  SIX = 'svga_6',
  TEN = 'svga_10',
  TWELVE = 'svga_12',
}

export enum REWARD_LOG {
  INCOME = 'INCOME',
  ACCOUNT_TRANSFERRED = 'ACCOUNT_TRANSFERRED',
}

export enum DATA_MODAL {
  ACTIVITIES = 'activities',
  ADD_TO_HOME = 'add_to_home',
  ADDCARD = 'add_card',
  ANNOUNCE = 'announce',
  AUTENTICACAO = 'autenticacao',
  BANCO = 'banco',
  BET_RECORDS = 'bets_records',
  BIND_EMAIL = 'bind_email',
  BIND_GOOGLE_EMAIL_BONUS = 'bind_google_email_bonus',
  BIND_PHONE = 'bind_phone',
  BONUS = 'bonus',
  CHANGE_AVATAR = 'change_avatar',
  CLOSE = '',
  CONDIVAR_AMIGOS = 'condivar_amigos',
  DAILY_BONUS = 'daily_bonus',
  DICA = 'dica',
  DOWNLOAD_TIP = 'download',
  FIRST_RECHARGE = 'first_recharge',
  FORGOT_PASSWORD = 'forgot_password',
  FUNDO_MODAL = 'fundo_modal',
  GAME = 'game',
  ILUSTRAR = 'ilustrar',
  LOGIN = 'login',
  LOGIN_MODAL = 'login_modal',
  MAIL = 'mail',
  MAIL_OPENED = 'mail_opened',
  NEXT_LEVEL = 'next_level',
  OTHER_ANNOUNCEMENT = 'other_announcement',
  PAYMENT = 'payment',
  PHONE = 'cellular',
  PRIZE_POOL = 'prize_pool',
  RECHARGE_RECORDS = 'recharge_records',
  REGISTER = 'register',
  RESCUE_FUND = 'rescue_fund',
  SENHARETIRADA = 'senha_retirada',
  SETTINGS = 'settings',
  SUPPORT = 'support',
  TIPS = 'tips',
  VERSION_PAGE = 'version',
  VIP = 'VIP',
  WITHDRAW_PRIVILEGE = 'withdraw_privilege',
  WITHDRAW_RECORDS = 'withdraw_records',
  WITHDRAWPASS = 'withdrawPassword',
  WITHDRAWRECORD = 'withdrawRecord',
  POINTS_TRANSFER_FAILED = 'pointsTransferFailed',
  PINDUODUO = 'PINDUODUO',
  RECHARGE_BONUS = 'recharge_bonus',
}

export enum LOGIN_MODAL {
  LOGIN = 0,
  REGISTER = 1,
  FORGOT_PASS = 2,
}

export enum MOBILE_MAX_LENGTH {
  PHILIPPINES = 10,
  TAIWAN = 9,
  INDONESIA = 12,
  BRAZIL = 11,
}

export enum BIND_MODAL {
  BIND_EMAIL_BONUS = 'bind_email',
  BIND_GOOGLE_EMAIL_BONUS = 'bind_google_email_bonus',
  BIND_PHONE_BONUS = 'bind_phone',
}

export enum LOCAL_FILTERS {
  BETTING_CATEGORY = 'betting-record-category',
  BETTING_RECORD_DATE = 'profile-date-filter-0',
  FUND_DETAILS_DATE = 'profile-date-filter-1',
  FUND_DETAILS_STATUS = 'profile-status-filter',
}

export enum REQUEST_METHOD {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export enum ACTIVITY_TYPE {
  EVENTS = 'events',
  MISSION = 'mission',
}

export enum DAILY_BONUS_STATUS {
  CLAIMABLE = 1, //red
  CLAIMED = 2, //gray
  NOT_CLAIMABLE = 0, // orange
  NOT_CLAIMED = 3, // gray
}

export enum COPY_CLIPBOARD {
  CONTACT = 'Contact',
  EMAIL = 'email',
  ID = 'ID',
}

export enum SIDE_MENU {
  BETTING_RECORDS = 5,
  CODE_DETAILS = 2,
  FAST_WITHDRAW = 1,
  WALLET_MANAGEMENT = 3,
  WITHDRAW_RECORDS = 4,
}

export enum NO_DATA_TYPE {
  LEFT_PANEL = 'left',
  RIGHT_PANEL = 'right',
}

export enum SCREEN_TYPE {
  ADD_BANK = 2,
  BANK_LIST = 1,
}

export enum BANK_TYPE {
  BANK = 'BANK',
  WALLET = 'WALLET',
}

export enum FUND_DETAIL_MONEY {
  ACTIVITY = 'ACTIVITY',
  BIND_EMAIL = 'BIND_EMAIL',
  BIND_PHONE = 'BIND_PHONE',
  BOHUI = 'BOHUI',
  BONUS_MONEY = 'BONUS_MONEY',
  BONUS_RECHARGE = 'BONUS_RECHARGE',
  CODE_CLEAN = 'CODE_CLEAN',
  COMMISSION = 'COMMISSION',
  DAILY_BONUS = 'DAILY_BONUS',
  DEPOSIT = 'DEPOSIT',
  DEPOSIT_BONUS = 'DEPOSIT_BONUS',
  FIRST_RECHARGE = 'FIRST_RECHARGE',
  GAME_FAIL = 'GAME_FAIL',
  GAME_IN = 'GAME_IN',
  GAME_MANUAL_SCORE = 'GAME_MANUAL_SCORE',
  GAME_OUT = 'GAME_OUT',
  GM = 'GM',
  MISSION = 'MISSION',
  PAY = 'PAY',
  PAY_AGENT = 'PAY_AGENT',
  PINDUODUO = 'PINDUODUO',
  PLATFORM = 'PLATFORM',
  REFUND_BET_AMOUNT = 'REFUND_BET_AMOUNT',
  REGISTER_BONUS = 'REGISTER_BONUS',
  RESCUE_BONUS = 'RESCUE_BONUS',
  SAFE_BOX = 'SAFE_BOX',
  TEST_MONEY = 'TEST_MONEY',
  USDT = 'USDT',
  VIP = 'VIP',
  VIPACCOUNT = 'VIPACCOUNT',
  WITHDRAW = 'WITHDRAW',
}

export enum ANNOUNCEMENT_TYPE {
  CONTENT = 'Content',
  CONTENT_IMAGE = 'Content_Image',
  IMAGE = 'Image',
  PARTNERS = 'Partners',
}

export enum MissionRepeatType {
  DAILY = 'DAILY',
  NA = 'NA',
  THREEDAY = 'THREEDAY',
  WEEKLY = 'WEEKLY',
}

export enum JUMP_TYPE {
  ACTIVITY = 'ACTIVITY',
  BIND_EMAIL = 'BIND_EMAIL',
  BIND_PHONE = 'BIND_PHONE',
  DAILY_BONUS = 'DAILY_BONUS',
  EXTERNAL = 'EXTERNAL',
  INVITER = 'INVITER',
  MESSAGE = 'MESSAGE',
  PINDUODUO = 'PINDUODUO',
  RECHARGE = 'RECHARGE',
  RESCUE_FUND = 'FUND',
  VIP = 'VIP',
  RECHARGE_BONUS = 'RECHARGE_STEP_ACTIVITY',
  // DEPOSIT_BONUS = 'DEPOSIT_BONUS',
  // LOGIN_BONUS = 'LOGIN_BONUS',
}

export enum EVENT_TYPES {
  TYPE_0 = 0, //display the ‘content’ (content field from response)
  TYPE_1 = 1, //JUMP to external browser(Google, Safari, Brave) use the ‘url’
  TYPE_2 = 2, //WebView/Webkit/iFrame (inside the app) use the ‘url’
  TYPE_3 = 3, //is internal screen jump (ex: VIP, RescueFund)
}

export enum EVENT_ACTIVITY_ENUM {
  REGULAR = 'regularActivity',
  RECHARGE = 'rechargeActivity',
  SPIN = 'spinActivity',
}

export enum VERIFICATION_METHOD {
  SMS = 'sms',
  WHATSAPP = 'whatsApp',
}

export enum DEFAULT {
  TIME = '00:00:00',
  DATE_FORMAT = 'YYYY-MM-DD',
}

export enum ANNOUNCEMENT_SHOW_TYPE {
  DIALOG = 'DIALOG',
  BUTTON_CLICK = 'BUTTON_CLICK',
}

export enum DAILY_BONUS_POPUP_CODE {
  DISPLAY_RECHARGE = 10000,
  NO_RECHARGE = 503,
}

export enum RewardLogsType {
  INCOME = 'INCOME',
  ACCOUNT_TRANSFERRED = 'ACCOUNT_TRANSFERRED',
}

export enum APK_EVENT {
  SPIN = 'spin',
  BANNER_CLICK = 'BannerClick',
  DAILY_REWARD = 'DailyReward',
  ENTER_CASHBACK = 'EnterCashBack',
  ENTER_EVENT_CENTER = 'EnterEventCenter',
  ENTER_GAME = 'EnterGame',
  ENTER_PROMOTE = 'EnterPromote',
  ENTER_TASK = 'EnterTask',
  LOGIN = 'Login',
  LOGOUT = 'Logout',
  RECHARGE_CLICK = 'RechargeClick',
  REGISTER_CLICK = 'RegisterClick',
  VIP_REWARD = 'VipReward',
  WITHDRAW_CLICK = 'WithdrawClick',
  FIRST_RECHARGE_CLICK = 'FirstRechargeClick',
  RECHARGE = 'RECHARGE',
}
