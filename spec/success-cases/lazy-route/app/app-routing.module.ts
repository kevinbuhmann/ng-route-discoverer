declare const NgModule: any;
declare const RouterModule: any;

const routes = [
  {
    path: 'feature',
    children: [
      {
        path: '',
        loadChildren: 'app/feature/feature/feature.module#FeatureModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
