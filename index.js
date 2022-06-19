const express = require("express");
const db = require("./db.js");

const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = 3000;

app.get("/", function (req, res) {
  res.json({ message: "L'API marche bien" });
});

// Lister les contactes
app.get("/api/contacts", (req, res) => {
  const sql = "SELECT * FROM contact";
  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "Liste des contactes", data: rows });
  });
});

// Afficher un contacte avec son ID
app.get("/api/contacts/:id", (req, res) => {
  const { id: contacteID } = req.params;
  const sql = "SELECT * FROM contact WHERE id = ?";
  const params = [contacteID];
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: `Afficher le contacte ${contacteID}`, data: row });
  });
});

// creer un nouveau contacte
app.post("/api/contacts", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Merci de remplir tous les champs!" });
    return;
  }

  const contact = { name, email, phone };
  const sql = "INSERT INTO contact (name, email, phone) VALUES (?,?,?)";
  const params = [contact.name, contact.email, contact.phone];
  db.run(sql, params, function (err, reslut) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res
      .status(201)
      .json({ message: "Contacte crée avec succes", data: contact });
  });
});

// modifier un contacte
app.put("/api/contacts/:id", (req, res) => {
  const { id: contacteID } = req.params;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ error: "Merci de remplir tous les champs!" });
    return;
  }

  const contact = { name, email, phone };
  const sql = "UPDATE contact SET name = ?, email = ?, phone = ? WHERE id = ?";
  const params = [contact.name, contact.email, contact.phone, contacteID];
  db.run(sql, params, function (err, reslut) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: `Contacte ${contacteID} modifié avec succes`,
      data: contact,
    });
  });
});

// supprimer un contacte
app.delete("/api/contacts/:id", (req, res) => {
  const { id: contacteID } = req.params;
  const sql = "DELETE FROM contact WHERE id = ?";
  db.run(sql, contacteID, function (err, resultat) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: `Contatce ${contacteID} supprimé`,
      data: this.changes,
    });
  });
});

// demarrer le serveur
app.listen(PORT, function () {
  // console.log("L'application est demarré au port: " + PORT);
  console.log(`L'application est demarré au port: ${PORT}`);
});
