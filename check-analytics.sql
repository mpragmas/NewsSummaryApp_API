SELECT
  (SELECT COUNT(*) FROM analytics_events) AS events,
  (SELECT COUNT(*) FROM user_sessions) AS sessions,
  (SELECT COUNT(*) FROM external_clicks) AS clicks,
  (SELECT COUNT(*) FROM story_impressions) AS impressions,
  (SELECT COUNT(*) FROM publisher_daily_stats) AS daily_stats;
