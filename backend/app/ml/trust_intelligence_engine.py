import pandas as pd


class TrustIntelligenceEngine:

    def __init__(self, farmer_profiles_df):

        self.df = farmer_profiles_df.copy()

        self.build_scores()

    def build_scores(self):

        trust_map = {
            "TRUSTED": 0.9,
            "WARM": 0.6,
            "COLD": 0.3
        }

        emotion_map = {
            "HOPEFUL": 0.2,
            "STABLE": 0.4,
            "ANXIOUS": 0.9,
            "PANIC": 1.0
        }

        panic_map = {
            "NORMAL": 0.2,
            "PANIC": 0.95
        }

        relationship_map = {
            "1st Season": 0.3,
            "2nd Season": 0.5,
            "3rd Season": 0.7,
            "4th Season": 0.9
        }

        channel_map = {
            "WhatsApp": 0.9,
            "Voice Call": 0.7,
            "Field Visit": 1.0
        }

        self.df["base_trust_score"] = (
            self.df["trust_level"]
            .map(trust_map)
        )

        self.df["emotion_risk_score"] = (
            self.df["emotion"]
            .map(emotion_map)
        )

        self.df["panic_score"] = (
            self.df["panic_state"]
            .map(panic_map)
        )

        self.df["relationship_strength"] = (
            self.df["relationship_stage"]
            .map(relationship_map)
        )

        self.df["communication_score"] = (
            self.df["preferred_channel"]
            .map(channel_map)
        )

        self.df["dynamic_trust_score"] = (

            (
                self.df["base_trust_score"] * 0.35
            )

            +

            (
                self.df["relationship_strength"] * 0.25
            )

            +

            (
                self.df["communication_score"] * 0.15
            )

            -

            (
                self.df["panic_score"] * 0.15
            )

            -

            (
                self.df["emotion_risk_score"] * 0.10
            )
        )

        self.df["dynamic_trust_score"] = (
            self.df["dynamic_trust_score"]
            .clip(0, 1)
        )

        self.df["intervention_urgency"] = (

            (
                self.df["panic_score"] * 0.45
            )

            +

            (
                self.df["emotion_risk_score"] * 0.30
            )

            +

            (
                1 - self.df["dynamic_trust_score"]
            ) * 0.25
        )

        self.df["urgency_category"] = (
            self.df["intervention_urgency"]
            .apply(self.urgency_category)
        )

        self.df["next_best_action"] = (
            self.df.apply(
                self.next_best_action,
                axis=1
            )
        )

    def urgency_category(self, score):

        if score >= 0.75:
            return "CRITICAL"

        elif score >= 0.50:
            return "HIGH"

        elif score >= 0.30:
            return "MEDIUM"

        else:
            return "LOW"

    def next_best_action(self, row):

        if row["urgency_category"] == "CRITICAL":

            return (
                "Immediate field intervention required"
            )

        elif row["panic_state"] == "PANIC":

            return (
                "Stabilize emotionally before advisory"
            )

        elif row["trust_level"] == "COLD":

            return (
                "Trust-building visit recommended"
            )

        elif row["season_stage"] == "PEST_SEASON":

            return (
                "Preventive pest advisory required"
            )

        elif row["season_stage"] == "RECOVERY":

            return (
                "Empathy-driven recovery support"
            )

        else:

            return (
                "Continue relationship nurturing"
            )

    def get_farmer_trust(self, retailer_id):

        result = self.df[
            self.df["retailer_id"] == retailer_id
        ]

        if result.empty:

            return {
                "success": False,
                "message": "Retailer not found"
            }

        row = result.iloc[0]

        return {
            "retailer_id": retailer_id,
            "farmer_name": row["farmer_name"],
            "trust_level": row["trust_level"],
            "panic_state": row["panic_state"],
            "dynamic_trust_score": round(
                row["dynamic_trust_score"], 4
            ),
            "intervention_urgency": round(
                row["intervention_urgency"], 4
            ),
            "urgency_category": row[
                "urgency_category"
            ],
            "next_best_action": row[
                "next_best_action"
            ]
        }

    def get_critical_farmers(self, top_n=20):

        critical = (

            self.df
            .sort_values(
                "intervention_urgency",
                ascending=False
            )
            .head(top_n)

        )

        return critical[
            [
                "retailer_id",
                "farmer_name",
                "trust_level",
                "panic_state",
                "dynamic_trust_score",
                "intervention_urgency",
                "urgency_category",
                "next_best_action"
            ]
        ].to_dict(orient="records")

    def get_summary(self):

        return {
            "total_farmers": int(len(self.df)),
            "critical_cases": int(
                (
                    self.df["urgency_category"]
                    == "CRITICAL"
                ).sum()
            ),
            "high_risk_cases": int(
                (
                    self.df["urgency_category"]
                    == "HIGH"
                ).sum()
            ),
            "panic_farmers": int(
                (
                    self.df["panic_state"]
                    == "PANIC"
                ).sum()
            )
        }