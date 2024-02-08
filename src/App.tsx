import React, { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-notes.svg'
import { NoteCard } from './components/noteCard'
import NewNoteCard from './components/newNoteCard'

export function App() {

  interface Notes {
    id: string,
    content: string,
    date: Date,
  }
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Notes[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onCreatedNote(content: string){
    const newNote = {
      id: crypto.randomUUID(),
      content,
      date: new Date()
    }

    const notesArray = [newNote, ...notes]
    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>){
    const query = event.target.value;

    setSearch(query)
  }

  function onNoteDeleted(id: string){
    const notesArray = notes.filter(note => {
     return note.id !== id
    } ) 
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const filteredNotes = search !== '' ? notes.filter((note => note.content.toLowerCase().includes(search.toLowerCase()))) : notes


  return (
    <div className='max-w-6xl mx-auto my-12 space-y-6 px-5 xl:px-0'> 
    <img src={logo} alt="nlw expert" />
    <form className='w-full'>
    <input 
      type="text" 
      placeholder='Busque em suas notas...'
      className='w-full bg-transparent outline-none text-3xl font-semibold tracking-tight placeholder:text-slate-500'
      onChange={handleSearch}
      />
    </form>
    <div className='h-px w-full bg-slate-700'/>

    <section className='grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-6'>
      <NewNoteCard onCreatedNote={onCreatedNote} />
      {filteredNotes.map((note) => {
        return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted}/>
      })}
    </section>
    
    </div>
  )
}
