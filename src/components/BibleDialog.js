import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Divider from "@material-ui/core/Divider"
import Grid from "@material-ui/core/Grid"
import IconButton from "@material-ui/core/IconButton"
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { bibleIndex } from "../utils/references"
import React, { FC, Fragment } from "react"
import { useMediaQuery } from "@material-ui/core"

const useStyles = makeStyles((theme) =>
  createStyles({
    containerVertical: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    containerHorizontal: {
      display: "flex"
    },
    bold: { fontWeight: "bold" },
    itemHorizontal: {
      flex: 1,
      // TODO: Find the proper way to style
      width: "100vw"
    },
    return: {
      padding: 0
    }
  })
)

export const BibleDialog = (props) => {
  const {
    bibleRefKey,
    bibleRef,
    setBibleRef,
    open,
    setOpen,
    chapterLength,
    stop
  } = props
  const classes = useStyles()
  const theme = useTheme()
  const largeScreen = useMediaQuery(theme.breakpoints.up("sm"))

  const handleClickOpen = () => {
    setOpen({ ...open, [bibleRefKey]: true })
  }

  const handleClose = () => {
    setOpen({ ...open, [bibleRefKey]: false })
  }

  const onClickItem = (value) => (event) => {
    let updatedBibleRef = {
      ...bibleRef,
      [bibleRefKey]: value
    }

    let updatedOpen = {
      ...open,
      [bibleRefKey]: false
    }

    if (bibleRefKey === "book") {
      updatedBibleRef = {
        ...updatedBibleRef,
        chapter: null
      }
      updatedOpen = {
        ...updatedOpen,
        chapter: true
      }
    }
    if (bibleRefKey === "chapter") {
      updatedBibleRef = {
        ...updatedBibleRef,
        verse: null
      }
      updatedOpen = {
        ...updatedOpen,
        verse: true
      }
    }

    if (bibleRefKey === "verse") stop()

    setBibleRef(updatedBibleRef)
    setOpen(updatedOpen)
  }

  const buttonContent = (bibleRefKey) => {
    switch (bibleRefKey) {
      case "book":
        return bibleRef.book !== null
          ? bibleIndex[largeScreen ? "korean" : "kor"][bibleRef.book]
          : "책"
      case "chapter":
        return bibleRef.chapter !== null ? `${bibleRef.chapter + 1}장` : "장"
      case "verse":
        return bibleRef.verse !== null ? `${bibleRef.verse + 1}절` : "절"
      default:
        return null
    }
  }

  const dialogContent = (bibleRefKey) => {
    switch (bibleRefKey) {
      case "book":
        return (
          <div className={classes.containerHorizontal}>
            {["old", "new"].map((testament) => (
              <div key={testament} className={classes.itemHorizontal}>
                <Typography variant="h6" align="center">
                  {testament === "old" ? "구약" : "신약"}
                </Typography>
                <Divider />
                <div className={classes.containerVertical}>
                  {bibleIndex[
                    testament === "old" ? "indicesOld" : "indicesNew"
                  ].map((i) => (
                    <Button
                      key={i}
                      onClick={onClickItem(i)}
                      variant={bibleRef.book === i ? "outlined" : "text"}
                    >
                      {bibleIndex["korean"][i]}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )

      case "chapter":
        const chaptersArray = () => {
          let out = []
          if (bibleRef.book !== null) {
            for (let i = 0; i < bibleIndex.totalChapters[bibleRef.book]; i++) {
              out.push(i)
            }
          }
          return out
        }

        return (
          <Grid container justify="center" alignItems="center" spacing={1}>
            {chaptersArray().map((i) => (
              <Grid item key={i}>
                <Button
                  onClick={onClickItem(i)}
                  variant={bibleRef[bibleRefKey] === i ? "outlined" : "text"}
                >
                  {`${i + 1}`}
                </Button>
              </Grid>
            ))}
          </Grid>
        )
      case "verse":
        const versesArray = () => {
          let out = []
          if (bibleRef.book !== null && bibleRef.chapter !== null) {
            for (let i = 0; i < chapterLength; i++) {
              out.push(i)
            }
          }
          return out
        }

        return (
          <Grid container justify="center" alignItems="center" spacing={1}>
            {versesArray().map((i) => (
              <Grid item key={i}>
                <Button
                  onClick={onClickItem(i)}
                  variant={bibleRef[bibleRefKey] === i ? "outlined" : "text"}
                >
                  {`${i + 1}`}
                </Button>
              </Grid>
            ))}
          </Grid>
        )

      default:
        return <p>Loading {bibleRefKey}...</p>
    }
  }

  return (
    <Fragment>
      <Button size="small" onClick={handleClickOpen} color="inherit">
        <Typography className={classes.bold}>
          {buttonContent(bibleRefKey)}
        </Typography>
      </Button>

      <Dialog
        className={classes.dialog}
        open={open[bibleRefKey]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container justify="center" alignItems="center" spacing={1}>
            <Grid item>
              <IconButton
                onClick={handleClose}
                className={classes.return}
                aria-label="return"
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" align="center">
                Choose a {bibleRefKey}
              </Typography>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>{dialogContent(bibleRefKey)}</DialogContent>
      </Dialog>
    </Fragment>
  )
}
