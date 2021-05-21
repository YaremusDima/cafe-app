import React, {createElement, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';


import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import {
    Cell,
    Panel, PanelHeaderBack,
    Placeholder, Search,
    Snackbar,
    SplitCol,
    SplitLayout,
    Tabbar,
    TabbarItem,
    usePlatform, ViewWidth, VKCOM,
    withAdaptivity
} from "@vkontakte/vkui";
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {Icon28MusicOutline, Icon28UserOutline, Icon28UsersOutline} from "@vkontakte/icons";
import { View} from "@vkontakte/vkui";

function getRests() {
    return {
        123: {prop1: '1', prop2: 'img', prop3: 'sdfsdf'},
        2456: {prop1: '21'},
        1357: {prop1: '2144', prop2: 'i44mg2'},
        44444: {prop1: null, prop2: '11i4f4mg2'},
        342724: {prop1: '21as44', prop2: 'i44dffdmg2'},
    }
}

function printRests(rests, go) {
    let ans = []
    for (let prop in rests) {
        ans.push(
            <Cell after={getProps(rests[prop])} onClick={() => go(prop)}>{prop}</Cell>
        )
        console.log(prop)
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
                <PanelHeader left={<PanelHeaderBack onClick={() => go("rests")}/>}>Организации</PanelHeader>
                <Group>
                    <Div>
                        rest
                    </Div>
                </Group>
            </Panel>
        )
    }
    console.log(res)
    return res
}

const Rests = ({id, go, fetchedUser, ROUTES}) => (
    <Fragment>
        <Panel id="rests">
            <PanelHeader left={<PanelHeaderBack/>}>Организации</PanelHeader>
            {fetchedUser &&
            <Group style={{height: '1000px'}}>
                <Search/>
                <Div id="rest">
                    {printRests(getRests(), go)}
                    <Cell after={getProps("111")} onClick={() => go("111")}>{"111"}</Cell>
                </Div>
            </Group>}
        </Panel>
        {
            createRestsPanels(getRests(), go)
        }
        <Panel id="111">
            <PanelHeader left={<PanelHeaderBack onClick={() => go("rests")}/>}>Организации</PanelHeader>
            {fetchedUser &&
                <Group>
                    <Div>
                        rest
                    </Div>
                </Group>
            }
        </Panel>
    </Fragment>
);


export default Rests;
