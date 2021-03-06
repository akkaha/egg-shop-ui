import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { HomeComponent } from './components/home/home.component'
import { ShopOrderListComponent } from './components/shop-order-list/shop-order-list.component'
import { ShopOrderPayComponent } from './components/shop-order-pay/shop-order-pay.component'
import { ShopOrderPrintComponent } from './components/shop-order-print/shop-order-print.component'
import { ShopOrderComponent } from './components/shop-order/shop-order.component'
import { ShopPriceListComponent } from './components/shop-price-list/shop-price-list.component'
import { ShopStatisticsComponent } from './components/shop-statistics/shop-statistics.component'
import { ShopUserListComponent } from './components/shop-user-list/shop-user-list.component'

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'shop-order-list', component: ShopOrderListComponent },
  { path: 'shop-user-list', component: ShopUserListComponent },
  { path: 'shop-order', component: ShopOrderComponent },
  { path: 'shop-order/:id', component: ShopOrderComponent },
  { path: 'shop-order-pay/:id', component: ShopOrderPayComponent },
  { path: 'shop-order-print/:id', component: ShopOrderPrintComponent },
  { path: 'shop-order-dashboard', component: ShopStatisticsComponent },
  { path: 'shop-price-list', component: ShopPriceListComponent },
  { path: '**', redirectTo: 'home' },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
