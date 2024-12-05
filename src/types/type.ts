export interface Blacklist {
  id: number;
  word: string;
}
export interface Facebook {
  id: number;
  url: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  currency: string;
  condition: string;
  image_url: string;
  description: string;
  availability: string;
  custom_label_0: string;
  custom_label_1: string;
  custom_label_2: string;
  custom_label_3: string;
  custom_label_4: string;
  additional_image_urls: string[];
}

export interface Product {
  id: number;
  category: string;
  shop_id: string;
  name: string;
  content: string | null;
  originalprice: number;
  marginprice: number;
  price: number;
  real_id: string;
  info_status: number;
  site_id: number;
  real_url: string;
  image: string;
  video: string | null;
  quantity: number;
  provider: string;
  brand_id: number | null;
  brand_name: string | null;
  weight: number | null;
  volume: number | null;
  sizes: string | null;
  delivery_price: number;
  sale_originalprice: number;
  sale_marginprice: number;
  sale_price: number;
  update_date: string;
  shop_score: number;
  category_ota: string | null;
  salescount: number;
  price_cn: number | null;
  sale_price_cn: number | null;
  name_cn: string | null;
  delivery_price_cn: number | null;
}
export interface TaboaCategory {
  taobao_id: number;
  name: string;
  parentid: number;
  full_parent: string;
  full_name: string;
  fb_cat_id: number;
  is_block: boolean;
  promote: boolean;
  google_cat_id: number;
}

export interface Invoice {
  id: number;
  neo_invoice_id: string;
  name: string;
  description: string;
  keyword: string;
  amount: number;
  is_paid: boolean;
  payment_type: any;
  paid_date: any;
  register: string;
  callback: any;
  is_notified: boolean;
  cdate: string;
  paid_amount: number;
}

export interface Transaction {
  id: number;
  bank: string;
  recipient: string;
  sender: string;
  txn_date: string;
  debit: number;
  credit: number;
  note: string;
  begin_balance: number;
  end_balance: number;
  branch_id: number;
  is_unique: string;
  cdate: string;
}

export interface Bank {
  id: number;
  user: any;
  dans: string;
  transactionDate: string;
  accountId?: string;
  amountType: string;
  amount: number;
  transactionRemarks: string;
  txnTime: string;
  beginBalance: number;
  endBalance: number;
  txnBranchId: number;
  isUnique: string;
  isSent: number;
}
