SELECT is_tech AS "Types of Applications", COUNT(*) AS "Number of Applications"
	FROM my_applications
	GROUP BY is_tech;

SELECT *
	FROM my_applications
	WHERE platform == "Cold Email";