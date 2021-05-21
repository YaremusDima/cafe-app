import React, {useState, useEffect, Fragment} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {
    Icon16Add,
    Icon16Minus,
    Icon24Error,
    Icon28ClipOutline,
    Icon28MessageOutline,
    Icon28NewsfeedOutline,
    Icon28ServicesOutline,
    Icon28AppleOutline,
    Icon28ChefHatOutline,
    Icon28ArticleOutline,
    Icon28BoxHeartOutline,
    Icon28LocationMapOutline,
    Icon28StorefrontOutline,
    Icon28WalletOutline,
    Icon28MarketSlashOutline,
    Icon28ShoppingCartOutline,
    Icon28ThumbsUpOutline,
} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';
import Intro from './panels/Intro';
import {
    AdaptivityProvider, AppRoot,
    Cell, ConfigProvider, FormItem, FormLayout, Headline,
    Panel, PanelHeaderBack, PanelHeaderContent,
    Placeholder,
    Snackbar,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem, Title,
    usePlatform, ViewWidth, VKCOM,
    withAdaptivity
} from "@vkontakte/vkui";
import * as PropTypes from "prop-types";
import {Epic} from "@vkontakte/vkui/dist/components/Epic/Epic";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
//import tort from './img/cake.jpg'
//import cap from './img/cappucino.jpg'
import zachet from './img/zachet.jpg'
import ardis from './img/ardis.jpg'
import boltay from './img/boltay.jpg'
import nk from './img/nk.jpg'
import fsh from './img/fsh.jpg'
import Button from "@vkontakte/vkui/dist/components/Button/Button";
//import {object} from "prop-types";

const ROUTES = {
    RESTS: 'rests',
    INTRO: 'intro',
    FOOD: 'food',
    BASKET: 'basket',
    ORDERS: 'orders',
    OFFERS: 'offers',
};

const STORAGE_KEYS = {
    STATUS: 'status',
}

Snackbar.propTypes = {
    before: PropTypes.element,
    layout: PropTypes.string,
    onClose: PropTypes.func,
    duration: PropTypes.number,
    children: PropTypes.node
};

var BASKET = {}
var currentOrganisationChoice = ''
var basketCost = 0
var orderTime
var payWay = 'nal'
var ordersAmount = 2
var orders = {}
/* orderId1: {
     basket: {
         productId1: 10,
         productId2: 2
     },
     time: '22:22',
     payWay: 'nal',
     cost: 1300,
     status: 'обрабатывается',
     organisation: 'restId1'
 },
 orderId2: {
     basket: {
         productId5: 3,
         productId6: 5
     },
     time: '19:20',
     payWay: 'karta',
     cost: 1488,
     status: 'отклонен',
     organisation: 'restId3'
 }
}*/
//ordersAmount = 0
//orders = []

//для payWay возможны три варианта: наличные в ресторане - nal; карта в ресторане - karta; карта онлайн - online

