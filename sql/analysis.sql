-- Applications per platform 
SELECT 
	platform AS "How I Applied",
	COUNT(*) AS "Number of Applications", 
	SUM(CASE WHEN is_tech == "Tech" THEN 1 ELSE 0 END) AS "Tech",
	SUM(CASE WHEN is_tech == "Non-Tech" THEN 1 ELSE 0 END) AS "Non-Tech"
	FROM my_applications
	GROUP BY platform;  -- add  status?

-- Tech vs non-tech counts
SELECT is_tech AS "Tech or Non-Tech", COUNT(*) AS "Number of Applications"
	FROM my_applications
	GROUP BY is_tech;
	
-- Response Rate = use CASE for 
SELECT status, COUNT(*) AS "Number of Applications"
	FROM my_applications
	GROUP BY status;

-- Interview Rate