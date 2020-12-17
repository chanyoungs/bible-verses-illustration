import React, { useEffect, useState } from "react"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { P5 } from "./P5.js"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import PauseIcon from "@material-ui/icons/Pause"
import { IconButton, Grid, Typography, TextField } from "@material-ui/core"
import { MainContext } from "./MainContext"
import NKRV from "../assets/bibles/nkrv"
import { BackdropLoading } from "./BackdropLoading.js"

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh"
    },
    display: {
      width: 300,
      height: 500,
      background: "#808080"
    },
    verse: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    typography: {
      fontWeight: "bold"
    },
    black: {
      color: "#000000"
    },
    white: {
      color: "#FFFFFF"
    }
  })
)

export const App = () => {
  const classes = useStyles()
  const [verseIndex, setVerseIndex] = useState(0)
  const [chapterIndex, setChapterIndex] = useState(0)
  const [bookIndex, setBookIndex] = useState(0)
  const [verse, setVerse] = useState(NKRV["0001"].verses[0])
  const [charIndex, setCharIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [stopped, setStopped] = useState(true)
  const [loadingInstruments, setLoadingInstruments] = useState(3)
  const interval = 60
  const [timeNow, setTimeNow] = useState(interval)

  useEffect(() => {
    setVerse(NKRV["0001"].verses[verseIndex])
  }, [verseIndex])
  const reset = () => {
    setCharIndex(0)
    setTimeNow(interval)
  }
  const stop = () => {
    setStopped(true)
    setPlaying(false)
    reset()
  }

  return (
    <MainContext.Provider
      value={{
        setVerseIndex,
        verse,
        setVerse,
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
        <Grid container className={classes.display}>
          <Grid item xs={12}>
            <P5 />
            {/* <TextField
          multiline
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
        /> */}
          </Grid>
          <Grid item xs={12} className={classes.verse}>
            {verse.split("").map((letter, index) => (
              <Typography
                display="inline"
                variant="h6"
                className={`${classes.typography} ${
                  classes[index <= charIndex && !stopped ? "white" : "black"]
                }`}
                key={index}
              >
                {letter}
              </Typography>
            ))}
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item>
            <IconButton
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
            <IconButton onClick={stop} disabled={loadingInstruments > 0}>
              <StopIcon />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </MainContext.Provider>
  )
}
