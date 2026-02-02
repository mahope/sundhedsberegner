"use client";

import { useState, useMemo } from "react";

export default function VandindtagBeregner() {
  const [vaegt, setVaegt] = useState<number>(70);
  const [aktivitet, setAktivitet] = useState<string>("moderat");
  const [klima, setKlima] = useState<string>("tempereret");

  const beregning = useMemo(() => {
    if (!vaegt) return null;

    // Basis: 30-35 ml per kg kropsvægt
    let basisMl = vaegt * 33;

    // Aktivitetsniveau justering
    const aktivitetFaktorer: Record<string, number> = {
      stillesiddende: 0.9,
      let: 1.0,
      moderat: 1.15,
      aktiv: 1.3,
      meget_aktiv: 1.5,
    };
    basisMl *= aktivitetFaktorer[aktivitet] || 1;

    // Klima justering
    const klimaFaktorer: Record<string, number> = {
      koldt: 0.95,
      tempereret: 1.0,
      varmt: 1.15,
      tropisk: 1.3,
    };
    basisMl *= klimaFaktorer[klima] || 1;

    const literPerDag = basisMl / 1000;
    const glasPerDag = Math.ceil(basisMl / 250); // 250ml per glas

    return {
      literPerDag: literPerDag.toFixed(1),
      mlPerDag: Math.round(basisMl),
      glasPerDag,
      morgen: Math.round(basisMl * 0.35 / 250), // 35% om morgenen
      formiddag: Math.round(basisMl * 0.25 / 250),
      eftermiddag: Math.round(basisMl * 0.25 / 250),
      aften: Math.round(basisMl * 0.15 / 250),
    };
  }, [vaegt, aktivitet, klima]);

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Vægt (kg)</label>
          <input
            type="number"
            min="30"
            max="200"
            value={vaegt}
            onChange={(e) => setVaegt(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Aktivitetsniveau</label>
          <select
            value={aktivitet}
            onChange={(e) => setAktivitet(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          >
            <option value="stillesiddende">Stillesiddende (kontor)</option>
            <option value="let">Let aktiv (gåture)</option>
            <option value="moderat">Moderat aktiv (motion 3x/uge)</option>
            <option value="aktiv">Aktiv (daglig motion)</option>
            <option value="meget_aktiv">Meget aktiv (hård træning)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Klima</label>
          <select
            value={klima}
            onChange={(e) => setKlima(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          >
            <option value="koldt">Koldt (under 10°C)</option>
            <option value="tempereret">Tempereret (10-25°C)</option>
            <option value="varmt">Varmt (25-35°C)</option>
            <option value="tropisk">Tropisk (over 35°C)</option>
          </select>
        </div>
      </div>

      {/* Resultater */}
      {beregning && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-blue-100 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Dagligt vandindtag</p>
              <p className="text-4xl font-bold text-blue-700">
                {beregning.literPerDag} L
              </p>
              <p className="text-sm text-gray-500">{beregning.mlPerDag} ml</p>
            </div>
            <div className="p-6 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Glas vand (250ml)</p>
              <p className="text-4xl font-bold text-blue-600">
                {beregning.glasPerDag} 🥛
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Per time (vågen)</p>
              <p className="text-4xl font-bold text-green-600">
                ~{Math.round(beregning.mlPerDag / 16)} ml
              </p>
            </div>
          </div>

          {/* Fordeling over dagen */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">🕐 Foreslået fordeling over dagen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Morgen (6-10)</p>
                <p className="text-2xl font-bold text-blue-600">{beregning.morgen} glas</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Formiddag (10-13)</p>
                <p className="text-2xl font-bold text-blue-600">{beregning.formiddag} glas</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Eftermiddag (13-18)</p>
                <p className="text-2xl font-bold text-blue-600">{beregning.eftermiddag} glas</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Aften (18-22)</p>
                <p className="text-2xl font-bold text-blue-600">{beregning.aften} glas</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">💡 Tips til at drikke nok vand</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Start dagen med et stort glas vand</li>
              <li>Hold en vandflaske ved dit skrivebord</li>
              <li>Drik et glas vand før hvert måltid</li>
              <li>Sæt påmindelser på din telefon</li>
              <li>Frugt og grøntsager bidrager også til væskeindtag</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
