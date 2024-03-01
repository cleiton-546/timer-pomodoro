import { HandPalm, Play } from "phosphor-react";
import { HomeContainer,  StartCountdownButton, StopCountdownButton } from './styles'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { createContext,  useState } from "react";

import { NewCycleFrom } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";

    
const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "informe a tarefa"),
    minutesAmount: zod.number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos') 
})   

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCyclesAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]) 
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)   
    
    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCyclesAsFinished() {
        setCycles((state) =>
        state.map((cycle) => {
            if (cycle.id === activeCycleId) {
                return { ...cycle, finishDate: new Date()}
            } else {
                return cycle           
            }         
        }),            
        )        
    }


    function handleCreateNewCycle(data: NewCycleFormData) {
        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
        reset()
    }

    function handleInterruptCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date}
                } else {
                    return cycle
                }
            }),
        )
        setActiveCycleId(null)
    }

    const task = watch("task")
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCyclesAsFinished, amountSecondsPassed, setSecondsPassed }}>
                  <FormProvider {...newCycleForm}>
                    <NewCycleFrom/>
                  </FormProvider>    
                  <Countdown/>
                </CyclesContext.Provider>
                

                { activeCycle ? (
                <StopCountdownButton onClick={handleInterruptCycle} type="button">
                    <HandPalm size={24} />
                    Interromper
                </StopCountdownButton>                    
                ) : (
                <StartCountdownButton disabled={isSubmitDisabled}  type="submit">
                    <Play size={24}/>
                    Começar
                </StartCountdownButton>                    
                ) }
            </form>
        </HomeContainer>
    )
}