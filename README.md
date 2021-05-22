# aframe-web-portals

An [aframe](https://github.com/aframevr/aframe) component for creating portals to other websites.

## Usage

To create a portal, add the **web-portal** component.

```html
<a-entity web-portal="url:https://example.com; text:Portal to Example.com;"></a-entity>
```

### Properties

| Property           | Description                                                     | Default             |
| ------------------ | --------------------------------------------------------------- | ------------------- |
| url                | the url of the target web page                                  | "https://aframe.io" |
| player             | a css selector to the player, for collision detection           | "#player"           |
| text               | text to display above the portal                                | ""                  |
| width              | width of the portal                                             | 1.5                 |
| height             | height of the portal                                            | 2.4                 |
|                    |                                                                 |                     |
| frameWidth         | width of the portal frame                                       | 0.15                |
| enableFrame        | enables a visual frame around the portal                        | true                |
| enableWebsurface   | enables a websurface display of the target site                 | true                |
| enableReturnButton | enables a button overlay upon portal entry for leaving the site | true                |

## Additional Info

The component currently uses AABB collision detection. While web-portals still work when rotated at non axis aligned angles (ie. `rotation="0 30 0"`), the best results will be seen when the portals are aligned with a cardinal direction (ie. `rotation="0 90 0`)
