import pandas as pd

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATASET_DIR = BASE_DIR / "datasets"


class DataLoader:

    @staticmethod
    def load_all_data():

        retailer_df = pd.read_csv(
            DATASET_DIR / "retailer_priority_output.csv"
        )

        pos_df = pd.read_csv(
            DATASET_DIR / "retailer_pos.csv"
        )

        inventory_df = pd.read_csv(
            DATASET_DIR / "retailer_inventory_weekly.csv"
        )

        visit_df = pd.read_csv(
            DATASET_DIR / "retailer_visit_log.csv"
        )

        campaign_df = pd.read_csv(
            DATASET_DIR / "whatsapp_campaign.csv"
        )

        territory_df = pd.read_csv(
            DATASET_DIR / "territory_decision_engine.csv"
        )

        return {
            "retailer": retailer_df,
            "pos": pos_df,
            "inventory": inventory_df,
            "visit": visit_df,
            "campaign": campaign_df,
            "territory": territory_df
        }