-- Applications per platform 
SELECT platform AS "How I Applied", COUNT(*) AS "Number of Applications"
	FROM my_applications
	GROUP BY platform; -- Note: add how many tech and non tech?

-- Tech vs non-tech counts
SELECT is_tech AS "Tech or Non-Tech", COUNT(*) AS "Number of Applications"
	FROM my_applications
	GROUP BY is_tech;
	
-- Response Rate 

-- Interview Rate