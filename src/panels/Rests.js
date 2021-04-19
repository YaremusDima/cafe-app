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
        rest1: {prop1: '1', prop2: 'img', prop3: 'sdfsdf'},
        rest2: {prop1: '21'},
        rest3: {prop1: '2144', prop2: 'i44mg2'},
        rest4: {prop1: null, prop2: '11i4f4mg2'},
        rest5: {prop1: '21as44', prop2: 'i44dffdmg2'},
    }
}

function ccc(text) {
    let element = document.getElementById('rest')
    let div1 = document.createElement('div')
    div1.className = "Cell Cell--android"
    let div2 = document.createElement('div')
    div2.className = "Cell__in"
    let div3 = document.createElement('div')
    div3.role = "button"
    div3.setAttribute('role', 'button')
    div3.className = "Tappable Tappable--android SimpleCell SimpleCell--android SimpleCell--sizeY-regular Tappable--sizeX-compact Tappable--inactive"
    let div4 = document.createElement('div')
    div4.className = "SimpleCell__main"
    let div5 = document.createElement('div')
    div5.className = "SimpleCell__children"
    div5.innerHTML = text;
    let div6 = document.createElement('div')
    div6.className = "SimpleCell__after"
    let span1 = document.createElement('span')
    span1.className = "SimpleCell__after"
    let span2 = document.createElement('span')
    span2.className = "Tappable__hoverShadow"
    element.appendChild(div1)
    div1.appendChild(div2)
    div2.appendChild(div3)
    div3.appendChild(div4)
    div4.appendChild(div5)
    div3.appendChild(div6)
    div3.appendChild(span1)
    div3.appendChild(span2)
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
        <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => go(ROUTES.HOME)}/>}>
            Rests
        </PanelHeader>
        {fetchedUser &&
        <Panel id={'rests'}>
            <Group>
                <Search/>
                <Div id="rest">
                    {printRests(getRests(), go)}
                </Div>
            </Group>
        </Panel>}
    </Panel>
);


export default Rests;
