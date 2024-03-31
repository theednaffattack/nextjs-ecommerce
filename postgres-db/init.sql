CREATE USER ecommerce_user;
CREATE DATABASE ecommerce_db;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce_user;

\connect ecommerce_db;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA ecommerce_schema;

CREATE TABLE ecommerce_schema.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT,
    price_in_cents INTEGER,
    order_ids UUID,
    download_verification_ids UUID,
    created_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP
);

CREATE TABLE ecommerce_schema.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT,
    price_in_cents INTEGER,
    product_id UUID,
    user_id UUID,
    created_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP

);

CREATE TABLE ecommerce_schema.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT,
    created_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP,
    updated_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP

);

CREATE TABLE ecommerce_schema.download_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    product_id UUID,
    created_at TIMESTAMP with time zone not null default CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

alter table ecommerce_schema.products add foreign key (order_ids) REFERENCES ecommerce_schema.orders(id) ON DELETE RESTRICT;
alter table ecommerce_schema.products add foreign key (download_verification_ids) REFERENCES ecommerce_schema.download_verifications(id) ON DELETE CASCADE;
alter table ecommerce_schema.orders add foreign key (product_id) REFERENCES ecommerce_schema.products(id) ON DELETE RESTRICT;
alter table ecommerce_schema.orders add foreign key (user_id) REFERENCES ecommerce_schema.users(id)  ON DELETE CASCADE;
alter table ecommerce_schema.download_verifications add foreign key (product_id) REFERENCES ecommerce_schema.products(id) ON DELETE CASCADE;
