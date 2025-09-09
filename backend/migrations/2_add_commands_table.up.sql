CREATE TABLE commands (
  id SERIAL PRIMARY KEY,
  mission_id INT NOT NULL,

  name VARCHAR(64) UNIQUE NOT NULL,
  description VARCHAR(256),
  args JSONB NOT NULL,
  
  CONSTRAINT fk_mission FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);
