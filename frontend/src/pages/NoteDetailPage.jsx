import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null); //robimy taki
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate(); // to jest do wracania do poprzedniej strony

  const { id } = useParams(); // to jest do pobierania id z url za pomoca react-router

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`); // to jest do pobierania notatki po id
        setNote(res.data); // to jest do ustawiania notatki w useState
      } catch (error) {
        toast.error("Failed to load note");
        console.log("Error fetching note", error);
      } finally {
        setLoading(false); //ustawiamy zeby nie bylo krecacego sie kolka na ekranie po zaladowaniu
      }
    };
    fetchNote(); // to jest do wywolania fetchNote
  }, [id]); //to znaczy ze useEffect odpali sie tylko po zmianie id

  const handleDelete = async () => {
    //funkcja do usuwania notatki
    if (!window.confirm("Are you sure you want to delete this note?")) return; // to pokazuje nam okno z potwierdzeniem
    //czy na pewno chcemy usunac notatke
    try {
      await api.delete(`/notes/${id}`); //jak chcemy to usuwamy notatke
      navigate("/"); // po kliknieciu kosza strona przenosi do HomePage
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error deleting note", error);
      toast.error("Failed to deleted note");
    }
  };
  const handleSafe = async () => {
    //funkcja do zapisywania notatki
    if (!note.title.trim() || !note.content.trim()) {
      // to jest do sprawdzania czy title i content nie sa puste
      toast.error("Title and content are required");
      return;
    }
    setSaving(true); // to jest do pokazywania loading na przycisku, wtedy on jest freeze i nie moze byc klikniety
    try {
      await api.put(`/notes/${id}`, note); //note to jest object ktorym chcemy nadpisac
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error updating note", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false); // anulujemy loading
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })} // to jest do ustawiania title
                  // poprzez useEffect bierzemy dostep do notatki z api i tutaj rozdrabniamy ja i zmieniamy title na
                  // to co jest w input w formularzu
                />
              </div>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={
                    (e) => setNote({ ...note, content: e.target.value }) // tutaj analogiczna sytuacja
                  }
                />
              </div>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSafe} //tutaj wywolujemy handleSafe i zapisuje sie notatka
                >
                  {/* jezeli jest Saving to pokazuje sie Saving a jezeli nie ma to save note, to jest napis przycisku  */}
                  {saving ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
