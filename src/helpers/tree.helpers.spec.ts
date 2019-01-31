import { RouteTree } from './../ng-route-discoverer';
import { getPaths } from './tree.helpers';

describe('tree helpers', () => {
  describe('getPaths', () => {
    it('should work with a basic path', () => {
      const routes: RouteTree[] = [
        {
          path: 'help'
        }
      ];

      expect(getPaths(routes)).toEqual(['/help']);
    });

    it('should work with two top-level paths', () => {
      const routes: RouteTree[] = [
        {
          path: 'help'
        },
        {
          path: 'about'
        }
      ];

      expect(getPaths(routes)).toEqual(['/help', '/about']);
    });

    it('should work with nested paths', () => {
      const routes: RouteTree[] = [
        {
          path: 'help',
          children: [
            {
              path: 'getting-started'
            }
          ]
        }
      ];

      expect(getPaths(routes)).toEqual(['/help/getting-started']);
    });

    it('should work with deeply nested paths', () => {
      const routes: RouteTree[] = [
        {
          path: 'help',
          children: [
            {
              path: 'getting-started',
              children: [
                {
                  path: 'step-one'
                }
              ]
            }
          ]
        }
      ];

      expect(getPaths(routes)).toEqual(['/help/getting-started/step-one']);
    });

    it('should terminate a path with an empty path route', () => {
      const routes: RouteTree[] = [
        {
          path: 'help',
          children: [
            {
              path: ''
            },
            {
              path: 'getting-started'
            }
          ]
        }
      ];

      expect(getPaths(routes)).toEqual(['/help', '/help/getting-started']);
    });
  });
});
