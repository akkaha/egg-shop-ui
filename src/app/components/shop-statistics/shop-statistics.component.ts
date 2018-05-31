import 'rxjs/add/operator/switchMap'

import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import * as moment from 'moment'
import { NzMessageService } from 'ng-zorro-antd'
import { Subject } from 'rxjs/Subject'

import { API_SHOP_STATIS, API_USER_QUERY } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { ShopUser, StatisticsQuery, StatisticsResponse } from '../../model/egg.model'

@Component({
  templateUrl: './shop-statistics.component.html',
})
export class ShopStatisticsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private message: NzMessageService,
  ) { }

  dates: Date[] = []
  chartOption
  levelOption
  userList: ShopUser[] = []
  user: ShopUser = {}
  selectedUser: ShopUser = {}
  isLoading = false
  searchChange = new Subject<string>()
  search: StatisticsQuery = {}

  onDateOk() {
    const start = this.dates[0]
    const end = this.dates[1]
    this.search.start = moment(start).format('YYYY-MM-DD')
    this.search.end = moment(end).format('YYYY-MM-DD')
    this.load()
  }
  selectedUserChange(user: ShopUser) {
    this.user = { ...this.selectedUser }
    this.search.user = this.user.id
    this.load()
  }
  onSearchUser(value: string): void {
    this.isLoading = true;
    this.searchChange.next(value);
  }
  load() {
    this.http.post<ApiRes<StatisticsResponse>>(API_SHOP_STATIS, this.search).subscribe(res => {
      if (res.data.byLevel) {
        const level = res.data.byLevel.map(l => {
          return { value: l.count, name: l.level }
        }).sort(function (a, b) { return a.value - b.value; })
        this.levelOption = {
          backgroundColor: 'white',
          title: {
            text: '层数分布',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [
            {
              name: '层数',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: level,
              roseType: 'radius',
              label: {
                normal: {
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  }
                }
              },
              labelLine: {
                normal: {
                  lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                  },
                  smooth: 0.2,
                  length: 10,
                  length2: 20
                }
              },
              itemStyle: {
                normal: {
                  color: '#c23531',
                  shadowBlur: 200,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ]
        }
      }
      if (res.data.byWeight) {
        this.chartOption = {
          xAxis: {
            type: 'category',
            data: res.data.byWeight.map(w => w.weight),
            name: '重量'
          },
          yAxis: {
            type: 'value',
            name: '数量'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              const tar = params[0]
              return tar ? tar.data : 0
            }
          },
          series: [{
            data: res.data.byWeight.map(w => w.count),
            type: 'bar'
          }]
        }
      }
    })
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
    this.searchChange.next()
    this.load()
  }
}
