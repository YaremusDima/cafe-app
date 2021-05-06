import React, {createElement, useEffect} from 'react';
import PropTypes from 'prop-types';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import {Icon28MusicOutline, Icon28UserOutline, Icon28UsersOutline} from "@vkontakte/icons";
import {PanelHeaderBack, Search, View} from "@vkontakte/vkui";

function getRests() {
    return {
        123: {prop1: '1', prop2: 'img', prop3: 'sdfsdf'},
        rest2: {prop1: '21'},
        rest3: {prop1: '2144', prop2: 'i44mg2'},
        rest4: {prop1: null, prop2: '11i4f4mg2'},
        rest5: {prop1: '21as44', prop2: 'i44dffdmg2'},
    }
}

function objectToArrayOfObjects(obj) {
    let ans = [];
    for (let prop in obj) {
        ans.push(prop)
    }
    return ans
}

function printRests(rests, go) {
    let ans = []
    for (let prop in rests) {
        ans.push(
            <Cell after={getProps(rests[prop])}>{prop}</Cell>
        )
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

const Rests = ({id, go, fetchedUser, ROUTES}) => (
    <Panel id={id}>
        <PanelHeader left={<PanelHeaderBack />}>Организации</PanelHeader>
        <Group style={{ height: '1000px' }}>
            {fetchedUser &&
            <Panel id={'rests'}>
                <Group>
                    <Search/>
                    <Div id="rest">
                        {printRests(getRests(), go)}
                    </Div>
                </Group>
            </Panel>}
        </Group>
    </Panel>
);


export default Rests;
