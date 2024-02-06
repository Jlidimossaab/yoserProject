import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { LoginComponent } from './login/login.component';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { AjoutCategorieComponent } from './ajout-categorie/ajout-categorie.component';
import { AjoutLocationComponent } from './ajout-location/ajout-location.component';
import { ConsulterCategorieComponent } from './consulter-categorie/consulter-categorie.component';
import { ConsulterLocationComponent } from './consulter-location/consulter-location.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AdminHomeComponent,
    LoginComponent,
    MenuComponent,
    AjoutCategorieComponent,
    AjoutLocationComponent,
    ConsulterCategorieComponent,
    ConsulterLocationComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    BrowserAnimationsModule,
    ButtonModule,
    ToastModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
