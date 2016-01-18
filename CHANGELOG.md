### v1.0.7

* provide a way to access to the DecoratedComponent instance (d64b703)
* copy correct displayName from decorated component (7e87b60)
* fixes an issue where props where incorrect on DecoratedComponent on initialization (fe5c762)

## v1.0.6

* use [react-pure-render](https://github.com/gaearon/react-pure-render) for performance issues

## v1.0.5 (5 nov 2015)

* revert custom `takeSnapshot` (fix #3)

## v1.0.4 (5 nov 2015)

* filter properties to copy (fix #2)
* use custom `takeSnapshot`

## v1.0.3 (5 nov 2015)

* Rollback to babel 5.0, fix support for IE9

## v1.0.2 (4 nov 2015)

* Copy static methods from original component to decorated one (fix #1)
* Add simple tests
* Add `CHANGELOG.md`

## v1.0.1 (4 nov 2015)

* Add documentation about providing `flux` through `context` with `AltContainer`

## v1.0.0 (3 nov 2015)

* First release
