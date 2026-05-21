import pandas as pd
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

BASE_DIR = Path(__file__).resolve().parent.parent.parent

DATA_PATH = BASE_DIR / "datasets" / "territory_decision_engine.csv"
MODEL_PATH = BASE_DIR / "app" / "ml" / "models" / "stockout_model.pkl"

FEATURE_COLUMNS = [
    "weekly_sales",
    "weekly_revenue",
    "sales_growth",
    "sales_momentum",

    "inventory_qty",
    "avg_inventory",
    "inventory_risk",
    "inventory_risk_norm",

    "engagement_score",
    "engagement_score_norm",

    "rep_coverage_score",
    "coverage_score_norm",

    "territory_health_score",
    "urgency_score",
    "opportunity_score"
]


def load_data():

    df = pd.read_csv(DATA_PATH)

    df = df.sort_values(
        ["territory_id", "week"]
    )

    df["future_stockout"] = (
        df.groupby("territory_id")["stockout_count"]
        .shift(-1)
    )

    df["future_stockout_flag"] = (
        df["future_stockout"] > 0
    ).astype(int)

    df = df.dropna(
        subset=["future_stockout"]
    )

    ml_data = df[
        FEATURE_COLUMNS +
        ["future_stockout_flag"]
    ].copy()

    ml_data = ml_data.fillna(0)

    return ml_data


def train_model():

    ml_data = load_data()

    X = ml_data[FEATURE_COLUMNS]

    y = ml_data["future_stockout_flag"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )

    model.fit(X_train, y_train)

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    joblib.dump(model, MODEL_PATH)

    return {
        "message": "Stockout model trained successfully"
    }


def load_model():

    if not MODEL_PATH.exists():
        train_model()

    return joblib.load(MODEL_PATH)


def predict_stockout(input_data: dict):

    model = load_model()

    input_df = pd.DataFrame([input_data])

    prediction = model.predict(input_df)[0]

    probability = model.predict_proba(input_df)[0][1]

    return {
        "stockout_risk": int(prediction),
        "risk_probability": round(float(probability), 4),
        "risk_level": (
            "HIGH"
            if probability > 0.7
            else "MEDIUM"
            if probability > 0.4
            else "LOW"
        )
    }