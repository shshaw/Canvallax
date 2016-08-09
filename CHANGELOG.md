## [2.0.0] - 2016-02-XX

- Massive cleanups and rewrites for performance and unified codebases.
  - Double check the documentation to see new option names & methods.
  - The global `Canvallax` variable is now `canvallax`.
  - `canvallax()` has become `canvallax.Scene()` for clarity.
  - `distance` property is now just `z`.
  - Trackers are now classes that can control scenes, groups and elements with offsets & easing! Set the `tracker` property of Canvallax pieces to a `canvallax.TrackPointer()` or `canvallax.TrackScroll()` instance.
  - `canvallax.Ellipse` replaces `canvallax.Circle` and uses `width` & `height` instead of `radius` for creating oblong shapes.
  - `canvallax.Polygon` also uses `width` & `height` and supports custom shapes using an array as the `points` value. Custom shapes can be closed by setting the last point in the array as `'close'`.
- `canvallax.Group()` for keeping elements together.
  - Element positions & transforms will be relative to Group's position.
- `clip` property utilizing Canvallax Elements or custom functions.
- Built in animation engine!
  - All Canvallax items have `.to(duration,properties,options)`, `.from(duration,fromProperties,options)` and `.fromTo(duration,fromProperties,toProperties,options)` animation functions.
  - Animate any object's properties with `canvallax.Animate(duration,properties,options)`.
- Migrated to gulp for a simplified build process.
  - Custom builds by excluding modules `gulp --exclude=animate,elements,trackers`.
  - Builds to `dev` folder by default (ignored by git), use `gulp --dist` to create a public build.


## [1.2.0] - 2016-11-15

- Support for pointer & scroll tracking.


## [1.1.1] - 2015-11-12

- Support for rotation & scale
- `transformOrigin` property


## [1.0.0] - 2015-11-09

- Initial  release
