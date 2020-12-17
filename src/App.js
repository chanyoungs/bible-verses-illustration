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
        reset
      }}
    >
      <div className={classes.root}>
        <BackdropLoading
          open={loadingInstruments > 0}
          progress={100 * (1 - loadingInstruments / 3)}
        />
        <P5 />
        {/* <TextField
          multiline
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
        /> */}
        <Grid container justify="center">
          <Grid item>
            <IconButton
              onClick={() => {
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
