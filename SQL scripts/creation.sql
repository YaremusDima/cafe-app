

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
    product_cost float,
    product_avatar text
);

create table "Order"(
    order_id int primary key,
    order_date timestamp,
    organisation_id int references Organisation(organisation_id),
    expectation_time timestamp,
    order_amount varchar(30),
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

create table Payment(
    payment_id int primary key ,
    order_id int references "Order"(order_id),
    payment_status int,
    payment_amount varchar(30)
);
create table Order_status(
    order_status int primary key,
    status_description text
);

insert into Products values (33,'Каша','Нереальная вкусная каша', 0.5);
insert into Products values (35,'Кофе','кофе кофе вкусный кофе', 7);
insert into Products values (37,'Жижа','Загадочный бульон', 0.5,'https://prnt.sc/12yd6ka');
insert into Products values (10,'Булка','Много мяса, мало теста', 56,'https://prnt.sc/12yd9hi');
insert into Organisation values (2,'Пищевой комбинат','Здесь вас накормят пищей для души и для тела','https://prnt.sc/12ydbzl');
insert into Organisation values (5,'Кофейная радость','КОФЕ ЖИЖА КОФЕ ЖИЖА КОФЕ ЖИЖА КОФЕ ЖИЖА КОФЕ ЖИЖА ','https://prnt.sc/12ydddy');
insert into Product_status values (2,33,1);
insert into Product_status values (2,10,1);
insert into Product_status values (5,35,1);
insert into Product_status values (5,37,1);
insert into Persons values (188856609,'Володя Мельников');
insert into Person_status values (188856609,2,1);
