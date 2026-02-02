"use client";

import { useState, useMemo } from "react";

export default function SoevnbehovBeregner() {
  const [alder, setAlder] = useState<number>(30);
  const [aktivitet, setAktivitet] = useState<string>("moderat");
  const [opvaagningstid, setOpvaagningstid] = useState<string>("07:00");

  const beregning = useMemo(() => {
    if (!alder) return null;

    // Søvnbehov baseret på alder (National Sleep Foundation guidelines)
    let basisTimer: number;
    let minTimer: number;
    let maxTimer: number;

    if (alder < 1) {
      basisTimer = 15; minTimer = 12; maxTimer = 17;
    } else if (alder < 3) {
      basisTimer = 13; minTimer = 11; maxTimer = 14;
    } else if (alder < 6) {
      basisTimer = 11.5; minTimer = 10; maxTimer = 13;
    } else if (alder < 14) {
      basisTimer = 10; minTimer = 9; maxTimer = 11;
    } else if (alder < 18) {
      basisTimer = 9; minTimer = 8; maxTimer = 10;
    } else if (alder < 26) {
      basisTimer = 8; minTimer = 7; maxTimer = 9;
    } else if (alder < 65) {
      basisTimer = 7.5; minTimer = 7; maxTimer = 9;
    } else {
      basisTimer = 7; minTimer = 7; maxTimer = 8;
    }

    // Juster for aktivitetsniveau
    const aktivitetJustering: Record<string, number> = {
      stillesiddende: -0.25,
      let: 0,
      moderat: 0.25,
      aktiv: 0.5,
      meget_aktiv: 0.75,
    };
    basisTimer += aktivitetJustering[aktivitet] || 0;

    // Beregn sengetider for 4-6 søvncyklusser (90 min hver)
    const [opvaagningsTime, opvaagningsMin] = opvaagningstid.split(":").map(Number);
    const opvaagningMinutter = opvaagningsTime * 60 + opvaagningsMin;

    const sengetider = [];
    for (let cyklusser = 4; cyklusser <= 6; cyklusser++) {
      const soevnMinutter = cyklusser * 90;
      const indsoevningsTid = 15; // 15 min til at falde i søvn
      const sengetidMinutter = opvaagningMinutter - soevnMinutter - indsoevningsTid;
      
      let sengetidJusteret = sengetidMinutter;
      if (sengetidJusteret < 0) sengetidJusteret += 24 * 60;
      
      const timer = Math.floor(sengetidJusteret / 60);
      const minutter = sengetidJusteret % 60;
      
      sengetider.push({
        cyklusser,
        soevnTimer: soevnMinutter / 60,
        tid: `${timer.toString().padStart(2, "0")}:${minutter.toString().padStart(2, "0")}`,
        anbefalet: cyklusser === 5,
      });
    }

    return {
      basisTimer: basisTimer.toFixed(1),
      minTimer: minTimer.toFixed(1),
      maxTimer: maxTimer.toFixed(1),
      sengetider,
      aldersgruppe: getAldersgruppe(alder),
    };
  }, [alder, aktivitet, opvaagningstid]);

  function getAldersgruppe(alder: number): string {
    if (alder < 1) return "Spædbarn";
    if (alder < 3) return "Småbarn";
    if (alder < 6) return "Førskolebarn";
    if (alder < 14) return "Skolebarn";
    if (alder < 18) return "Teenager";
    if (alder < 26) return "Ung voksen";
    if (alder < 65) return "Voksen";
    return "Senior";
  }

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Alder (år)</label>
          <input
            type="number"
            min="0"
            max="120"
            value={alder}
            onChange={(e) => setAlder(parseInt(e.target.value) || 0)}
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
            <option value="stillesiddende">Stillesiddende</option>
            <option value="let">Let aktiv</option>
            <option value="moderat">Moderat aktiv</option>
            <option value="aktiv">Meget aktiv</option>
            <option value="meget_aktiv">Ekstremt aktiv</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Ønsket opvågningstid</label>
          <input
            type="time"
            value={opvaagningstid}
            onChange={(e) => setOpvaagningstid(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg text-lg"
          />
        </div>
      </div>

      {/* Resultater */}
      {beregning && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-purple-100 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Anbefalet søvn</p>
              <p className="text-4xl font-bold text-purple-700">
                {beregning.basisTimer} timer
              </p>
              <p className="text-sm text-gray-500">{beregning.aldersgruppe}</p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Minimum</p>
              <p className="text-3xl font-bold text-purple-600">
                {beregning.minTimer} timer
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl text-center">
              <p className="text-sm text-gray-600 mb-1">Maksimum</p>
              <p className="text-3xl font-bold text-purple-600">
                {beregning.maxTimer} timer
              </p>
            </div>
          </div>

          {/* Optimale sengetider */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">
              🌙 Optimale sengetider for at vågne kl. {opvaagningstid}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Baseret på 90-minutters søvncyklusser + 15 min til at falde i søvn
            </p>
            <div className="grid grid-cols-3 gap-4">
              {beregning.sengetider.map((st) => (
                <div
                  key={st.cyklusser}
                  className={`p-4 rounded-lg text-center ${
                    st.anbefalet
                      ? "bg-purple-200 border-2 border-purple-400"
                      : "bg-white border"
                  }`}
                >
                  <p className="text-3xl font-bold text-purple-700">{st.tid}</p>
                  <p className="text-sm text-gray-600">
                    {st.soevnTimer} timers søvn
                  </p>
                  <p className="text-xs text-gray-500">
                    ({st.cyklusser} cyklusser)
                  </p>
                  {st.anbefalet && (
                    <span className="inline-block mt-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">
                      ⭐ Anbefalet
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium mb-2">💤 Tips til bedre søvn</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Hold en fast døgnrytme - også i weekenden</li>
              <li>Undgå skærme 1 time før sengetid</li>
              <li>Hold soveværelset køligt (16-19°C)</li>
              <li>Undgå koffein efter kl. 14</li>
              <li>Motion tidligt på dagen - ikke sent</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
