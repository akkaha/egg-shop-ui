import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_ORDER_PAY, API_ORDER_UPDATE } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { clearOrderField, OrderBill, OrderStatus, PriceExtra, ShopOrder, ShopUser } from '../../model/egg.model'

@Component({
  templateUrl: './shop-order-pay.component.html',
  styleUrls: ['./shop-order-pay.component.css']
})
export class ShopOrderPayComponent implements OnInit {

  order: ShopOrder = {}
  user: ShopUser = {}
  bill: OrderBill = {
    items: [],
  }
  readonly = true
  tablePageIndex = 1
  tablePageSize = 10
  pageSizeOptions = [10, 20, 30, 40, 50, 100]
  popVisible = {}
  orderPayRes: OrderPayRes = {}
  weightAdjustStr = ''

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  itemIndex(index: number) {
    return (this.tablePageIndex - 1) * this.tablePageSize + index
  }
  isFinished() {
    return OrderStatus.FINISHED === this.order.status
  }
  doFinish() {
    this.modal.create({
      nzTitle: `确认完成`,
      nzContent: `编号: ${this.order.dayOrder}, 姓名: ${this.order.user}, 数量: ${this.bill.totalCount}, 金额: ${this.bill.totalPrice}.`,
      nzOnOk: () => {
        const toUpdate = clearOrderField(this.order)
        toUpdate.status = OrderStatus.FINISHED
        toUpdate.bill = JSON.stringify(this.bill)
        this.http.post<ApiRes<ShopOrder>>(API_ORDER_UPDATE, toUpdate).subscribe(res => {
          this.order.status = OrderStatus.FINISHED
          this.readonly = true
          this.message.success('操作成功')
        })
      }
    })
  }
  doNew() {
    this.modal.confirm({
      nzTitle: `确认打回单号: ${this.order.dayOrder}`,
      nzContent: `打回后状态变为 '新增', 需要重新提交.`,
      nzOnOk: () => {
        this.order.status = OrderStatus.NEW
        this.http.post<ApiRes<ShopOrder>>(API_ORDER_UPDATE, clearOrderField(this.order)).subscribe(res => {
          this.goBack()
        })
      }
    })
  }
  doPrint() {
    this.router.navigate([`/shop-order-print/${this.order.id}`])
  }
  setWeightAdjustStr() {
    if (this.bill && this.bill.priceExtra) {
      const extra = this.bill.priceExtra
      if (extra.weightAdjust) {
        if (extra.weightAdjust.startsWith('-')) {
          this.weightAdjustStr = extra.weightAdjust
        } else {
          this.weightAdjustStr = `+${extra.weightAdjust}`
        }
      }
    }
  }
  doCalc(date: string) {
    this.http.get<ApiRes<OrderPayRes>>(`${API_ORDER_PAY}/${this.order.id}?date=${date}`).subscribe(res => {
      this.bill = res.data.bill
      this.orderPayRes = res.data
      this.setWeightAdjustStr()
    })
  }
  goBack() {
    this.router.navigate(['/shop-order-list'])
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.http.get<ApiRes<OrderPayRes>>(`${API_ORDER_PAY}/${id}`).subscribe(res => {
          this.orderPayRes = res.data
          this.order = res.data.order
          this.bill = res.data.bill
          this.user = res.data.user
          this.setWeightAdjustStr()
        })
      }
    })
  }
}

export interface OrderPayRes {
  order?: ShopOrder
  bill?: OrderBill
  user?: ShopUser
  priceExtra?: PriceExtra
}
