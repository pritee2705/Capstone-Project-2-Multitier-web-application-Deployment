CREATE DATABASE IF NOT EXISTS idms_db;
USE idms_db;

CREATE TABLE IF NOT EXISTS batches (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interns (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    intern_id        VARCHAR(20)  NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    mobile_number    VARCHAR(15)  NOT NULL,
    id_card_type     ENUM('FREE','PREMIUM') NOT NULL,
    date_of_joining  DATE NOT NULL,
    batch_id         BIGINT NOT NULL,
    sequence_no      INT NOT NULL,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_intern_batch
        FOREIGN KEY (batch_id) REFERENCES batches(id),
    CONSTRAINT uq_batch_sequence
        UNIQUE (batch_id, sequence_no)
);