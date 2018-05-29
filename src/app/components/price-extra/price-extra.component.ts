import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { NzMessageService, NzModalRef } from 'ng-zorro-antd'

import { API_ORDER_BILL_INSERT } from '../../api/egg.api'
import { ApiResObj } from '../../model/api.model'
import { BillItem, PriceExtra } from '../../model/egg.model'

@Component({
  templateUrl: './price-extra.component.html',
})
export class PriceExtraComponent implements OnInit {

  _onSaved: Function
  prices: BillItem[] = []
  weightAdjust = ''
  priceExtra: PriceExtra = {}
  _date
  errMsg = ''
  @Input()
  set data(val: string) {
    if (val) {
      // todo get detail
    }
  }
  @Input()
  set onSaved(val: Function) {
    this._onSaved = val
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private message: NzMessageService,
    private modalRef: NzModalRef
  ) { }

  doAddSixPrice() {
    this.prices.push({ level: 6 })
    this.prices = [...this.prices]
  }
  doAddSevenPrice() {
    this.prices.push({ level: 7 })
    this.prices = [...this.prices]
  }
  remove(item: BillItem, index: number) {
    this.prices.splice(index, 1)
  }
  doSave() {
    const rangeReg = /^[1-9]\d{0,3}(\.\d{1}){0,1}$/
    for (const p of this.prices) {
      if (!rangeReg.test(p.weight) || !rangeReg.test(p.price)) {
        this.errMsg = '格式错误,输入数字, 1.0 ~ 9999.9'
        return
      }
    }
    if (this.priceExtra.weightAdjust) {
      const boxReg = /^-?(0||[1-9]\d{0,3})(\.\d{1}){0,1}$/
      if (!boxReg.test(this.priceExtra.weightAdjust)) {
        this.errMsg = '箱重格式错误,输入数字, -9999.9 ~ 9999.9'
        return
      }
    }
    if (!this._date) {
      this.errMsg = '日期不能为空'
      return
    }
    const date = moment(this._date).format('YYYY-MM-DD')
    const data = { items: this.prices, priceExtra: this.priceExtra }
    this.http.post<ApiResObj>(`${API_ORDER_BILL_INSERT}/${date}`, data).subscribe(insertRes => {
      if (this._onSaved) {
        this._onSaved()
      }
      this.modalRef.destroy({})
      this.message.success('保存成功')
    })
  }
  ngOnInit(): void {
  }
}
