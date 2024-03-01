import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import {CountdownContainer, Separator} from './styles'
import { CyclesContext } from '../..'

export function Countdown() {
    const { activeCycle, activeCycleId, markCurrentCyclesAsFinished, amountSecondsPassed, setSecondsPassed } = useContext(CyclesContext)
    
    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number

        if(activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(), 
                    activeCycle.startDate,
                    )
                
                if (secondsDifference >= totalSeconds) {
                    markCurrentCyclesAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setSecondsPassed(secondsDifference)
                }   
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId])  
 
    const currenSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 

    const minutesAmount = Math.floor(currenSeconds / 60)
    const secondsAmount = currenSeconds % 60 

    const minutes = String(minutesAmount).padStart(2, "0")
    const seconds = String(secondsAmount).padStart(2, "0")

    useEffect(() => {
        if(activeCycle) {
            document.title = `${minutes} ${seconds}`
        }
    }, [minutes, seconds, activeCycle, setSecondsPassed, markCurrentCyclesAsFinished])
    
    
    
    return(
        <CountdownContainer> 
             <span>{minutes[0]}</span>         
             <span>{minutes[1]}</span>
             <Separator>:</Separator>
             <span>{seconds[0]}</span>
             <span>{seconds[1]}</span>
        </CountdownContainer>        

          
        
    )
}