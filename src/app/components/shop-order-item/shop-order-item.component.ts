import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalRef } from 'ng-zorro-antd'

import { API_ORDER_ITEM_INSERT } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { OrderItem } from '../../model/egg.model'

@Component({
  templateUrl: './shop-order-item.component.html',
})
export class ShopOrderItemComponent implements OnInit {

  item: OrderItem = {}
  _onSaved: Function

  @Input()
  set data(val: OrderItem) {
    if (val) {
      this.item = { ...val }
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

  save() {
    const item: OrderItem = {
      weight: this.item.weight,
      level: this.item.level,
      user: this.item.user,
      order: this.item.order
    }
    this.http.post<ApiRes<OrderItem>>(API_ORDER_ITEM_INSERT, item).subscribe(res => {
      this.message.success('保存成功')
      if (this._onSaved) {
        this._onSaved()
      }
      this.modalRef.destroy({})
    })
  }
  ngOnInit(): void {
  }
}
