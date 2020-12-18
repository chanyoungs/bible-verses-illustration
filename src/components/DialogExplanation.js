import React from "react"
import {
  AppBar,
  Backdrop,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import explanation from "../../assets/explanation.jpg"
import CloseIcon from "@material-ui/icons/Close"

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  image: {
    maxWidth: "90vw"
  }
}))

export const DialogExplanation = ({ open, handleClose }) => {
  const classes = useStyles()
  return (
    <div>
      <Dialog fullScreen open={open}>
        <AppBar position="sticky" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              저자의 설명글
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <img src={explanation} alt="Explanation" className={classes.image} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
