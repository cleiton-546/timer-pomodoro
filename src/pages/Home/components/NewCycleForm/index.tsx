import { useContext } from 'react'
import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { useFormContext } from 'react-hook-form'


export function NewCycleFrom () {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()
    
    
    return(
         <FormContainer>
           <label >Vou trabalhar em </label> 
           
            <TaskInput
            id="task" 
            list="task-suggestions"
            placeholder="Dê um nome para seu projeto"
            disabled={!!activeCycle}      
            {...register('task')}     
             />             
             <datalist id="task-suggestions">
                <option value=""/>
             </datalist>   
             <label htmlFor="minutesAmounts">Durante</label>
             <MinutesAmountInput
             type="number" 
             id="minutesAmount"
             disabled={!!activeCycle}
             step={5} 
             min={5}
             max={60}
             placeholder="00" 
             {...register('minutesAmount', { valueAsNumber: true })}
             />
                    <span>minutos.</span>
        </FormContainer>                  
    )

}