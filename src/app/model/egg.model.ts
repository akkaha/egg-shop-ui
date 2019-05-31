import { Subject } from 'rxjs/Subject'

export interface StatisticsQuery {
  start?: string
  end?: string
  user?: number
  isHome?: string
}

export interface StatisticsResponse {
  byLevel?: { level?: string, count?: number }[]
  byWeight?: { weight?: string, count?: number }[]
  byDate?: { day?: string, count?: number }[]
}

export interface ShopUser {
  id?: number
  name?: string
  country?: string
  phone?: string
  remark?: string
  ext?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserExt {
  sixWeights: string[]
  sevenWeights: string[]
}

export interface ShopOrder {
  id?: number
  dayOrder?: number
  user?: number
  bill?: string
  status?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
  start?: string
  end?: string
  userName?: string
}

export interface ListShopOrderItem {
  id?: number
  user?: number
  count?: number
  status?: string
  remark?: string
  createdAt?: string
}

export const OrderStatus = {
  NEW: 'new',
  COMMITED: 'commited',
  FINISHED: 'finished',
  DEPRECATED: 'deprecated',
}

export interface OrderItem {
  id?: number
  weight?: string
  count?: number
  order?: number
  level?: number
  user?: number
  createdAt?: string
  updatedAt?: string
  /** use internal */
  checked?: boolean
  dbStatus?: string
  readonly?: boolean
  status?: string
  error?: boolean
  subject?: Subject<OrderItem>
}

export interface BillItem {
  weight?: string
  price?: string
  level?: number
  count?: number
  totalWeight?: string
  totalPrice?: string
}

export interface PriceItem {
  weight?: string
  price?: string
  level?: number
}

export interface PriceExtra {
  id?: number
  date?: string
  weightAdjust?: string
}

export interface OrderBillSummary {
  totalCount?: number
  totalWeight?: string
  meanWeight?: string
  totalPrice?: string
  meanPrice?: string
}
export interface OrderBill {
  date?: string
  totalCount?: number
  totalWeight?: string
  meanWeight?: string
  totalPrice?: string
  meanPrice?: string
  items?: BillItem[]
  sixSUmmary?: OrderBillSummary
  sevenSummary?: OrderBillSummary
  sixPriceRange?: Object
  sevenPriceRange?: Object
  remark?: string
  priceExtra?: PriceExtra
}

export interface PrintConfig {
  colCount?: number
  rowCount?: number
  empRowCount?: number
  title?: string
  showBorder?: boolean
  showItemPrice?: boolean,
  showTotalWeight?: boolean,
  showMeanWeight?: boolean,
  showTotalPrice?: boolean,
  showFormula?: boolean,
  showRemark?: boolean,
  showCreateTime?: boolean
  remarkContent?: string
  style?: {
    top?: string
    left?: string
    bottom?: string
    right?: string
  },
  weightGroups?: string
}

export interface ShopPrice {
  id?: string
  day?: string
  weight?: number
  price?: number
  level?: number
}

export const DefaultPrintConfig = {
  colCount: 2,
  rowCount: 6,
  empRowCount: 0,
  title: '津行蛋品收购处',
  showBorder: false,
  showItemPrice: false,
  showTotalWeight: true,
  showMeanWeight: false,
  showTotalPrice: true,
  showFormula: false,
  showRemark: true,
  showCreateTime: true,
  remarkContent: '',
  style: {
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
  },
  weightGroups: ''
}

export const DbStatus = {
  CREATING: 'creating',
  CREATED: 'created'
}

export interface OrderDetail {
  order: ShopOrder
  items: OrderItem[]
}
export function clearNewOrderItem(item: OrderItem) {
  const newItem: OrderItem = { ...item }
  newItem.dbStatus = undefined
  newItem.readonly = undefined
  newItem.status = undefined
  newItem.error = undefined
  newItem.subject = undefined
  newItem.createdAt = undefined
  newItem.updatedAt = undefined
  newItem.checked = undefined
  return newItem
}

export function clearOrderField(item: ShopOrder | ShopOrder) {
  const newItem: ShopOrder | ShopOrder = { ...item }
  newItem.createdAt = undefined
  newItem.updatedAt = undefined
  return newItem
}
