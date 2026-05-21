import pandas as pd


class VisitPlanningEngine:

    def __init__(self, df):

        self.df = df.copy()

        # =====================================================
        # HIGH RISK DISTRICTS
        # =====================================================

        self.high_risk_districts = [
            "Patna",
            "Warangal",
            "Meerut"
        ]

    # =========================================================
    # DAILY VISIT PLAN
    # =========================================================

    def generate_daily_plan(self):

        df = self.df.copy()

        # =====================================================
        # SAFE COLUMNS
        # =====================================================

        required_columns = {

            "panic_state": "NORMAL",
            "trust_level": "WARM",
            "season_stage": "EARLY_GROWTH",
            "emotion": "STABLE",
            "relationship_stage": "2nd Season",
            "preferred_channel": "Voice Call",
            "district": "Unknown",
            "engagement_score": 50
        }

        for column, default_value in required_columns.items():

            if column not in df.columns:

                df[column] = default_value

        # =====================================================
        # PRIORITY SCORE
        # =====================================================

        df["priority_score"] = 0

        # =====================================================
        # PANIC STATE
        # =====================================================

        panic_mask = (
            df["panic_state"] == "PANIC"
        )

        df.loc[
            panic_mask,
            "priority_score"
        ] += 40

        # =====================================================
        # TRUST LEVEL
        # =====================================================

        cold_mask = (
            df["trust_level"] == "COLD"
        )

        warm_mask = (
            df["trust_level"] == "WARM"
        )

        df.loc[
            cold_mask,
            "priority_score"
        ] += 30

        df.loc[
            warm_mask,
            "priority_score"
        ] += 15

        # =====================================================
        # SEASON STAGE
        # =====================================================

        pest_mask = (
            df["season_stage"] == "PEST_SEASON"
        )

        harvest_mask = (
            df["season_stage"] == "PRE_HARVEST"
        )

        df.loc[
            pest_mask,
            "priority_score"
        ] += 20

        df.loc[
            harvest_mask,
            "priority_score"
        ] += 10

        # =====================================================
        # EMOTION
        # =====================================================

        anxious_mask = (
            df["emotion"] == "ANXIOUS"
        )

        hopeful_mask = (
            df["emotion"] == "HOPEFUL"
        )

        df.loc[
            anxious_mask,
            "priority_score"
        ] += 10

        df.loc[
            hopeful_mask,
            "priority_score"
        ] += 5

        # =====================================================
        # RELATIONSHIP STAGE
        # =====================================================

        first_season_mask = (
            df["relationship_stage"]
            == "1st Season"
        )

        df.loc[
            first_season_mask,
            "priority_score"
        ] += 10

        # =====================================================
        # PREFERRED CHANNEL
        # =====================================================

        field_visit_mask = (
            df["preferred_channel"]
            == "Field Visit"
        )

        df.loc[
            field_visit_mask,
            "priority_score"
        ] += 5

        # =====================================================
        # HIGH RISK DISTRICT
        # =====================================================

        district_mask = (
            df["district"]
            .isin(self.high_risk_districts)
        )

        df.loc[
            district_mask,
            "priority_score"
        ] += 10

        # =====================================================
        # ENGAGEMENT BONUS
        # =====================================================

        df["engagement_score"] = pd.to_numeric(
            df["engagement_score"],
            errors="coerce"
        ).fillna(0)

        df["engagement_bonus"] = (
            df["engagement_score"] * 0.2
        ).fillna(0).astype(int)

        df["priority_score"] += (
            df["engagement_bonus"]
        )

        # =====================================================
        # PRIORITY LEVEL
        # =====================================================

        df["priority"] = "LOW"

        df.loc[
            df["priority_score"] >= 90,
            "priority"
        ] = "HIGH"

        df.loc[
            (
                df["priority_score"] >= 50
            )
            &
            (
                df["priority_score"] < 90
            ),
            "priority"
        ] = "MEDIUM"

        # =====================================================
        # RECOMMENDED ACTION
        # =====================================================

        df["recommended_action"] = (
            "Routine Advisory"
        )

        df.loc[
            df["priority"] == "MEDIUM",
            "recommended_action"
        ] = "Voice Call Follow-up"

        df.loc[
            df["priority"] == "HIGH",
            "recommended_action"
        ] = "Immediate Field Visit"

        # =====================================================
        # RESPONSE TIME
        # =====================================================

        df["response_time"] = (
            "Routine Weekly Follow-up"
        )

        df.loc[
            df["priority"] == "MEDIUM",
            "response_time"
        ] = "Within 3 Days"

        df.loc[
            df["priority"] == "HIGH",
            "response_time"
        ] = "Within 24 Hours"

        # =====================================================
        # PRODUCT RECOMMENDATION
        # =====================================================

        df["recommended_product"] = (
            "General Crop Care"
        )

        df.loc[
            pest_mask,
            "recommended_product"
        ] = "Insecticide"

        df.loc[
            harvest_mask,
            "recommended_product"
        ] = "Yield Booster"

        growth_mask = (
            df["season_stage"]
            == "EARLY_GROWTH"
        )

        df.loc[
            growth_mask,
            "recommended_product"
        ] = "Growth Nutrient"

        # =====================================================
        # SORT
        # =====================================================

        df = df.sort_values(
            by="priority_score",
            ascending=False
        )

        # =====================================================
        # TOP 20 VISITS
        # =====================================================

        top_df = df.head(20)

        # =====================================================
        # BUILD RESPONSE
        # =====================================================

        visit_plan = []

        for _, row in top_df.iterrows():

            reasons = []

            if row["panic_state"] == "PANIC":

                reasons.append(
                    "Farmer in panic state"
                )

            if row["trust_level"] == "COLD":

                reasons.append(
                    "Low trust relationship"
                )

            if row["season_stage"] == "PEST_SEASON":

                reasons.append(
                    "Pest season active"
                )

            if row["district"] in self.high_risk_districts:

                reasons.append(
                    "High risk district"
                )

            visit_plan.append({

                "retailer_id":
                    row["retailer_id"],

                "farmer_name":
                    row.get(
                        "farmer_name",
                        "Unknown Farmer"
                    ),

                "district":
                    row["district"],

                "trust_level":
                    row["trust_level"],

                "emotion":
                    row["emotion"],

                "season_stage":
                    row["season_stage"],

                "engagement_score":
                    int(row["engagement_score"]),

                "priority":
                    row["priority"],

                "priority_score":
                    int(row["priority_score"]),

                "recommended_action":
                    row["recommended_action"],

                "response_time":
                    row["response_time"],

                "recommended_product":
                    row["recommended_product"],

                "preferred_channel":
                    row["preferred_channel"],

                "reason":
                    reasons
            })

        # =====================================================
        # RESPONSE
        # =====================================================

        return {

            "status": "success",

            "total_priority_visits":
                len(visit_plan),

            "visit_plan":
                visit_plan
        }