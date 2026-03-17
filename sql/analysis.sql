-- =====================================================
-- JOB APPLICATION DATA ANALYSIS
-- Author: Jeanne Ferrer
-- Database: job_applications.db
-- Table: my_applications
--
-- This file contains exploratory and analytical SQL
-- queries used to understand job application trends,
-- response rates, and hiring outcomes.
-- =====================================================

-- =====================================================
-- 1. DATASET OVERVIEW
-- =====================================================

-- Total rows/applications
SELECT COUNT(*) AS "total_applications" FROM my_applications;

-- Unique Platforms (will have to expand dataset, specific platform instead of "Job Board Listing")
SELECT DISTINCT platform FROM my_applications;

-- Unique Statuses
SELECT DISTINCT status FROM my_applications;

-- Tech vs Non-Tech Inspection
SELECT company, specific_role FROM my_applications WHERE is_tech = "Tech" ORDER BY specific_role;
SELECT company, specific_role FROM my_applications WHERE is_tech = "Non-Tech" ORDER BY specific_role;

-- =====================================================
-- 2. APPLICATION DISTRIBUTION
-- =====================================================

-- Applications per platform
SELECT platform, COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY platform;

-- EXPORT: Applications per platform w/ tech split
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

-- Tech vs non-tech totals
SELECT is_tech AS "tech_or_nontech", COUNT(*) AS "num_of_applications"
	FROM my_applications
	GROUP BY is_tech;
	
-- Tech vs non-tech percentage

-- Tech vs non-tech per platform

-- =====================================================
-- 4. RESPONSE ANALYSIS
-- =====================================================

-- Count per status
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
SELECT 
	(SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("Not Interested (Interview Offer)", "Rejected (App)", "Rejected (Interview)", "OFFER!!!!")) AS "response",
	(SELECT COUNT(*) AS "no_response_count" FROM my_applications WHERE status 
		IN ("Applied", "Ghosted")) AS "no_response";

-- EXPORT: response rate overall
SELECT 
	((SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("Not Interested (Interview Offer)", "Rejected (App)", "Rejected (Interview)", "OFFER!!!!"))) * 1.0 /(SELECT COUNT(*) FROM my_applications) AS "response_rate",
	((SELECT COUNT(*) AS "no_response_count" FROM my_applications WHERE status 
		IN ("Applied", "Ghosted"))) * 1.0 /(SELECT COUNT(*) FROM my_applications) AS "no_response_rate";

-- EXPORT: response rate per platform
SELECT
	platform,
	((SELECT COUNT(*) FROM my_applications AS sub WHERE sub.platform = my_applications.platform AND sub.status 
		IN ("Not Interested (Interview Offer)", "Rejected (App)", "Rejected (Interview)", "OFFER!!!!"))) * 1.0 /(SELECT COUNT(*) FROM my_applications AS sub2 WHERE sub2.platform = my_applications.platform) AS "response_rate",
	((SELECT COUNT(*) AS "no_response_count" FROM my_applications AS sub3 WHERE sub3.platform = my_applications.platform AND sub3.status 
		IN ("Applied", "Ghosted"))) * 1.0 /(SELECT COUNT(*) FROM my_applications AS sub4 WHERE sub4.platform = my_applications.platform) AS "no_response_rate"
	FROM my_applications
	GROUP BY platform;

-- =====================================================
-- 5. INTERVIEW ANALYSIS
-- =====================================================

-- Interview-related statuses
SELECT status, COUNT(*) AS "num_of_applications"
	FROM my_applications
	WHERE status IN ("Rejected (Interview)", "OFFER!!!!", "Not Interested (Interview Offer)")
	GROUP BY status;

-- EXPORT: interview rate overall
SELECT
	((SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("Rejected (Interview)", "OFFER!!!!", "Not Interested (Interview Offer)"))) * 1.0 /(SELECT COUNT(*) FROM my_applications) AS "interview_rate";

-- interview rate per platform
SELECT
	platform,
	((SELECT COUNT(*) FROM my_applications AS sub WHERE sub.platform = my_applications.platform AND sub.status 
		IN ("Rejected (Interview)", "OFFER!!!!", "Not Interested (Interview Offer)"))) * 1.0 /(SELECT COUNT(*) FROM my_applications AS sub2 WHERE sub2.platform = my_applications.platform) AS "interview_rate"
	FROM my_applications
	GROUP BY platform;

-- interview outcomes

-- =====================================================
-- 6. OFFER ANALYSIS
-- =====================================================

-- offer counts

-- EXPORT: offer rate overall
SELECT
	((SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("OFFER!!!!"))) * 1.0 /(SELECT COUNT(*) FROM my_applications) AS "offer_rate";

-- offer rate relative to interviews
SELECT
	((SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("OFFER!!!!"))) * 1.0 /(SELECT COUNT(*) FROM my_applications WHERE status 
		IN ("Rejected (Interview)", "OFFER!!!!", "Not Interested (Interview Offer)")) AS "offer_to_interview_rate";

-- =====================================================
-- 7. HIRING FUNNEL
-- =====================================================

-- total applications
-- responses
-- interviews
-- offers

-- EXPORT: hiring funnel
SELECT "Applied" AS "stage", COUNT(*) AS "count" FROM my_applications
UNION ALL
SELECT "Response" AS "stage", COUNT(*) AS "count" FROM my_applications WHERE status 
	IN ("Not Interested (Interview Offer)", "Rejected (App)", "Rejected (Interview)", "OFFER!!!!")
UNION ALL
SELECT "Interview" AS "stage", COUNT(*) AS "count" FROM my_applications WHERE status 
	IN ("Rejected (Interview)", "OFFER!!!!", "Not Interested (Interview Offer)")
UNION ALL
SELECT "Offer" AS "stage", COUNT(*) AS "count" FROM my_applications WHERE status 
	IN ("OFFER!!!!");

-- =====================================================
-- 8. TIME ANALYSIS (LATER, WILL HAVE TO EXPAND DATASET, TO BE EXPORTED)
-- =====================================================

-- applications per month
-- responses over time
-- interview timeline