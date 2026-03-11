-- =====================================================
-- 1. DATASET OVERVIEW
-- =====================================================

-- Total rows/applications
SELECT COUNT(*) AS "total_applications" FROM my_applications;

-- Unique Platforms (initial query, expand dataset)
SELECT platform FROM my_applications GROUP BY platform;

-- Unique Statuses
SELECT status FROM my_applications GROUP BY status;

-- Tech vs Non-Tech Distribution
SELECT company, specific_role FROM my_applications WHERE is_tech = "Tech" ORDER BY specific_role;
SELECT company, specific_role FROM my_applications WHERE is_tech = "Non-Tech" ORDER BY specific_role;

-- =====================================================
-- 2. APPLICATION DISTRIBUTION
-- =====================================================

-- Applications per platform
SELECT platform, COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY platform;

-- EXPORTED Applications per platform w/ tech split
SELECT platform, COUNT(*) AS "num_of_applications", 
	SUM(CASE WHEN is_tech == "Tech" THEN 1 ELSE 0 END) AS "num_of_tech",
	SUM(CASE WHEN is_tech == "Non-Tech" THEN 1 ELSE 0 END) AS "num_of_nontech"
	FROM my_applications
	GROUP BY platform;
	
-- Applications per platform percentage

-- Ranking platforms by application volume
SELECT platform, COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY platform
	ORDER BY num_of_applications DESC;

-- =====================================================
-- 3. ROLE TARGETING
-- =====================================================

-- EXPORTED Tech vs non-tech totals
SELECT is_tech AS "tech_or_nontech", COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY is_tech;
	
-- Tech vs non-tech percentage

-- Tech vs non-tech per platform

-- =====================================================
-- 4. RESPONSE ANALYSIS
-- =====================================================

-- EXPORTED Count per status
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

-- response vs no-response categories

-- response rate overall

-- response rate per platform

-- =====================================================
-- 5. INTERVIEW ANALYSIS
-- =====================================================

-- Interview-related statuses
SELECT status, COUNT(*) AS "num_of_applications"
	FROM my_applications
	WHERE status = "Rejected (Interview)" OR status = "OFFER!!!!" OR status = "Not Interested (Interview Offer)"
	GROUP BY status;

-- interview rate overall

-- interview rate per platform

-- interview outcomes

-- =====================================================
-- 6. OFFER ANALYSIS
-- =====================================================

-- offer counts

-- offer rate overall

-- offer rate relative to interviews

-- =====================================================
-- 7. HIRING FUNNEL
-- =====================================================

-- total applications
-- responses
-- interviews
-- offers

-- =====================================================
-- 8. TIME ANALYSIS (LATER, WILL HAVE TO REDO DATASET)
-- =====================================================

-- applications per month
-- responses over time
-- interview timeline