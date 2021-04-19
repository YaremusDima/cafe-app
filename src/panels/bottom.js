import React, {Fragment} from 'react';


import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';

const Home = ({id, go, fetchedUser}) => (
    <Panel id={id}>
        <PanelHeader>Example</PanelHeader>
        <Fragment>
            {fetchedUser &&
            <Group>
                <Div>
                    <h2>
                        Welcome to the test page!
                    </h2>
                    <img className="Persik" src={persik} alt="Persik The Cat"/>
                </Div>
            </Group>}
        </Fragment>
    </Panel>
);


export default Home;
