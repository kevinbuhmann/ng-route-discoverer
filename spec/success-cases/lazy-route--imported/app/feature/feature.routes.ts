export const featureRoutes = [
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
