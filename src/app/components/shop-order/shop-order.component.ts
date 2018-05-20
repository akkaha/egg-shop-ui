import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_USER_ORDER_DETAIL } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { CarOrder, OrderItem, UserOrder } from '../../model/egg.model'
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
  readonly = false
  SHOP_ORDER_WEIGHTS = 'SHOP_ORDER_WEIGHTS'

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

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
  ngOnInit(): void {
    this.route.queryParams.subscribe(query => {
      if (query.hasOwnProperty('readonly')) {
        this.readonly = true
      }
    })
    this.route.params.subscribe(params => {
      const id = params['id']
      if (id) {
        // edit or view
        this.http.get<ApiRes<{ order: UserOrder, items: OrderItem[], car: CarOrder }>>(`${API_USER_ORDER_DETAIL}/${id}`).subscribe(res => {
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
