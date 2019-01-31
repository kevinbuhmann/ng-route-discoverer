declare const NgModule: any;
declare const RouterModule: any;
declare const FeatureComponent: any;

const routes = [
  {
    path: '',
    component: FeatureComponent
  },
  {
    path: 'feature-page',
    component: FeatureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class FeatureModule {}
