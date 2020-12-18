import React, { useEffect, useState } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { P5 } from "./P5.js"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import PauseIcon from "@material-ui/icons/Pause"
import {
  IconButton,
  Grid,
  Typography,
  TextField,
  AppBar,
  Toolbar,
  BottomNavigation,
  BottomNavigationAction,
  ButtonGroup
} from "@material-ui/core"
import { MainContext } from "../MainContext"
import NKRV from "../../assets/bibles/nkrv"
import { BackdropLoading } from "./BackdropLoading.js"
import { BibleDialog } from "./BibleDialog.js"
import { bibleIndex } from "../utils/references.js"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: "center",
      minHeight: "100vh"
      // minWidth: "100vh",
    },
    display: {
      // width: 300,
      // height: 500
      width: "100vw",
      flex: 1
    },
    verse: {
      flex: 1,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    typography: {
      fontWeight: "bold"
    },
    black: {
      color: "#000000"
    },
    primary: {
      color: theme.palette.primary.main
    },
    bottomNavigation: {
      // position: "fixed",
      top: "auto",
      bottom: 0,
      width: "100vw"
      // background: theme.palette.primary.main
    }
  })
)

export const App = () => {
  const classes = useStyles()
  const [bibleRef, setBibleRef] = useState({
    book: 0,
    chapter: 0,
    verse: 0
  })
  const [verse, setVerse] = useState("")
  const [charIndex, setCharIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [stopped, setStopped] = useState(true)
  const [loadingInstruments, setLoadingInstruments] = useState(3)
  const interval = 30
  const [timeNow, setTimeNow] = useState(interval)
  const [openBibleDialog, setOpenBibleDialog] = useState({
    book: false,
    chapter: false,
    verse: false
  })

  const reset = () => {
    setCharIndex(0)
  }
  const stop = () => {
    setStopped(true)
    setPlaying(false)
    reset()
    setTimeNow(interval)
  }

  const getChapterKey = () =>
    `${String(
      bibleIndex.cumulativeChapters[bibleRef.book] + bibleRef.chapter + 1
    ).padStart(4, "0")}`

  useEffect(() => {
    if (
      bibleRef.book !== null &&
      bibleRef.chapter !== null &&
      bibleRef.verse !== null
    ) {
      setVerse(NKRV[getChapterKey()].verses[bibleRef.verse])
    }
  }, [bibleRef.book, bibleRef.chapter, bibleRef.verse])

  // const getVerse = () => {
  //   const cumulativeChapter = `${String(
  //     bibleIndex.cumulativeChapters[bibleRef.book] + bibleRef.chapter
  //   ).padStart(4, "0")}`
  //   return NKRV[cumulativeChapter].verses[bibleRef.verse - 1]
  // }

  const getNextVerse = () => {
    if (
      bibleRef.book !== null &&
      bibleRef.chapter !== null &&
      bibleRef.verse !== null
    ) {
      let bibleRefNew = { ...bibleRef, verse: bibleRef.verse + 1 }

      if (bibleRef.verse === NKRV[getChapterKey()].verses.length - 1) {
        bibleRefNew.verse = 0
        if (bibleRef.chapter === bibleIndex.totalChapters[bibleRef.book] - 1) {
          bibleRefNew.book =
            bibleRef.book === bibleIndex.totalChapters.length - 1
              ? 0
              : bibleRef.book + 1
          bibleRefNew.chapter = 0
        } else {
          bibleRefNew.chapter += 1
        }
      }
      setBibleRef(bibleRefNew)
    }
  }

  return (
    <MainContext.Provider
      value={{
        getNextVerse,
        verse,
        charIndex,
        setCharIndex,
        playing,
        setPlaying,
        loadingInstruments,
        setLoadingInstruments,
        interval,
        timeNow,
        setTimeNow,
        stop,
        stopped,
        reset
      }}
    >
      <div className={classes.root}>
        <BackdropLoading
          open={loadingInstruments > 0}
          progress={100 * (1 - loadingInstruments / 3)}
        />
        <P5 />
        <div className={classes.verse}>
          {verse.split("").map((letter, index) => (
            <Typography
              display="inline"
              variant="h6"
              className={`${classes.typography} ${
                classes[index <= charIndex && !stopped ? "black" : "primary"]
              }`}
              key={index}
            >
              {letter}
            </Typography>
          ))}
        </div>
        <AppBar position="sticky" className={classes.bottomNavigation}>
          <Toolbar>
            <Grid container justify="center" alignItems="center">
              <Grid item>
                <ButtonGroup fullWidth className={classes.buttonGroup}>
                  {["book", "chapter", "verse"].map(
                    (bibleRefKey) =>
                      (bibleRefKey !== "chapter" || bibleRef.book !== null) && (
                        <BibleDialog
                          key={bibleRefKey}
                          bibleRefKey={bibleRefKey}
                          bibleRef={bibleRef}
                          chapterLength={NKRV[getChapterKey()].verses.length}
                          setBibleRef={setBibleRef}
                          open={openBibleDialog}
                          setOpen={setOpenBibleDialog}
                          stop={stop}
                        />
                      )
                  )}
                </ButtonGroup>
              </Grid>
              <Grid item>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (!playing) setStopped(false)
                    setPlaying(!playing)
                  }}
                  disabled={loadingInstruments > 0}
                >
                  {playing ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  color="inherit"
                  onClick={stop}
                  disabled={loadingInstruments > 0}
                >
                  <StopIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    </MainContext.Provider>
  )
}
