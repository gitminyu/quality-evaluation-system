import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme ,Avatar} from 'antd';
import { useNavigate, Routes, Route } from 'react-router-dom'
import EvaluationPage from './components/evaluationPage';
import ItemPage from './components/itemPage';
import SystemPage from './components/systemPage';
import UserPage from './components/userPage';
import './index.css'
const { Header, Sider, Content } = Layout;

function MainPage() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';
    const navigate=useNavigate();
    const changeMenu=(e)=>{
        navigate(e.key,
            // {replace:true}
            )
    }
    return (
        <Layout>
            <Layout>
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        mode="inline"
                        // defaultSelectedKeys={['1']}
                        onClick={changeMenu}
                        items={[
                            {
                                key: '/user',
                                icon: <UserOutlined />,
                                label: '用户管理',
                            },
                            {
                                key: '/system',
                                icon: <VideoCameraOutlined />,
                                label: '系统管理',
                            },
                            {
                                key: '/item',
                                icon: <UploadOutlined />,
                                label: '评估项管理',
                            },
                            {
                                key: '/evaluation',
                                icon: <UploadOutlined />,
                                label: '系统评估',
                            }
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header className='header'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Avatar src={<img src={url} alt="avatar" />} />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Routes>
                            <Route path='/user' element={<UserPage/>}></Route>
                            <Route path='/system' element={<SystemPage/>}></Route>
                            <Route path='/item' element={<ItemPage/>}></Route>
                            <Route path='/evaluation' element={<EvaluationPage/>}></Route>

                        </Routes>
                        Content
                    </Content>
                </Layout>
            </Layout>

        </Layout>
    );
};

export default MainPage;