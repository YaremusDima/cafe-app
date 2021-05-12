const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'infa',
    password: '1',
    port: 5432,
});

class Organisation {
    organisation_id;
    organisation_name;
    organisation_description;
    organisation_avatar;

    constructor(organization_id, organization_name, organization_description, organisation_avatar) {
        this.organisation_id = organization_id;
        this.organisation_name = organization_name;
        this.organisation_description = organization_description;
        this.organisation_avatar = organisation_avatar;

    }

}

class Product {
    organisation_id;
    product_id;
    product_name;
    product_description;
    product_cost;
    product_avatar;
    product_status;

    constructor(organisation_id, product_id, product_name, product_description, product_cost, product_avatar, product_status) {
        this.organisation_id = organisation_id;
        this.product_id = product_id;
        this.product_name = product_name;
        this.product_description = product_description;
        this.product_cost = product_cost;
        this.product_avatar = product_avatar;
        this.product_status = product_status;

    }

}

class Order {
    order_id;
    order_date;
    organisation_id;
    expectation_time;
    order_status;
    order_amount;
    order_content;

    constructor(order_id,
                order_date,
                organisation_id,
                expectation_time,
                order_status, order_amount,
                order_content) {
        this.order_id = order_id;
        this.order_date = order_date;
        this.organisation_id = organisation_id;
        this.expectation_time = expectation_time;
        this.order_status = order_status;
        this.order_amount = order_amount;
        this.order_content = order_content;
    }
}

class Person {
    person_id;
    person_name;
    person_organisation;
    person_status;

    constructor(person_id, person_name, person_organisation, person_status) {
        this.person_id = person_id;
        this.person_name = person_name;
        this.person_organisation = person_organisation;
        this.person_status = person_status;
    }

}

class Payment {
    order_id;
    payment_id;
    payment_amount;
    payment_status;

    constructor(payment_id, payment_amount, payment_status, order_id) {
        this.payment_amount = payment_amount;
        this.payment_id = payment_id;
        this.payment_status = payment_status;
        this.order_id = order_id;

    }
}

function runQuery(query) {
    client.connect();
    // const query = `Select * from Products`;
    client.query(query, (err, res) => {
        if (err) {
            console.error(err);

        }
        // for (let row of res.rows) {
        console.log(res.rows);
        // }


        client.end();
        return res;
    });

}


//Продукты начало
function insertIntoProducts(data) {
    if (data instanceof Product) {
        const query = `insert into Products values (${data.product_id}, '${data.product_name}','${data.product_description}',${data.product_cost},'${data.product_avatar}')`;
        console.log(runQuery(query));
        const statusquery = `insert into Product_status values (${data.organisation_id},${data.product_id},${data.product_status})`;
        console.log(runQuery(statusquery));
    } else {
        console.error("Wrong object insert");
    }

}

function updateProductStatus(data) {
    if (data.hasOwnProperty('product_id') && data.hasOwnProperty('product_status')) {
        const statusquery = `update Product_status set product_status = ${data.product_status} where product_id = ${data.product_id}`;
        console.log(runQuery(statusquery));
    }
}

function getMenu(organisation_id, request) {
    const query = `select * from Product_status right join products on Product_status.product_id = Products.product_id where organisation_id  =${organisation_id} and Product_name like '%${request}%' order by product_name`;
    return runQuery(query);
}

//Продукты конец

//Заказы начало
function insertIntoOrders(data) {
    if (data instanceof Order) {
        const query = `insert into "Order" values (${data.order_id}, '${data.order_date}',${data.organisation_id},'${data.expectation_time}',${data.order_status})`;
        console.log(runQuery(query));
        for (item in data.order_content.keys) {
            const orderinput = `insert into "Order_content" values (${data.order_id}, ${item},${data.order_content[item]})`;
            console.log(runQuery(orderinput));
        }

    } else {
        console.error("Wrong object insert");
    }

}

function updateOrderStatus(data) {
    if (data.hasOwnProperty('order_id') && data.hasOwnProperty('order_status')) {
        const query = `update "Order" set order_status = ${data.order_status} where order_id = ${data.order_id}`;
        console.log(runQuery(query));

    } else {
        console.error("Wrong input")
    }
}

//Заказы конец

function insertIntoPersons(data) {
    if (data instanceof Person) {
        const query = `insert into Persons values (${data.person_id}, '${data.person_name}')`;
        console.log(runQuery(query));
        const organisation_query = `insert into Person_status values (${data.person_id},${data.person_organisation},${data.person_status})`
        console.log(runQuery(organisation_query));
    } else {
        console.error("Wrong object insert");
    }

}
function getAvailableOrganisation(person_id){
    const query = `select * from Person_status where person_id = ${person_id}`
        return runQuery(query);
}

function getOrganisation(request = '') {
    const query = `select * from Organisation where lower(organisation_name) like lower('%${request}%') order by organisation_name`;
    return runQuery(query);
}

function insertIntoOrganisation(data) {
    if (data instanceof Organisation) {
        const query = `insert into Organisation values (${data.organisation_id}, '${data.organisation_name}','${data.organisation_description}','${data.organisation_avatar}')`;
        console.log(runQuery(query));
    } else {
        console.error("Wrong object insert");
    }

}

function getProduct(request = '') {
    const query = `select * from Products where lower(product_name) like lower('%${request}%') order by product_name`;
    return runQuery(query);
}

function insertPayment(data) {
    if (data instanceof Payment) {

        const query = `insert into Payment values (${data.payment_id},${data.order_id},${data.payment_status},'${data.payment_amount}')`
        console.log(runQuery(organisation_query));
    } else {
        console.error("Wrong object insert");
    }

}

// console.log(getProduct());





