import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import { useEffect } from "react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.response.status === 429) {
          //jezeli bedzie error 429 to to znaczy ze jest rate limited
          setIsRateLimited(true); // i wtedy ustawiamy isRateLimited na true, przez co w return pojawi sie komponent RateLimitedUI
        } else {
          toast.error("Fail to load notes"); // to jest funkcja z react-hot-toast,
          // jezeli bedzie jakis inny error to wyswietli ta wiadomosc
        }
      } finally {
        //to znaczy, ze zawsze sie to odpali na koncu czy bedzie error czy nie
        setLoading(false); // dzieki temu jak sie uda zaladowac rzeczy to loading bedzie false
      }
    };
    fetchNotes();
  }, []); // [] oznacza ze useEffect bedzie wykonywany tylko raz
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">
            Loadings notes...
          </div>
        )}
        {/* takie cos */}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
