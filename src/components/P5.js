import React, { useState, useContext, useRef, useLayoutEffect } from "react"
import Sketch from "react-p5"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { Sampler } from "tone"
import violinA4 from "../../assets/samples/violin/A4.wav"
import organA1 from "../../assets/samples/organ/A1.wav"
import organA2 from "../../assets/samples/organ/A2.wav"
import organA3 from "../../assets/samples/organ/A3.wav"
import organA4 from "../../assets/samples/organ/A4.wav"
import organA5 from "../../assets/samples/organ/A5.wav"
import fluteA3 from "../../assets/samples/flute/A3.wav"
import fluteA4 from "../../assets/samples/flute/A4.wav"
import fluteA5 from "../../assets/samples/flute/A5.wav"
import celloA2 from "../../assets/samples/cello/A2.wav"
import celloA3 from "../../assets/samples/cello/A3.wav"
import celloA4 from "../../assets/samples/cello/A4.wav"
import { MainContext } from "./../MainContext"
import { getCharacterComponents, testKorean } from "../utils"
import { charactersDisplayerLoader } from "../utils/display"
import { soundPlayerLoader } from "../utils/sound"
import { Grid, Typography } from "@material-ui/core"

let testerCount = 10
const tester = (...log) => {
  if (testerCount > 0) {
    console.log(...log)
    testerCount--
  }
}

let fadeOut = false
let displayPrev = true
let instrumentsPlayStatus = {
  0: true,
  1: true,
  2: true
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // height: 400
      paddingTop: theme.spacing(2),
      flex: 1,
      width: "100vw"
    }
  })
)

let charCodes
let charCodesPrev

export const P5 = (props) => {
  const classes = useStyles()
  const targetRef = useRef()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (targetRef.current)
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight
      })
  }, [])

  const {
    loadingInstruments,
    setLoadingInstruments,
    verse,
    playing,
    setPlaying,
    charIndex,
    setCharIndex,
    interval,
    timeNow,
    setTimeNow,
    stop,
    stopped,
    reset,
    getNextVerse,
    frequencyMode,
    displayMode,
    instrumentsPlayMode
  } = useContext(MainContext)

  const [instruments, setInstruments] = useState(() => {
    return {
      // violin: new Sampler({
      //   urls: {
      //     A4: violinA4
      //   },
      //   attack: 0,
      //   release: 100,
      //   onload: () => {
      //     setLoadingInstruments((r) => r - 1)
      //     console.log("Violin Loaded!")
      //   }
      // }).toDestination(),
      organ: new Sampler({
        urls: {
          A1: organA1,
          A2: organA2,
          A3: organA3,
          A4: organA4,
          A5: organA5
        },
        attack: 100,
        release: 100,
        // volume: -10,
        onload: () => {
          setLoadingInstruments((r) => r - 1)
          console.log("Organ Loaded!")
        }
      }).toDestination(),
      flute: new Sampler({
        urls: {
          A3: fluteA3,
          A4: fluteA4,
          A5: fluteA5
        },
        attack: 100,
        release: 100,
        volume: -10,
        onload: () => {
          setLoadingInstruments((r) => r - 1)
          console.log("Flute Loaded!")
        }
      }).toDestination(),
      cello: new Sampler({
        urls: {
          A2: celloA2,
          A3: celloA3,
          A4: celloA4
        },
        attack: 100,
        release: 100,
        volume: -10,
        onload: () => {
          setLoadingInstruments((r) => r - 1)
          console.log("Cello Loaded!")
        }
      }).toDestination()
      // piano: new Sampler({
      //   urls: {
      //     C4: "C4.mp3",
      //     "D#4": "Ds4.mp3",
      //     "F#4": "Fs4.mp3",
      //     A4: "A4.mp3"
      //   },
      //   attack: 0,
      //   release: 100,
      //   onload: () => {
      //     setLoadingInstruments((r) => r - 1)
      //     console.log("Piano Loaded!")
      //   },
      //   baseUrl: "https://tonejs.github.io/audio/salamander/"
      // }).toDestination()
    }
  })

  const soundPlayer = (charCode, componentIndex) =>
    soundPlayerLoader(charCode, componentIndex, instruments, frequencyMode)

  const charactersDisplayer = (p5, charCodes, noAlpha) =>
    charactersDisplayerLoader({
      p5,
      charCodes,
      interval,
      timeNow,
      noAlpha,
      fadeOut,
      stopped,
      displayMode,
      soundPlayer,
      instrumentsPlayMode,
      instrumentsPlayStatus
    })

  const preload = (p5) => {}

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas().parent(canvasParentRef)
    p5.noStroke()
    // p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef)
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    // p5.createCanvas(500, 500).parent(canvasParentRef);
  }

  const draw = (p5) => {
    p5.resizeCanvas(dimensions.width, dimensions.height)
    p5.colorMode(p5.HSB)
    // p5.background(0, 0, 50)
    const gridSize = Math.min(p5.width, p5.height)
    p5.fill(0, 0, 50)
    p5.rect(
      (p5.width - gridSize) / 2,
      (p5.height - gridSize) / 2,
      gridSize,
      gridSize
    )
    if (displayPrev) charactersDisplayer(p5, charCodesPrev, true)
    charactersDisplayer(p5, charCodes)

    if (loadingInstruments === 0 && playing) {
      if (charIndex < verse.length) {
        if (timeNow <= 0) {
          setCharIndex(charIndex + 1)
          setTimeNow(interval)
          charCodesPrev = charCodes

          if (!displayPrev) displayPrev = true
          if (fadeOut) displayPrev = false
          fadeOut = false
        } else {
          if (timeNow === interval) {
            const char = verse[charIndex]
            if (testKorean(char)) {
              charCodes = getCharacterComponents(char)
              if (instrumentsPlayMode === 0) {
                charCodes.forEach((charCode, componentIndex) => {
                  soundPlayer(charCode, componentIndex)
                })
              }
            } else {
              fadeOut = true
            }
            instrumentsPlayStatus = {
              0: true,
              1: true,
              2: true
            }
          }
          setTimeNow(timeNow - 1)
        }
      } else {
        // stop()
        reset()
        getNextVerse()
      }
    }

    // NOTE: Do not use setState in the draw function or in functions that are executed
    // in the draw function...
    // please use normal variables or class properties for these purposes
  }

  return (
    <div ref={targetRef} className={classes.root}>
      <Sketch preload={preload} setup={setup} draw={draw} />
    </div>
  )
}
