import pandas as pd
from pathlib import Path

# add folder cleaning before processing

# paths
BASE_DIR = Path(__file__).resolve().parent.parent
EXPORTS_DIR = BASE_DIR / "exports"
DOCS_DATA_DIR = BASE_DIR / "docs" / "data"

# make sure output folder exists
DOCS_DATA_DIR.mkdir(parents=True, exist_ok=True)

# loop through all csv files
for file in EXPORTS_DIR.glob("*.csv"):
    df = pd.read_csv(file)

    # optional: clean column names
    df.columns = [col.lower().strip().replace(" ", "_") for col in df.columns]

    # save to docs/data
    output_file = DOCS_DATA_DIR / file.name
    df.to_csv(output_file, index=False)

    print(f"Processed: {file.name}")