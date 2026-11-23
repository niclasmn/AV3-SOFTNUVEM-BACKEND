const express = require("express");
const supabaseClient = require("@supabase/supabase-js");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const SUPABASE_URL =
  process.env.SUPABASE_URL || "https://vatrxvjenlugqllusmey.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_KEY || "sb_publishable_A_GOP6uHdcL1yPnN8Hcldg_wcEGsB4B";

const supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);

app.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

app.get("/products/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", req.params.id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json(data);
});

app.post("/products", async (req, res) => {
  const { name, description, price } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert({ name, description, price })
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(201).json({ message: "created!!", data });
});

app.put("/products/:id", async (req, res) => {
  const { name, description, price } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({ name, description, price })
    .eq("id", req.params.id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).json({ message: "updated!!", data });
});

app.delete("/products/:id", async (req, res) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", req.params.id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  return res.status(200).send("deleted!!");
});

app.get("/", (req, res) => {
  res.send("Hello I am working my friend Supabase <3");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`> Ready on http://0.0.0.0:${PORT}`);
});
