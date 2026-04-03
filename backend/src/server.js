import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

//tutaj ustawiamy cors do frontendu, jezeli jestesmy w development to fronta masz brac z localhosta,
//Bo cors jest to laczenia fronta i backendu jak maja innej porty. W prod mamy jeden port
// wiec to jest niepotrzebne
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
}

app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

//sprawdzamy czy server jest w production
if (process.env.NODE_ENV === "production") {
  //tutaj ustawiamy statyczne pliki, aby fornt byl czytany z dist, gdzie caly front jest skompresowany
  //path.join sluzy do łączenia ścieżek, musimy go importowac
  //dirname to jest aktualny katalog w ktorym wywolany jest kod, to jest po prostu skrót.
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  //Tutaj mowimy zeby kazdy req get przekierowal na index.html w dist
  app.get("*", (req, res) => {
    //res.sendFile to funckja ktora mowi zeby wyslac plik statyczne do klienta
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port:", PORT);
  });
});
