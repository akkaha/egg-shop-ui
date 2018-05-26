import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd'

import { AppRoutingModule } from './/app-routing.module'
import { ApiCodeInterceptor } from './api/api-code.interceptor'
import { AppComponent } from './app.component'
import { HomeComponent } from './components/home/home.component'
import { PayPatternComponent } from './components/pay-pattern/pay-pattern.component'
import { PopInuptComponent } from './components/pop-input/pop-inupt.component'
import { ShopOrderListComponent } from './components/shop-order-list/shop-order-list.component'
import { ShopOrderPayComponent } from './components/shop-order-pay/shop-order-pay.component'
import { ShopOrderPrintComponent } from './components/shop-order-print/shop-order-print.component'
import { ShopOrderComponent } from './components/shop-order/shop-order.component'
import { ShopUserListComponent } from './components/shop-user-list/shop-user-list.component'
import { ShopUserComponent } from './components/shop-user/shop-user.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShopOrderComponent,
    ShopOrderListComponent,
    ShopOrderPayComponent,
    PayPatternComponent,
    PopInuptComponent,
    ShopOrderPrintComponent,
    ShopUserListComponent,
    ShopUserComponent,
  ],
  entryComponents: [
    ShopUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiCodeInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
