import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MesAffairesComponent } from '../pages/client/mes-affaires/mes-affaires.component';
import { MesRendezVousComponent } from '../pages/client/mes-rendez-vous/mes-rendez-vous.component';
import { MeshonorraireComponent } from '../pages/client/meshonorraire/meshonorraire.component';
import { ParametreComponent } from '../pages/client/parametre/parametre.component';

const routes: Routes = [
  {
    path:'mesaffaires',
    component:MesAffairesComponent
  },
  {
    path:'mesrendezvous',
    component:MesRendezVousComponent
  },
  {
    path:'meshonnoraire',
    component:MeshonorraireComponent
  },
  {
    path:'mesparams',
    component:ParametreComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
