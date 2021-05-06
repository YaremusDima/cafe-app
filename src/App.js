import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
//import SnackBar from '@vkontakte/vkui/dist/components/SnackBar/SnackBar';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {
    Icon24Error,
    Icon28ClipOutline,
    Icon28MessageOutline,
    Icon28NewsfeedOutline,
    Icon28ServicesOutline, Icon28UserCircleOutline, Icon56NewsfeedOutline
} from '@vkontakte/icons';
import '@vkontakte/vkui/dist/vkui.css';

import Home from './panels/Home';
import Intro from './panels/Intro';
import {
    Cell,
    Panel, PanelHeaderBack,
    Placeholder,
    Snackbar,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem,
    usePlatform, ViewWidth, VKCOM,
    withAdaptivity
} from "@vkontakte/vkui";
import * as PropTypes from "prop-types";
import Rests from "./panels/Rests";
import {Epic} from "@vkontakte/vkui/dist/components/Epic/Epic";
import PanelHeader from "@vkontakte/vkui/dist/components/PanelHeader/PanelHeader";
import Group from "@vkontakte/vkui/dist/components/Group/Group";

const ROUTES = {
    RESTS: 'rests',
    INTRO: 'intro',
    FOOD: 'food',
    BASKET:'basket',
    OFFERS:'offers',
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
            console.log(storageData)
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

    const go = panel => {
        setActiveStory(panel);
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

    const Example = withAdaptivity(({ viewWidth }) => {
        const platform = usePlatform();
        const isDesktop = viewWidth >= ViewWidth.TABLET;
        const hasHeader = platform !== VKCOM;

        return (
            <SplitLayout
                header={hasHeader && <PanelHeader separator={false} />}
                style={{ justifyContent: "center" }}
            >
                {isDesktop && (
                    <SplitCol fixed width="280px" maxWidth="280px">
                        <Panel>
                            {hasHeader && <PanelHeader />}
                            <Group>
                                <Cell
                                    disabled={activeStory === 'rests'}
                                    style={activeStory === 'rests' ? {
                                        backgroundColor: "var(--button_secondary_background)",
                                        borderRadius: 8
                                    } : {}}
                                    data-story="rests"
                                    onClick={onStoryChange}
                                    before={<Icon28NewsfeedOutline />}
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
                                    before={<Icon28ServicesOutline />}
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
                                    before={<Icon28MessageOutline />}
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
                                    before={<Icon28ClipOutline />}
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
                        ><Icon28NewsfeedOutline /></TabbarItem>
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
                            label="12"
                            text="Корзина"
                        ><Icon28MessageOutline /></TabbarItem>
                        <TabbarItem
                            onClick={onStoryChange}
                            selected={activeStory === 'offers'}
                            data-story="offers"
                            text="Заказы"
                        ><Icon28ClipOutline /></TabbarItem>
                    </Tabbar>
                    }>
                        <View id="rests" activePanel="rests" popout={popout}>
                            <Rests id={ROUTES.RESTS} fetchedUser={fetchedUser} go={go} ROUTES={ROUTES}/>
                        </View>
                        <View id="food" activePanel="food" popout={popout}>
                            <Panel id="food">
                                <PanelHeader left={<PanelHeaderBack />}>Еда</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28ServicesOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                            </Panel>
                        </View>
                        <View id="basket" activePanel="basket" popout={popout}>
                            <Panel id="basket">
                                <PanelHeader left={<PanelHeaderBack />}>Корзина</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28MessageOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                            </Panel>
                        </View>
                        <View id="offers" activePanel="offers" popout={popout}>
                            <Panel id="offers">
                                <PanelHeader left={<PanelHeaderBack />}>Заказы</PanelHeader>
                                <Group style={{ height: '1000px' }}>
                                    <Placeholder icon={<Icon28ClipOutline width={56} height={56} />}>
                                    </Placeholder>
                                </Group>
                            </Panel>
                        </View>
                        <View id ="intro" activePanel="intro" popout={popout}>
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
    <View activePanel={activePanel} popout={popout}>
            <Home id={ROUTES.HOME} fetchedUser={fetchedUser} go={go} snackbarError={snackbar} ROUTES={ROUTES}/>
            <Intro id={ROUTES.INTRO} fetchedUser={fetchedUser} go={viewIntro} snackbarError={snackbar}
                   userHasSeenIntro={userHasSeenIntro}/>
            <Rests id={ROUTES.RESTS} fetchedUser={fetchedUser} go={go} ROUTES={ROUTES}/>
            {generateRestsPanels()}
        </View>
        */
    return (
        <Example />
    );
}

export default App;

