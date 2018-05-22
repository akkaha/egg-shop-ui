import { Subject } from 'rxjs/Subject';

export interface ShopUser {
  id?: number
  name?: string
  country?: number
  phone?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
}

export interface ShopOrder {
  id?: number
  user?: number
  phone?: string
  bill?: string
  status?: string
  remark?: string
  createdAt?: string
  updatedAt?: string
}

export interface ListShopOrderItem extends ShopOrder {
  checked?: boolean
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
}

export interface PriceExtra {
  id?: number
  date?: string
  weightAdjust?: string
}

export interface OrderBill {
  date?: string
  totalCount?: number
  totalWeight?: string
  meanWeight?: string
  totalPrice?: string
  meanPrice?: string
  items?: BillItem[]
  priceRange?: Object
  remark?: string
  priceExtra?: PriceExtra
}

export interface PrintConfig {
  colCount?: number
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
  style?: {
    top?: string
    left?: string
    bottom?: string
    right?: string
  },
  weightGroups?: string
}

export const DefaultPrintConfig = {
  colCount: 10,
  empRowCount: 0,
  title: '🥚河北🥚',
  showBorder: false,
  showItemPrice: false,
  showTotalWeight: true,
  showMeanWeight: false,
  showTotalPrice: true,
  showFormula: false,
  showRemark: true,
  showCreateTime: true,
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
