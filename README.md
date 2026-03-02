# Job Application Data Analysis
A data analysis project exploring job application trends, response rates, and hiring outcomes to improve job search strategy using Python and visualization tools.

## Project Overview
This project analyzes personal job application data to understand trends in application platforms, role types (tech vs non-tech), and hiring outcomes.
</br>
</br>The goal is to practice data analysis skills using real-world data and generate insights that can improve job search strategy.

## Files of Project
- `data/`: contains both CSV and db verions of the cleaned data set
- `exports/`: contains results of queries from `sql/analysis.sql`
- `sql/analysis.sql`: SQL queries for practice and to generate CSVs

## Dataset
The dataset includes the following columns:
- Company
- Specific Role
- Type (Tech / Non-Tech)
- Via What (Cold Email, Website Application, Job Board Listing)
- Status (Applied, Interviewed, Rejected, Offer)
### To Add
- Application Date (Backtrack via resume PDF creation date)
- Interview Date (Backtrack via email or Indeed/LinkedIn)
- Rejection Date (Backtrack via email or Indeed/LinkedIn) 

## Tools and Languages
- Python (pandas, matplotlib) & Jupyter Notebook
- SQL (DB Browser for SQLite)
