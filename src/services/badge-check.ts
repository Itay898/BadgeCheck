export async function checkVehicleBadge({ plate }: { plate: string }) {
  const res = await fetch(`/api/check?plate=${encodeURIComponent(plate)}`);
  if (!res.ok) {
    return {
      plateNumber: plate,
      isVerified: false,
      checkedAt: new Date().toISOString(),
      errorMessage: "שגיאה בחיבור לשרת. נסה שוב.",
    };
  }
  return res.json();
}
