
-- Creating MusicVideo Table
DROP TABLE IF EXISTS MusicVideo;
CREATE TABLE MusicVideo (
TrackId INTEGER PRIMARY KEY,
VideoDirector TEXT,
FOREIGN KEY (TrackId) REFERENCES tracks(TrackID)
);

-- Insert 10 videos
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (1, "Director 001");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (2, "Director 002");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (3, "Director 003");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (4, "Director 004");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (5, "Director 005");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (6, "Director 006");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (7, "Director 007");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (8, "Director 008");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (9, "Director 009");
INSERT INTO MusicVideo (TrackId, VideoDirector) VALUES (10, "Director 010");

-- Insert Voodoo to MusicVideo without using TrackID
SELECT TrackId FROM tracks WHERE Name = "Voodoo";

INSERT INTO MusicVideo (TrackId, VideoDirector)
SELECT TrackId, "Director Voodoo"
FROM tracks
WHERE Name == "Voodoo";

SELECT * FROM tracks WHERE Name = "Voodoo";


--Write a query that lists all the customers that listen to longerthan average tracks, excluding the tracks that are longer than 15 minutes.
-- 1. Calculate the avg duration
SELECT AVG(Milliseconds) AS avg_length
FROM tracks;

-- 2. Create a intermediate view to filter the tracks that is either shorter than the average or longer than 15 minutes.
DROP VIEW IF EXISTS FilteredTracks;
CREATE VIEW FilteredTracks AS
SELECT DISTINCT TrackId, Milliseconds
FROM tracks
WHERE Milliseconds > (SELECT AVG(Milliseconds) FROM tracks)
AND Milliseconds <= 60*1000*15;

--3. Select distinct customers with their first name and last name
SELECT DISTINCT
customers.FirstName AS firstname,
customers.LastName AS lastname
FROM FilteredTracks
JOIN invoice_items USING(TrackId)
JOIN invoices USING(InvoiceId)
JOIN customers USING(CustomerId);

-- Write a query that lists all the tracks that are not in one of the top 5 genres with longer duration in the database.
DROP VIEW IF EXISTS genre_track_length_ordered;
CREATE VIEW genre_track_length_ordered AS
SELECT genres.Name AS name, genres.GenreId AS gid,
AVG(tracks.Milliseconds) AS avg_length
FROM tracks
JOIN genres USING(GenreId)
GROUP by genres.GenreId;

-- 2: Identify the top 5 genres with the longest average duration
DROP VIEW IF EXISTS top_5_longest_genres;
CREATE VIEW top_5_longest_genres AS
SELECT gid
FROM genre_track_length_ordered
ORDER by avg_length DESC
LIMIT 5;

-- 3: Filter out tracks that belong to one of these top 5 genres
SELECT tracks.TrackId, tracks.Name, tracks.Milliseconds
FROM tracks
WHERE tracks.GenreId NOT IN (SELECT gid FROM top_5_longest_genres);


--Define an insightful query on your own that involves at least three tables

-- Write a query to get a list of tracks that are part of invoices with a total billing amount over $5.
-- 1. Calculate the average track length in the database
-- 2. Identify invoices with a total billing amount over 5
SELECT
invoices.Total AS BillingAmount,
tracks.Name AS TrackName,
tracks.Milliseconds * 1.0 / (1000 * 60) AS TrackLengthInMinutes
FROM invoices
JOIN invoice_items USING(InvoiceId)
JOIN tracks USING (TrackId)
WHERE invoices.Total > 5
AND tracks.Milliseconds < (SELECT AVG(Milliseconds) FROM tracks)
AND tracks.Milliseconds > 3 * 60 * 1000
ORDER BY TrackLengthInMinutes;




