const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

// מאפשר גישה לקבצי frontend (index.html, css, js וכו')
app.use(express.static(path.join(__dirname)));

// מאפשר בקשות מהדפדפן
app.use(cors());

// תמיכה ב-JSON אם תצטרך בעתיד
app.use(express.json());

// פרטי מאגר data.gov.il
const RESOURCE_ID = "c8b9f9c8-4612-4068-934f-d4acd2e3c06e";
const CKAN_ENDPOINT = "https://data.gov.il/api/3/action/datastore_search";

// פונקציה לניקוי מספר רכב
function normalizePlate(input) {
  const plate = String(input || "").replace(/\D/g, "");
  if (plate.length < 5 || plate.length > 8) return null;
  return plate;
}

// API לבדיקה
app.get("/api/check/:plate", async (req, res) => {
  const plate = normalizePlate(req.params.plate);

  if (!plate) {
    return res.status(400).json({
      ok: false,
      error: "מספר רכב לא תקין"
    });
  }

  try {
    const { data } = await axios.get(CKAN_ENDPOINT, {
      params: {
        resource_id: RESOURCE_ID,
        q: plate,
        limit: 20
      },
      timeout: 8000
    });

    const records = data?.result?.records || [];

    const exact = records.find((record) =>
      Object.values(record).some((value) => String(value) === plate)
    );

    res.json({
      ok: true,
      plate,
      hasDisabledBadge: Boolean(exact)
    });

  } catch (error) {
    console.error("Data.gov.il error:", error.message);

    res.status(502).json({
      ok: false,
      error: "שגיאה מול מאגר משרד התחבורה"
    });
  }
});

// Render דורש שימוש ב-PORT מהסביבה
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
