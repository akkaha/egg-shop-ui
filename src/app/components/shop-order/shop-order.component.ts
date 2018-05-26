import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'
import { Subject } from 'rxjs/Subject'

import {
  API_ORDER_DETAIL,
  API_ORDER_INSERT,
  API_ORDER_ITEM_DEC,
  API_ORDER_ITEM_INC,
  API_ORDER_UPDATE,
  API_USER_QUERY,
} from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { OrderDetail, OrderItem, OrderStatus, ShopOrder, ShopUser } from '../../model/egg.model'
import { mathIsNumeric, mathSort } from '../../util/math-util'

@Component({
  templateUrl: './shop-order.component.html',
  styleUrls: ['./shop-order.component.css']
})
export class ShopOrderComponent implements OnInit {

  cardBodyStyle = {
    padding: '12px',
  }
  gridStyle = {
    width: '25%',
    textAlign: 'center',
    padding: '10px'
  }
  sixWeights: LevelWeightItem[] = []
  sevenWeights: LevelWeightItem[] = []
  sixWeightItems: OrderItem[] = []
  sevenWeightItems: OrderItem[] = []
  readonly = false
  SHOP_ORDER_WEIGHTS = 'SHOP_ORDER_WEIGHTS'
  isLoading = false
  searchChange = new Subject<string>()
  userList: ShopUser[] = []
  user: ShopUser = {}
  selectedUser: ShopUser = {}
  countryEditable = true
  orderCreated = false
  order: ShopOrder = {}
  totalCount = 0

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  plusItemCount(item: OrderItem) {
    this.http.post<ApiRes<{ item: number, total: number }>>(API_ORDER_ITEM_INC, item).subscribe(res => {
      item.count = res.data.item
      this.totalCount = res.data.total
    })
  }
  minusItemCount(item: OrderItem) {
    this.http.post<ApiRes<{ item: number, total: number }>>(API_ORDER_ITEM_DEC, item).subscribe(res => {
      item.count = res.data.item
      this.totalCount = res.data.total
    })
  }
  newOrder() {
    if (this.user && this.user.name) {
      const newOrder = {
        user: this.user,
        sixWeights: this.sixWeights.map(item => item.weight),
        sevenWeights: this.sevenWeights.map(item => item.weight)
      }
      this.http.post<ApiRes<OrderDetail>>(API_ORDER_INSERT, newOrder).subscribe(res => {
        this.orderCreated = true
        this.countryEditable = false
        const sixTemp: OrderItem[] = []
        const seventTemp: OrderItem[] = []
        res.data.items.forEach(item => {
          if (item.level === 6) {
            sixTemp.push(item)
          } else if (item.level === 7) {
            seventTemp.push(item)
          }
        })
        this.sixWeightItems = sixTemp
        this.sevenWeightItems = seventTemp
        this.order = res.data.order
      })
    } else {
      this.message.warning('请选择用户')
    }
  }
  selectedUserChange(user: ShopUser) {
    this.user = { ...this.selectedUser }
    if (user && user.id && user.id > 0) {
      this.countryEditable = false
    } else {
      this.countryEditable = true
    }
  }
  onSearchUser(value: string): void {
    this.isLoading = true;
    this.searchChange.next(value);
  }
  addWeightLevel(level: string) {
    switch (level) {
      case '6':
        this.sixWeights.push({ weight: '' })
        break
      case '7':
        this.sevenWeights.push({ weight: '' })
        break
      default:
        return
    }
  }
  removeWeightLevel(level: string, index: number) {
    switch (level) {
      case '6':
        this.sixWeights.splice(index, 1)
        this.saveWeightLevel()
        break
      case '7':
        this.sevenWeights.splice(index, 1)
        this.saveWeightLevel()
        break
      default:
        return
    }
  }
  sortWeightLevel(level: string) {
    switch (level) {
      case '6':
        if (this.isWeightLevelValid(this.sixWeights)) {
          const sixNums = this.sixWeights.map(w => w.weight)
          this.sixWeights = mathSort(sixNums).map(num => {
            return { 'weight': num }
          })
        } else {
          this.message.warning('必须全为数字')
        }
        break
      case '7':
        if (this.isWeightLevelValid(this.sevenWeights)) {
          const sevenNums = this.sevenWeights.map(w => w.weight)
          this.sevenWeights = mathSort(sevenNums).map(num => {
            return { 'weight': num }
          })
        } else {
          this.message.warning('必须全为数字')
        }
        break
      default:
        return
    }
  }
  isWeightLevelValid(weights: LevelWeightItem[]) {
    for (const w of weights) {
      if (!mathIsNumeric(w.weight)) {
        return false
      }
    }
    return true
  }
  weightLevelChange(level: string, weight: string) {
    this.saveWeightLevel()
  }
  saveWeightLevel() {
    const levels: LevelWeight = {
      six: this.sixWeights,
      seven: this.sevenWeights
    }
    localStorage.setItem(this.SHOP_ORDER_WEIGHTS, JSON.stringify(levels))
  }
  doCommit() {
    this.modal.confirm({
      nzTitle: `确认提交?`,
      nzContent: `编号: ${this.order.id}`,
      nzOnOk: () => {
        const order: ShopOrder = { id: this.order.id, status: OrderStatus.COMMITED }
        this.http.post<ApiRes<ShopOrder>>(API_ORDER_UPDATE, order).subscribe(res => {
          this.router.navigate(['/shop-order-list'])
        })
      }
    })
  }
  goBack() {
    this.router.navigate(['/shop-order-list'])
  }
  ngOnInit(): void {
    this.searchChange.debounceTime(300).subscribe(value => {
      const user = { name: value, size: 100 }
      this.http.post<ApiRes<ShopUser[]>>(API_USER_QUERY, user).subscribe(res => {
        if (res.data.list.length > 0) {
          this.userList = res.data.list
        } else {
          this.userList = [{ id: -1, name: value }]
        }
        this.isLoading = false
      })
    })
    this.route.queryParams.subscribe(query => {
      if (query.hasOwnProperty('readonly')) {
        this.readonly = true
      }
    })
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        // edit or view
        this.orderCreated = true
        this.http.get<ApiRes<{ order: ShopOrder, items: OrderItem[], user: ShopUser, total: number }>>
          (`${API_ORDER_DETAIL}/${id}`).subscribe(res => {
            this.selectedUser = res.data.user || {}
            this.user = { ...this.selectedUser }
            this.userList.push(this.selectedUser)
            this.order = res.data.order
            this.totalCount = res.data.total
            const tmpSix: OrderItem[] = []
            const tmpSeven: OrderItem[] = []
            res.data.items.forEach(item => {
              if (item.level === 6) {
                tmpSix.push(item)
              } else if (item.level === 7) {
                tmpSeven.push(item)
              }
            })
            this.sixWeightItems = tmpSix
            this.sevenWeightItems = tmpSeven
          })
      } else {
        // new
        const weigths = localStorage.getItem(this.SHOP_ORDER_WEIGHTS)
        try {
          const levels: LevelWeight = JSON.parse(weigths)
          if (levels) {
            this.sixWeights = levels.six || []
            this.sevenWeights = levels.seven || []
          }
        } catch (error) {
          console.error(error)
        }
      }
    })
  }
}

interface LevelWeight {
  six: LevelWeightItem[]
  seven: LevelWeightItem[]
}

interface LevelWeightItem { weight: string }
