"use client";

import { useState } from "react";
import {
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Home,
  ThermometerSnowflake,
  Info,
  Gauge,
  Layers,
  HelpCircle,
} from "lucide-react";

interface DehumidifierSizingProps {
  outcode: string;
  dampRiskScore: number;
  pctOldBuild: number;
  pctPoorEpc: number;
  dominantHouseType: string;
  city: string;
}

interface SizingTier {
  category: string;
  capacity: string;
  tech: "Compressor" | "Desiccant";
  minTemp: string;
  powerWatts: string;
  hourlyCost: string;
  airflow: string;
  noise: string;
  targetProperty: string;
  physicsDescription: string;
  keySpecs: string[];
}

const DEHUMIDIFIER_BENCHMARKS: SizingTier[] = [
  {
    category: "Compact Domestic",
    capacity: "10L - 12L / Day",
    tech: "Compressor",
    minTemp: "15°C - 35°C",
    powerWatts: "160W - 180W",
    hourlyCost: "~3.9p - 4.4p/hr",
    airflow: "105 - 120 m³/h",
    noise: "35 - 38 dB(A)",
    targetProperty: "1-2 Bed Flats, Compact Terraces (<70m²)",
    physicsDescription:
      "Passes ambient moist air across a sealed refrigeration evaporator coil. Airborne moisture rapidly condenses into water droplets and drains into an internal reservoir. Most energy-efficient when internal ambient temperatures exceed 16°C.",
    keySpecs: [
      "Ultra-low wattage suitable for continuous daytime running",
      "Digital humidistat automatically cycles compressor off at 50% RH",
      "Sufficient for 1-2 occupants generating ~4-6L vapor daily",
      "Compact footprint ideal for tight landings and hallways",
    ],
  },
  {
    category: "Standard Family",
    capacity: "14L - 16L / Day",
    tech: "Compressor",
    minTemp: "15°C - 35°C",
    powerWatts: "210W - 240W",
    hourlyCost: "~5.1p - 5.9p/hr",
    airflow: "135 - 165 m³/h",
    noise: "38 - 42 dB(A)",
    targetProperty: "2-3 Bed Semi-Detached & Mid-Terraces (70-110m²)",
    physicsDescription:
      "Features higher CFM fan speeds to pull damp air from adjacent bedrooms and bathrooms towards a central hallway position. Accelerates clothes drying times without allowing indoor humidity to surpass the 60% fungal germination boundary.",
    keySpecs: [
      "Dedicated laundry drying mode (pushes air upwards to dry hanging clothes)",
      "Continuous drainage port option for unattended cellar or utility operation",
      "Handles moisture generation of 3-4 occupants (~8-10L vapor daily)",
      "Smart auto-defrost mechanism prevents frost accumulation on coils",
    ],
  },
  {
    category: "Heavy-Duty Solid Wall",
    capacity: "20L - 25L / Day",
    tech: "Compressor",
    minTemp: "15°C - 35°C",
    powerWatts: "280W - 360W",
    hourlyCost: "~6.8p - 8.8p/hr",
    airflow: "180 - 220 m³/h",
    noise: "42 - 46 dB(A)",
    targetProperty: "3-5 Bed Victorian Solid Brick & High Risk Homes (>110m²)",
    physicsDescription:
      "High-throughput commercial-grade refrigeration coils extract moisture rapidly before it can migrate to cold uninsulated external walls. Frequently combined with true H13 HEPA air filtration to capture airborne viable mould spores (*Cladosporium*, *Penicillium*).",
    keySpecs: [
      "High cubic airflow sweeps cold corner microclimates where air stagnates",
      "Dual filtration: Carbon deodoriser + HEPA mould-spore capture",
      "Large 4.5L - 6L water reservoir reduces daily emptying frequency",
      "Mandatory for homes with over 40% pre-1930 uninsulated solid brickwork",
    ],
  },
  {
    category: "Low-Temperature Desiccant",
    capacity: "7.5L - 10L / Day (Equivalent to 18L Compressor in cold)",
    tech: "Desiccant",
    minTemp: "1°C - 30°C",
    powerWatts: "320W - 590W",
    hourlyCost: "~7.8p - 14.5p/hr",
    airflow: "115 - 150 m³/h",
    noise: "34 - 38 dB(A)",
    targetProperty: "Unheated Rooms, Cold Basements, Garages & Stone Cottages (<15°C)",
    physicsDescription:
      "Contains no refrigerant gas or compressor. Air is passed through a slowly rotating wheel impregnated with hygroscopic zeolite desiccant. An internal ceramic heater regenerates the wheel, expelling extracted water into the tank while releasing warm, dry air into the room (+2°C to +3°C ambient temperature rise).",
    keySpecs: [
      "Functions down to 1°C where standard compressor coils freeze solid",
      "Adds auxiliary heat to the room, helping push cold plaster above dew point",
      "Extremely quiet operation with zero compressor rumble or vibration",
      "No greenhouse hydrofluorocarbon gases; lightweight and easy to carry",
    ],
  },
];

