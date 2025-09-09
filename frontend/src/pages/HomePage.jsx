import { useState } from "react"
import { useEffect } from "react"
import { toast } from "react-hot-toast"

import api from "../lib/axios"
import NavBar from "../components/NavBar"
import RateLimitedUI from "../components/RateLimitedUI"
import NoteCard from "../components/NoteCard"
import NotesNotFound from "../components/NotesNotFound"

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getNotes = async () => {
            try {
                const res = await api.get("/notes")
                setNotes(res.data)
                setIsRateLimited(false)

            } catch (error) {
                console.log("Error fetching notes.")
                console.log(error)
                
                if (error.response?.status === 429) {
                    setIsRateLimited(true)
                    toast.error("Rate limit reached.")
                } else {
                    toast.error("Failed to load notes")
                }

            } finally {
                setLoading(false)
            }
        }

        getNotes();
    }, [])

    return (
        <div className="min-h-screen">
            <NavBar />

            {isRateLimited && <RateLimitedUI />}

            {notes.length === 0 && !isRateLimited && <NotesNotFound />}

            <div className="max-w-7xl mx-auto p-4 mt-6">
                {loading && <div className="text-center text-primary py-10"> Loading notes... </div>}
                {notes.length > 0 && !isRateLimited && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} setNotes={setNotes} />
                    ))} 
                </div>
                )}
            </div>
        </div>
    )
}

export default HomePage