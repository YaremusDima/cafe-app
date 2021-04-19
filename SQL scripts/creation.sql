

create table Organisation(
    organisation_id int primary key,
    organisation_name varchar(30),
    organisation_description text,
    organisation_avatar text
);

create table Products(
    product_id int primary key,
    product_name varchar(30),
    product_description text,
    product_cost float
);

create table "Order"(
    order_id int primary key,
    order_date timestamp,
    organisation_id int references Organisation(organisation_id),
    expectation_time timestamp,
    order_status int
);
create table Persons(
    person_id int primary key,
    person_name varchar(30)
);

create table Order_content(
    order_id int  references "Order"(order_id),
    product_id int  references Products(product_id),
    amount int,
    primary key (order_id,product_id)
    );

create table Person_status(
    person_id int  references Persons(person_id),
    organisation_id int   references  Organisation(organisation_id),
    person_status int,
    primary key (person_id,organisation_id)
);

create table Product_status(
    organisation_id int   references  Organisation(organisation_id),
    product_id int references Products(product_id),
    product_status int,
    primary key(organisation_id,product_id)

);

