'use client'

import { useEffect, useRef, useState } from 'react'

const COMMAND = 'npx kernel-pets add gutsy'
const COMMENT = '# installs a Codex pet into ~/.codex/pets'
const TYPE_SPEED = 55
const PAUSE_AFTER = 1800
const DELETE_SPEED = 30
const PAUSE_BEFORE_RESTART = 600

export function TerminalTyper() {
  const [displayed, setDisplayed] = useState('')
  const [showComment, setShowComment] = useState(false)
  const [cursor, setCursor] = useState(true)
  const phase = useRef<'typing' | 'pause' | 'deleting' | 'waiting'>('typing')
  const index = useRef(0)

  useEffect(() => {
    const cursorTimer = setInterval(() => setCursor((c) => !c), 530)
    return () => clearInterval(cursorTimer)
  }, [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    function tick() {
      if (phase.current === 'typing') {
        if (index.current < COMMAND.length) {
          index.current++
          setDisplayed(COMMAND.slice(0, index.current))
          timer = setTimeout(tick, TYPE_SPEED)
        } else {
          setShowComment(true)
          phase.current = 'pause'
          timer = setTimeout(tick, PAUSE_AFTER)
        }
      } else if (phase.current === 'pause') {
        setShowComment(false)
        phase.current = 'deleting'
        timer = setTimeout(tick, DELETE_SPEED)
      } else if (phase.current === 'deleting') {
        if (index.current > 0) {
          index.current--
          setDisplayed(COMMAND.slice(0, index.current))
          timer = setTimeout(tick, DELETE_SPEED)
        } else {
          phase.current = 'waiting'
          timer = setTimeout(tick, PAUSE_BEFORE_RESTART)
        }
      } else if (phase.current === 'waiting') {
        phase.current = 'typing'
        timer = setTimeout(tick, TYPE_SPEED)
      }
    }

    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-1 bg-muted/20 px-4 py-4 leading-5 text-muted-foreground">
      <p>
        <span className="text-foreground/50">$</span>{' '}
        <span className="text-foreground/80">npx</span>{' '}
        {displayed.slice(4)}
        <span
          className="inline-block w-[2px] h-[13px] bg-foreground/60 align-middle ml-[1px] translate-y-[-1px]"
          style={{ opacity: cursor ? 1 : 0 }}
        />
      </p>
      <p
        className="mt-2 text-foreground/35 transition-opacity duration-300"
        style={{ opacity: showComment ? 1 : 0 }}
      >
        {COMMENT}
      </p>
    </div>
  )
}
