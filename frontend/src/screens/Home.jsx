import React from 'react'
import AddNote from '../Components/AddNote'
import AllNotes from './AllNotes'

const Home = () => {
  return (
    <div>
        <AddNote />
        <AllNotes />
    </div>
  )
}

export default Home