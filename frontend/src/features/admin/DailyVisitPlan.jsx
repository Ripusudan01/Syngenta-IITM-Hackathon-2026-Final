import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock3,
  ShieldAlert,
  Sprout
} from 'lucide-react';

import { apiService } from '../../utils/apiService';

export default function DailyVisitPlan() {

  const [visitData, setVisitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchVisitPlan() {

      try {

        setLoading(true);

        const response =
          await apiService.getDailyVisitPlan();

        setVisitData(response);

      } catch (err) {

        console.error(
          "Daily visit plan fetch failed:",
          err
        );

      } finally {

        setLoading(false);
      }
    }

    fetchVisitPlan();

  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        <p className="text-sm text-slate-500">
          Generating AI field visit priorities...
        </p>
      </div>
    );
  }

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
            Daily AI Visit Plan
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Dynamic field prioritization engine
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl text-xs font-bold">
          {visitData?.total_priority_visits} Priority Visits
        </div>

      </div>

      {/* VISIT CARDS */}
      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">

        {
          visitData?.visit_plan?.slice(0, 10).map((visit, index) => (

            <div
              key={index}
              className="border border-slate-200 rounded-2xl p-5 hover:border-emerald-400 transition-all duration-300 bg-slate-50/40"
            >

              {/* TOP */}
              <div className="flex items-start justify-between gap-4">

                <div className="space-y-1">

                  <div className="flex items-center gap-2">

                    <span className="text-sm font-black text-slate-900">
                      {visit.farmer_name}
                    </span>

                    <span className="bg-rose-50 text-rose-700 text-[10px] px-2 py-1 rounded-lg font-bold uppercase">
                      {visit.priority}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">

                    <MapPin className="w-3.5 h-3.5" />

                    {visit.district}

                  </div>

                </div>

                <div className="text-right">

                  <div className="text-2xl font-black text-emerald-600">
                    {visit.priority_score}
                  </div>

                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    Priority Score
                  </div>

                </div>

              </div>

              {/* ACTION SECTION */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">

                <div className="bg-white border border-slate-100 rounded-xl p-3">

                  <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Recommended Action
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {visit.recommended_action}
                  </p>

                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-3">

                  <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold">
                    <Sprout className="w-3.5 h-3.5" />
                    Suggested Product
                  </div>

                  <p className="mt-2 text-sm font-bold text-emerald-700">
                    {visit.recommended_product}
                  </p>

                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-3">

                  <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold">
                    <Clock3 className="w-3.5 h-3.5" />
                    Response Window
                  </div>

                  <p className="mt-2 text-sm font-bold text-amber-600">
                    {visit.response_time}
                  </p>

                </div>

              </div>

              {/* EXPLAINABLE AI */}
              <div className="mt-5 bg-violet-50 border border-violet-100 rounded-xl p-4">

                <div className="flex items-center gap-2 text-violet-700 text-[10px] uppercase font-black tracking-wide">

                  <AlertTriangle className="w-3.5 h-3.5" />

                  Why AI Recommended This

                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">

                  {
                    visit.reason?.map((item, idx) => (

                      <div
                        key={idx}
                        className="text-xs text-slate-700 bg-white border border-violet-100 rounded-lg px-3 py-2"
                      >
                        ✔ {item}
                      </div>

                    ))
                  }

                </div>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  );
}