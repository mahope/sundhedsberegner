"use client";

import { useState, useMemo } from "react";

interface Drik {
  navn: string;
  kaffein: number;
  emoji: string;
}

const drikkeValg: Drik[] = [
  { navn: "Kop kaffe (150ml)", kaffein: 95, emoji: "☕" },
  { navn: "Espresso (30ml)", kaffein: 63, emoji: "☕" },
  { navn: "Dobbelt espresso", kaffein: 126, emoji: "☕" },
  { navn: "Latte/Cappuccino", kaffein: 63, emoji: "☕" },
  { navn: "Sort te (250ml)", kaffein: 47, emoji: "🍵" },
  { navn: "Grøn te (250ml)", kaffein: 28, emoji: "🍵" },
  { navn: "Cola (330ml)", kaffein: 32, emoji: "🥤" },
  { navn: "Energidrik (250ml)", kaffein: 80, emoji: "⚡" },
  { navn: "Red Bull (250ml)", kaffein: 80, emoji: "⚡" },
  { navn: "Monster (500ml)", kaffein: 160, emoji: "⚡" },
  { navn: "Mørk chokolade (50g)", kaffein: 25, emoji: "🍫" },
];

export default function KaffeinBeregner() {
  const [valgtDrik, setValgtDrik] = useState<string>("Kop kaffe (150ml)");
  const [antal, setAntal] = useState<number>(1);
  const [tidspunkt, setTidspunkt] = useState<string>("08:00");
  const [vaegt, setVaegt] = useState<number>(70);

  const beregning = useMemo(() => {
    const drik = drikkeValg.find((d) => d.navn === valgtDrik);
    if (!drik || !antal) return null;

    const totalKaffein = drik.kaffein * antal;
    
    // Kaffein halveringstid er ca. 5-6 timer for de fleste voksne
    const halveringstid = 5.5; // timer
    
    const [indtagelsesTime, indtagelsesMin] = tidspunkt.split(":").map(Number);
    const indtagelsesMinutter = indtagelsesTime * 60 + indtagelsesMin;

    // Beregn kaffein-niveau over tid (op til 24 timer)
    const tidspunkter = [];
    for (let timer = 0; timer <= 16; timer += 2) {
      const minutter = indtagelsesMinutter + timer * 60;
      let klokkeslaetMinutter = minutter % (24 * 60);
      
      const t = Math.floor(klokkeslaetMinutter / 60);
      const m = klokkeslaetMinutter % 60;
      
      // Eksponentiel nedbrydning
      const restKaffein = totalKaffein * Math.pow(0.5, timer / halveringstid);
      
      tidspunkter.push({
        tid: `${t.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
        timer,
        kaffein: Math.round(restKaffein),
        procent: Math.round((restKaffein / totalKaffein) * 100),
      });
    }

    // Find hvornår kaffein er under 50mg (kan sove)
    const timerTilSoevn = Math.log(50 / totalKaffein) / Math.log(0.5) * halveringstid;
    const soevnMinutter = indtagelsesMinutter + Math.max(0, timerTilSoevn) * 60;
    let soevnKlokkeslaet = Math.floor(soevnMinutter % (24 * 60));
    const soevnTime = Math.floor(soevnKlokkeslaet / 60);
    const soevnMin = soevnKlokkeslaet % 60;

    // Daglig anbefalet maks (400mg for voksne)
    const maksAnbefalet = 400;
    const procentAfMaks = Math.round((totalKaffein / maksAnbefalet) * 100);

    return {
      totalKaffein,
      drik,
      tidspunkter,
      kanSoveKl: totalKaffein <= 50 
        ? tidspunkt 
        : `${soevnTime.toString().padStart(2, "0")}:${soevnMin.toString().padStart(2, "0")}`,
      timerTilSoevn: Math.max(0, timerTilSoevn).toFixed(1),
      procentAfMaks,
      overMaks: totalKaffein > maksAnbefalet,
    };
  }, [valgtDrik, antal, tidspunkt, vaegt]);

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Drik</label>
          <select
            value={valgtDrik}
            onChange={(e) => setValgtDrik(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          >
            {drikkeValg.map((d) => (
              <option key={d.navn} value={d.navn}>
                {d.emoji} {d.navn} ({d.kaffein}mg)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Antal</label>
          <input
            type="number"
            min="1"
            max="20"
            value={antal}
            onChange={(e) => setAntal(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tidspunkt for indtagelse</label>
          <input
            type="time"
            value={tidspunkt}
            onChange={(e) => setTidspunkt(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Din vægt (kg)</label>
          <input
            type="number"
            min="30"
            max="200"
            value={vaegt}
            onChange={(e) => setVaegt(parseFloat(e.target.value) || 70)}
            className="w-full px-4 py-3 border rounded-lg"
          />
        </div>
      </div>

      {/* Resultater */}
      {beregning && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 bg-amber-100 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Total kaffein</p>
              <p className="text-3xl font-bold text-amber-700">
                {beregning.totalKaffein} mg
              </p>
              <p className="text-sm text-gray-500">
                {beregning.drik.emoji} {antal}x {beregning.drik.navn.split(" (")[0]}
              </p>
            </div>
            
            <div className={`p-6 rounded-xl text-center ${
              beregning.overMaks ? "bg-red-100" : "bg-green-100"
            }`}>
              <p className="text-sm text-gray-600 mb-1">Af daglig maks (400mg)</p>
              <p className={`text-3xl font-bold ${
                beregning.overMaks ? "text-red-700" : "text-green-700"
              }`}>
                {beregning.procentAfMaks}%
              </p>
              {beregning.overMaks && (
                <p className="text-xs text-red-600">⚠️ Over anbefalet</p>
              )}
            </div>

            <div className="p-6 bg-purple-100 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Kan sove fra kl.</p>
              <p className="text-3xl font-bold text-purple-700">
                {beregning.kanSoveKl}
              </p>
              <p className="text-xs text-gray-500">Under 50mg kaffein</p>
            </div>

            <div className="p-6 bg-blue-100 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Timer til søvn</p>
              <p className="text-3xl font-bold text-blue-700">
                {beregning.timerTilSoevn}
              </p>
              <p className="text-xs text-gray-500">Halveringstid: 5.5 timer</p>
            </div>
          </div>

          {/* Nedbrydning over tid */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">📉 Kaffein-nedbrydning over tid</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Tid</th>
                    <th className="py-2 text-left">Timer efter</th>
                    <th className="py-2 text-left">Kaffein</th>
                    <th className="py-2 text-left">Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  {beregning.tidspunkter.map((t) => (
                    <tr key={t.timer} className="border-b">
                      <td className="py-2 font-medium">{t.tid}</td>
                      <td className="py-2 text-gray-500">+{t.timer} timer</td>
                      <td className="py-2">{t.kaffein} mg</td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                t.kaffein > 100
                                  ? "bg-amber-500"
                                  : t.kaffein > 50
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                              }`}
                              style={{ width: `${t.procent}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{t.procent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg">
              <h3 className="font-medium mb-2">☕ Kaffein-fakta</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Halveringstid: 5-6 timer (varierer individuelt)</li>
                <li>Maks anbefalet: 400mg/dag for voksne</li>
                <li>Gravide: max 200mg/dag</li>
                <li>Kaffein optages på 15-45 minutter</li>
                <li>Effekten varer typisk 4-6 timer</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium mb-2">😴 For god søvn</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Undgå kaffein 6 timer før sengetid</li>
                <li>Morgenkaffe har mindst påvirkning på søvn</li>
                <li>Eftermiddagskaffe kan forstyrre søvnkvaliteten</li>
                <li>Afkoffeineret kaffe har stadig ~3mg kaffein</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
