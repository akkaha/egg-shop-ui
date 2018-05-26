import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalRef } from 'ng-zorro-antd'

import { API_USER_SAVE } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { ShopUser } from '../../model/egg.model'

@Component({
  templateUrl: './shop-user.component.html',
})
export class ShopUserComponent implements OnInit {

  user: ShopUser = {}
  _onSaved: Function

  @Input()
  set data(val: ShopUser) {
    if (val) {
      this.user = { ...val }
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
    this.http.post<ApiRes<ShopUser>>(API_USER_SAVE, this.user).subscribe(res => {
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
