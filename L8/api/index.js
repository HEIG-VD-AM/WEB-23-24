import express, { json } from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 8080;

app.use(json());
app.use(cors())

const deezerApi = axios.create({ baseURL: "https://api.deezer.com" });

app.get("/popular/playlists", async (_, res) => {
  const { data } = await deezerApi.get("/chart/0/playlists", {
    params: { limit: 50 },
  });
  if (data.error) {
    return res.status(500).json(data.error);
  }
  res.json(data.data);
});

app.get("/playlist/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = await deezerApi.get(`/playlist/${id}`, {
    params: { limit: 50 },
  });
  if (data.error) {
    return res.status(500).json(data.error);
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
