import React from "react";
import * as Dialog from '@radix-ui/react-dialog'
import {formatDistanceToNow} from 'date-fns'
import {ptBR} from 'date-fns/locale'
import {X} from 'lucide-react'

interface NoterCardProps{
  note: {
    id: string
    date: Date,
    content: string
  }
  onNoteDeleted: (id: string) => void
}

export function NoteCard({note, onNoteDeleted} : NoterCardProps){
  return (  
  <Dialog.Root>
  <Dialog.Trigger className='rounded-md bg-slate-800 flex flex-col gap-3 p-5 relative text-left outline-none overflow-hidden transition-all ease-in-out hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
    <span className='text-slate-300 font-medium text-sm'>{formatDistanceToNow(note.date ,{locale: ptBR ,addSuffix: true})}</span>
    <p className='text-slate-400 leading-6 text-sm'>
      {note.content}
    </p>
    <div className='absolute right-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none'/>
  </Dialog.Trigger>
  <Dialog.Portal>
    
    <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
    
    <Dialog.Content className="z-10 fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-700 md:max-w-[640px] w-full md:min-h-[600px] md:rounded-md outline-none flex flex-col overflow-hidden">
    <Dialog.Close className="absolute top-0 right-0 p-1.5 bg-slate-800 group">
     <X className="text-slate-500 size-5 group-hover:text-slate-100"/>
    </Dialog.Close>
    <div className="flex flex-1 flex-col gap-3 p-5">
    <span className='text-slate-300 font-medium text-sm'>{formatDistanceToNow(note.date ,{locale: ptBR ,addSuffix: true})}</span>
    <p className='text-slate-400 leading-6 text-sm'>
      {note.content}
    </p>
    </div>
    <button onClick={() => onNoteDeleted(note.id)} type="button" className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group">
      Deseja <span className="text-red-400 group-hover:underline">apagar essa nota?</span>
    </button>
    </Dialog.Content>

  </Dialog.Portal>

  </Dialog.Root>
  )
}
