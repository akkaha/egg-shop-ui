import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as math from 'mathjs'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_ORDER_PAY } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { BillItem, DefaultPrintConfig, OrderBill, PrintConfig, ShopOrder, ShopUser } from '../../model/egg.model'
import { OrderPayRes } from '../shop-order-pay/shop-order-pay.component'

@Component({
  selector: 'app-shop-order-print',
  templateUrl: './shop-order-print.component.html',
  styleUrls: ['./shop-order-print.component.css']
})
export class ShopOrderPrintComponent implements OnInit {

  order: ShopOrder = {}
  bill: OrderBill = {}
  user: ShopUser = {}
  weightAdjustStr = ''

  values: BillItem[] = []

  cols = []
  rows = []

  CONFIG_KEY = 'user-print-config'
  config: PrintConfig = DefaultPrintConfig
  // tables: PrintTable[] = []
  tdStyle = {
    'padding': '5px',
    'color': 'black'
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) {
  }

  meanWeightResult() {
    if (this.bill && this.bill.meanWeight && this.weightAdjustStr) {
      const a = math.bignumber(math.eval(this.bill.meanWeight))
      const b = math.bignumber(math.eval(this.weightAdjustStr))
      return ' = ' + math.add(a, b) + ' 斤'
    } else {
      return ''
    }
  }
  paddingStyle() {
    if (this.config && this.config.style) {
      const style = this.config.style
      return {
        'paddingTop': (style.top || '0') + 'mm',
        'paddingLeft': (style.left || '0') + 'mm',
        'paddingBottom': (style.bottom || '0') + 'mm',
        'paddingRight': (style.right || '0') + 'mm',
      }
    } else {
      return {}
    }
  }
  saveToLocal() {
    try {
      localStorage.setItem(this.CONFIG_KEY, JSON.stringify(this.config))
    } catch (error) {
      console.log(error)
    }
  }
  restoreFromLocal() {
    try {
      const str = localStorage.getItem(this.CONFIG_KEY)
      if (str) {
        const config: PrintConfig = JSON.parse(str)
        if (config.colCount) {
          let num = parseInt(config.colCount.toString(), 10)
          if (num <= 0 || Number.isNaN(num)) {
            num = 10
            config.colCount = num
            this.saveToLocal()
          } else {
            config.colCount = num
          }
        } else {
          config.colCount = DefaultPrintConfig.colCount
        }
        if (config.rowCount) {
          let num = parseInt(config.rowCount.toString(), 10)
          if (num < 0 || Number.isNaN(num)) {
            num = 0
            config.rowCount = num
            this.saveToLocal()
          } else {
            config.rowCount = num
          }
        } else {
          config.rowCount = DefaultPrintConfig.rowCount
        }
        if (!config.style) {
          config.style = {}
        }
        this.config = config
      }
    } catch (error) {
      console.log(error)
    }
    this.cols.length = this.config.colCount
    this.rows.length = this.config.rowCount
  }
  rowCountChange() {
    let num = 0
    try {
      num = parseInt(this.config.rowCount.toString(), 10)
      if (num < 0 || Number.isNaN(num)) {
        num = 0
      }
    } catch (error) {
      num = 0
    }
    this.config.rowCount = num
    this.rows.length = num
    this.saveToLocal()
  }
  colCountChange() {
    let num = 10
    try {
      num = parseInt(this.config.colCount.toString(), 10)
      if (num <= 0 || Number.isNaN(num)) {
        num = 10
      }
    } catch (error) {
      num = 10
    }
    this.tdStyle['width'] = `${Math.floor(1 / num * 100)}%`
    this.cols.length = num
    // fixed rows
    // this.rows.length = Math.ceil(this.values.length / num)
    this.saveToLocal()
  }
  w(r: number, c: number) {
    const i = c * this.config.rowCount + r
    const item = this.values[i]
    if (item) {
      const itemPrice = this.formatPrice(item.price)
      const formatedPrice = this.formatPrice(item.totalPrice)
      return `${item.weight} x ${item.count} x ${itemPrice}=${formatedPrice}元`
    } else {
      return ''
    }
  }
  formatPrice(val: string) {
    if (val) {
      try {
        const ret = parseFloat((Math.round(Number(val) * 10) / 10).toString()).toFixed(1)
        return ret
      } catch (error) {
        console.error(error)
        return ''
      }
    } else {
      return ''
    }
  }
  print() {
    window.print()
  }
  goBack() {
    this.location.back()
  }
  ngOnInit(): void {
    this.restoreFromLocal()
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.http.get<ApiRes<OrderPayRes>>(`${API_ORDER_PAY}/${id}`).subscribe(res => {
          this.user = res.data.user
          this.order = res.data.order
          this.bill = res.data.bill
          if (this.bill) {
            if (this.bill.priceExtra) {
              const extra = this.bill.priceExtra
              if (extra.weightAdjust) {
                if (extra.weightAdjust.startsWith('-')) {
                  this.weightAdjustStr = extra.weightAdjust
                } else {
                  this.weightAdjustStr = `+${extra.weightAdjust}`
                }
              }
            }
            if (this.bill.items) {
              const items = this.bill.items
              this.values = items
              // fixed rows
              // this.rows.length = Math.ceil(this.values.length / this.config.colCount)
              // if (this.config.weightGroups) {
              //   this.tables = toPrintTables(this.config, this.values, this.weightAdjustStr)
              // }
            }
          }
        })
      }
    })
  }
}
