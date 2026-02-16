const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// מאפשר לפרונטנד לשלוח בקשות לשרת
app.use(cors());

// אם בעתיד תשלח POST/JSON
app.use(express.json());

const RESOURCE_ID = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";
const CKAN_ENDPOINT = "https://data.gov.il/api/3/action/datastore_search";

function normalizePlate(input) {
  const plate = String(input || "").replace(/\D/g, "");
  if (plate.length < 5 || plate.length > 8) return null;
  return plate;
}

// דף בית כדי שלא תקבל Cannot GET /
app.get("/", (req, res) => {
  res.send("השרת עובד. בדיקה: /api/check/1234567");
});

app.get("/api/check/:plate", async (req, res) => {
  const plate = normalizePlate(req.params.plate);
  if (!plate) return res.status(400).json({ ok: false, error: "מספר רכב לא תקין" });

  try {
    const { data } = await axios.get(CKAN_ENDPOINT, {
      params: {
        resource_id: RESOURCE_ID,
        q: plate,
        limit: 20,
      },
      timeout: 8000,
    });

    const records = data?.result?.records || [];

    const exact = records.find((r) =>
      Object.values(r).some((v) => String(v) === plate)
    );

    res.json({
      ok: true,
      plate,
      hasDisabledBadge: Boolean(exact),
    });
  } catch (e) {
    res.status(502).json({ ok: false, error: "שגיאה מול data.gov.il" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

  console.log("Server running: http://localhost:3000");
});
