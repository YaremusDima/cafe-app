import React from 'react';
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

const Home = ({ id, go, fetchedUser, ROUTES}) => (
	<Panel id={id}>
		<PanelHeader>Cafe-app</PanelHeader>
		{fetchedUser &&
        <Group>
            <Cell expandable before={<Icon28UserOutline/>} onClick={() => go(ROUTES.RESTS)}>
                Рестораны
            </Cell>
            <Cell expandable before={<Icon28UsersOutline/>} >
                Еда
            </Cell>
            <Cell expandable before={<Icon28MusicOutline/>} >
                Корзина
            </Cell>
        </Group>}
	</Panel>
);

Home.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	fetchedUser: PropTypes.shape({
		photo_200: PropTypes.string,
		first_name: PropTypes.string,
		last_name: PropTypes.string,
		city: PropTypes.shape({
			title: PropTypes.string,
		}),
	}),
};

export default Home;
