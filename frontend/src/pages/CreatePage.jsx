import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

const CreatePage = () => {
  const [title, setTitle] = useState(""); //state dla tytulu
  const [content, setContent] = useState(""); //state dla opisu notatki
  const [loading, setLoading] = useState(false); //state dla loading

  const navigate = useNavigate(); //dzieki temu przekierowuje nas na inna strone,
  // w tym przypadku na strone z notatkami po utworzeniu nowej notatki

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      //trimujemy, zeby nie bylo pustych spacji
      toast.error("Title and content are required"); // jezeli nie ma tytulu i opisu to wyswietli ta wiadomosc
      return;
    }
    setLoading(true); //wtedy loading bedzie wyswietlany na ekranie jako loading...
    try {
      await api.post("/notes", { title, content }); //tutaj dodajemy nowa notatke
      // normalnie powinno byc axios.post i caly link do backendu, ale zrobilismy funckje w lib/axios
      // zeby ograniczyc ilosc kodu w komponentach
      toast.success("Note created successfully"); // po utworzeniu notatki wyswietli ta wiadomosc
      navigate("/"); // i przekierowuje nas na strone z notatkami
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're reating notes too fast!", {
          duration: 4000, //tutaj ustawiamy czas trwania toastu w milisekundach
          icon: "⏳", //tutaj ustawiamy ikone
        });
      } else {
        toast.error("Failed to create note"); // tutaj pokaze sie kumunikat, jezeli jakikolwiek inny
        // error sie pokaze
      }
    } finally {
      setLoading(false); //to znaczy, ze zawsze sie to odpali na koncu czy bedzie error czy nie
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeft className="size-5" />
            <span>Back to Notes</span>
          </Link>
          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} //dzieki temu mozemy zmieniac wartosc title
                    // w zaleznosci od wpisywanych danych. bez tego nic nie daloby rady sie wpisac w tym input
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
