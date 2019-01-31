declare const NgModule: any;
declare const RouterModule: any;
declare const SomeComponent: any;

const routes = [
  {
    path: 'errors',
    children: [
      ...[
        {
          path: 'not-found',
          component: SomeComponent
        },
        {
          path: 'internal-server-error',
          component: SomeComponent
        }
      ]
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