export default function DehumidifierSizingGuide({
  outcode,
  dampRiskScore,
  pctOldBuild,
  pctPoorEpc,
  dominantHouseType,
  city,
}: DehumidifierSizingProps) {
  const [propertySize, setPropertySize] = useState<"flat" | "semi" | "detached" | "cold">("semi");

  const isHighRisk = dampRiskScore >= 50;
  const isSolidWallHeavy = pctOldBuild >= 35;

  const getRecommendedCapacity = () => {
    if (propertySize === "cold") {
      return {
        capacity: "7.5L - 10L Desiccant",
        type: "Rotary Desiccant (Low Temperature)",
        reason:
          "Compressor models suffer up to 70% efficiency loss below 15°C due to coil frosting. A desiccant unit extracts moisture consistently down to 1°C and raises ambient room temperature by 2°C to 3°C, elevating wall plaster above the condensation dew point.",
        benchmarkIndex: 3,
      };
    }
    if (propertySize === "flat") {
      if (isHighRisk || isSolidWallHeavy) {
        return {
          capacity: "12L - 14L Compressor",
          type: "Mid-Capacity Refrigerant Compressor",
          reason: `Higher moisture load in ${outcode} due to ${pctOldBuild}% solid-wall construction requires a 12L-14L capacity unit rather than entry-level 10L models to control winter humidity spikes.`,
          benchmarkIndex: 0,
        };
      }
      return {
        capacity: "10L - 12L Compressor",
        type: "Compact Refrigerant Compressor",
        reason: "Sufficient extraction for apartments under 70m² with moderate occupant moisture production and standard room heating.",
        benchmarkIndex: 0,
      };
    }
    if (propertySize === "semi") {
      if (isHighRisk) {
        return {
          capacity: "20L Heavy-Duty Compressor",
          type: "High-Capacity Refrigerant Compressor",
          reason: `Elevated damp risk score (${dampRiskScore}/100) indicates sustained high vapor pressure. A 20L unit rapidly pulls relative humidity below the 55% mould colonisation threshold across multiple rooms.`,
          benchmarkIndex: 2,
        };
      }
      return {
        capacity: "14L - 16L Compressor",
        type: "Standard Family Compressor",
        reason: `Standard residential sizing capable of serving 3 bedrooms and laundry drying across ${city} housing stock.`,
        benchmarkIndex: 1,
      };
    }
    // Detached / Large Victorian 4+ Bed
    return {
      capacity: "20L - 25L Compressor with HEPA",
      type: "Whole-House Commercial Refrigerant",
      reason:
        "Large air volume and extensive cold exterior wall perimeters require high CFM airflow and HEPA filtration to clear condensation and trap airborne mould spores.",
      benchmarkIndex: 2,
    };
  };

  const recommendation = getRecommendedCapacity();

  return (
    <section className="my-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold mb-3">
            <Wind className="w-3.5 h-3.5 text-slate-700" />
            Building Science &amp; Moisture Extraction
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Dehumidifier Sizing &amp; Extraction Guide for {outcode}
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Technical sizing benchmarks calculated from {outcode}&apos;s housing thermodynamics ({pctOldBuild}% pre-1930 solid walls, {pctPoorEpc}% EPC E-G ratings).
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl">
          <Droplets className="w-5 h-5 text-slate-700 shrink-0" />
          <div className="text-xs">
            <span className="text-slate-500 block">Critical Mould Threshold</span>
            <span className="font-extrabold text-slate-900 text-sm">&lt; 55% Relative Humidity</span>
          </div>
        </div>
      </div>

      {/* Interactive Size Selector */}
      <div className="mt-8">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-3">
          Select Your Property Profile in {outcode}:
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: "flat", label: "1-2 Bed Flat / Terrace", icon: Home, desc: "Under 70m² floor area" },
            { id: "semi", label: "3 Bed Semi-Detached", icon: Home, desc: "70m² - 120m² floor area" },
            { id: "detached", label: "4+ Bed Large House", icon: Home, desc: "Over 120m² floor area" },
            { id: "cold", label: "Cold Room / Basement", icon: ThermometerSnowflake, desc: "Ambient temps under 15°C" },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = propertySize === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPropertySize(item.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-slate-200" : "text-slate-500"}`} />
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <span className="text-sm font-bold block">{item.label}</span>
                  <span className={`text-[11px] block mt-0.5 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                    {item.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Sizing Calculation Result */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 border border-slate-700">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Engineered Recommendation for {outcode}
              </span>
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full border border-slate-700">
                {recommendation.type}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {recommendation.capacity} Extraction Rate
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto">
          <span className="text-[11px] text-slate-400 block">Estimated Household Moisture</span>
          <span className="text-base font-extrabold text-white">
            {isHighRisk ? "High (~6-10L / 24h)" : "Moderate (~4-7L / 24h)"}
          </span>
        </div>
      </div>

      {/* Solid Wall Technical Warning if applicable */}
      {isSolidWallHeavy && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Solid Wall Dew-Point Alert ({outcode}):</strong> With {pctOldBuild}% of properties built prior to 1930 lacking cavity wall insulation, external winter temperatures drive internal plaster below the 12.8°C dew point. Standard passive trickle vents alone cannot clear this moisture volume; mechanical extraction or Positive Input Ventilation (PIV) running continuously is essential to prevent surface fungal growth.
          </div>
        </div>
      )}

      {/* Technical Sizing Benchmarks Grid */}
      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-slate-700" />
              Technical Extraction Sizing Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Engineering comparison of UK domestic dehumidifier categories, electrical consumption, and operating physics.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Energy Cap: ~24.5p/kWh
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEHUMIDIFIER_BENCHMARKS.map((tier, idx) => {
            const isTargetMatch = idx === recommendation.benchmarkIndex;

            return (
              <div
                key={tier.category}
                className={`rounded-2xl border transition-all flex flex-col justify-between p-6 relative ${
                  isTargetMatch
                    ? "border-slate-900 bg-white ring-2 ring-slate-900/10 shadow-lg"
                    : "border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 shadow-xs"
                }`}
              >
                {isTargetMatch && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs border border-slate-800 flex items-center gap-1.5">
                      <Gauge className="w-3 h-3 text-emerald-400" />
                      Recommended for Your Selection
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mt-1">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                        {tier.tech} System • {tier.minTemp}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-lg mt-0.5">
                        {tier.category} ({tier.capacity})
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {tier.physicsDescription}
                  </p>

                  {/* Sizing & Spec Chips */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-[11px] bg-slate-100 p-2.5 rounded-xl border border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Electricity</span>
                      <span className="font-bold text-slate-800">{tier.powerWatts}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Hourly Cost</span>
                      <span className="font-bold text-slate-800">{tier.hourlyCost}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Noise Level</span>
                      <span className="font-bold text-slate-800">{tier.noise}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                      Engineering Suitability &amp; Key Features:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {tier.keySpecs.map((spec, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <strong className="text-slate-700 font-semibold">Typical UK Application:</strong> {tier.targetProperty}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Building Physics Guidance Callout */}
      <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <p>
            <strong>Positioning Rule:</strong> Maintain at least 30cm to 50cm clearance around the air inlet and outlet grilles. For whole-property coverage, locate the unit in a central hallway or landing with all interior doors kept ajar.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <p>
            <strong>Compressor vs. Desiccant:</strong> If your room temperature routinely drops below 15°C (unheated winter spaces, cellars, outbuildings), desiccant units extract dramatically more water per hour than compressor models without freezing up.
          </p>
        </div>
      </div>
    </section>
  );
}
