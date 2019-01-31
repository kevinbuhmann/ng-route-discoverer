declare const NgModule: any;
declare const RouterModule: any;

@NgModule({
  imports: [RouterModule.forRoot('this is not a routes array')]
})
export class AppRoutingModule {}
