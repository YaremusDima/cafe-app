import React, {useState, useEffect, Fragment} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
//import SnackBar from '@vkontakte/vkui/dist/components/SnackBar/SnackBar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {
    Icon16Add, Icon16Minus, Icon20HomeOutline,
    Icon24Error,
    Icon28ClipOutline, Icon28HomeOutline,
    Icon28MessageOutline,
    Icon28NewsfeedOutline,
    Icon28ServicesOutline, Icon28UserCircleOutline, Icon56NewsfeedOutline
} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';

import Intro from './panels/Intro';
import {
    Cell, CellButton, FixedLayout, Headline,
    Panel, PanelHeaderBack, PanelHeaderClose, PanelHeaderContent,
    Placeholder, Search,
    Snackbar, Spacing,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem, Title,
    usePlatform, ViewWidth, VKCOM,
    withAdaptivity
} from "@vkontakte/vkui";
import * as PropTypes from "prop-types";
import Rests from "./panels/Rests";
import {Epic} from "@vkontakte/vkui/dist/components/Epic/Epic";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Header from "@vkontakte/vkui/dist/components/Header/Header";
import tort from './img/cake.jpg'
import Button from "@vkontakte/vkui/dist/components/Button/Button";
import {object} from "prop-types";
import * as ReactDOM from "react-dom";