const App = () => {
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>)
    const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const [activeStory, setActiveStory] = React.useState('intro');
    const [activePanelRests, setActivePanelRests] = React.useState("rests");
    const [activePanelFood, setActivePanelFood] = React.useState("food");
    const [activePanelOffers, setActivePanelOffers] = React.useState("offers");
    const [activePanelOrders, setActivePanelOrders] = React.useState("orders")
    const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);

    useEffect(() => {
        bridge.subscribe(({detail: {type, data}}) => {
            if (type === 'VKWebAppUpdateConfig') {
                const schemeAttribute = document.createAttribute('scheme');
                schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
                document.body.attributes.setNamedItem(schemeAttribute);
            }
        });

        async function fetchData() {
            const user = await bridge.send('VKWebAppGetUserInfo');
            const storageData = await bridge.send('VKWebAppStorageGet', {
                keys: Object.values(STORAGE_KEYS)
            });
            const data = {};
            storageData.keys.forEach(({key, value}) => {
                try {
                    data[key] = value ? JSON.parse(value) : {};
                    switch (key) {
                        case STORAGE_KEYS.STATUS:
                            if (data[key] && data[key].hasSeenIntro) {
                                setActiveStory(ROUTES.RESTS);
                                setUserHasSeenIntro(true);
                            }
                            break;
                        default:
                            break;
                    }
                    //setActiveStory(ROUTES.INTRO)
                    //setUserHasSeenIntro(false)
                } catch (error) {
                    setSnackbar(<Snackbar
                            layout='vertical'
                            onClose={() => setSnackbar(null)}
                            before={
                                <Avatar size={24} style={{backgroundColor: 'var(--dynamic-red)'}}
                                ><Icon24Error fill='#fff' width='14' height='14'/></Avatar>
                            }
                            duration={988}
                        >
                            Проблема с получением данных из Storage
                        </Snackbar>
                    );
                }

            });
            let k = 0
            while ((user === null) && (k < 1000)) {
                k += 1;
            }
            if (k < 1000) {
                setUser(user)
            }
            setPopout(null);
        }

        fetchData();
    }, []);

    const go = view => {
        setActiveStory(view);
        setActivePanelRests(view);
    };

    const goPanelRests = (panel) => {
        setActivePanelRests(panel);
    };

    const goPanelFood = (panel) => {
        setActivePanelRests(panel);
    };

    const goPanelBasket = (panel) => {
        setActivePanelRests(panel);
    };

    const goPanelOffers = (panel) => {
        setActivePanelRests(panel);
    };

    const goPanelOrders = (panel) => {
        setActivePanelOrders(panel)
    }
    const viewIntro = async () => {
        try {
            await bridge.send('VKWebAppStorageSet', {
                key: STORAGE_KEYS.STATUS,
                value: JSON.stringify({
                    hasSeenIntro: true,
                }),
            });
            go(ROUTES.RESTS);
        } catch (error) {
            setSnackbar(<Snackbar
                    layout='vertical'
                    onClose={() => setSnackbar(null)}
                    before={<Avatar size={24} style={{backgroundColor: 'var(--dynamic_red)'}}>
                        <Icon24Error fill='#fff' width={14} height={14}/></Avatar>}
                    duration={900}
                >
                    Проблема с отправкой данных в Storage
                </Snackbar>
            );
        }
    }

