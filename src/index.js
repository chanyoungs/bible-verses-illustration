import React from "react"
import ReactDOM from "react-dom"
import { createMuiTheme } from "@material-ui/core"
import { CssBaseline } from "@material-ui/core"
import { MuiThemeProvider } from "@material-ui/core"
// import "./index.css";

import { App } from "./components/App"
import { removeWatermark } from "./utils"

setTimeout(removeWatermark, 1000)

const rootElement = document.getElementById("root")
ReactDOM.render(
  <MuiThemeProvider theme={createMuiTheme()}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  rootElement
)
