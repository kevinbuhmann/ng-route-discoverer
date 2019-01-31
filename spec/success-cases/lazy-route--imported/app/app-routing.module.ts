import { featureRoutes } from './feature/feature.routes';

declare const NgModule: any;
declare const RouterModule: any;

const routes = [...featureRoutes];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
