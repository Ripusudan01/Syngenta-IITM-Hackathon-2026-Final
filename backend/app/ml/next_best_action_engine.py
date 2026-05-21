import pandas as pd


class NextBestActionEngine:

    def __init__(self, df):

        self.df = df.copy()

        # ====================================================
        # HIGH RISK DISTRICTS
        # ====================================================

        self.high_risk_districts = [
            "Patna",
            "Warangal",
            "Meerut"
        ]

    # ========================================================
    # GENERATE ACTION
    # ========================================================

    def generate_action(self, retailer_id):

        result = self.df[
            self.df["retailer_id"] == retailer_id
        ]

        # ====================================================
        # RETAILER NOT FOUND
        # ====================================================

        if result.empty:

            return {
                "success": False,
                "message": "Retailer not found"
            }

        row = result.iloc[0]

        priority_score = 0

        reasons = []

        # ====================================================
        # SAFE NUMERIC VALUES
        # ====================================================

        sales_growth = float(
            row.get(
                "sales_growth",
                0
            )
        )

        inventory_risk = float(
            row.get(
                "inventory_risk",
                0
            )
        )

        engagement_score = float(
            row.get(
                "engagement_score",
                0
            )
        )

        visit_success = float(
            row.get(
                "visit_success",
                0
            )
        )

        panic_state = row.get(
            "panic_state",
            "NORMAL"
        )

        district = row.get(
            "district",
            "Unknown"
        )

        # ====================================================
        # SALES DECLINE
        # ====================================================

        if sales_growth < 0:

            priority_score += 25

            reasons.append(
                "Sales declining"
            )

        # ====================================================
        # INVENTORY RISK
        # ====================================================

        if inventory_risk > 0.7:

            priority_score += 25

            reasons.append(
                "High inventory stockout risk"
            )

        # ====================================================
        # LOW ENGAGEMENT
        # ====================================================

        if engagement_score < 40:

            priority_score += 15

            reasons.append(
                "Low campaign engagement"
            )

        # ====================================================
        # LOW VISIT SUCCESS
        # ====================================================

        if visit_success < 0.5:

            priority_score += 20

            reasons.append(
                "Low visit conversion rate"
            )

        # ====================================================
        # PANIC STATE
        # ====================================================

        if panic_state == "PANIC":

            priority_score += 30

            reasons.append(
                "Farmer panic detected"
            )

        # ====================================================
        # HIGH RISK DISTRICT
        # ====================================================

        if district in self.high_risk_districts:

            priority_score += 15

            reasons.append(
                "High-risk district"
            )

        # ====================================================
        # PRIORITY LEVEL
        # ====================================================

        if priority_score >= 70:

            priority = "HIGH"

            action = "Immediate Field Visit"

        elif priority_score >= 40:

            priority = "MEDIUM"

            action = "Voice Call Follow-up"

        else:

            priority = "LOW"

            action = "Routine Advisory"

        # ====================================================
        # FALLBACK REASON
        # ====================================================

        if len(reasons) == 0:

            reasons.append(
                "Farmer operating normally"
            )

        # ====================================================
        # RESPONSE
        # ====================================================

        return {

            "success": True,

            "retailer_id":
                retailer_id,

            "farmer_name":
                row.get(
                    "farmer_name",
                    "Unknown Farmer"
                ),

            "district":
                district,

            "trust_level":
                row.get(
                    "trust_level",
                    "Unknown"
                ),

            "emotion":
                row.get(
                    "emotion",
                    "Unknown"
                ),

            "season_stage":
                row.get(
                    "season_stage",
                    "Unknown"
                ),

            "priority":
                priority,

            "priority_score":
                priority_score,

            "recommended_action":
                action,

            "recommended_channel":
                row.get(
                    "preferred_channel",
                    "Voice Call"
                ),

            "reasons":
                reasons
        }