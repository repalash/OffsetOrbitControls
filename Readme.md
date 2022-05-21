# OffsetOrbitControls
Small extension to OrbitControls to allow for offsetting the target position on screen. 
This is useful for zooming and rotating around an arbitrary point on the screen to create.
It also allows for panning around without changing the target position.

Live Demo: [https://repalash.com/OffsetOrbitControls/](https://repalash.com/OffsetOrbitControls/)  

To use replace `OrbitControls` with `OffsetOrbitControls` and call `controls.update()` in the render loop. see `index.html`

To reset the target or to set the offset on the screen, set `controls.targetOffset.set(x, y, 0)` in screen space NDC.

To fix the target offset on screen, disable panning by doing `controls.enablePan = false` 
