import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_PRICE_QUERY } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { ShopPrice } from '../../model/egg.model'
import { PriceExtraComponent } from '../price-extra/price-extra.component'

@Component({
  templateUrl: './shop-price-list.component.html',
  styleUrls: ['./shop-price-list.component.css']
})
export class ShopPriceListComponent implements OnInit {

  _date: null
  total = 0
  current = 1
  size = 10
  list: ShopPrice[] = []
  extra = {}
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  newPrice() {
    this.modal.create({
      nzTitle: '添加定价',
      nzContent: PriceExtraComponent,
      nzFooter: null,
      nzComponentParams: {
        onSaved: function () {
          this.load()
        }.bind(this)
      },
    })
  }
  doEdit(item: ShopPrice) {
    this.modal.create({
      nzTitle: '编辑定价',
      nzContent: PriceExtraComponent,
      nzFooter: null,
      nzComponentParams: {
        data: item.day,
        onSaved: function () {
          this.load()
        }.bind(this)
      },
    })
  }
  load() {
    let day
    if (this._date) {
      day = moment(this._date).format('YYYY-MM-DD')
    }
    const date = moment(this._date).format('YYYY-MM-DD')
    this.http.post<ApiRes<ShopPrice[]>>(API_PRICE_QUERY, {
      date: day, current: this.current, size: this.size
    }).subscribe(res => {
      this.list = res.data.list
      this.total = res.data.total
      this.extra = res.data['extra'] || {}
    })
  }
  ngOnInit(): void {
    this.load()
  }
}
