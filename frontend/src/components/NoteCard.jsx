import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
const NoteCard = ({ note, setNotes }) => {
  const handleDelete = async (e, id) => {
    e.preventDefault(); // to zapobiegniecie przeładowania strony po kliknieciu kosza, poniewaz
    // caly ten obiekt to <Link>, wiec po kliknieciu kosza strona przenosi do detail page
    if (!window.confirm("Are you sure you want to delete this note?")) return; //to znaczy, ze jezeli
    // klikniemy na kosza to wyskoczy okno z potwierdzeniem, jezeli damy anuluj to zakanczamy funkcje
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // tutaj usuwamy z useState z HomePage
      // usuniete notatki, poza dbs musimy je tez usunac ze state
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error deleting note", error);
      toast.error("Failed to deleted note");
    }
  };
  return (
    <Link
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]"
      to={`/note/${note._id}`}
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <PenSquareIcon className="size-4" />
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)} // tutaj przypisujemy funkcje do przycisku
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
