import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { renderRoutes } from 'react-router-config'

import Routes from '../client/Routes'

export default (req, store) => {
  // Context object contains the results of the render.
  const context = {}

  // JSX is given to renderToString to be passed as content to
  // fill the html template for initial SSR HTML. renderRoutes
  // takes the Routes array and returns the specified component.
  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} context={context}>
        {renderRoutes(Routes)}
      </StaticRouter>
    </Provider>
  )

  // Preserving server store/state by adding JSON data to the window.
  return `
    <html>
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
      </head>
      <body>
        <div id="root">${content}</div>
        <script>
          window.INITIAL_STATE = ${JSON.stringify(store.getState())}
        </script>
        <script src="bundle.js"></script>
      </body>
    </html>
  `
}
