import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { NzMessageService, NzModalService } from 'ng-zorro-antd'

import { API_SHOP_STATIS } from '../../api/egg.api'
import { ApiRes } from '../../model/api.model'
import { StatisticsResponse } from '../../model/egg.model'

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private modal: NzModalService,
  ) { }

  chartOption
  load() {
    this.http.post<ApiRes<StatisticsResponse>>(API_SHOP_STATIS, { isHome: true }).subscribe(res => {
      if (res.data.byDate) {
        this.chartOption = {
          title: {
            text: '每日数量'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: res.data.byDate.map(item => item.day)
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '每日数量',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              areaStyle: { normal: {} },
              data: res.data.byDate.map(item => item.count)
            }
          ]
        }
      }
    })
  }

  ngOnInit(): void {
    this.load()
  }
}
