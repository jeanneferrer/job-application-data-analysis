# Job Application Data Analysis
A data analysis project exploring job application trends, response rates, and hiring outcomes to improve job search strategy using visualization tools.

## Project Overview
This project analyzes personal job application data to understand trends in application platforms, role types (tech vs non-tech), and hiring outcomes.
</br>
</br>The goal is to practice data analysis skills using real-world data and generate insights that can improve job search strategy.

## Files of Project
- `data/`: contains both CSV and db verions of the cleaned data set
- `docs/`: contains the frontend for the dashboard
- `exports/`: contains results of queries from `sql/analysis.sql`
- `notebooks/`: placeholder folder for Jupyter notebook for future implementation
- `scripts/`: contains automation Python scripts
- `sql/analysis.sql`: SQL queries for practice and to generate CSVs

## Dataset
The initial dataset includes the following columns:
- Company
- Specific Role
- Type: Tech or Non-Tech
- Via What: Cold Email, Website Application, Indeed, Glassdoor, LinkedIn, Job Bank, Other Job Board
- Status: Applied, Ghosted, Rejected (App), Rejected (Interview), Not Interested (App), Not Interested (Interview Offer), OFFER!!!!
### To Add
- Application Date (Backtrack via resume PDF creation date)
- Interview Date (Backtrack via email or Indeed/LinkedIn)
- Rejection Date (Backtrack via email or Indeed/LinkedIn) 

## Tools and Languages
- Python
- SQL (DB Browser for SQLite)
- HTML/CSS/JS
- Chart.js

## TODO: Add a simple architecture diagram
