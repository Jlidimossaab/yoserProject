import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AjoutCategorieComponent } from './ajout-categorie/ajout-categorie.component';
import { ConsulterCategorieComponent } from './consulter-categorie/consulter-categorie.component';
import { ConsulterLocationComponent } from './consulter-location/consulter-location.component';
import { AjoutLocationComponent } from './ajout-location/ajout-location.component';

const routes: Routes = [
  { path: 'adminHome', component: AdminHomeComponent },
  { path: 'ajout_categorie', component: AjoutCategorieComponent },
  { path: 'ajout_location', component: AjoutLocationComponent },
  { path: 'consulter_categorie', component: ConsulterCategorieComponent },
  { path: 'consulter_location', component: ConsulterLocationComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