////////////////////////////////////////// Это функции для создания страниц организаций

    function getOrganisation() {
        return {
            restId1: {
                restName: 'Зачет',
                restDesc: 'Место совсем близко от Московского Физтеха,' +
                    ' качество обслуживания среднее, вентиляция хромает, еда хорошая.',
                restPic: zachet,
                restLocation: 'Долгопрудный, Институтский переулок 6'
            },
            restId2: {
                restName: 'Ардис',
                restDesc: 'Маленький магазин с самыми необходимыми продуктами и овощной палаткой в студгородке.',
                restPic: ardis,
                restLocation: 'Долгопрудный, Институтский переулок 6'
            },
            restId3: {
                restName: 'Болтай',
                restDesc: 'Как кофейня достаточно неплохая, кофе хороший, но цены очень завышены для Долгопрудного.' +
                    ' Как кафе или ресторан не очень. Покупают выпечку и торты из другой перкарни и продают дороже.' +
                    ' Еда собственного приготовления вкусная, но цены такие же, как и в кафешках в самом центре Москвы.',
                restPic: boltay,
                restLocation: 'Долгопрудный, Институтский переулок 8'
            },
            restId4: {
                restName: 'Кофейня НК',
                restDesc: 'Это уютное и атмосферное место, где вы можете отдохнуть и насладиться горячим ароматным кофе',
                restPic: nk,
                restLocation: 'Долгопрудный, Первомайская 5'
            },
            restId5: {
                restName: 'Формула шаурмы',
                restDesc: 'Отличная шаурма гигантских размеров. Кладут много майонеза и перепутали острую с не острой два раза подряд.' +
                    ' Но это ерунда. Плюс есть блины с начинками. И выпечка. Цены суперадекват. Вкусно. Даже есть доставка и сайт!!!)' +
                    ' Вот это уровень! Молодцы! Народу много, но обслуживание быстрое.',
                restPic: fsh,
                restLocation: 'Долгопрудный, Первомайская 7а'
            }
        }
    }

    function getMenu(rest_id) {
        if (rest_id === 'restId1') {
            return {
                productId1: {prodName: 'тортик', prodPic: zachet, prodPrice: 420, prodOrgId: 'restId1'},
                productId2: {prodName: 'жаркое', prodPic: zachet, prodPrice: 500, prodOrgId: 'restId1'}
            }
        }
        if (rest_id === 'restId2') {
            return {
                productId3: {prodName: 'монстер', prodPic: ardis, prodPrice: 100, prodOrgId: 'restId2'},
                productId4: {prodName: 'пиво', prodPic: ardis, prodPrice: 120, prodOrgId: 'restId2'}
            }
        }
        if (rest_id === 'restId3') {
            return {
                productId5: {prodName: 'каппучино', prodPic: boltay, prodPrice: 160, prodOrgId: 'restId3'},
                productId6: {prodName: 'чиабатта', prodPic: boltay, prodPrice: 210, prodOrgId: 'restId3'},
            }
        }
        if (rest_id === 'restId4') {
            return {
                productId7: {prodName: 'каппучино', prodPic: nk, prodPrice: 130, prodOrgId: 'restId4'},
                productId8: {prodName: 'эспрессо', prodPic: nk, prodPrice: 80, prodOrgId: 'restId4'},
                productId9: {prodName: 'латте', prodPic: nk, prodPrice: 110, prodOrgId: 'restId4'}
            }
        }
        if (rest_id === 'restId5') {
            return {
                productId10: {prodName: 'шавуха', prodPic: fsh, prodPrice: 140, prodOrgId: 'restId5'},
                productId11: {prodName: 'шавуха сырная', prodPic: fsh, prodPrice: 160, prodOrgId: 'restId5'},
            }
        }
    };

    function printRests(rests, go) {
        let ans = []
        for (let prop in rests) {
            ans.push(
                <Cell expandable before={<img src={rests[prop].restPic} height={'50'}/>}
                      after={rests[prop].restLocation} onClick={() => go(prop)}>{rests[prop].restName}</Cell>
            )
        }
        return ans;
    }

    /*
    ниже в функции при action = 0 - начальный запуск, когда попадаем на страницу ресторана
                       action = 1 - запуск по нажатию кнопки +
                       action = -1 - запуск по нажатию кнопки -

     */


    function changeAmount(prod_id, action, organisation, price) {
        let totCell = document.getElementById(prod_id)
        let iTotCell = document.getElementById(prod_id + 'InBasket')
        let priceCell = document.getElementById('finalCost')
        let labelCell = document.getElementById('basketLabel')
        console.log('step1')
        if (!BASKET.hasOwnProperty(prod_id)) {
            console.log('newOne')
            BASKET[prod_id] = 0
        }
        if (action === 1) {
            if ((organisation === currentOrganisationChoice) || (currentOrganisationChoice === '')) {
                currentOrganisationChoice = organisation
                console.log(organisation)
                console.log('plus')
                BASKET[prod_id] += 1
                basketCost += price
                console.log(BASKET)
                let newNumber = BASKET[prod_id]
                let newCost = basketCost
                if (totCell !== null) {
                    totCell.textContent = newNumber
                }
                if (iTotCell !== null) {
                    iTotCell.textContent = newNumber
                }
                if (priceCell !== null) {
                    priceCell.textContent = `Стоимость заказа: ${newCost} руб`
                }
                if (labelCell !== null) {
                    labelCell.textContent = `${getAmountOfFoodInBasket()}`
                }
            } else {
                {
                    setSnackbar(<Snackbar
                            layout='vertical'
                            onClose={() => setSnackbar(null)}
                            before={
                                <Icon24Error fill='#fff' width='100' height='100'/>
                            }
                            duration={988}
                        >
                            В корзину можно одновременно добавлять товары только из одного ресторана!
                        </Snackbar>
                    );
                }
                alert('В корзину можно одновременно добавлять товары только из одного ресторана!')
            }
        }
        if ((action === -1) && (BASKET[prod_id] > 0)) {
            console.log('minus')
            BASKET[prod_id] += -1
            basketCost += -price
            console.log(BASKET)
            let newNumber = BASKET[prod_id]
            let newCost = basketCost
            if (totCell !== null) {
                totCell.textContent = newNumber
            }
            if (iTotCell !== null) {
                iTotCell.textContent = newNumber
            }
            if (priceCell !== null) {
                priceCell.textContent = `Стоимость заказа: ${newCost} руб`
            }
            if (labelCell !== null) {
                labelCell.textContent = `${getAmountOfFoodInBasket()}`
            }
            let basketEmpty = true
            for (let food in BASKET) {
                if (BASKET[food] > 0) {
                    basketEmpty = false
                }
            }
            if (basketEmpty) {
                currentOrganisationChoice = ''
            }
        }
    }

    function printProds(prods) {
        console.log(BASKET)
        let ans = []
        for (let prop in prods) {
            if (!BASKET.hasOwnProperty(prop)) {
                BASKET[prop] = 0
            }
            ans.push(
                <Cell expandable before={<img src={prods[prop].prodPic} height={'50'}/>} after={
                    <Group>
                        {
                            <SplitLayout>
                                <Button before={<Icon16Minus/>} mode="tertiary"
                                        onClick={() => changeAmount(prop, -1, prods[prop].prodOrgId, prods[prop].prodPrice)}/>
                                <Cell id={prop}>{BASKET[prop]}</Cell>
                                <Button before={<Icon16Add/>} mode="tertiary"
                                        onClick={() => changeAmount(prop, 1, prods[prop].prodOrgId, prods[prop].prodPrice)}/>
                            </SplitLayout>
                        }
                    </Group>
                }>{prods[prop]['prodName']}<font color={'grey'}> - {prods[prop].prodPrice} руб</font></Cell>
            )
        }
        ;
        return ans;
    }

    function getProps(obj) {
        let answer = Object.keys(obj).reduce(function (ans, item) {
            let temp = '' + ans + item + ": " + obj[item] + ", ";
            return temp
        }, '')
        return answer.substring(0, answer.length - 2);
    }

    function createRestsPanels(rests, go) {
        let res = []
        for (let rest in rests) {
            res.push(
                <Panel id={rest}>
                    <PanelHeader left={<PanelHeaderBack onClick={() => go("rests")}/>}
                                 separator={false}>Организации</PanelHeader>
                    <Group style={{height: '1000px'}}>
                        <Header mode={'primary'}><b><big>
                            {rests[rest]['restName']}</big></b></Header>
                        <Div><em>
                            {rests[rest]['restDesc']}
                        </em></Div>
                        <Header mode={'primary'}><b>
                            <medium>Меню:</medium>
                        </b></Header>
                        <Div id="prod">
                            {printProds(getMenu(rest))}
                        </Div>
                    </Group>
                </Panel>
            )
        }
        return res
    }

    ///////////////////////////////////////////функции и переменные для работы с корзиной

    function orderSend(basket, time, payWay, cost) {
        console.log('отправляем данные Володе')
        ordersAmount += 1
        orders[`orderId${ordersAmount}`] = {
            basket: basket,
            time: time,
            payWay: payWay,
            cost: cost,
            status: 'обрабатывается',
            organisation: currentOrganisationChoice
        }

    }

    function orderRequest() {
        orderTime = document.getElementsByTagName('input')[0].value
        console.log(orderTime)
        payWay = document.getElementsByTagName('select')[0].value
        console.log(payWay)
        let basketDiv = document.getElementById('basketDiv')
        if (orderTime === '') {
            alert('Выберите время доставки!')
        } else {
            orderSend(BASKET, orderTime, payWay, basketCost)
            BASKET = []
            basketCost = 0
            currentOrganisationChoice = ''
            let labelCell = document.getElementById('basketLabel')
            if (labelCell !== null) {
                labelCell.textContent = `${getAmountOfFoodInBasket()}`
            }
            basketDiv.textContent = 'Заказ отправлен на обработку. Информацию о нем можно найти во вкладке "Заказы"'
        }
        ;
    }

    function printBasket(prods) {
        let ans = []
        for (let food in BASKET) {
            if (BASKET[food] > 0) {
                ans.push(
                    <Cell expandable before={<img src={prods[food].prodPic} height={'50'}/>} after={
                        <Group>
                            {
                                <SplitLayout>
                                    <Button before={<Icon16Minus/>} mode="tertiary"
                                            onClick={() => changeAmount(food, -1, prods[food].prodOrgId, prods[food].prodPrice)}/>
                                    <Cell id={food + 'InBasket'}>{BASKET[food]}</Cell>
                                    <Button before={<Icon16Add/>} mode="tertiary"
                                            onClick={() => changeAmount(food, 1, prods[food].prodOrgId, prods[food].prodPrice)}/>
                                </SplitLayout>
                            }
                        </Group>
                    }>{prods[food].prodName} </Cell>
                )
            }
        }
        if (ans.length !== 0) {
            ans.push(
                <Cell id={'finalCost'}>Стоимость заказа: {basketCost} руб</Cell>
            )
        }
        if (ans.length === 0) {
            return (
                <Group>
                    <Placeholder icon={<Icon28MarketSlashOutline width={56} height={56}/>}>
                    </Placeholder>
                    <p align={'center'}>В корзине пока что пусто.</p>
                </Group>
            )
        } else {
            ans.push(
                <Group>
                    <FormLayout>
                        <FormItem top='Время выдачи заказа'>
                            <input
                                type="time"
                                name="ordTime"
                                placeholder="чч:мм"
                            />
                            {//<Button mode="tertiary" onClick={() => setOrderTime()}>выбрать</Button>
                            }
                        </FormItem>
                        <FormItem top={'Способ оплаты заказа'}>
                            <select placeholder="не выбран">
                                <option value={'nal'}>наличными в ресторане</option>
                                <option value={'karta'}>картой в ресторане</option>
                                <option value={'online'}>картой онлайн</option>
                            </select>
                            {//<Button mode="tertiary" onClick={() => setPayWay()}>выбрать</Button>
                            }
                        </FormItem>
                    </FormLayout>
                    <Div className='OfferButton'>
                        <Button mode='commerce' size='m' onClick={() => orderRequest()}>
                            Сделать заказ
                        </Button>
                    </Div>
                </Group>
            )
            return (ans)
        }
        ;
    }

    function getUsersOrders(userId) {
        console.log('выдача ордеров юзеру' + userId)
        return (orders)
    }

    function returnToBasket(orderId, order) {
        console.log('возвращаем корзину')
        BASKET = order.basket
        console.log(BASKET)
        currentOrganisationChoice = `${order.organisation}`
        basketCost = order.cost
        let labelCell = document.getElementById('basketLabel')
        labelCell.textContent = `${getAmountOfFoodInBasket()}`
        deleteOrder(orderId, order)
    }

    function deleteOrder(orderId, order) {
        console.log('отменяем заказ')
        delete orders[orderId]
        let orderGroup = document.getElementById(orderId)
        orderGroup.textContent = ''
    }

    function printStatus(orderId, order) {
        console.log(orderId, order)
        if (order.status === 'обрабатывается') {
            return (
                <Div>Статус заказа: <font color={'orange'}>находится в обработке...</font></Div>
            )
        }
        if (order.status === 'принят') {
            return (
                <Div>Статус заказа: <font color={'green'}>принят!</font></Div>
            )
        }
        if (order.status === 'отклонен') {
            return (
                <Group>
                    <Div>Статус заказа: <font color={'red'}>заказ отклонен! (выберите другое время) </font></Div>
                    <Div>
                        <Button mode={'primary'} onClick={() => returnToBasket(orderId, order)}>
                            Вернуть заказ в корзину
                        </Button>
                        <Button mode={'destructive'} onClick={() => deleteOrder(orderId, order)}>
                            Отменить заказ
                        </Button>
                    </Div>
                </Group>
            )
        }
    }

    function printOrders(userId) {
        let ans = []
        console.log(userId)
        let orders = getUsersOrders(userId)
        if (Object.keys(orders).length > 0) {
            for (let order in orders) {
                let prodList = ' '
                for (let prod in orders[order].basket) {
                    if (orders[order].basket[prod] > 0) {
                        prodList = prodList + getProductById(prod) + ' (' + orders[order].basket[prod] + 'шт); '
                    }
                }
                console.log(prodList);
                ans.push(
                    <Group id={order}>
                        <Header size={'l'}>Заказ номер: {order}</Header>
                        <Div><font color={'grey'}>{prodList}</font></Div>
                        <Div>Ресторан: {getOrganisationById(orders[order].organisation)}</Div>
                        <Div>Время выдачи: {orders[order].time}</Div>
                        <Div>Стоимость заказа: {orders[order].cost}</Div>
                        <Div>
                            Способ оплаты:
                            {
                                orders[order].payWay === 'nal' ? ' наличными в ресторане' : ''
                            }
                            {
                                orders[order].payWay === 'karta' ? ' картой в ресторане' : ''
                            }
                            {
                                orders[order].payWay === 'online' ? ' картой онлайн' : ''
                            }
                        </Div>
                        {printStatus(order, orders[order])}
                    </Group>
                )
            }
        } else {
            return (
                <Group>
                    <Placeholder icon={<Icon28ShoppingCartOutline width={56} height={56}/>}>
                    </Placeholder>
                    <p align={'center'}>На данный момент у Вас нет заказов.</p>
                </Group>
            )
        }
        ;
        return ans;
    }


    function getProductById(id) {
        if (id === "productId1") {
            return "тортик"
        }
        if (id === "productId2") {
            return "жаркое"
        }
        if (id === "productId3") {
            return "монстр"
        }
        if (id === "productId4") {
            return "пиво"
        }
        if (id === "productId5") {
            return "каппучино"
        }
        if (id === "productId6") {
            return "чиабатта"
        }
        if (id === "productId7") {
            return "каппучино"
        }
        if (id === "productId8") {
            return "эспрессо"
        }
        if (id === "productId9") {
            return "латте"
        }
        if (id === "productId10") {
            return "шавуха"
        }
        if (id === "productId11") {
            return "шавуха сырная"
        }
    }

    function getAmountOfFoodInBasket() {
        let acc = 0;
        for (let item in BASKET) {
            acc += BASKET[item];
        }
        return acc;
    }


    ////////////////////////////////////////Заказы

    function getAvailableOrganisation(person) {
        let chelId = 0
        let k = 0
        while ((person === null) && (k < 1000)) {
            k += 1
        }
        if (k < 1000) {
            chelId = person.id
            console.log(chelId)
        }
        let helpReturn = {}
        if ((chelId === 365257180) || (chelId === 68043104)) {
            helpReturn = {
                personId: 'userId1',
                organisationId: 'restId4',
                personStatus: 'armenian'
            }
        }
        return (helpReturn)
    }

    function printOffersButton() {
        if (!getAvailableOrganisation(fetchedUser).hasOwnProperty('personId')) {
            console.log('вы не админ!')
            return (<></>);
        } else {
            console.log('вы админ!')
            return (<TabbarItem
                onClick={onStoryChange}
                selected={activeStory === 'offers'}
                data-story="offers"
                text="Заказы"
            ><Icon28StorefrontOutline/></TabbarItem>)
        }
    }

    function getOrganisationById(id) {
        if (id === 228) {
            return "AMOGUS corp."
        }
        if (id === 'restId1') {
            return "Зачет"
        }
        if (id === 'restId2') {
            return "Ардис"
        }
        if (id === 'restId3') {
            return "Болтай"
        }
        if (id === 'restId4') {
            return "Кофейня НК"
        }
        if (id === 'restId5') {
            return "Формула шаурмы"
        }
    }

    function getOrganisationOrders(organisationId) {
        let orgOrders = {}
        for (let order in orders) {
            if (orders[order].organisation === organisationId) {
                orgOrders[order] = orders[order]
                console.log('найден заказ в вашей организации')
            }
        }
        return orgOrders
    }

    function declineOrder(orderId, order) {
        orders[orderId].status = 'отклонен'
        let orderDiv = document.getElementById(`${orderId}_offers`)
        orderDiv.textContent = 'Статус заказа: отклонен.'
    }

    function acceptOrder(orderId, order) {
        orders[orderId].status = 'принят'
        let orderDiv = document.getElementById(`${orderId}_offers`)
        orderDiv.textContent = 'Статус заказа: принят.'
    }

    function printAcceptButtons(orderId, order) {
        if (order.status === 'обрабатывается') {
            return (
                <Div id={`${orderId}_offers`}>
                    <Button mode={'destructive'} onClick={() => declineOrder(orderId, order)}>Отклонить</Button>
                    <Button mode={'commerce'} onClick={() => acceptOrder(orderId, order)}>Принять</Button>
                </Div>
            )
        } else {
            return (
                <Div id={`${orderId}_offers`}>{`Статус заказа: ${order.status}`}</Div>
            )
        }
    }

    function printOffers(organisationId) {
        let ans = []
        let orders = getOrganisationOrders(organisationId)
        if (Object.keys(orders).length > 0) {
            console.log('что-то есть')
            console.log(orders)
            for (let order in orders) {
                let prodList = ' '
                for (let prod in orders[order].basket) {
                    if (orders[order].basket[prod] > 0) {
                        prodList = prodList + getProductById(prod) + ' (' + orders[order].basket[prod] + 'шт); '
                    }
                }
                console.log(prodList);
                ans.push(
                    <Group id={order}>
                        <Header size={'l'}>Заказ номер: {order}</Header>
                        <Div><font color={'grey'}>{prodList}</font></Div>
                        <Div>Время выдачи: {orders[order].time}</Div>
                        <Div>Стоимость заказа: {orders[order].cost}</Div>
                        <Div>
                            Способ оплаты:
                            {
                                orders[order].payWay === 'nal' ? ' наличными в ресторане' : ''
                            }
                            {
                                orders[order].payWay === 'karta' ? ' картой в ресторане' : ''
                            }
                            {
                                orders[order].payWay === 'online' ? ' картой онлайн' : ''
                            }
                        </Div>
                        {printAcceptButtons(order, orders[order])}
                    </Group>
                )
            }
        } else {
            console.log('ничего нет')
            return (
                <Group>
                    <Placeholder icon={<Icon28ThumbsUpOutline width={56} height={56}/>}>
                    </Placeholder>
                    <p align={'center'}>На данный момент заказов не поступало.</p>
                </Group>
            )
        }
        ;
        console.log('под конец')
        return ans;
    }

    const Offers = (
        {
            id, fetchedUser
        }
    ) => {
        return (
            <Panel id="offers">
                <PanelHeader>Заказы</PanelHeader>
                <Group mode={'plain'}>
                    <Fragment>
                        <Div id={"organisation-text"}>
                            <Headline weight={"medium"}>Организация: {getOrganisationById(getAvailableOrganisation(
                                fetchedUser)['organisationId'])}</Headline>
                        </Div>
                        <Div>
                            {printOffers(getAvailableOrganisation(
                                fetchedUser)['organisationId'])}
                        </Div>
                    </Fragment>
                </Group>
            </Panel>
        )
    }

    const Orders = (
        {
            id, fetchedUser
        }
    ) => {
        return (
            <Panel id="orders">
                <PanelHeader><PanelHeaderContent>Ваши
                    заказы</PanelHeaderContent></PanelHeader>
                <Group mode={'plain'}>
                    <Fragment>
                        <Div id={'ordersDiv'}>
                            {printOrders(fetchedUser.id)}
                        </Div>
                    </Fragment>
                </Group>
            </Panel>
        )
    }

    const Example = withAdaptivity((
        {
            viewWidth
        }
        ) => {
            const platform = usePlatform();
            const isDesktop = viewWidth >= ViewWidth.TABLET;
            const hasHeader = platform !== VKCOM;

            return (
                <AppRoot>
                    <SplitLayout
                        header={hasHeader && <PanelHeader separator={false}/>}
                        style={{justifyContent: "center"}}
                    >
                        {isDesktop && (
                            <SplitCol fixed width="280px" maxWidth="280px">
                                <Panel>
                                    {hasHeader && <PanelHeader/>}
                                    <Group>
                                        <Cell
                                            disabled={activeStory === 'rests'}
                                            style={activeStory === 'rests' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            data-story="rests"
                                            onClick={onStoryChange}
                                            before={<Icon28NewsfeedOutline/>}
                                        >
                                            feed
                                        </Cell>
                                        <Cell
                                            disabled={activeStory === 'basket'}
                                            style={activeStory === 'basket' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            data-story="basket"
                                            onClick={onStoryChange}
                                            before={<Icon28MessageOutline/>}
                                        >
                                            messages
                                        </Cell>
                                        <Cell
                                            disabled={activeStory === 'orders'}
                                            style={activeStory === 'orders' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            data-story="orders"
                                            onClick={onStoryChange}
                                            before={<Icon28ServicesOutline/>}
                                        >
                                            services
                                        </Cell>
                                        <Cell
                                            disabled={activeStory === 'offers'}
                                            style={activeStory === 'offers' ? {
                                                backgroundColor: "var(--button_secondary_background)",
                                                borderRadius: 8
                                            } : {}}
                                            data-story="offers"
                                            onClick={onStoryChange}
                                            before={<Icon28ClipOutline/>}
                                        >
                                            clips
                                        </Cell>
                                    </Group>
                                </Panel>
                            </SplitCol>
                        )}

                        <SplitCol
                            animate={!isDesktop}
                            spaced={isDesktop}
                            width={isDesktop ? '560px' : '100%'}
                            maxWidth={isDesktop ? '560px' : '100%'}
                        >
                            <Epic activeStory={activeStory} tabbar={!isDesktop &&
                            <Tabbar>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'rests'}
                                    data-story="rests"
                                    text="Организации"
                                ><Icon28ChefHatOutline/></TabbarItem>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'basket'}
                                    data-story="basket"
                                    label={<p
                                        id={'basketLabel'}>{getAmountOfFoodInBasket() !== 0 ? getAmountOfFoodInBasket() : 0}</p>}
                                    text="Корзина"
                                ><Icon28BoxHeartOutline/></TabbarItem>
                                <TabbarItem
                                    onClick={onStoryChange}
                                    selected={activeStory === 'orders'}
                                    data-story="orders"
                                    text="Заказы"
                                ><Icon28WalletOutline/></TabbarItem>
                                {printOffersButton()}
                            </Tabbar>
                            }>
                                <View id="rests" activePanel={activePanelRests} popout={popout}>
                                    <Panel id="rests">
                                        <PanelHeader><Title weight={"bold"}
                                                            level={1}>Организации</Title></PanelHeader>
                                        {fetchedUser &&
                                        <Group mode={'plain'}>
                                            <Fragment>
                                                {/*<Search/>*/}
                                                <Div id="rests">
                                                    {printRests(getOrganisation(), goPanelRests)}
                                                </Div>
                                            </Fragment>
                                        </Group>}
                                    </Panel>
                                    {createRestsPanels(getOrganisation(), goPanelRests)}
                                </View>
                                <View id="basket" activePanel="basket" popout={popout}>
                                    <Panel id="basket">
                                        <PanelHeader><PanelHeaderContent>Корзина</PanelHeaderContent></PanelHeader>
                                        <Group mode={'plain'}>
                                            <Fragment>
                                                <Div id="basketDiv">
                                                    {printBasket(getMenu(currentOrganisationChoice))}
                                                </Div>
                                            </Fragment>
                                        </Group>
                                    </Panel>
                                </View>
                                <View id="orders" activePanel="orders" popout={popout}>
                                    <Orders id={ROUTES.ORDERS} fetchedUser={fetchedUser}/>
                                </View>
                                <View id="offers" activePanel="offers" popout={popout}>
                                    <Offers id={ROUTES.OFFERS} fetchedUser={fetchedUser}/>
                                </View>
                                <View id="intro" activePanel="intro" popout={popout}>
                                    <Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro}
                                           snackbarError={snackbar}
                                           userHasSeenIntro={userHasSeenIntro} route={ROUTES.RESTS}/>
                                </View>
                            </Epic>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            );
        }
        ,
        {
            viewWidth: true
        }
    );


    /*
        <View activePanelRests={activePanelRests} popout={popout}>
            <Home id={ROUTES.HOME} fetchedUser={fetchedUser} go={go} snackbarError={snackbar} ROUTES={ROUTES}/>
            <Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} snackbarError={snackbar}
                   userHasSeenIntro={userHasSeenIntro}/>
            <Rests id={ROUTES.RESTS} fetchedUser={fetchedUser} go={go} ROUTES={ROUTES}/>
            {generateRestsPanels()}
        </View>
    */
    return (
        <ConfigProvider>
            <AdaptivityProvider>
                <Example/>
            </AdaptivityProvider>
        </ConfigProvider>
    )
}

export default App;

