# app/ml/recommendation_engine.py

from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATA_DIR = BASE_DIR / "data" / "processed"

TERRITORY_DATA_PATH = DATA_DIR / "territory_priority_output.csv"
RETAILER_DATA_PATH = DATA_DIR / "retailer_priority_output.csv"
STOCKOUT_DATA_PATH = DATA_DIR / "stockout_predictions.csv"


# =========================
# LOAD DATA
# =========================

territory_data = pd.read_csv(TERRITORY_DATA_PATH)

retailer_data = pd.read_csv(RETAILER_DATA_PATH)

stockout_predictions = pd.read_csv(STOCKOUT_DATA_PATH)


# =========================
# RETAILER RECOMMENDATIONS
# =========================

def get_top_retailers(limit: int = 10):
    """
    Return top retailers based on priority score.
    """

    top_retailers = (
        retailer_data
        .sort_values(by="priority_score", ascending=False)
        .head(limit)
    )

    return top_retailers[
        [
            "retailer_id",
            "priority_score",
            "priority_category",
            "recommended_action",
            "weekly_sales",
            "weekly_revenue",
        ]
    ].to_dict(orient="records")


def get_retailer_recommendation(retailer_id: str):
    """
    Get recommendation details for a specific retailer.
    """

    retailer = retailer_data[
        retailer_data["retailer_id"] == retailer_id
    ]

    if retailer.empty:
        return {
            "success": False,
            "message": "Retailer not found"
        }

    retailer = retailer.sort_values(
        by="priority_score",
        ascending=False
    ).iloc[0]

    return {
        "success": True,
        "data": {
            "retailer_id": retailer["retailer_id"],
            "priority_score": float(retailer["priority_score"]),
            "priority_category": retailer["priority_category"],
            "recommended_action": retailer["recommended_action"],
            "weekly_sales": int(retailer["weekly_sales"]),
            "weekly_revenue": float(retailer["weekly_revenue"]),
            "sales_growth": float(retailer["sales_growth"]),
            "revenue_growth": float(retailer["revenue_growth"]),
            "inventory_pressure": float(retailer["inventory_pressure"]),
        }
    }


# =========================
# TERRITORY RECOMMENDATIONS
# =========================

def get_top_territories(limit: int = 10):
    """
    Return top territories based on intelligence score.
    """

    top_territories = (
        territory_data
        .sort_values(
            by="territory_intelligence_score",
            ascending=False
        )
        .head(limit)
    )

    return top_territories[
        [
            "territory_id",
            "territory_intelligence_score",
            "territory_health_score",
            "territory_status",
            "recommendations",
            "action_priority",
        ]
    ].to_dict(orient="records")


def get_territory_recommendation(territory_id: str):
    """
    Get recommendation details for a specific territory.
    """

    territory = territory_data[
        territory_data["territory_id"] == territory_id
    ]

    if territory.empty:
        return {
            "success": False,
            "message": "Territory not found"
        }

    territory = territory.sort_values(
        by="territory_intelligence_score",
        ascending=False
    ).iloc[0]

    return {
        "success": True,
        "data": {
            "territory_id": territory["territory_id"],
            "territory_intelligence_score": float(
                territory["territory_intelligence_score"]
            ),
            "territory_health_score": float(
                territory["territory_health_score"]
            ),
            "territory_status": territory["territory_status"],
            "sales_alert": territory["sales_alert"],
            "inventory_alert": territory["inventory_alert"],
            "engagement_alert": territory["engagement_alert"],
            "recommendations": territory["recommendations"],
            "action_priority": territory["action_priority"],
            "urgency_score": float(territory["urgency_score"]),
            "opportunity_score": float(
                territory["opportunity_score"]
            ),
        }
    }


# =========================
# STOCKOUT PREDICTIONS
# =========================

def get_high_risk_stockouts(limit: int = 10):
    """
    Return products with highest stockout risk.
    """

    if "stockout_probability" not in stockout_predictions.columns:
        return []

    high_risk = (
        stockout_predictions
        .sort_values(
            by="stockout_probability",
            ascending=False
        )
        .head(limit)
    )

    columns = [
        col for col in [
            "product_id",
            "territory_id",
            "retailer_id",
            "stockout_probability",
            "predicted_stockout",
        ]
        if col in high_risk.columns
    ]

    return high_risk[columns].to_dict(orient="records")


# =========================
# DASHBOARD SUMMARY
# =========================

def get_dashboard_summary():
    """
    Dashboard level KPIs.
    """

    total_retailers = retailer_data["retailer_id"].nunique()

    total_territories = territory_data["territory_id"].nunique()

    avg_priority_score = float(
        retailer_data["priority_score"].mean()
    )

    high_priority_retailers = int(
        (
            retailer_data["priority_category"]
            == "HIGH_PRIORITY"
        ).sum()
    )

    critical_sales_alerts = int(
        (
            territory_data["sales_alert"]
            == "CRITICAL_SALES_DROP"
        ).sum()
    )

    at_risk_territories = int(
        (
            territory_data["territory_status"]
            == "AT_RISK"
        ).sum()
    )

    return {
        "total_retailers": total_retailers,
        "total_territories": total_territories,
        "average_priority_score": round(
            avg_priority_score,
            4
        ),
        "high_priority_retailers": high_priority_retailers,
        "critical_sales_alerts": critical_sales_alerts,
        "at_risk_territories": at_risk_territories,
    }


# =========================
# FILTER FUNCTIONS
# =========================

def filter_retailers_by_priority(priority: str):
    """
    Filter retailers by priority category.
    """

    filtered = retailer_data[
        retailer_data["priority_category"] == priority
    ]

    return filtered.to_dict(orient="records")


def filter_territories_by_status(status: str):
    """
    Filter territories by status.
    """

    filtered = territory_data[
        territory_data["territory_status"] == status
    ]

    return filtered.to_dict(orient="records")