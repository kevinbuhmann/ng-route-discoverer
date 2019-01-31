declare const NgModule: any;
declare const RouterModule: any;
declare const SomeComponent: any;

const errorRoutes = [
  {
    path: 'not-found',
    component: SomeComponent
  },
  {
    path: 'internal-server-error',
    component: SomeComponent
  }
];

const routes = [
  {
    path: 'errors',
    children: [...errorRoutes]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
