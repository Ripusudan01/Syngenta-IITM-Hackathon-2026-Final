import pandas as pd
import numpy as np


class LLMPersonalizationEngine:

    def __init__(self, retailer_df):

        self.df = retailer_df.copy()

        np.random.seed(42)

        self.generate_profiles()

    def generate_profiles(self):

        self.df["trust_level"] = np.random.choice(
            ["TRUSTED", "WARM", "COLD"],
            len(self.df),
            p=[0.4, 0.4, 0.2]
        )

        self.df["emotion"] = np.random.choice(
            ["HOPEFUL", "PANIC", "ANXIOUS", "STABLE"],
            len(self.df)
        )

        self.df["panic_state"] = np.where(
            self.df["emotion"] == "PANIC",
            "PANIC",
            "NORMAL"
        )

        self.df["preferred_language"] = np.random.choice(
            ["Hindi", "Tamil", "Telugu", "Punjabi"],
            len(self.df)
        )

        self.df["district"] = np.random.choice(
            [
                "Meerut",
                "Amravati",
                "Bharatpur",
                "Ludhiana",
                "Coimbatore",
                "Warangal",
                "Patna",
                "Jaipur"
            ],
            len(self.df)
        )

        self.df["preferred_channel"] = np.random.choice(
            ["WhatsApp", "Voice Call", "Field Visit"],
            len(self.df)
        )

        self.df["relationship_stage"] = np.random.choice(
            [
                "1st Season",
                "2nd Season",
                "3rd Season",
                "4th Season"
            ],
            len(self.df)
        )

        self.df["season_stage"] = np.random.choice(
            [
                "PRE_SOWING",
                "EARLY_GROWTH",
                "PEST_SEASON",
                "PRE_HARVEST"
            ],
            len(self.df)
        )

        self.df["memory_context"] = np.random.choice(
            [
                "last season pest attack",
                "crop yellowing after rainfall",
                "successful harvest last season",
                "delayed sowing due to rain"
            ],
            len(self.df)
        )

        self.df["farmer_name"] = (
            "Farmer_" +
            self.df.index.astype(str)
        )

        self.generate_messages()

        self.generate_strategies()

    def generate_messages(self):

        def build_message(row):

            if row["trust_level"] == "TRUSTED":

                return (
                    f"{row['farmer_name']} ji 🙏 "
                    f"Last season you mentioned "
                    f"{row['memory_context']}. "
                    f"We are monitoring similar conditions."
                )

            elif row["trust_level"] == "WARM":

                return (
                    f"Namaste {row['farmer_name']} 🙏 "
                    f"Please monitor your field carefully this week."
                )

            else:

                return (
                    f"{row['farmer_name']} ji, "
                    f"our field officer may contact you soon."
                )

        self.df["relationship_message"] = (
            self.df.apply(
                build_message,
                axis=1
            )
        )

    def generate_strategies(self):

        def build_strategy(row):

            if row["emotion"] == "PANIC":

                return (
                    "Avoid direct product selling. "
                    "Start with reassurance."
                )

            elif row["trust_level"] == "TRUSTED":

                return (
                    "Discuss optimization and future planning."
                )

            else:

                return (
                    "Routine advisory engagement."
                )

        self.df["field_strategy"] = (
            self.df.apply(
                build_strategy,
                axis=1
            )
        )

    def get_farmer_profile(self, retailer_id):

        result = self.df[
            self.df["retailer_id"] == retailer_id
        ]

        if result.empty:

            return {
                "success": False,
                "message": "Retailer not found"
            }

        row = result.iloc[0]

        # ====================================================
        # REMOVE NaN VALUES
        # ====================================================

        row = row.replace(
            [np.nan, np.inf, -np.inf],
            "UNKNOWN"
        )

        return {

            "success": True,

            "retailer_id":
                row.get("retailer_id", "UNKNOWN"),

            "farmer_name":
                row.get("farmer_name", "UNKNOWN"),

            "district":
                row.get("district", "UNKNOWN"),

            "trust_level":
                row.get("trust_level", "UNKNOWN"),

            "emotion":
                row.get("emotion", "UNKNOWN"),

            "panic_state":
                row.get("panic_state", "UNKNOWN"),

            "preferred_language":
                row.get("preferred_language", "UNKNOWN"),

            "preferred_channel":
                row.get("preferred_channel", "UNKNOWN"),

            "relationship_stage":
                row.get("relationship_stage", "UNKNOWN"),

            "season_stage":
                row.get("season_stage", "UNKNOWN"),

            "memory_context":
                row.get("memory_context", "UNKNOWN")
        }

    def get_relationship_message(self, retailer_id):

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
            "emotion": row["emotion"],
            "message": row["relationship_message"]
        }

    def get_field_strategy(self, retailer_id):

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
            "preferred_channel": row["preferred_channel"],
            "season_stage": row["season_stage"],
            "strategy": row["field_strategy"]
        }

    def executive_summary(self):

        trusted = (
            self.df["trust_level"]
            .eq("TRUSTED")
            .sum()
        )

        panic = (
            self.df["emotion"]
            .eq("PANIC")
            .sum()
        )

        return {
            "trusted_farmers": int(trusted),
            "panic_state_farmers": int(panic),
            "total_profiles": int(len(self.df))
        }