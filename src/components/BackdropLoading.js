import React from "react"
import { Backdrop, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { CircularProgressWithLabel } from "./CircularProgressWithLabel"

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    display: "flex",
    flexDirection: "column"
  },
  typography: {
    padding: theme.spacing(1)
  }
}))

export const BackdropLoading = ({ open, progress }) => {
  const classes = useStyles()
  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <Typography className={classes.typography}>
          Loading instruments...
        </Typography>
        <CircularProgressWithLabel color="inherit" value={progress} />
      </Backdrop>
    </div>
  )
}
