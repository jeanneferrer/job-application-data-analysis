-- Applications per platform (exported)
SELECT 
	platform,
	COUNT(*) AS "num_of_applications", 
	SUM(CASE WHEN is_tech == "Tech" THEN 1 ELSE 0 END) AS "num_of_tech",
	SUM(CASE WHEN is_tech == "Non-Tech" THEN 1 ELSE 0 END) AS "num_of_nontech"
	FROM my_applications
	GROUP BY platform;

-- Tech vs non-tech counts (exported)
SELECT is_tech AS "tech_or_nontech", COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY is_tech;
	
-- Response Rate (exported)
SELECT status, COUNT(*) AS "no_of_applications"
	FROM my_applications
	GROUP BY status
	ORDER BY CASE
			WHEN (status = "Applied") THEN 1
			WHEN (status = "Ghosted") THEN 2
			WHEN (status = "Rejected (App)") THEN 3
			WHEN (status = "Not Interested (App)") THEN 4
			WHEN (status = "Not Interested (Interview Offer)") THEN 5
			WHEN (status = "Rejected (Interview)") THEN 6
			WHEN (status = "OFFER!!!!") THEN 7
		END; 

SELECT COUNT(*) AS "total_applications"
	FROM my_applications;

-- Interview Rate 
SELECT status, COUNT(*) AS "num_of_applications"
	FROM my_applications
	WHERE status = "Rejected (Interview)" OR status = "OFFER!!!!" OR status = "Not Interested (Interview Offer)"
	GROUP BY status;

-- Hiring Funnel 

-- Applications Over Time (to be sorted and then exported)