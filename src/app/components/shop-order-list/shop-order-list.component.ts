import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_ORDER_DELETE, API_ORDER_QUERY, API_ORDER_UPDATE, API_USER_QUERY } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { ListShopOrderItem, OrderStatus, ShopOrder, ShopUser } from '../../model/egg.model'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  templateUrl: './shop-order-list.component.html',
  styleUrls: ['./shop-order-list.component.css']
})
export class ShopOrderListComponent implements OnInit {

  search: ShopOrder = {}
  total = 0
  current = 1
  size = 10
  statusOptions = [
    { label: '新增', value: OrderStatus.NEW },
    { label: '待结算', value: OrderStatus.COMMITED },
    { label: '完成', value: OrderStatus.FINISHED },
    { label: '废弃', value: OrderStatus.DEPRECATED },
  ]
  list: ListShopOrderItem[] = []
  isLoading = false
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

  onSearchUser(value: string): void {
    this.isLoading = true;
    this.searchChange.next(value);
  }
  doSearch() {
    this.current = 1
    this.load()
  }
  load() {
    this.http.post<ApiRes<ListShopOrderItem[]>>(
      API_ORDER_QUERY, { ...this.search, current: this.current, size: this.size }
    ).subscribe(res => {
      this.list = res.data.list
      this.total = res.data.total
    })
  }
  statusColor(status: string) {
    switch (status) {
      case OrderStatus.NEW:
        return 'blue'
      case OrderStatus.COMMITED:
        return 'red'
      case OrderStatus.FINISHED:
        return 'green'
      case OrderStatus.DEPRECATED:
        return ''
      default:
        return ''
    }
  }
  statusName(status: string) {
    switch (status) {
      case OrderStatus.NEW:
        return '新增'
      case OrderStatus.COMMITED:
        return '待结算'
      case OrderStatus.FINISHED:
        return '完成'
      case OrderStatus.DEPRECATED:
        return '废弃'
      default:
        return '未知'
    }
  }
  canBeDeprecated(item: ShopOrder) {
    return item.status === OrderStatus.NEW
  }
  canEdit(item: ShopOrder) {
    return item.status === OrderStatus.NEW
  }
  canView(item: ShopOrder) {
    return item.status !== OrderStatus.NEW
  }
  canDeal(item: ShopOrder) {
    return item.status === OrderStatus.COMMITED
  }
  canPrint(item: ShopOrder) {
    return item.status === OrderStatus.FINISHED
  }
  canRestore(item: ShopOrder) {
    return item.status === OrderStatus.DEPRECATED
  }
  doDeprecate(item: ShopOrder) {
    const order: ShopOrder = { id: item.id, status: OrderStatus.DEPRECATED }
    this.http.post<ApiRes<ShopOrder>>(API_ORDER_UPDATE, order).subscribe(res => {
      this.message.success('更新成功')
      this.load()
    })
  }
  doEdit(item: ShopOrder) {
    this.router.navigate([`/shop-order/${item.id}`])
  }
  doView(item: ShopOrder) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'readonly': '' },
    }
    if (OrderStatus.FINISHED === item.status) {
      this.router.navigate([`/shop-order-pay/${item.id}`], navigationExtras)
    } else {
      this.router.navigate([`/shop-order/${item.id}`], navigationExtras)
    }
  }
  doPay(item: ShopOrder) {
    this.router.navigate([`/shop-order-pay/${item.id}`])
  }
  doPrint(item: ShopOrder) {
    this.router.navigate([`/shop-order-print/${item.id}`])
  }
  doRestore(item: ShopOrder) {
    const order: ShopOrder = { id: item.id, status: OrderStatus.NEW }
    this.http.post<ApiRes<ShopOrder>>(API_ORDER_UPDATE, order).subscribe(res => {
      this.message.success('更新成功')
      this.load()
    })
  }
  doDelete(item: ShopOrder) {
    this.modal.create({
      nzTitle: '删除',
      nzContent: `确认删除吗,删除后所有关联数据将不可找回?`,
      nzOnOk: () => {
        const order: ShopOrder = { id: item.id }
        this.http.post<ApiRes<ShopOrder>>(API_ORDER_DELETE, order).subscribe(res => {
          this.message.success('操作成功')
          this.load()
        })
      }
    })
  }
  ngOnInit(): void {
    this.load()
    this.searchChange.debounceTime(300).subscribe(value => {
      const user: ShopUser = { name: value }
      this.http.post<ApiRes<ShopUser[]>>(API_USER_QUERY, user).subscribe(res => {
        if (res.data.length > 0) {
          this.userList = res.data
        } else {
          this.userList = []
        }
        this.isLoading = false
      })
    })
  }
}
