import React, { FormEvent, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog'
import {X} from 'lucide-react'
import { toast } from "sonner";

interface newNoteCardProps {
  onCreatedNote: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export default function NewNoteCard({onCreatedNote}: newNoteCardProps){
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  function handleRecording(){
    const isSpeechRecogAPIAvailable = 'SpeechRecognition' in window ||'webkitSpeechRecognition' in window 

    if(!isSpeechRecogAPIAvailable){
      alert("Infelizmente seu navegador não suporta essa função")
      return
    }

    setIsRecording(true);
    setIsDisabled(true);
    setShouldShowOnboarding(false); 
    

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    speechRecognition = new speechRecognitionAPI;
    speechRecognition.lang = 'pt-BR';
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.maxAlternatives = 1;

    speechRecognition.onresult= (event) => {
      const transcription = Array.from(event.results).reduce((text, result) =>{
        return text.concat(result[0].transcript)
      } , '')
      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.log(event)
    }

    speechRecognition.start();
  }

  function handleStopRecording(){
    setIsRecording(false);
    setIsDisabled(false);
    speechRecognition?.stop()
  }


  function handleEditor(){
    setShouldShowOnboarding(false)
  }

  function handleContent(event: { target: { value: string; }; }){
    setContent(event.target.value)
    if(event.target.value === ''){
      setShouldShowOnboarding(true)
    }
  }

  function handleSubmit(event: FormEvent){
    event.preventDefault();

    if(content === ''){
      return
    }

    onCreatedNote(content)
    setContent('');
    setShouldShowOnboarding(true);
    toast.success('Nota criada com sucesso!')
  }

  return(
  <Dialog.Root>
    <Dialog.Trigger className='rounded-md bg-slate-700 flex flex-col text-left gap-3 p-5 outline-none transition-all ease-in-out hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
      <span className='text-slate-200 font-medium text-sm'>Adicionar nota</span>
      <p className='text-slate-400 leading-6 text-sm'>Grave uma nota em áudio que será convertida para texto automaticamente.</p>
    </Dialog.Trigger>

    <Dialog.Portal>
    
    <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
    
    <Dialog.Content className="z-10 fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 md:max-w-[640px] w-full md:min-h-[600px] md:rounded-md outline-none flex flex-col overflow-hidden">
    <Dialog.Close onClick={() =>{handleStopRecording(); setContent(''); setShouldShowOnboarding(true)}} className="absolute top-0 right-0 p-1.5 bg-slate-800 group">
     <X className="text-slate-500 size-5 group-hover:text-slate-100"/>
    </Dialog.Close>
    <form className="flex flex-1 flex-col">
    <div className="flex flex-1 flex-col gap-3 p-5">
    <span className='text-slate-300 font-medium text-sm'>Adicionar nota</span>
      {(shouldShowOnboarding ? <p className='text-slate-400 leading-6 text-sm'>
    Comece <button onClick={handleRecording} className="text-lime-400 font-medium hover:underline">gravando uma nota</button> em áudio ou se preferir <button className="text-lime-400 font-medium hover:underline" onClick={handleEditor}>utilize apenas texto</button>.
    </p> : <textarea disabled={isDisabled} className="resize-none bg-transparent text-sm leading-6 outline-none flex-1 text-slate-400" autoFocus onChange={handleContent} value={content}/>)}
    </div>
    {isRecording ? 
    <button type="button" onClick={handleStopRecording} className="flex gap-2 w-full bg-slate-800 py-4 items-center justify-center text-center text-sm font-semibold text-slate-50 outline-none hover:text-slate-200">
     <div className="bg-red-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>
     Gravando! (clique p/ interromper)
    </button> 
    : 
    <button type="button" onClick={handleSubmit} className="w-full bg-lime-400 py-4 text-center text-sm font-semibold text-lime-950 outline-none hover:bg-lime-500">
     Salvar nota
    </button>}

    </form>
    </Dialog.Content>

  </Dialog.Portal>
  </Dialog.Root>
  )
}
