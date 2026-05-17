-- CREATE USER andrei WITH ENCRYPTED PASSWORD 'parola';
-- GRANT ALL PRIVILEGES ON DATABASE cti_2026 TO andrei;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO andrei;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO andrei;

DROP TABLE IF EXISTS produse;
DROP TYPE IF EXISTS categorie_audio;
DROP TYPE IF EXISTS destinatie_utilizare;
DROP TYPE IF EXISTS rating_ip;

CREATE TYPE categorie_audio AS ENUM('Casti In-Ear', 'Casti Over-Ear', 'Boxe', 'Soundbar');
CREATE TYPE destinatie_utilizare AS ENUM (
    'Lifestyle',
    'Studio', 
    'Gaming',             
    'Sport',              
    'Hi-Fi',   
    'Home Cinema'         
);
CREATE TYPE rating_ip AS ENUM('IPX2', 'IPX4', 'IPX5', 'IPX7', 'IP67', 'IP68');

CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(100) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   tip_produs categorie_audio DEFAULT 'Casti In-Ear',
   destinatie_utilizare destinatie_utilizare DEFAULT 'Lifestyle',
   greutate INT NOT NULL CHECK (greutate > 0),
   rezistenta_apa rating_ip,
   caracteristici VARCHAR[],
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   expediat_in_magazin boolean DEFAULT TRUE
);

INSERT INTO produse (nume, descriere, pret, tip_produs, destinatie_utilizare, greutate, rezistenta_apa, caracteristici, imagine, expediat_in_magazin) VALUES 
('Sony WH-1000XM5', 'Căști Over-Ear cu anulare activă a zgomotului, autonomie de 30 de ore, ideale pentru călătorii și birou.', 1800.00, 'Casti Over-Ear', 'Lifestyle', 250, NULL, '{"Anulare zgomot","Microfon","Control tactil"}', 'sony-wh-1000xm5.jpg', TRUE),

('AirPods Pro 2', 'Căști In-Ear true wireless cu audio spațial și anulare avansată a zgomotului de fond.', 1200.00, 'Casti In-Ear', 'Lifestyle', 50, 'IPX4', '{"Anulare zgomot","Incarcare Magsafe"}', 'airpods-pro-2.jpg', TRUE),

('JBL Charge 5', 'Boxă portabilă cu sunet puternic, bas profund și funcție de powerbank integrată.', 700.00, 'Boxe', 'Lifestyle', 960, 'IP67', '{"Powerbank","PartyBoost"}', 'jbl-charge-5.jpg', TRUE),

('Logitech Z906', 'Sistem 5.1 Home Cinema cu sunet surround certificat THX și o putere de 1000W.', 1500.00, 'Boxe', 'Home Cinema', 16000, NULL, '{"Surround 5.1","THX","Telecomanda"}', 'logitech-z906.jpg', FALSE),

('Samsung HW-Q990C', 'Soundbar premium 11.1.4 Dolby Atmos cu subwoofer wireless, ideal pentru Smart TV.', 4500.00, 'Soundbar', 'Home Cinema', 7700, NULL, '{"Dolby Atmos","Q-Symphony","Subwoofer wireless"}', 'samsung-soundbar.jpg', TRUE),

('Sennheiser HD 560S', 'Căști Over-Ear pentru audiofili cu un sunet analitic, open-back, extrem de confortabile.', 900.00, 'Casti Over-Ear', 'Studio', 240, NULL, '{"Open-back","Conector jack 6.3mm"}', 'sennheiser-hd560s.jpg', FALSE),

('Bose SoundLink Micro', 'Boxă ultra-portabilă rezistentă la apă și șocuri, cu clemă pentru prindere la rucsac.', 550.00, 'Boxe', 'Sport', 290, 'IP67', '{"Microfon","Portabilitate"}', 'bose-soundlink-micro.jpg', TRUE),

('HyperX Cloud III', 'Căști de gaming extrem de confortabile cu microfon detașabil și sunet spațial.', 450.00, 'Casti Over-Ear', 'Gaming', 320, NULL, '{"Sunet spatial","Microfon detasabil","Gaming"}', 'hyperx-cloud-iii.jpg', TRUE),

('Beats Studio Buds', 'Căști In-Ear compacte cu anulare a zgomotului și compatibilitate nativă pe iOS și Android.', 750.00, 'Casti In-Ear', 'Lifestyle', 45, 'IPX4', '{"Anulare zgomot","Compatibilitate universala"}', 'beats-studio-buds.jpg', TRUE),

('Sonos Arc', 'Soundbar inteligent premium pentru TV, muzică și gaming cu suport asistent vocal.', 4200.00, 'Soundbar', 'Home Cinema', 6250, NULL, '{"Dolby Atmos","Asistent vocal","Design premium"}', 'sonos-arc.jpg', TRUE);
