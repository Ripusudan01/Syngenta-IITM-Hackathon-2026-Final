import pandas as pd

from app.ml.data_loader import DataLoader


class FeatureEngineering:

    @staticmethod
    def build_feature_dataframe():

        # =====================================================
        # LOAD DATA
        # =====================================================

        data = DataLoader.load_all_data()

        retailer_df = data["retailer"]

        pos_df = data["pos"]

        inventory_df = data["inventory"]

        visit_df = data["visit"]

        campaign_df = data["campaign"]

        # =====================================================
        # POS FEATURES
        # =====================================================

        pos_df["sales_value"] = (

            pos_df["sku_qty"] *

            pos_df["sku_price"]
        )

        pos_features = (

            pos_df.groupby("retailer_id")

            .agg({

                "sku_qty": "sum",

                "sales_value": "sum"

            })

            .reset_index()
        )

        pos_features.columns = [

            "retailer_id",

            "weekly_sales",

            "weekly_revenue"
        ]

        # =====================================================
        # SALES GROWTH FEATURE
        # =====================================================

        pos_features["sales_growth"] = (

            pos_features["weekly_sales"]

            .pct_change()

            .fillna(0)
        )

        # =====================================================
        # SALES MOMENTUM
        # =====================================================

        pos_features["sales_momentum"] = (

            pos_features["weekly_sales"]

            .rolling(window=3, min_periods=1)

            .mean()
        )

        # =====================================================
        # INVENTORY FEATURES
        # =====================================================

        inventory_features = (

            inventory_df.groupby("retailer_id")

            .agg({

                "sku_qty": "mean"

            })

            .reset_index()
        )

        inventory_features.columns = [

            "retailer_id",

            "inventory_qty"
        ]

        # =====================================================
        # AVG INVENTORY
        # =====================================================

        inventory_features["avg_inventory"] = (

            inventory_features["inventory_qty"]
        )

        # =====================================================
        # INVENTORY RISK
        # =====================================================

        inventory_features["inventory_risk"] = (

            1 /

            (inventory_features["inventory_qty"] + 1)
        )

        # =====================================================
        # INVENTORY RISK NORMALIZED
        # =====================================================

        max_inventory_risk = (
            inventory_features["inventory_risk"].max()
        )

        inventory_features["inventory_risk_norm"] = (

            inventory_features["inventory_risk"]

            / max_inventory_risk
        )

        # =====================================================
        # VISIT FEATURES
        # =====================================================

        if "visit_success" in visit_df.columns:

            visit_features = (

                visit_df.groupby("retailer_id")

                .agg({

                    "visit_success": "mean"

                })

                .reset_index()
            )

        else:

            visit_features = pd.DataFrame({

                "retailer_id":
                    retailer_df["retailer_id"],

                "visit_success":
                    0.5
            })

        # =====================================================
        # CAMPAIGN FEATURES
        # =====================================================

        campaign_df["engagement_score"] = (

            campaign_df["opened_status"].astype(int)

            +

            campaign_df["clicked_status"].astype(int)

        ) * 50

        campaign_features = (

            campaign_df.groupby("grower_id")

            .agg({

                "engagement_score": "mean"

            })

            .reset_index()
        )

        campaign_features.columns = [

            "retailer_id",

            "engagement_score"
        ]

        # =====================================================
        # ENGAGEMENT SCORE NORMALIZED
        # =====================================================

        max_engagement = (
            campaign_features["engagement_score"]
            .max()
        )

        if pd.isna(max_engagement) or max_engagement == 0:

            max_engagement = 1

        campaign_features["engagement_score_norm"] = (

            campaign_features["engagement_score"]

            / max_engagement
        )

        # =====================================================
        # MERGE ALL FEATURES
        # =====================================================

        merged_df = retailer_df.merge(

            pos_features,

            on="retailer_id",

            how="left"
        )

        merged_df = merged_df.merge(

            inventory_features,

            on="retailer_id",

            how="left"
        )

        merged_df = merged_df.merge(

            visit_features,

            on="retailer_id",

            how="left"
        )

        merged_df = merged_df.merge(

            campaign_features,

            on="retailer_id",

            how="left"
        )

        # =====================================================
        # COVERAGE FEATURES
        # =====================================================

        merged_df["rep_coverage_score"] = 0.7

        merged_df["coverage_score_norm"] = 0.7

        # =====================================================
        # TERRITORY HEALTH SCORE
        # =====================================================

        merged_df["territory_health_score"] = (

            (
                merged_df["engagement_score_norm"]

                +

                (1 - merged_df["inventory_risk_norm"])
            ) / 2
        )

        # =====================================================
        # URGENCY SCORE
        # =====================================================

        merged_df["urgency_score"] = (

            merged_df["inventory_risk_norm"] * 100
        )

        # =====================================================
        # OPPORTUNITY SCORE
        # =====================================================

        merged_df["opportunity_score"] = (

            merged_df["engagement_score_norm"] * 100
        )

        # =====================================================
        # VISIT SUCCESS RANDOMIZATION
        # =====================================================

        import numpy as np

        merged_df["visit_success"] = np.random.uniform(
            0.3,
            0.95,
            len(merged_df)
        )

        # =====================================================
        # FILL NUMERIC NULLS WITH MEAN
        # =====================================================

        numeric_columns = merged_df.select_dtypes(
            include=["number"]
        ).columns

        merged_df[numeric_columns] = (
            merged_df[numeric_columns]
            .fillna(
                merged_df[numeric_columns].mean()
            )
        )

        # =====================================================
        # FINAL TEXT NULL CLEANUP
        # =====================================================

        text_columns = [

            "district",

            "trust_level",

            "emotion",

            "season_stage",

            "preferred_channel",

            "relationship_stage",

            "memory_context",

            "farmer_name"
        ]

        for col in text_columns:

            if col in merged_df.columns:

                merged_df[col] = (
                    merged_df[col]
                    .fillna("UNKNOWN")
                )

        # print(merged_df.columns)

        return merged_df