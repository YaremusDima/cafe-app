import React, {Fragment} from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';

import './Intro.css';
import Group from "@vkontakte/vkui/dist/components/Group/Group";
import Div from "@vkontakte/vkui/dist/components/Div/Div";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import FixedLayout from '@vkontakte/vkui/dist/components/FixedLayout/FixedLayout';
import Button from "@vkontakte/vkui/dist/components/Button/Button";


const Intro = ({id, snackbarError, fetchedUser, userHasSeenIntro, go, route}) => {
	return (
        <Panel id={id} centered={true}>
            <PanelHeader>
                Cafe-app
            </PanelHeader>
            {(!userHasSeenIntro && fetchedUser) &&
                <Fragment>
                    <Group>
                        <Div className='User'>
                            {fetchedUser.photo_200 && <Avatar src={fetchedUser.photo_200}/>}
                            <h2>Привет, {fetchedUser.first_name}!</h2>
                            <h3>Этот сервис помогает купить заранее к определенному времени кофе или еду в ресторанах</h3>
                        </Div>
                    </Group>
                    <FixedLayout vertical='bottom'>
                        <Div className='OkButton'>
                            <Button mode='commerce' size='l' stretched style={{ marginRight: 8 }} onClick={() => go(route)}>
                                OK, всё понятно!
                            </Button>
                        </Div>
                    </FixedLayout>
                </Fragment>

            }
            {snackbarError}
        </Panel>
    )
};

export default Intro;
