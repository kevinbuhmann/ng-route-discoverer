declare const NgModule: any;
declare const RouterModule: any;
declare const SomeComponent: any;

const routes = [
  {
    path: '',
    component: SomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