const ROUTES = {
    RESTS: 'rests',
    INTRO: 'intro',
    FOOD: 'food',
    BASKET: 'basket',
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

function getIdRests() {
    return ['1', '2', '3', '5']
}

function generateRestsPanels() {

}

const App = () => {
    const [fetchedUser, setUser] = useState(null);
    const [popout, setPopout] = useState(<ScreenSpinner size='large'/>)
    const [userHasSeenIntro, setUserHasSeenIntro] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const [activeStory, setActiveStory] = React.useState('intro');
    const [activePanelRests, setActivePanelRests] = React.useState("rests");
    const [activePanelFood, setActivePanelFood] = React.useState("food");
    const [activePanelOffers, setActivePanelOffers] = React.useState("rests");
//    const [testQuant, setTestQuant] = React.useState(0);
    const [basket, setBasket] = React.useState({});
    const onStoryChange = (e) => setActiveStory(e.currentTarget.dataset.story);
    var isOgranizator = false;
    var _user;

    class AmountCheck extends React.Component {
        change() {
            BASKET.setState({
                id : BASKET[props.id]
            })
        }

        render() {
            return (
                <SplitLayout>
                    <div>{BASKET[this.props.id]}</div>
                </SplitLayout>
            )
        }
    }

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
            setUser(user);
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

    function getRests() {
        return {
            restId1: {restName: '4444', restDesc: 'smth', restPic: 'sdfsdf'},
            restId2: {restName: '21', restDesc: 'opisanie', restPic: 'sdfsdf'},
            restId3: {restName: '2144', restDesc: 'i44mg2', restPic: 'sdfsdf'},
            restId4: {restName: null, restDesc: '11i4f4mg2', restPic: 'sdfsdf'},
            restId5: {restName: '21as44', restDesc: 'i44dffdmg2', restPic: 'sdfsdf'},
        }
    }

    function getMenu(rest_id) {
        return {
            product1: {prodName: 'product', prodPic: tort, prodPrice: '420P'},
            product2: {prodName: 'product', prodPic: tort, prodPrice: '69P'}
        }
    };

    /* async function findInBasket(prod_id) {
          if (BASKET.hasOwnProperty(prod_id)) {
              BASKET[prod_id] += 1
          }
          else {
              BASKET[prod_id] = 0
          }
          return BASKET[prod_id]
      }*/

    function printRests(rests, go) {
        let ans = []
        for (let prop in rests) {
            ans.push(
                <Cell after={getProps(rests[prop])} onClick={() => go(prop)}>{prop}</Cell>
            )
            //console.log(prop)
        }
        return ans;
    }

    /*
    ниже в функции при action = 0 - начальный запуск, когда попадаем на страницу ресторана
                       action = 1 - запуск по нажатию кнопки +
                       action = -1 - запуск по нажатию кнопки -

     */


    function changeAmount(prod_id, action) {
        let totCell = document.getElementById(prod_id)
        console.log('step1')
        if (!BASKET.hasOwnProperty(prod_id)) {
            console.log('newOne')
            BASKET[prod_id] = 0;
        }
        if (action === 1) {
            console.log('plus')
            BASKET[prod_id] += 1;
        }
        if ((action === -1) && (BASKET[prod_id] > 0)) {
            console.log('minus')
            BASKET[prod_id] += -1;
        }
        let newNumber = BASKET[prod_id]
        console.log(BASKET[prod_id])
        totCell.textContent = newNumber
        /*return (
            <Cell>
                <SplitLayout>
                    <Button before={<Icon16Minus/>} mode="tertiary" onClick={() => changeAmount(prod_id, -1)}/>
                    <Div id={prod_id}>{BASKET.prod_id}</Div>
                    <Button before={<Icon16Add/>} mode="tertiary" onClick={() => changeAmount(prod_id, 1)}/>
                </SplitLayout>
            </Cell>
        )*/
    }

    function printProds(prods) {
        let ans = []
        for (let prop in prods) {
            if (!BASKET.hasOwnProperty(prop)) {
                BASKET[prop] = 0
            }
            ans.push(
                <Cell expandable before={<img src={tort} height={'50'}/>} after={
                    <Group>
                        {/*<Div>
                            {changeAmount(prop, 0)}
                        </Div>*/}
                        {
                            <SplitLayout>
                                <Button before={<Icon16Minus/>} mode="tertiary" onClick={() => changeAmount(prop, -1)}/>
                                <Cell id = {prop}>{BASKET[prop]}</Cell>
                                <Button before={<Icon16Add/>} mode="tertiary" onClick={() => changeAmount(prop, 1)}/>
                            </SplitLayout>
                        }
                    </Group>
                }>{prods[prop]['prodName']}</Cell>
            )
//console.log(prop)
        }
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
                    <Group>
                        <Header mode={'primary'}/*aside={<img src='' alt={'пикча рестика'}>}*/>название
                            рестика {rests[rest]['restName']}</Header>
                        <Div>
                            описание: {rests[rest]['restDesc']}
                        </Div>
                        <Header mode={'primary'}>Меню:</Header>
                        <Div id="prod">
                            {printProds(getMenu(rest))}
                        </Div>
                    </Group>
                </Panel>
            )
        }
        //console.log(res)
        return res
    }

    ///////////////////////////////////////////функции и переменные для работы с корзиной

    var BASKET = {
    }

    //addFoodToBasket("35", 10)
    //addFoodToBasket("228")
    //addFoodToBasket("228", 2)

    function addFoodToBasket(id, action) {
        if (BASKET.hasOwnProperty(id)) {
            if (action === 1) {
                BASKET[id] += 1
            }
            if ((action === -1) && (BASKET[id] > 0)) {
                BASKET[id] += -1
            }
        } else {
            BASKET[id] = 0;
        }
    }

    function printBasket() {
        let ans = []
        for (let food in BASKET) {
            ans.push(
                <Cell after={BASKET[food]}>{getFoodNameById(food)}</Cell>
            )
            //console.log(prop)
        }
        return ans;
    }

    function getFoodNameById(id) {
        if (id === "35") {
            return "МММясо"
        }
        if (id === "228") {
            return "Пивко"
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

    function getAvailableOrganisation(person_id) {
        return [
            {
                person_id: person_id,
                organisation_id: 228,
                person_status: "gay"
            }
        ]
    }

    function printOffersButton() {
        if (getAvailableOrganisation(fetchedUser).length === 0) {
            return (<></>);
        } else {
            return (<TabbarItem
                onClick={onStoryChange}
                selected={activeStory === 'offers'}
                data-story="offers"
                text="Заказы"
            ><Icon28ClipOutline/></TabbarItem>)
        }
    }

    function getOrders(organisation_id) {
        return {
            order1_id: {
                order_date: new Date(2011, 0, 1, 12, 0, 0, 0),
                expectation_time: new Date(2011, 0, 1, 12, 30, 0, 0),
                order_status: 0,
                order_amount: 1000,
                order_content: basket,
            }
        }
    }

    function getOrganisationById(id) {
        if (id === 228) {
            return "AMOGUS corp."
        }
    }

    const Offers = ({id, fetchedUser}) => {
        return (
            <Panel id="offers">
                <Group style={{height: '1000px'}}>
                    <PanelHeader>Заказы</PanelHeader>
                    <Spacing/>
                    <Div id={"organisation-text"}>
                        <Headline weight={"medium"}>Организация: {getOrganisationById(getAvailableOrganisation(
                            fetchedUser.id)[0].organisation_id)}</Headline>
                    </Div>
                    <Div>
                        {}
                    </Div>
                </Group>
            </Panel>
        )
    }

    const Example = withAdaptivity(({viewWidth}) => {
        const platform = usePlatform();
        const isDesktop = viewWidth >= ViewWidth.TABLET;
        const hasHeader = platform !== VKCOM;

        return (

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
                                    disabled={activeStory === 'food'}
                                    style={activeStory === 'food' ? {
                                        backgroundColor: "var(--button_secondary_background)",
                                        borderRadius: 8
                                    } : {}}
                                    data-story="food"
                                    onClick={onStoryChange}
                                    before={<Icon28ServicesOutline/>}
                                >
                                    services
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
                        ><Icon28NewsfeedOutline/></TabbarItem>
                        <TabbarItem
                            onClick={onStoryChange}
                            selected={activeStory === 'food'}
                            data-story="food"
                            text="Еда"
                        ><Icon28ServicesOutline/></TabbarItem>
                        <TabbarItem
                            onClick={onStoryChange}
                            selected={activeStory === 'basket'}
                            data-story="basket"
                            label={getAmountOfFoodInBasket()}
                            text="Корзина"
                        ><Icon28MessageOutline/></TabbarItem>

                        {printOffersButton()}
                    </Tabbar>
                    }>
                        <View id="rests" activePanel={activePanelRests} popout={popout}>
                            <Panel id="rests">
                                <PanelHeader><Title weight={"bold"} level={1}>Организации</Title></PanelHeader><Spacing
                                size={16}/>
                                {fetchedUser &&
                                <Group style={{height: '1000px'}}>
                                    <Fragment>
                                        <Search/>
                                        <Div id="rest">
                                            {printRests(getRests(), goPanelRests)}
                                        </Div>
                                    </Fragment>
                                </Group>}
                            </Panel>
                            {createRestsPanels(getRests(), goPanelRests)}
                        </View>
                        <View id="food" activePanel="food" popout={popout}>
                            <Panel id="food">
                                <PanelHeader><PanelHeaderContent>Еда</PanelHeaderContent></PanelHeader><Spacing/>
                                <Group style={{height: '1000px'}}>
                                    <Placeholder icon={<Icon28ServicesOutline width={56} height={56}/>}>
                                    </Placeholder>
                                </Group>
                            </Panel>
                        </View>
                        <View id="basket" activePanel="basket" popout={popout}>
                            <Panel id="basket">
                                <PanelHeader><PanelHeaderContent>Корзина</PanelHeaderContent></PanelHeader><Spacing/>
                                <Group style={{height: '1000px'}}>
                                    {//printBasket()
                                    }
                                </Group>
                                <Div className='OfferButton'>
                                    <CellButton mode='commerce' size='l' stretched style={{marginRight: 8}}>
                                        Сделать заказ
                                    </CellButton>
                                </Div>
                            </Panel>
                        </View>
                        <View id="offers" activePanel="offers" popout={popout}>
                            <Offers id={ROUTES.OFFERS} fetchedUser={fetchedUser}/>
                        </View>
                        <View id="intro" activePanel="intro" popout={popout}>
                            <Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} snackbarError={snackbar}
                                   userHasSeenIntro={userHasSeenIntro} route={ROUTES.RESTS}/>
                        </View>
                    </Epic>
                </SplitCol>
            </SplitLayout>
        );
    }, {
        viewWidth: true
    });


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
        <Example/>
    );
}

export default App;

