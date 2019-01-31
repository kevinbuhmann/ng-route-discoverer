declare const NgModule: any;
declare const RouterModule: any;
declare const SomeComponent: any;

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: SomeComponent
      }
    ])
  ]
})
export class AppRoutingModule {}
