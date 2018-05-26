import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

import { API_USER_DELETE, API_USER_QUERY } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { ShopUser } from '../../model/egg.model'
import { ShopUserComponent } from '../shop-user/shop-user.component'

@Component({
  templateUrl: './shop-user-list.component.html',
  styleUrls: ['./shop-user-list.component.css']
})
export class ShopUserListComponent implements OnInit {

  search: ShopUser = {}
  total = 0
  current = 1
  size = 10
  searchChange = new BehaviorSubject('')
  userList: ShopUser[] = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  doSearch(): void {
    this.current = 1
    this.searchChange.next('');
  }
  addUser() {
    this.modal.create({
      nzTitle: '添加用户',
      nzContent: ShopUserComponent,
      nzFooter: null,
      nzComponentParams: {
        onSaved: function () {
          this.searchChange.next('')
        }.bind(this)
      },
    })
  }
  doEdit(item: ShopUser) {
    this.modal.create({
      nzTitle: '编辑用户',
      nzContent: ShopUserComponent,
      nzFooter: null,
      nzComponentParams: {
        data: item,
        onSaved: function () {
          this.searchChange.next('')
        }.bind(this)
      },
    })
  }
  doDelete(item: ShopUser) {
    this.modal.confirm({
      nzTitle: `<i>确认删除 ${item.name}?</i>`,
      nzOnOk: () => {
        this.http.post(API_USER_DELETE, item).subscribe(res => {
          this.message.success('删除成功')
          this.searchChange.next('')
        })
      }
    })
  }
  ngOnInit(): void {
    this.searchChange.debounceTime(300).subscribe(value => {
      this.http.post<ApiRes<ShopUser[]>>(API_USER_QUERY, {
        ...this.search, current: this.current, size: this.size
      }).subscribe(res => {
        this.userList = res.data.list
        this.total = res.data.total
      })
    })
  }
}
