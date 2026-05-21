import { useEffect, useState } from 'react';
import { farmerApi } from '../../api/farmerApi';
import { CloudRain, Sprout, HeartCrack, ShieldCheck, Users } from 'lucide-react';
import SeasonArcTracker from './SeasonArcTracker';
import FarmerMemoryTimeline from './FarmerMemoryTimeline';
import InteractionLogger from './InteractionLogger';
import { getRegionalContext } from '../../config/indiaRegionalContext';

// 1. ADD allFarmers AND onSelectFarmerIndex TO PROPS DESTRUCTURING HERE
export default function FarmerInsights({
  selectedFarmerData,
  onUpdateFarmerMemory,
  allFarmers = [],
  onSelectFarmerIndex
}) {
  const [relationshipData, setRelationshipData] =
    useState(null);
  const [relationshipLoading, setRelationshipLoading] =
    useState(true);
  const [fieldStrategy, setFieldStrategy] = useState(null);
  const [nextBestAction, setNextBestAction] =
    useState(null);
  const [nextBestActionLoading, setNextBestActionLoading] =
    useState(false);
  const [fieldStrategyLoading, setFieldStrategyLoading] = useState(false);


  if (!selectedFarmerData) {
    return (
      <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-xs font-bold text-slate-400 animate-pulse">
        🛰️ Waiting for active territory farmer sync matrix parameters...
      </div>
    );
  }


  const {
    id,
    farmer_name,
    state_location,
    district,
    season_stage,
    strategy,
    preferred_channel,
    panic_state,
    urgency_category,
    dynamic_trust_score,
    field_representative,
    history = [
      { date: "12 May 2026", interaction_type: "Routine Crop Audit", sentiment: "STABLE", notes: "Completed regular inspection. Disbursed organic bio-nutrients." },
      { date: "02 May 2026", interaction_type: "Pest Threat Assessment", sentiment: "ANXIOUS", notes: "Spotted early leaf folder presence. Farmer requested fast tracking order." }
    ]
  } = selectedFarmerData;

  // const regionalConfig = getRegionalContext(state_location);
  const regionalConfig = getRegionalContext('maharashtra');
  const labels = regionalConfig.uiLabels;
  const isCritical = panic_state === 'PANIC' || urgency_category === 'CRITICAL';
  useEffect(() => {

    async function fetchRelationshipThreat() {

      try {

        setRelationshipLoading(true);

        const data =
          await farmerApi.getRelationshipMessage(
            selectedFarmerData?.retailer_id
          );

        setRelationshipData(data);

      } catch (err) {

        console.error(
          "Relationship threat fetch failed:",
          err
        );

      } finally {

        setRelationshipLoading(false);
      }
    }
    async function fetchFieldStrategy() {

      try {

        setFieldStrategyLoading(true);

        const response = await farmerApi.getFieldStrategy(
          selectedFarmerData?.retailer_id
        );

        setFieldStrategy(response);

      } catch (err) {

        console.error(
          "Field strategy fetch failed:",
          err
        );

      } finally {

        setFieldStrategyLoading(false);
      }
    }

    async function fetchNextBestAction() {

      try {

        setNextBestActionLoading(true);

        const response =
          await farmerApi.getNextBestAction(
            selectedFarmerData?.retailer_id
          );

        setNextBestAction(response);

      } catch (err) {

        console.error(
          "Next best action fetch failed:",
          err
        );

      } finally {

        setNextBestActionLoading(false);
      }
    }

    if (selectedFarmerData?.retailer_id) {
      fetchRelationshipThreat();
      fetchFieldStrategy();
      fetchNextBestAction();
    }

  }, [selectedFarmerData]);

  const handleAddNewLog = (newLog) => {
    if (onUpdateFarmerMemory) {
      onUpdateFarmerMemory(id, newLog);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* 1. Life Cycle Timeline Display Panel */}
      <SeasonArcTracker
        currentStage={
          fieldStrategy?.season_stage || season_stage
        }
        stateLocation={state_location}
      />
      {/* 2. Primary Twin Layout Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Interactive Flow: Advisory and Submission Triggers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Best Action AI Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">

            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                AI Next Best Action
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Context-aware field intelligence recommendations
              </p>
            </div>

            <div className="p-4 bg-violet-50 border border-violet-100 rounded-xl">

              {
                nextBestActionLoading ? (
                  <p className="text-xs text-slate-500">
                    Generating AI recommendation...
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-bold text-violet-900">
                      {
                        nextBestAction?.recommendation ||
                        "Promote fungicide solution for high-risk crop zones."
                      }
                    </p>

                    <div className="mt-3 space-y-2">

                      <div className="text-[11px] text-slate-600">
                        ✔ Pest outbreak risk detected
                      </div>

                      <div className="text-[11px] text-slate-600">
                        ✔ Crop currently in vulnerable growth stage
                      </div>

                      <div className="text-[11px] text-slate-600">
                        ✔ Retailer demand trend increasing
                      </div>

                    </div>
                  </>
                )
              }

            </div>
          </div>
          {/* Advisory Feed Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                {labels.strategyTitle} ({district || "Central Territory"})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time language translation matrix set to: <strong className="text-slate-700 uppercase font-mono">[{regionalConfig.languageCode}]</strong>
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-start space-x-3.5">
                <Sprout className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{labels.strategySub}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {
                      fieldStrategyLoading
                        ? "Loading strategic advisory..."
                        : fieldStrategy?.strategy ||
                        strategy ||
                        "No active context advisory broadcast streaming for this zone."
                    }
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start space-x-3.5">
                <CloudRain className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{labels.channelLabel}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Active Delivery Node: <strong className="text-blue-700 font-bold uppercase">
                      {
                        fieldStrategyLoading
                          ? "SYNCING..."
                          : fieldStrategy?.preferred_channel ||
                          preferred_channel ||
                          "SMS"
                      }
                    </strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* New Active Logging Actions Interface Panel */}
          <InteractionLogger onSaveLog={handleAddNewLog} />
        </div>

        {/* Right Status Sidebar Flow: Risk Badges and Historical Memory */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Relationship Threat Metrics</h4>
              <div className={`text-center py-5 rounded-xl border ${isCritical ? 'bg-rose-50 border-rose-100 text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-900'
                }`}>
                {isCritical ? (
                  <HeartCrack className="w-7 h-7 text-rose-500 mx-auto mb-2 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-7 h-7 text-emerald-600 mx-auto mb-2" />
                )}
                <span className="block text-xl font-black tracking-tight uppercase">
                  {
                    relationshipLoading
                      ? "SYNCING..."
                      : relationshipData?.emotion ||
                      urgency_category ||
                      "STABLE"
                  }
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Trust Level:

                  {
                    relationshipData?.trust_level ||
                    "UNKNOWN"
                  }                </span>
              </div>
            </div>

            <div className="bg-[#0B1F3B] text-white p-4 rounded-xl text-center space-y-1">
              <span className="block text-[9px] font-bold tracking-widest uppercase text-emerald-400">{labels.personnelLabel}</span>
              <span className="block text-xs font-bold">{field_representative?.name || "R. Kumar"}</span>
              <span className="block text-[10px] text-slate-300 font-mono">📞 {field_representative?.phone || "+91 XXXXX XXXXX"}</span>
            </div>
          </div>

          {/* Historical Farmer Memory Timeline */}
          <FarmerMemoryTimeline memoryRecords={history} />
        </div>

      </div>
    </div>
  );
}